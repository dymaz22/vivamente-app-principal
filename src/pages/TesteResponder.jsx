import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { useQuizQuestions, submitQuiz } from '../hooks/useQuizzes';
import { useAuth } from '../hooks/useAuth';

const TesteResponder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { questions, loading, error } = useQuizQuestions(parseInt(id), 'pt');

  const currentQuestion = !loading && questions.length > 0 ? questions[currentQuestionIndex] : null;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer = currentQuestion?.id ? answers[currentQuestion.id] !== undefined : false;

  const handleAnswerSelect = (optionId) => {
    if (!currentQuestion?.id) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Erro: Usuário não encontrado. Faça o login novamente.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitQuiz(parseInt(id), answers, user.id);
      if (result.success) {
        navigate(`/teste/${id}/resultado`, { state: { resultData: result.data } });
      } else {
        alert("Ocorreu um erro ao finalizar o teste. Tente novamente.");
        console.error('Erro ao submeter quiz:', result.error);
      }
    } catch (error) {
      alert("Ocorreu um erro grave ao finalizar o teste.");
      console.error('Erro ao submeter quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight' && hasAnswer) handleNext();
      else if (event.key === 'ArrowLeft' && currentQuestionIndex > 0) handlePrevious();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex, hasAnswer, questions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8"><Skeleton className="h-10 w-10 rounded-full bg-card/30" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-full bg-card/30" /><Skeleton className="h-6 w-32 bg-card/30" /></div></div>
          <Card className="bg-card/30 backdrop-blur-sm border-border/50"><CardHeader><Skeleton className="h-8 w-3/4 bg-card/30" /></CardHeader><CardContent><div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => (<Skeleton key={i} className="h-12 w-full bg-card/30" />))}</div></CardContent></Card>
        </div>
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4 flex items-center justify-center">
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 w-full max-w-lg"><CardContent className="p-8 text-center"><h2 className="text-2xl font-bold text-white mb-4">Erro ao carregar perguntas</h2><p className="text-white/70 mb-6">{error || 'Não foram encontradas perguntas para este teste.'}</p><Button onClick={() => navigate(`/teste/${id}`)} className="bg-primary hover:bg-primary/90">Voltar para a Introdução</Button></CardContent></Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-4xl">
           <Skeleton className="h-screen w-full bg-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/teste/${id}`)} className="text-white/70 hover:text-white" disabled={submitting}><ArrowLeft className="w-4 h-4" /></Button>
          <div className="flex-1"><Progress value={progress} className="h-2 mb-2" /><p className="text-white/70 text-sm">Pergunta {currentQuestionIndex + 1} de {questions.length}</p></div>
        </div>
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white leading-relaxed">{currentQuestion.text_pt}</CardTitle>
            <CardDescription className="text-white/70">Selecione a opção que melhor representa sua resposta</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={String(answers[currentQuestion.id] || '')} onValueChange={handleAnswerSelect} className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                  <div key={option.id} className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-card/30 ${answers[currentQuestion.id] === option.id ? 'border-primary bg-primary/10' : 'border-border/30 bg-card/10'}`} onClick={() => handleAnswerSelect(option.id)}>
                    <RadioGroupItem value={String(option.id)} id={`opt-${option.id}`} className="text-primary" />
                    <Label htmlFor={`opt-${option.id}`} className="flex-1 text-white cursor-pointer font-medium"><span className="text-primary font-bold mr-2">{index + 1}.</span>{option.text_pt}</Label>
                  </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0 || submitting} className="border-border/50 text-white hover:bg-card/50"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button>
          <Button onClick={handleNext} disabled={!hasAnswer || submitting} className="bg-primary hover:bg-primary/90 text-white">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isLastQuestion ? <><Check className="w-4 h-4 mr-2" />Finalizar</> : <>Próxima<ArrowRight className="w-4 h-4 ml-2" /></>}</Button>
        </div>
      </div>
    </div>
  );
};

export default TesteResponder;