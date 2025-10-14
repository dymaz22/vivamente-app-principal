import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import CardItem from '../components/CardItem';
import HorizontalCarousel from '../components/HorizontalCarousel';
import PetalsAnimation from '../components/PetalsAnimation';

// Importando apenas o hook que existe
import { useCourses } from '../hooks/useCourses';

const AprenderHome = () => {
  const navigate = useNavigate();

  // Usando apenas o hook que existe
  const { courses, loading: coursesLoading, error: coursesError } = useCourses('pt');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      <PetalsAnimation />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Aprender</h1>
          <p className="text-white/70">Desenvolva seu bem-estar com conteúdo personalizado</p>
        </div>

        {/* A SEÇÃO "CONTINUE FAZENDO" FOI REMOVIDA */}

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

        {/* A SEÇÃO "TESTES" FOI REMOVIDA */}
        
      </div>
    </div>
  );
};

export default AprenderHome;