// functions/gemini.cjs

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "ok" };
  }

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Chave API ausente" }) };
    }

    const { message, history, aiContext } = JSON.parse(event.body);

    const systemInstructionText = `
      INSTRUÇÃO DO SISTEMA:
      Você é o 'Companheiro Vivamente', uma IA psicológica empática.
      Seja breve, acolhedor e fale Português do Brasil.
      ${aiContext ? `CONTEXTO DO USUÁRIO: ${JSON.stringify(aiContext)}` : ''}
      ---------------------------------------------------
    `;

    let contents = [];
    if (history.length > 0) {
      contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    }

    const finalMessage = `${systemInstructionText}\n\nMensagem do usuário: ${message}`;
    contents.push({ role: 'user', parts: [{ text: finalMessage }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    
    console.log("🔹 Enviando para o Google...");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contents })
    });

    const data = await response.json();

    // ==========================================================
    // O ESPIÃO: VAI MOSTRAR O JSON REAL NO TERMINAL
    // ==========================================================
    console.log("📦 RESPOSTA DO GOOGLE (JSON):");
    console.log(JSON.stringify(data, null, 2)); 
    // ==========================================================

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro na API do Google");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text }),
    };

  } catch (error) {
    console.error("🔥 ERRO:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};