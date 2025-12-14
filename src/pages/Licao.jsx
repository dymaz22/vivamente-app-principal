import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, MessageSquare, Send, User } from 'lucide-react';
import { useLessonDetails, markLessonAsComplete, submitLessonRating, submitLessonComment } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

const Licao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lessonDetails, loading, refetch } = useLessonDetails(id);
  
  const [completing, setCompleting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  // Função para pegar ID do YouTube
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  };

  const handleComplete = async () => {
    if (!user) return;
    setCompleting(true);
    await markLessonAsComplete(id, user.id);
    await refetch();
    setCompleting(false);
  };

  const handleRating = async (rating) => {
    if (!user) return;
    await submitLessonRating(id, rating, user.id);
    await refetch();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    
    setSendingComment(true);
    await submitLessonComment(id, user.id, commentText);
    setCommentText('');
    await refetch();
    setSendingComment(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-4 flex flex-col gap-4">
        <Skeleton className="w-full aspect-video rounded-xl bg-gray-800" />
        <Skeleton className="h-8 w-3/4 bg-gray-800" />
      </div>
    );
  }

  if (!lessonDetails) return null;

  const videoId = getYouTubeId(lessonDetails.video_url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;
  const isCompleted = lessonDetails.userProgress?.is_completed;
  const userRating = lessonDetails.userProgress?.rating || 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0f172a]/95 backdrop-blur-md border-b border-gray-800 p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold truncate">{lessonDetails.title}</h1>
      </div>

      {/* Player */}
      <div className="w-full aspect-video bg-black sticky top-16 z-10">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={lessonDetails.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
            <p>Vídeo indisponível</p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* Conteúdo */}
        <div>
          <h2 className="text-xl font-bold mb-2">Sobre a aula</h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            {lessonDetails.content || "Sem descrição."}
          </p>
        </div>

        {/* Ações (Concluir e Avaliar) */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-6">
          
          {/* Botão Concluir */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Progresso</h3>
              <p className="text-xs text-gray-400">
                {isCompleted ? "Aula concluída!" : "Marque ao terminar"}
              </p>
            </div>
            <Button
              onClick={handleComplete}
              disabled={isCompleted || completing}
              className={`
                ${isCompleted 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20 border border-green-500/30' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'}
              `}
            >
              {isCompleted ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Concluída</>
              ) : (
                completing ? "Salvando..." : "Concluir Aula"
              )}
            </Button>
          </div>

          <div className="h-px bg-gray-700/50" />

          {/* Estrelas */}
          <div>
            <h3 className="font-semibold text-white mb-2">O que achou?</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-8 h-8 cursor-pointer transition-all hover:scale-110 ${
                    star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Área de Comentários */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Comentários ({lessonDetails.comments?.length || 0})
          </h3>

          {/* Formulário */}
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Deixe sua dúvida ou comentário..."
              className="flex-grow bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim() || sendingComment}
              className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* Lista de Comentários */}
          <div className="space-y-4">
            {lessonDetails.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="bg-gray-800/50 rounded-2xl rounded-tl-none p-3 px-4">
                  <p className="text-sm text-gray-200">{comment.content}</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            
            {(!lessonDetails.comments || lessonDetails.comments.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">Seja o primeiro a comentar!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Licao;