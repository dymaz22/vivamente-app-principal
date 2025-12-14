import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { useCourseDetails } from '../hooks/useCourses';
import { Skeleton } from '../components/ui/skeleton';

const CursoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courseDetails, loading } = useCourseDetails(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-4">
        <Skeleton className="h-64 w-full rounded-2xl bg-gray-800 mb-4" />
        <Skeleton className="h-8 w-1/2 bg-gray-800 mb-2" />
        <Skeleton className="h-4 w-3/4 bg-gray-800" />
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Curso não encontrado</h2>
          <button onClick={() => navigate(-1)} className="text-purple-400">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20">
      {/* Header com Imagem */}
      <div className="relative h-72 w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${courseDetails.image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/60 to-[#0f172a]" />
        </div>
        
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6">
          <h1 className="text-3xl font-bold mb-2 text-shadow-lg">{courseDetails.title}</h1>
          <p className="text-gray-300 text-sm line-clamp-2">{courseDetails.description}</p>
        </div>
      </div>

      {/* Lista de Aulas */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          Lições do Curso
          <span className="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            {courseDetails.lessons?.length || 0} aulas
          </span>
        </h2>

        <div className="space-y-3">
          {courseDetails.lessons?.map((lesson, index) => (
            <div 
              key={lesson.id}
              onClick={() => navigate(`/licao/${lesson.id}`)}
              className="group bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-800 hover:border-purple-500/30 transition-all active:scale-[0.98]"
            >
              {/* Ícone de Play (Sempre liberado) */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <PlayCircle className="w-5 h-5 text-purple-400" />
              </div>

              <div className="flex-grow">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Lição {index + 1}
                </span>
                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {lesson.title}
                </h3>
              </div>

              <div className="flex-shrink-0">
                {/* Seta discreta indicando que é clicável */}
                <div className="w-8 h-8 rounded-full bg-gray-700/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </div>
              </div>
            </div>
          ))}

          {(!courseDetails.lessons || courseDetails.lessons.length === 0) && (
            <p className="text-gray-500 text-center py-8">Nenhuma aula disponível ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CursoDetalhes;