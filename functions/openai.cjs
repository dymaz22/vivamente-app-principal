// functions/openai.cjs
// Endpoint: /.netlify/functions/openai
// Provider: OpenAI | Model: gpt-4o-mini (fallback: gpt-4.1-mini -> gpt-4o-mini)

const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const OPENAI_URL = 'https://api.openai.com/v1/responses';

// Ordem de fallback (mantém o principal primeiro)
const MODEL_PRIMARY = 'gpt-4o-mini';
const MODEL_FALLBACKS = ['gpt-4.1-mini', 'gpt-4o-mini'];

// Resiliência
const OPENAI_TIMEOUT_MS = 20000; // 20s
const OPENAI_RETRIES = 2;        // total tentativas = 1 + retries
const RETRY_BASE_DELAY_MS = 450; // backoff simples

function headers(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function safeString(v) {
  return typeof v === 'string' ? v : String(v ?? '');
}

function shouldRetry(status, msg = '') {
  if (!status) return true; // erro de rede/timeout
  if (status === 408 || status === 429) return true;
  if (status >= 500) return true;
  // Alguns erros transitórios vêm como 400 com msg de overload (raro), mas não vamos inventar
  return false;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function callOpenAIWithRetries({ apiKey, payload, models }) {
  let lastErr = null;

  for (let mi = 0; mi < models.length; mi++) {
    const model = models[mi];

    for (let attempt = 0; attempt <= OPENAI_RETRIES; attempt++) {
      const t0 = Date.now();
      try {
        const res = await fetchWithTimeout(
          OPENAI_URL,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...payload, model }),
          },
          OPENAI_TIMEOUT_MS
        );

        const data = await res.json().catch(() => ({}));
        const ms = Date.now() - t0;

        if (res.ok) {
          return { ok: true, model, data, ms, status: res.status };
        }

        const msg = data?.error?.message || `Erro OpenAI (${res.status})`;
        lastErr = { status: res.status, msg, data };

        console.error('[openai] upstream error:', {
          model,
          attempt,
          status: res.status,
          ms,
          msg,
        });

        if (!shouldRetry(res.status, msg) || attempt === OPENAI_RETRIES) break;

        const backoff = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        await delay(backoff);
        continue;
      } catch (e) {
        const ms = Date.now() - t0;
        const msg = e?.name === 'AbortError' ? 'Timeout na OpenAI' : (e?.message || 'Erro de rede');
        lastErr = { status: 0, msg };

        console.error('[openai] upstream network error:', {
          model,
          attempt,
          ms,
          msg,
        });

        if (attempt === OPENAI_RETRIES) break;
        const backoff = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        await delay(backoff);
      }
    }
    // se falhou todas tentativas nesse model, tenta o próximo (fallback)
  }

  return { ok: false, lastErr };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headers(), body: 'ok' };
  }

  try {
    // Env checks (sem logar segredos)
    const apiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey) return { statusCode: 500, headers: headers(), body: JSON.stringify({ error: 'OPENAI_API_KEY ausente' }) };
    if (!supabaseUrl) return { statusCode: 500, headers: headers(), body: JSON.stringify({ error: 'SUPABASE_URL ausente' }) };
    if (!serviceRole) return { statusCode: 500, headers: headers(), body: JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY ausente' }) };

    const body = JSON.parse(event.body || '{}');
    const { message, history = [], userId } = body;

    if (!userId || typeof userId !== 'string') {
      return { statusCode: 400, headers: headers(), body: JSON.stringify({ error: 'userId ausente' }) };
    }
    if (!message || typeof message !== 'string') {
      return { statusCode: 400, headers: headers(), body: JSON.stringify({ error: 'Mensagem inválida' }) };
    }

    const supabase = createClient(supabaseUrl, serviceRole);

    // profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('ai_context, ai_memory')
      .eq('id', userId)
      .single();

    if (profileErr) {
      console.error('[openai] supabase profile error:', profileErr);
      return { statusCode: 500, headers: headers(), body: JSON.stringify({ error: 'Erro ao ler profiles (supabase)' }) };
    }

    // eventos recentes (se tabela existir)
    let eventsText = 'Nenhum';
    try {
      const { data: events } = await supabase
        .from('user_events')
        .select('type, payload, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12);

      if (events?.length) {
        eventsText = events
          .map((e) => `- ${e.type}: ${JSON.stringify(e.payload || {})}`)
          .join('\n');
      }
    } catch (e) {
      // não quebra por causa disso
      console.warn('[openai] user_events read skipped:', e?.message || e);
    }

    const systemPrompt = `
Você é o Companheiro do Vivamente (saúde mental e alta performance). NÃO clínico.
Responda em PT-BR, curto, claro, empático, fácil de ler.

FORMATO:
- 2 a 5 blocos curtos
- 1 emoji por bloco (máx. 4)
- no máximo 3 sugestões
- termine com 1 pergunta curta
- proibido: listas numeradas (1.,2.,3.), títulos e Markdown

QUIZ (ai_context):
${profile?.ai_context || 'Não informado'}

MEMÓRIA (ai_memory):
${profile?.ai_memory || 'Sem memória ainda'}

EVENTOS DO APP:
${eventsText}
`.trim();

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-20).map((m) => ({
        role: m?.sender === 'user' ? 'user' : 'assistant',
        content: safeString(m?.text),
      })),
      { role: 'user', content: message },
    ];

    // OpenAI call (retry + fallback)
    const result = await callOpenAIWithRetries({
      apiKey,
      models: [MODEL_PRIMARY, ...MODEL_FALLBACKS.filter((m) => m !== MODEL_PRIMARY)],
      payload: {
        input: messages,
        temperature: 0.7,
        max_output_tokens: 260,
      },
    });

    if (!result.ok) {
      const msg = result?.lastErr?.msg || 'Erro ao falar com a IA';
      const status = result?.lastErr?.status || 500;

      // Resposta amigável pro app (sem detalhes internos)
      return {
        statusCode: 503,
        headers: headers(),
        body: JSON.stringify({
          error: 'IA temporariamente instável. Tente novamente em instantes.',
          debug: process.env.NODE_ENV === 'development' ? `${msg}${status ? ` (${status})` : ''}` : undefined,
        }),
      };
    }

    const data = result.data;
    const text =
      data?.output_text ||
      data?.output?.[0]?.content?.map((c) => c?.text).filter(Boolean).join('') ||
      'Não consegui responder agora 😕';

    // Memória curta (não quebra se falhar)
    try {
      const memoryLine = `\n\nU: ${message}\nA: ${text}`.trim();
      const merged = `${profile?.ai_memory || ''}${memoryLine}`.trim();
      const limited = merged.slice(-4000);

      const { error: memErr } = await supabase.from('profiles').update({ ai_memory: limited }).eq('id', userId);
      if (memErr) console.error('[openai] supabase memory update error:', memErr);
    } catch (e) {
      console.warn('[openai] memory update skipped:', e?.message || e);
    }

    return {
      statusCode: 200,
      headers: headers(),
      body: JSON.stringify({
        provider: 'OpenAI',
        model: result.model,
        text,
      }),
    };
  } catch (err) {
    console.error('[openai] Function error:', err);
    return {
      statusCode: 500,
      headers: headers(),
      body: JSON.stringify({ error: 'Erro interno' }),
    };
  }
};
