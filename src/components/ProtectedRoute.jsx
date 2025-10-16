import React from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  
  // Se ainda estiver carregando, não mostre nada
  if (authLoading) {
    return null; // A tela de loading será controlada pelo App.jsx
  }
  
  // Se estiver autenticado, mostre o conteúdo. Caso contrário, não mostre nada.
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;