import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("ERRO: Chave da API do Gemini não encontrada.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
Você é o Vivamente, um companheiro de saúde mental empático, calmo e acolhedor.
Sua abordagem é baseada em TCC (Terapia Cognitivo-Comportamental) leve.

SUAS DIRETRIZES:
1. Acolhimento: Sempre valide o sentimento do usuário primeiro.
2. Brevidade: Dê respostas curtas e humanizadas (máximo 3 frases). Evite textões.
3. Segurança: Nunca dê diagnósticos médicos. Se o usuário falar em suicídio ou automutilação, instrua a buscar ajuda profissional imediatamente.
4. Idioma: Português de Portugal (mas neutro).

SEU CONHECIMENTO SOBRE O APP (RECOMENDE QUANDO APROPRIADO):
- Se o usuário estiver ansioso: Sugira a ferramenta "Respiração Guiada" na aba Rotina.
- Se estiver triste/deprimido: Sugira fazer um "Registro de Gratidão" ou ler uma lição na aba Aprender.
- Se estiver confuso: Sugira fazer um "Teste de Personalidade" na aba Aprender.
- Se estiver estressado: Sugira a ferramenta "Meditação Rápida".

Objetivo: Fazer o usuário se sentir ouvido e guiá-lo para uma ação positiva dentro do app.
`;

export const sendMessageToGemini = async (message, history) => {
  try {
    // CORREÇÃO: Usando o modelo exato que aparece na sua lista
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const chatHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Entendido. Sou o Vivamente. Vou agir conforme suas diretrizes, com empatia e sugerindo as ferramentas do app quando necessário." }],
        },
        ...chatHistory
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error("Erro ao falar com o Gemini:", error);
    return "Sinto muito, estou tendo dificuldade para me conectar agora. Podemos tentar novamente em instantes?";
  }
};