import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos os ícones dinâmicos
import { Play, Info, BookOpen, Wrench, ArrowRight, Heart, Wind, Droplet, Sun, Moon, Coffee, Book } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import CardItem from '../components/CardItem';
import HorizontalCarousel from '../components/HorizontalCarousel';
import PetalsAnimation from '../components/PetalsAnimation';
import { useCourses } from '../hooks/useCourses';
import { useTools } from '../hooks/useTools';

// Mapa de Ícones (Converte texto do Admin em Ícone Visual)
const iconMap = {
  heart: Heart,
  wind: Wind,
  droplet: Droplet,
  sun: Sun,
  moon: Moon,
  coffee: Coffee,
  book: Book,
  default: Wrench
};

const AprenderHome = () => {
  const navigate = useNavigate();
  const { courses, loading: coursesLoading } = useCourses();
  const { tools, loading: toolsLoading } = useTools();

  const featuredCourse = courses && courses.length > 0 ? courses[0] : null;

  return (
    <div className="min-h-screen bg-[#0f172a] pb-20 relative overflow-x-hidden">
      <PetalsAnimation />
      
      {/* === HERO SECTION === */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        {coursesLoading ? (
          <Skeleton className="w-full h-full bg-gray-800" />
        ) : featuredCourse ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${featuredCourse.image_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 pb-12 z-10">
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
                Destaque
              </span>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {featuredCourse.title}
              </h1>
              <p className="text-gray-200 text-sm line-clamp-2 max-w-md mb-6 drop-shadow-md">
                {featuredCourse.description}
              </p>
              
              <div className="flex gap-3">
                <Button 
                  className="bg-white text-black hover:bg-gray-200 font-bold px-6 rounded-lg flex items-center gap-2"
                  onClick={() => navigate(`/curso/${featuredCourse.id}`)}
                >
                  <Play className="w-5 h-5 fill-black" />
                  Começar Agora
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <p className="text-gray-400">Carregando conteúdo...</p>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-6 relative z-20 space-y-8">
        
        {/* === TRILHO DE CURSOS === */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Cursos Disponíveis</h2>
          </div>

          {coursesLoading ? (
            <div className="flex gap-4"><Skeleton className="w-[200px] h-[120px] bg-gray-800 rounded-xl" /></div>
          ) : courses && courses.length > 0 ? (
            <HorizontalCarousel>
              {courses.map((course) => (
                <CardItem
                  key={course.id}
                  image_url={course.image_url}
                  title={course.title}
                  subtitle="Curso Completo"
                  tag="Novo"
                  onClick={() => navigate(`/curso/${course.id}`)}
                />
              ))}
            </HorizontalCarousel>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum curso encontrado.</p>
          )}
        </section>

        {/* === TRILHO DE FERRAMENTAS (NOVO) === */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Ferramentas Rápidas</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {toolsLoading ? (
               <Skeleton className="w-full h-16 bg-gray-800 rounded-xl" />
            ) : tools && tools.length > 0 ? (
              tools.map((tool) => {
                const IconComponent = iconMap[tool.icon_name] || iconMap.default;
                
                return (
                  <div 
                    key={tool.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => navigate('/tarefas')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{tool.text_pt}</h3>
                        <p className="text-xs text-gray-400">
                          {tool.tool_categories?.name_pt || "Geral"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma ferramenta encontrada.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AprenderHome;