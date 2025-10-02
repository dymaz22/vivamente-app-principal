import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Play, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import PetalsAnimation from '../components/PetalsAnimation';
import { useCourseDetails } from '../hooks/useCourses';

const CursoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courseDetails, loading, error } = useCourseDetails(parseInt(id), 'pt');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'bloqueada':
        return <Lock className="w-5 h-5 text-gray-400" />;
      case 'liberada':
        return <Play className="w-5 h-5 text-primary" />;
      case 'concluida':
        return <Check className="w-5 h-5 text-green-500" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'bloqueada':
        return 'text-gray-400 cursor-not-allowed';
      case 'liberada':
        return 'text-white hover:text-primary cursor-pointer';
      case 'concluida':
        return 'text-green-500 cursor-pointer';
      default:
        return 'text-gray-400 cursor-not-allowed';
    }
  };

  const handleLessonClick = (lesson) => {
    if (lesson.status === 'liberada' || lesson.status === 'concluida') {
      navigate(`/licao/${lesson.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
        <PetalsAnimation />
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full bg-card/30" />
            <Skeleton className="h-8 w-48 bg-card/30" />
          </div>
          
          {/* Course Info Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4 bg-card/30" />
            <Skeleton className="h-6 w-full mb-2 bg-card/30" />
            <Skeleton className="h-6 w-3/4 bg-card/30" />
          </div>
          
          {/* Lessons Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-card/30" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative flex items-center justify-center">
        <PetalsAnimation />
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Erro ao carregar curso</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <Button onClick={() => navigate('/aprender')} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative flex items-center justify-center">
        <PetalsAnimation />
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Curso não encontrado</h2>
          <Button onClick={() => navigate('/aprender')} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      <PetalsAnimation />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/aprender')}
            className="text-white hover:text-primary"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Detalhes do Curso</h1>
        </div>

        {/* Course Info */}
        <div className="mb-8">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            {courseDetails.image_url && (
              <div className="mb-6">
                <img
                  src={courseDetails.image_url}
                  alt={courseDetails.title_pt}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}
            <h2 className="text-3xl font-bold text-white mb-4">
              {courseDetails.title_pt}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              {courseDetails.description_pt}
            </p>
          </div>
        </div>

        {/* Lessons List */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Lições do Curso</h3>
          
          {courseDetails.lessons && courseDetails.lessons.length > 0 ? (
            <div className="space-y-4">
              {courseDetails.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 transition-all duration-200 ${
                    lesson.status === 'liberada' || lesson.status === 'concluida'
                      ? 'hover:bg-card/50 cursor-pointer'
                      : 'cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(lesson.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-white/50">
                          Lição {lesson.order || index + 1}
                        </span>
                        {lesson.status === 'concluida' && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            Concluída
                          </span>
                        )}
                        {lesson.status === 'liberada' && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            Disponível
                          </span>
                        )}
                      </div>
                      <h4 className={`font-semibold ${getStatusColor(lesson.status)}`}>
                        {lesson.title_pt}
                      </h4>
                      {lesson.content_pt && (
                        <p className="text-white/60 text-sm mt-1 line-clamp-2">
                          {lesson.content_pt.substring(0, 100)}...
                        </p>
                      )}
                    </div>

                    {(lesson.status === 'liberada' || lesson.status === 'concluida') && (
                      <div className="flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                        >
                          {lesson.status === 'concluida' ? 'Revisar' : 'Iniciar'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8 text-center">
              <p className="text-white/70">Nenhuma lição disponível para este curso.</p>
            </div>
          )}
        </div>

        {/* Course Progress */}
        {courseDetails.lessons && courseDetails.lessons.length > 0 && (
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Progresso do Curso</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${
                        (courseDetails.lessons.filter(l => l.status === 'concluida').length /
                          courseDetails.lessons.length) *
                        100
                      }%`
                    }}
                  />
                </div>
              </div>
              <span className="text-white/70 text-sm">
                {courseDetails.lessons.filter(l => l.status === 'concluida').length} de{' '}
                {courseDetails.lessons.length} lições
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CursoDetalhes;

