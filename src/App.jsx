import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes de autenticação
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Componentes de layout
import MainLayout from './components/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Páginas da seção Aprender (existentes)
import AprenderHome from './pages/AprenderHome.jsx';
import ProgramaDetalhes from './pages/ProgramaDetalhes.jsx';
import CursoDetalhes from './pages/CursoDetalhes.jsx';
import Licao from './pages/Licao.jsx';
import Ferramentas from './pages/Ferramentas.jsx';
import AdicionarTarefa from './components/AdicionarTarefa.jsx';

// Páginas de Testes (novas)
import TesteIntroducao from './pages/TesteIntroducao.jsx';
import TesteResponder from './pages/TesteResponder.jsx';
import TesteResultado from './pages/TesteResultado.jsx';

// Páginas de Rotina e Humor
import Rotina from './pages/Rotina.jsx';
import MoodStep1_Level from './pages/MoodStep1_Level.jsx';
import MoodStep2_Sentiments from './pages/MoodStep2_Sentiments.jsx';
import MoodStep3_Context from './pages/MoodStep3_Context.jsx';
import MoodSuccess from './pages/MoodSuccess.jsx'; // <-- IMPORTAÇÃO CORRETA

// Páginas placeholder (serão criadas)
import Companheiro from './pages/Companheiro.jsx';
import Perfil from './pages/Perfil.jsx';

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
          
          {/* Seção Rotina e Humor */}
          <Route path="rotina" element={<Rotina />} />
          <Route path="rotina/humor/nivel" element={<MoodStep1_Level />} />
          <Route path="rotina/humor/sentimentos" element={<MoodStep2_Sentiments />} />
          <Route path="rotina/humor/contexto" element={<MoodStep3_Context />} />
          <Route path="rotina/humor/sucesso" element={<MoodSuccess />} /> {/* <-- ROTA ADICIONADA */}
          
          <Route path="companheiro" element={<Companheiro />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;