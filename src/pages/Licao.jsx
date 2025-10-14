import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Star, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Skeleton } from '../components/ui/skeleton';
import PetalsAnimation from '../components/PetalsAnimation';
import { useLessonDetails, markLessonAsComplete, submitLessonRating, submitLessonComment } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';

const Licao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lessonDetails, loading, error, refetch } = useLessonDetails(parseInt(id), 'pt');
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  React.useEffect(() => {
    if (lessonDetails?.userProgress?.rating) {
      setRating(lessonDetails.userProgress.rating);
    }
  }, [lessonDetails]);

  const handleComplete = async () => {
    if (!user) {
        console.error("Usuário não encontrado. Não é possível completar a lição.");
        return;
    }
    setIsCompleting(true);
    try {
      const result = await markLessonAsComplete(parseInt(id), user.id);
      if (result.success) {
        refetch();
      } else {
        console.error('Erro ao marcar lição como completa:', result.error);
      }
    } catch (error) {
      console.error('Erro ao marcar lição como completa:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleRating = async (newRating) => {
    setIsRating(true);
    try {
      const result = await submitLessonRating(parseInt(id), newRating);
      if (result.success) {
        setRating(newRating);
        refetch();
      } else {
        console.error('Erro ao avaliar lição:', result.error);
      }
    } catch (error) {
      console.error('Erro ao avaliar lição:', error);
    } finally {
      setIsRating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      const result = await submitLessonComment(parseInt(id), newComment);
      if (result.success) {
        setNewComment('');
        refetch();
      } else {
        console.error('Erro ao adicionar comentário:', result.error);
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
        <PetalsAnimation />
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8"><Skeleton className="h-10 w-10 rounded-full bg-card/30" /><div><Skeleton className="h-8 w-64 mb-2 bg-card/30" /><Skeleton className="h-4 w-20 bg-card/30" /></div></div>
          <div className="mb-8"><Skeleton className="aspect-video w-full bg-card/30 rounded-2xl" /></div>
          <div className="mb-8"><Skeleton className="h-32 w-full bg-card/30 rounded-2xl" /></div>
        </div>
      </div>
    );
  }

  if (error) { return ( <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative flex items-center justify-center">...</div> ); }
  if (!lessonDetails) { return ( <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative flex items-center justify-center">...</div> ); }

  const isCompleted = lessonDetails.userProgress?.is_completed || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      <PetalsAnimation />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:text-primary"><ArrowLeft className="w-6 h-6" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{lessonDetails.title_pt}</h1>
            <p className="text-white/60">Lição {lessonDetails.order || id}</p>
          </div>
        </div>

        {lessonDetails.video_url && (
          <div className="mb-8">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <div className="aspect-video bg-black rounded-xl mb-4 flex items-center justify-center">
                <iframe src={lessonDetails.video_url.replace('watch?v=', 'embed/')} title={lessonDetails.title_pt} className="w-full h-full rounded-xl" allowFullScreen />
              </div>
            </div>
          </div>
        )}

        {lessonDetails.content_pt && (
          <div className="mb-8">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Conteúdo da Lição</h2>
              <div className="text-white/80 leading-relaxed whitespace-pre-wrap">{lessonDetails.content_pt}</div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{isCompleted ? 'Lição Concluída!' : 'Marcar como Concluída'}</h3>
                <p className="text-white/60">{isCompleted ? 'Parabéns! Você completou esta lição.' : 'Clique para marcar esta lição como concluída.'}</p>
              </div>
              <Button onClick={handleComplete} disabled={isCompleted || isCompleting} className={isCompleted ? 'bg-green-600' : ''}>
                {isCompleting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Marcando...</>) : 
                 isCompleted ? (<><CheckCircle className="w-4 h-4 mr-2" />Concluída</>) : ('Marcar como Concluída')}
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Avalie esta Lição</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => handleRating(star)} disabled={isRating} className="transition-colors disabled:opacity-50"><Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} /></button>))}
              {rating > 0 && (<span className="text-white/70 ml-2">{rating} de 5 estrelas</span>)}
              {isRating && (<Loader2 className="w-4 h-4 ml-2 animate-spin text-primary" />)}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><MessageCircle className="w-5 h-5" />Comentários ({lessonDetails.comments?.length || 0})</h3>
            <div className="mb-6">
              <Textarea placeholder="Adicione seu comentário sobre esta lição..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="mb-3" disabled={isCommenting} />
              <Button onClick={handleAddComment} disabled={!newComment.trim() || isCommenting}>
                {isCommenting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>) : (<><Send className="w-4 h-4 mr-2" />Enviar Comentário</>)}
              </Button>
            </div>
            <div className="space-y-4">
              {lessonDetails.comments && lessonDetails.comments.length > 0 ? (
                lessonDetails.comments.map((comment) => (<div key={comment.id} className="border-b border-border/30 pb-4 last:border-b-0">...</div>))
              ) : (<p className="text-white/60 text-center py-4">Nenhum comentário ainda. Seja o primeiro a comentar!</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Licao;