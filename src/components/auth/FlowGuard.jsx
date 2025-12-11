import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';

export default function FlowGuard({ children }) {
  const { user } = useAuth();
  const { isPro, onboardingCompleted, loading } = useProfile({ user });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // 1. Se não estiver logado, deixa o Router lidar (vai pro Login)
    if (!user) return;

    const currentPath = location.pathname;

    // 2. Se NÃO for PRO -> Manda para Assinatura
    if (!isPro) {
      if (currentPath !== '/subscription') {
        navigate('/subscription', { replace: true });
      }
      return;
    }

    // 3. Se for PRO mas NÃO fez o Quiz -> Manda para o Quiz
    if (isPro && !onboardingCompleted) {
      if (currentPath !== '/quiz') {
        navigate('/quiz', { replace: true });
      }
      return;
    }

    // 4. Se já fez tudo e tentar voltar para telas de onboarding -> Manda para Home
    if (isPro && onboardingCompleted) {
      if (currentPath === '/subscription' || currentPath === '/quiz') {
        navigate('/aprender', { replace: true });
      }
    }

  }, [user, isPro, onboardingCompleted, loading, navigate, location]);

  // Enquanto carrega o perfil, mostra uma tela de loading bonita
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return children;
}