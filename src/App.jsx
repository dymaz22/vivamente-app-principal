import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes de autenticação
import Login from './pages/Login';
import Register from './pages/Register';

// Componentes de layout
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas da seção Aprender (existentes)
import AprenderHome from './pages/AprenderHome';
import ProgramaDetalhes from './pages/ProgramaDetalhes';
import CursoDetalhes from './pages/CursoDetalhes';
import Licao from './pages/Licao';
import Ferramentas from './pages/Ferramentas';
import AdicionarTarefa from './components/AdicionarTarefa';

// Páginas de Testes (novas)
import TesteIntroducao from './pages/TesteIntroducao';
import TesteResponder from './pages/TesteResponder';
import TesteResultado from './pages/TesteResultado';

// Páginas de Rotina e Humor
import Rotina from './pages/Rotina';
import MoodStep1_Level from './pages/MoodStep1_Level';
import MoodStep2_Sentiments from './pages/MoodStep2_Sentiments';
import MoodStep3_Context from './pages/MoodStep3_Context';

// Páginas placeholder (serão criadas)
import Companheiro from './pages/Companheiro';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas (autenticação) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas protegidas com layout principal */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Redirecionar / para /aprender */}
          <Route index element={<Navigate to="/aprender" replace />} />
          
          {/* Seção Aprender */}
          <Route path="aprender" element={<AprenderHome />} />
          <Route path="programa/:id" element={<ProgramaDetalhes />} />
          <Route path="curso/:id" element={<CursoDetalhes />} />
          <Route path="licao/:id" element={<Licao />} />
          <Route path="tarefas" element={<Ferramentas />} />
          <Route path="tarefas/nova" element={<AdicionarTarefa />} />
          
          {/* Seção Testes */}
          <Route path="teste/:id" element={<TesteIntroducao />} />
          <Route path="teste/:id/responder" element={<TesteResponder />} />
          <Route path="teste/:id/resultado" element={<TesteResultado />} />
          
          {/* Seção Rotina e Humor */}
          <Route path="rotina" element={<Rotina />} />
          <Route path="rotina/humor/nivel" element={<MoodStep1_Level />} />
          <Route path="rotina/humor/sentimentos" element={<MoodStep2_Sentiments />} />
          <Route path="rotina/humor/contexto" element={<MoodStep3_Context />} />
          
          {/* Outras seções (placeholder) */}
          <Route path="companheiro" element={<Companheiro />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
        
        {/* Rota catch-all - redirecionar para login se não autenticado, senão para aprender */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

