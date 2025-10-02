import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';

// Hooks
import { useQuizQuestions, submitQuiz } from '../hooks/useQuizzes';

const TesteResponder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Hooks de dados
  const { questions, loading, error } = useQuizQuestions(parseInt(id), 'pt');

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer = currentQuestion?.id ? answers[currentQuestion.id] !== undefined : false;

  const handleAnswerSelect = (optionId) => {
    if (!currentQuestion?.id) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const result = await submitQuiz(parseInt(id), answers);
      
      if (result.success) {
        // Navegar para página de resultado com os dados
        navigate(`/teste/${id}/resultado`, { 
          state: { 
            results: result.data.results,
            categories: result.data.categories,
            completed_at: result.data.completed_at
          }
        });
      } else {
        console.error('Erro ao submeter quiz:', result.error);
        // Aqui você pode mostrar uma mensagem de erro
      }
    } catch (error) {
      console.error('Erro ao submeter quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight' && hasAnswer) {
        handleNext();
      } else if (event.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        handlePrevious();
      } else if (event.key >= '1' && event.key <= '5') {
        const optionIndex = parseInt(event.key) - 1;
        if (currentQuestion?.options[optionIndex]) {
          handleAnswerSelect(currentQuestion.options[optionIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex, hasAnswer, currentQuestion]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full bg-card/30" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full bg-card/30" />
              <Skeleton className="h-6 w-32 bg-card/30" />
            </div>
          </div>

          {/* Question Card Skeleton */}
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 bg-card/30" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-card/30" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/teste/${id}`)}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Erro ao carregar perguntas</h2>
              <p className="text-white/70 mb-6">{error || 'Não foi possível carregar as perguntas do teste.'}</p>
              <Button onClick={() => navigate(`/teste/${id}`)} className="bg-primary hover:bg-primary/90">
                Voltar ao Teste
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/teste/${id}`)}
            className="text-white/70 hover:text-white"
            disabled={submitting}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-white/70 text-sm">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white leading-relaxed">
              {currentQuestion?.text_pt || 'Carregando pergunta...'}
            </CardTitle>
            <CardDescription className="text-white/70">
              Selecione a opção que melhor representa sua resposta
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <RadioGroup
              value={currentQuestion?.id ? (answers[currentQuestion.id] || '') : ''}
              onValueChange={handleAnswerSelect}
              className="space-y-4"
            >
              {currentQuestion?.options && Array.isArray(currentQuestion.options) ? 
                currentQuestion.options.map((option, index) => (
                  <div
                    key={option?.id || index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-card/30 ${
                      currentQuestion?.id && answers[currentQuestion.id] === option?.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border/30 bg-card/10'
                    }`}
                    onClick={() => option?.id && handleAnswerSelect(option.id)}
                  >
                    <RadioGroupItem value={option?.id || ''} id={option?.id || ''} className="text-primary" />
                    <Label
                      htmlFor={option?.id || ''}
                      className="flex-1 text-white cursor-pointer font-medium"
                    >
                      <span className="text-primary font-bold mr-2">{index + 1}.</span>
                      {option?.text_pt || 'Opção'}
                    </Label>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-white/70">Carregando opções...</p>
                  </div>
                )
              }
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitting}
            className="border-border/50 text-white hover:bg-card/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="text-center">
            <p className="text-white/50 text-sm">
              Use as teclas ← → para navegar ou 1-5 para selecionar
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!hasAnswer || submitting}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : isLastQuestion ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Finalizar
              </>
            ) : (
              <>
                Próxima
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index < currentQuestionIndex
                    ? 'bg-green-500'
                    : index === currentQuestionIndex
                    ? 'bg-primary'
                    : answers[questions[index]?.id]
                    ? 'bg-primary/50'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesteResponder;

