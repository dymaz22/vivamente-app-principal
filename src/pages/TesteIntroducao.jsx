import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

// Hooks (useUserQuizHistory foi removido)
import { useQuizDetails } from '../hooks/useQuizzes';

const TesteIntroducao = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hooks de dados (useUserQuizHistory foi removido)
  const { quizDetails, loading, error } = useQuizDetails(parseInt(id), 'pt');

  const handleStartQuiz = () => {
    navigate(`/teste/${id}/responder`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full bg-card/30" />
            <div className="space-y-2"><Skeleton className="h-8 w-64 bg-card/30" /><Skeleton className="h-4 w-48 bg-card/30" /></div>
          </div>
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardHeader><Skeleton className="h-8 w-3/4 bg-card/30" /><Skeleton className="h-4 w-full bg-card/30" /><Skeleton className="h-4 w-2/3 bg-card/30" /></CardHeader>
            <CardContent><div className="space-y-4"><div className="flex gap-4"><Skeleton className="h-6 w-20 bg-card/30" /><Skeleton className="h-6 w-24 bg-card/30" /></div><div className="flex gap-4"><Skeleton className="h-10 w-full bg-card/30" /></div></div></CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !quizDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Teste não encontrado</h2>
              <p className="text-white/70 mb-6">{error || 'O teste que você está procurando não foi encontrado.'}</p>
              <Button onClick={() => navigate('/aprender')} className="bg-primary hover:bg-primary/90">Voltar para Aprender</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/aprender')} className="text-white/70 hover:text-white"><ArrowLeft className="w-4 h-4" /></Button>
          <div><h1 className="text-2xl font-bold text-white">Teste</h1><p className="text-white/70">Prepare-se para descobrir mais sobre você</p></div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {quizDetails?.image_url && (<img src={quizDetails.image_url} alt={quizDetails.title_pt || 'Teste'} className="w-20 h-20 rounded-lg object-cover" />)}
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-white mb-2">{quizDetails?.title_pt || 'Teste'}</CardTitle>
                    <CardDescription className="text-white/70 text-base">{quizDetails?.description_pt || 'Descrição do teste'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30"><Clock className="w-4 h-4 mr-2" />{quizDetails?.duration || '10 min'}</Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30"><FileText className="w-4 h-4 mr-2" />{quizDetails?.questions_count || 0} perguntas</Badge>
                </div>
                <Button onClick={handleStartQuiz} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto" size="lg"><Play className="w-5 h-5 mr-2" />Iniciar Teste</Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {quizDetails?.resultCategories && Array.isArray(quizDetails.resultCategories) && quizDetails.resultCategories.length > 0 && (
              <Card className="bg-card/30 backdrop-blur-sm border-border/50">
                <CardHeader><CardTitle className="text-lg text-white">Categorias de Resultado</CardTitle><CardDescription className="text-white/70">O que você pode descobrir</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  {quizDetails.resultCategories.map((category) => (
                    <div key={category?.id || Math.random()} className="p-3 rounded-lg bg-card/20 border border-border/30">
                      <h4 className="font-semibold text-white text-sm mb-1">{category?.title_pt || 'Categoria'}</h4>
                      <p className="text-white/70 text-xs">{category?.description_pt || 'Descrição da categoria'}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
              <CardHeader><CardTitle className="text-lg text-white">Dicas</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                <div className="flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><p>Responda com honestidade para obter resultados mais precisos</p></div>
                <div className="flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><p>Não há respostas certas ou erradas</p></div>
                <div className="flex items-start gap-2"><div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><p>Você pode refazer o teste quantas vezes quiser</p></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesteIntroducao;