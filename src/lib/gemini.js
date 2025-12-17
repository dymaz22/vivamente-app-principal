// src/lib/gemini.js
// Mantemos o nome para não quebrar imports antigos
// Agora aponta para OpenAI + memória + eventos

import { supabase } from './supabaseClient';

export async function sendMessageToGemini(message, history = []) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return 'Usuário não autenticado.';
    }

    const res = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        userId: user.id,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || 'Erro na IA');
    }

    return data.text || 'Não consegui responder agora.';
  } catch (err) {
    console.error('Erro ao falar com a IA:', err);
    return 'Estou com dificuldade agora. Tente novamente em instantes.';
  }
}
