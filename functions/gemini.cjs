// functions/gemini.js

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "ok" };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "GEMINI_API_KEY não configurada" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const message = body.message;
    const history = Array.isArray(body.history) ? body.history : [];
    const aiContext = body.aiContext ?? null;

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Mensagem inválida" }),
      };
    }

    // ✅ Limita histórico pra não estourar contexto/tokens
    const lastMessages = history.slice(-10).map((msg) => ({
      role: msg?.sender === "user" ? "user" : "model",
      parts: [{ text: String(msg?.text ?? "").slice(0, 2000) }],
    }));

    // ✅ Instrução bem clara: curto, espaçado, com emojis e fácil de ler
    const systemInstruction = `
Você é o Companheiro Vivamente.
Fale em Português do Brasil.
Responda SEMPRE curto e fácil de ler.

REGRAS DE FORMATAÇÃO:
- Use parágrafos curtos
- Use quebras de linha (uma linha em branco entre ideias)
- Use poucos emojis (máx. 5) para guiar leitura
- Use bullets quando listar passos

TAMANHO:
- Máximo 6 linhas (curtas). Se precisar, pergunte 1 coisa no final.

${aiContext ? `CONTEXTO DO USUÁRIO (JSON): ${JSON.stringify(aiContext)}` : ""}

Agora responda o usuário:
`.trim();

    const contents = [
      ...lastMessages,
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nMensagem do usuário: ${message}` }],
      },
    ];

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent" +
      `?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 260, // curto, mas suficiente pra não cortar no meio
        },
      }),
    });

    const data = await response.json();

    // Log útil pra debugar quando vier vazio/bloqueado
    const finishReason = data?.candidates?.[0]?.finishReason;
    const promptBlockReason = data?.promptFeedback?.blockReason;

    if (!response.ok) {
      const msg = data?.error?.message || "Erro na API Gemini";
      console.error("❌ Gemini HTTP Error:", response.status, msg);
      throw new Error(msg);
    }

    const parts = data?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p) => p?.text).filter(Boolean).join("")
      : "";

    if (!text) {
      console.warn("⚠️ Gemini sem texto. finishReason:", finishReason, "blockReason:", promptBlockReason);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          text: "Tive um bloqueio rápido aqui 😕\n\nMe diz em 1 frase: o que você quer resolver agora?",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    console.error("🔥 Erro Gemini:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erro ao falar com a IA" }),
    };
  }
};
