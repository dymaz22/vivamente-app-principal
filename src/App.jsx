import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { useAuth } from './hooks/useAuth.jsx';
import Welcome from './pages/Welcome.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Subscription from './pages/Subscription.jsx';
import Quiz from './pages/Quiz.jsx';
import MainLayout from './components/MainLayout.jsx';
import AprenderHome from './pages/AprenderHome.jsx';
import ProgramaDetalhes from './pages/ProgramaDetalhes.jsx';
import CourseDetails from './pages/CursoDetalhes.jsx'; 
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
import Definicoes from './pages/Definicoes.jsx';
import EditarNome from './pages/EditarNome.jsx';
import AlterarSenha from './pages/AlterarSenha.jsx';
import AnaliseHumor from './pages/AnaliseHumor.jsx';
import StreakCalendar from './pages/StreakCalendar.jsx';
import TimelineStats from './pages/TimelineStats.jsx';
import ReasonsStats from './pages/ReasonsStats.jsx';
import SentimentsStats from './pages/SentimentsStats.jsx';
import LandingBackground from './components/auth/LandingBackground.jsx';
import FlowGuard from './components/auth/FlowGuard.jsx';
import Termos from './pages/Termos.jsx';
import Privacidade from './pages/Privacidade.jsx';

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

function AppContent() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* ============================================================
          ROTAS UNIVERSAIS (Acessíveis Logado ou Deslogado)
      ============================================================ */}
      <Route path="/termos" element={<Termos />} />
      <Route path="/privacidade" element={<Privacidade />} />

      {isAuthenticated ? (
        // ============================================================
        // ÁREA LOGADA
        // ============================================================
        <>
          {/* Rotas Especiais (Fora do Layout Principal) */}
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/quiz" element={<Quiz />} />

          {/* O FlowGuard protege o conteúdo principal */}
          <Route path="/" element={
            <FlowGuard>
              <MainLayout />
            </FlowGuard>
          }>
            <Route index element={<Navigate to="/aprender" replace />} />
            
            {/* Conteúdo */}
            <Route path="aprender" element={<AprenderHome />} />
            
            {/* CORREÇÃO AQUI: Rota simplificada para bater com o link da Home */}
            <Route path="curso/:id" element={<CourseDetails />} />
            
            <Route path="programa/:id" element={<ProgramaDetalhes />} />
            <Route path="aprender/aula/:id" element={<Licao />} />
            <Route path="licao/:id" element={<Licao />} />

            {/* Ferramentas */}
            <Route path="tarefas" element={<Ferramentas />} />
            <Route path="tarefas/nova" element={<AdicionarTarefa />} />
            
            {/* Testes */}
            <Route path="teste/:id" element={<TesteIntroducao />} />
            <Route path="teste/:id/responder" element={<TesteResponder />} />
            <Route path="teste/:id/resultado" element={<TesteResultado />} />
            
            {/* Rotina e Humor */}
            <Route path="rotina" element={<Rotina />} />
            <Route path="rotina/humor/nivel" element={<MoodStep1_Level />} />
            <Route path="rotina/humor/sentimentos" element={<MoodStep2_Sentiments />} />
            <Route path="rotina/humor/contexto" element={<MoodStep3_Context />} />
            <Route path="rotina/humor/sucesso" element={<MoodSuccess />} />
            
            {/* IA e Perfil */}
            <Route path="companheiro" element={<Companheiro />} />
            <Route path="perfil" element={<Perfil />} />
            
            {/* Estatísticas */}
            <Route path="analise-humor" element={<AnaliseHumor />} />
            <Route path="streak-calendar" element={<StreakCalendar />} />
            <Route path="timeline-stats" element={<TimelineStats />} />
            <Route path="reasons-stats" element={<ReasonsStats />} />
            <Route path="sentiments-stats" element={<SentimentsStats />} />
            
            {/* Configurações */}
            <Route path="definicoes" element={<Definicoes />} />
            <Route path="definicoes/nome" element={<EditarNome />} />
            <Route path="definicoes/senha" element={<AlterarSenha />} />
            
            <Route path="*" element={<Navigate to="/aprender" replace />} />
          </Route>
        </>
      ) : (
        // ============================================================
        // ÁREA PÚBLICA (Não logado)
        // ============================================================
        <>
          <Route path="/" element={
            <LandingBackground>
              <Welcome />
            </LandingBackground>
          } />
          <Route path="/login" element={
            <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-4">
               <div className="w-full max-w-md"><Login /></div>
            </div>
          } />
          <Route path="/register" element={
            <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-4">
               <div className="w-full max-w-md"><Register /></div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
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