import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Share2, Download, Trophy, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';

const TesteResultado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // >>>>> CORREÇÃO APLICADA AQUI <<<<<
  // Pegamos o objeto 'resultData' que foi enviado
  const { resultData } = location.state || {};

  // Se não há dados, mostramos a tela de erro
  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4 flex items-center justify-center">
        <Card className="bg-card/30 backdrop-blur-sm border-border/50"><CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Resultado não encontrado</h2>
          <p className="text-white/70 mb-6">Não foi possível carregar os resultados do teste.</p>
          <Button onClick={() => navigate(`/teste/${id}`)} className="bg-primary hover:bg-primary/90">Voltar ao Teste</Button>
        </CardContent></Card>
      </div>
    );
  }

  // Extraímos as informações de dentro do resultData
  const { score: totalScore, categoryDetails } = resultData;
  const dominantCategoryName = categoryDetails?.name_pt || 'Não definida';
  
  // Lógica de cálculo (simplificada, pois já temos o score total)
  const maxPossibleScore = 25; // Exemplo, precisaria vir do DB no futuro
  const overallPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/aprender')} className="text-white/70 hover:text-white"><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Resultado do Teste</h1>
            <p className="text-white/70">Concluído em {resultData.completed_at ? formatDate(resultData.completed_at) : 'agora'}</p>
          </div>
        </div>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4"><Trophy className="w-12 h-12 text-primary" /></div>
            <CardTitle className="text-3xl text-white">Teste Concluído!</CardTitle>
            <CardDescription className="text-white/70 text-lg">Seu resultado principal foi:</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <h3 className="text-4xl font-bold text-primary mb-2">{dominantCategoryName}</h3>
             <p className="text-white/70 max-w-md mx-auto">{categoryDetails?.description_pt || "Continue se cuidando."}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
           <CardHeader>
              <CardTitle className="text-xl text-white">Detalhes da Pontuação</CardTitle>
           </CardHeader>
           <CardContent className="text-center space-y-4">
              <div>
                <p className="text-white/70 text-sm">Pontuação Total</p>
                <p className="text-4xl font-bold text-white">{totalScore}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Percentual</p>
                <p className="text-2xl font-bold text-primary">{overallPercentage}%</p>
                <Progress value={overallPercentage} className="h-2 mt-2" />
              </div>
           </CardContent>
        </Card>
        
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(`/teste/${id}/responder`)} className="bg-primary hover:bg-primary/90"><RotateCcw className="w-4 h-4 mr-2" />Refazer Teste</Button>
          <Button onClick={() => navigate('/rotina')} variant="outline" className="border-border/50 text-white hover:bg-card/50">Voltar para a Rotina</Button>
        </div>
      </div>
    </div>
  );
};

export default TesteResultado;