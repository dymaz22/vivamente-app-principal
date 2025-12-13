// src/lib/gemini.js
export const sendMessageToGemini = async (message, history, aiContext = "") => {
  try {
    // Chama a nossa função local (que age como proxy seguro)
    const res = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, aiContext }),
    });

    if (!res.ok) {
      throw new Error(`Erro na API: ${res.status}`);
    }

    const data = await res.json();
    return data.text;
  } catch (error) {
    console.error("Erro ao falar com a Function:", error);
    return "Estou com dificuldade de conectar agora. Tente novamente em instantes.";
  }
};