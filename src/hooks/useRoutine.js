import { useState } from 'react';

// LISTA DE SENTIMENTOS MOCKADOS RESTAURADA
const MOCKED_SENTIMENTS = [
  { id: 1, name: 'Feliz' },
  { id: 2, name: 'Grato(a)' },
  { id: 3, name: 'Animado(a)' },
  { id: 4, name: 'Relaxado(a)' },
  { id: 5, name: 'Calmo(a)' },
  { id: 6, name: 'Confiante' },
  { id: 7, name: 'Ansioso(a)' },
  { id: 8, name: 'Estressado(a)' },
  { id: 9, name: 'Triste' },
  { id: 10, name: 'Cansado(a)' },
  { id: 11, name: 'Irritado(a)' },
  { id: 12, name: 'Entediado(a)' }
];

// O hook agora só faz uma coisa: fornece a lista de sentimentos.
export const useRoutine = () => {
    const [sentimentsList] = useState(MOCKED_SENTIMENTS);

    return {
        sentimentsList,
        // As outras funções foram removidas para evitar conflitos
    };
};