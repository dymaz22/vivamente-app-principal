import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';

export default function FlowGuard({ children }) {
  const { user, session } = useAuth();
  const { isPro, onboardingCompleted, loading } = useProfile(session);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Se estiver carregando ou sem usuário, não faz nada ainda
    if (loading || !user) return;

    const path = location.pathname;

    // LÓGICA DE PROTEÇÃO
    
    // 1. Se NÃO é PRO -> Manda pagar (exceto se já estiver lá)
    if (!isPro) {
      if (path !== '/subscription') {
        navigate('/subscription', { replace: true });
      }
      return;
    }

    // 2. Se é PRO mas NÃO fez Quiz -> Manda pro Quiz
    if (isPro && !onboardingCompleted) {
      if (path !== '/quiz') {
        navigate('/quiz', { replace: true });
      }
      return;
    }

    // 3. Se já fez tudo -> Não deixa voltar pra telas de entrada
    if (isPro && onboardingCompleted) {
      if (path === '/subscription' || path === '/quiz') {
        navigate('/aprender', { replace: true });
      }
    }

  }, [user, isPro, onboardingCompleted, loading, navigate, location]);

  // Tela de Carregamento (Evita piscar conteúdo proibido)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return children;
}