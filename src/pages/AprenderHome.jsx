import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, BookOpen, Wrench, Brain, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import CardItem from '../components/CardItem';
import HorizontalCarousel from '../components/HorizontalCarousel';
import PetalsAnimation from '../components/PetalsAnimation';

// Importar hooks de backend
import { useCourses, useLastActivity, useQuizzes } from '../hooks/useCourses';

const AprenderHome = () => {
  const navigate = useNavigate();

  // Hooks de backend
  const { courses, loading: coursesLoading, error: coursesError } = useCourses('pt');
  const { lastActivity, loading: lastActivityLoading, error: lastActivityError } = useLastActivity();
  const { quizzes, loading: quizzesLoading, error: quizzesError } = useQuizzes('pt');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      {/* Animação de pétalas */}
      <PetalsAnimation />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Aprender</h1>
          <p className="text-white/70">Desenvolva seu bem-estar com conteúdo personalizado</p>
        </div>

        {/* Continue Fazendo (anteriormente Curso Personalizado) */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">Continue Fazendo</h2>
          </div>
          
          {lastActivityLoading ? (
            <div className="max-w-md">
              <Skeleton className="h-48 w-full rounded-2xl bg-card/30" />
            </div>
          ) : lastActivityError ? (
            <div className="max-w-md bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <p className="text-white/70">Erro ao carregar última atividade</p>
            </div>
          ) : lastActivity && lastActivity.id ? (
            <CardItem
              image_url={lastActivity.image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"}
              title={lastActivity.title_pt || "Continue sua jornada"}
              subtitle="Próxima lição a ser feita"
              tag={`Lição ${lastActivity.order || 1}`}
              progress={75} // Progresso simulado
              onClick={() => navigate(`/licao/${lastActivity.id}`)}
              className="max-w-md"
            />
          ) : (
            <div className="max-w-md bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <p className="text-white/70">Nenhuma atividade recente encontrada</p>
            </div>
          )}
        </section>

        {/* Cursos (anteriormente Programas) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-white">Cursos</h2>
            </div>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/cursos')}
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {coursesLoading ? (
            <HorizontalCarousel>
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[280px]">
                  <Skeleton className="h-48 w-full rounded-2xl bg-card/30" />
                </div>
              ))}
            </HorizontalCarousel>
          ) : coursesError ? (
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <p className="text-white/70">Erro ao carregar cursos</p>
            </div>
          ) : courses && Array.isArray(courses) && courses.length > 0 ? (
            <HorizontalCarousel>
              {courses.map((course) => (
                course && course.id ? (
                  <CardItem
                    key={course.id}
                    image_url={course.image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"}
                    title={course.title_pt || "Curso sem título"}
                    subtitle={course.description_pt || "Descrição não disponível"}
                    tag="Curso"
                    onClick={() => navigate(`/curso/${course.id}`)}
                  />
                ) : null
              )).filter(Boolean)}
            </HorizontalCarousel>
          ) : (
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <p className="text-white/70">Nenhum curso disponível</p>
            </div>
          )}
        </section>

        {/* Ferramentas */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">Ferramentas</h2>
          </div>
          
          <div 
            className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 cursor-pointer hover:bg-card/50 transition-all duration-200"
            onClick={() => navigate('/tarefas')}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Tarefas do Dia</h3>
                <p className="text-white/70">Organize suas atividades de bem-estar</p>
              </div>
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>
        </section>

        {/* Testes */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-white">Testes</h2>
            </div>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/testes')}
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {quizzesLoading ? (
            <HorizontalCarousel>
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[280px]">
                  <Skeleton className="h-48 w-full rounded-2xl bg-card/30" />
                </div>
              ))}
            </HorizontalCarousel>
          ) : quizzesError ? (
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <p className="text-white/70">Erro ao carregar testes</p>
            </div>
          ) : quizzes && Array.isArray(quizzes) && quizzes.length > 0 ? (
            <HorizontalCarousel>
              {quizzes.map((quiz) => (
                quiz && quiz.id ? (
                  <CardItem
                    key={quiz.id}
                    image_url={quiz.image_url}
                    title={quiz.title_pt}
                    description={quiz.description_pt}
                    onClick={() => navigate(`/teste/${quiz.id}`)}
                    badge={`${quiz.questions_count || quiz.questions || 0} perguntas`}
                  />
                ) : null
              )).filter(Boolean)}
            </HorizontalCarousel>
          ) : (
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <p className="text-white/70">Nenhum teste disponível</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AprenderHome;

