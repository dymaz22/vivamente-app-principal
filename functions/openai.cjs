// functions/openai.cjs
// Endpoint: /.netlify/functions/openai
// Provider: OpenAI | Model: gpt-4o-mini

const { createClient } = require('@supabase/supabase-js');

function safeString(v) {
  return typeof v === 'string' ? v : String(v ?? '');
}

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'ok' };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'OPENAI_API_KEY ausente' }) };
    }
    if (!supabaseUrl) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'SUPABASE_URL ausente' }) };
    }
    if (!supabaseServiceKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY ausente' }) };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = JSON.parse(event.body || '{}');
    const message = body.message;
    const history = Array.isArray(body.history) ? body.history : [];
    const userId = body.userId;

    if (!userId || typeof userId !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId ausente' }) };
    }
    if (!message || typeof message !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Mensagem inválida' }) };
    }

    // 1) profile (quiz + memoria)
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('ai_context, ai_memory')
      .eq('id', userId)
      .single();

    if (profileErr) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Erro ao ler profiles' }) };
    }

    // 2) eventos recentes
    const { data: events } = await supabase
      .from('user_events')
      .select('type, payload, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(12);

    const eventsText =
      (events && events.length)
        ? events.map(e => `- ${e.type}: ${JSON.stringify(e.payload || {})}`).join('\n')
        : 'Nenhum';

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
      ...history.slice(-20).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: safeString(m.text),
      })),
      { role: 'user', content: message },
    ];

    // 3) OpenAI Responses API (Node 22 tem fetch nativo)
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: messages,
        temperature: 0.7,
        max_output_tokens: 260,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: data?.error?.message || `Erro OpenAI: ${res.status}` }),
      };
    }

    const text =
      data?.output_text ||
      data?.output?.[0]?.content?.map(c => c?.text).filter(Boolean).join('') ||
      'Não consegui responder agora 😕';

    // 4) atualiza memória (curta)
    const memoryLine = `\n\nU: ${message}\nA: ${text}`.trim();
    const merged = `${profile?.ai_memory || ''}${memoryLine}`.trim();
    const limited = merged.slice(-4000);

    await supabase.from('profiles').update({ ai_memory: limited }).eq('id', userId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        provider: 'OpenAI',
        model: 'gpt-4o-mini',
        text,
      }),
    };
  } catch (err) {
    console.error('openai function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Erro interno' }) };
  }
};
