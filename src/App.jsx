import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importe o seu hook de autenticação
import { useAuth } from './hooks/useAuth.jsx';

// Componentes
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MainLayout from './components/MainLayout.jsx';
import AprenderHome from './pages/AprenderHome.jsx';
// ... (mantenha todas as suas outras importações de página aqui)
import ProgramaDetalhes from './pages/ProgramaDetalhes.jsx';
import CursoDetalhes from './pages/CursoDetalhes.jsx';
import Licao from './pages/Licao.jsx';
import Ferramentas from './pages/Ferramentas.jsx';
import AdicionarTarefa from './components/AdicionarTarefa.jsx';
import TesteIntroducao from './pages/TesteIntroducao.jsx';
import TesteResponder from './pages/TesteResponder.jsx';
import TesteResultado from './pages/TesteResultado.jsx';
import Rotina from './pages/Rotina.jsx';
import MoodStep1_Level from './pages/MoodStep1_Level.jsx';
import MoodStep2_Sentiments from './pages/MoodStep2_Sentiments.jsx';
import MoodStep3_Context from './pages/MoodStep3_Context.jsx';
import MoodSuccess from './pages/MoodSuccess.jsx';
import Companheiro from './pages/Companheiro.jsx';
import Perfil from './pages/Perfil.jsx';

// Tela de Loading genérica
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function AppContent() {
  const { isAuthenticated, authLoading } = useAuth();

  // 1. Mostra a tela de Loading enquanto a autenticação é verificada
  if (authLoading) {
    return <LoadingScreen />;
  }

  // 2. Após o loading, decide qual conjunto de rotas renderizar
  return (
    <Routes>
      {isAuthenticated ? (
        // --- ROTAS PROTEGIDAS ---
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/aprender" replace />} />
          <Route path="aprender" element={<AprenderHome />} />
          <Route path="programa/:id" element={<ProgramaDetalhes />} />
          <Route path="curso/:id" element={<CursoDetalhes />} />
          <Route path="licao/:id" element={<Licao />} />
          <Route path="tarefas" element={<Ferramentas />} />
          <Route path="tarefas/nova" element={<AdicionarTarefa />} />
          <Route path="teste/:id" element={<TesteIntroducao />} />
          <Route path="teste/:id/responder" element={<TesteResponder />} />
          <Route path="teste/:id/resultado" element={<TesteResultado />} />
          <Route path="rotina" element={<Rotina />} />
          <Route path="rotina/humor/nivel" element={<MoodStep1_Level />} />
          <Route path="rotina/humor/sentimentos" element={<MoodStep2_Sentiments />} />
          <Route path="rotina/humor/contexto" element={<MoodStep3_Context />} />
          <Route path="rotina/humor/sucesso" element={<MoodSuccess />} />
          <Route path="companheiro" element={<Companheiro />} />
          <Route path="perfil" element={<Perfil />} />
          {/* Rota de fallback para qualquer outra URL quando logado */}
          <Route path="*" element={<Navigate to="/aprender" replace />} />
        </Route>
      ) : (
        // --- ROTAS PÚBLICAS ---
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rota de fallback para qualquer outra URL quando deslogado */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;