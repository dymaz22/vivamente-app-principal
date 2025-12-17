export async function sendMessageToOpenAI(message, history = [], aiContext = null) {
  const res = await fetch('/.netlify/functions/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history,
      aiContext,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || `Erro na IA (status ${res.status})`;
    throw new Error(msg);
  }

  return data?.text || "Não consegui responder agora 😕\n\nQuer tentar de novo?";
}
