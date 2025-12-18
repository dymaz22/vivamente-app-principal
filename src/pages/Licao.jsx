import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, CheckCircle, Star, MessageSquare, Send } from 'lucide-react';

export default function Licao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setLesson(data);
    } catch (error) {
      console.error('Erro ao buscar lição:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO INTELIGENTE DE VÍDEO ---
  const getVideoSource = (url) => {
    if (!url) return '';

    // 1. Se for VIMEO (Já vem pronto do banco como player.vimeo.com)
    if (url.includes('vimeo')) {
      return url; 
    }

    // 2. Se for YOUTUBE (Precisa converter para embed)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be')) {
        videoId = url.split('/').pop();
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // 3. Retorno padrão (caso seja um arquivo mp4 direto ou outro)
    return url;
  };

  const handleFinish = async () => {
    // Lógica de concluir aula (pode ser expandida depois)
    navigate(-1); // Volta para a lista
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      
      {/* Header */}
      <div className="p-4 flex items-center gap-4 bg-[#1a1a2e] border-b border-white/5">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="text-gray-400 hover:text-white" />
        </button>
        <h1 className="font-bold text-lg truncate">{lesson.title_pt}</h1>
      </div>

      {/* Player de Vídeo */}
      <div className="w-full aspect-video bg-black relative">
        {lesson.video_url ? (
          <iframe 
            src={getVideoSource(lesson.video_url)}
            title={lesson.title_pt}
            className="absolute inset-0 w-full h-full"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Vídeo indisponível
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-6 pb-20">
        <div>
          <h2 className="text-xl font-bold mb-2">Sobre a aula</h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            {lesson.content_pt || "Sem descrição disponível."}
          </p>
        </div>

        {/* Card de Progresso */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">Progresso</h3>
            <p className="text-xs text-gray-400">Marque ao terminar</p>
          </div>
          <button 
            onClick={handleFinish}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            Concluir Aula
          </button>
        </div>

        {/* Avaliação */}
        <div>
          <h3 className="font-bold mb-3">O que achou?</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)}>
                <Star 
                  className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comentários (Mock Visual) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">Comentários (0)</h3>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Deixe sua dúvida ou comentário..." 
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="p-3 bg-purple-600 rounded-xl text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-6 text-center text-gray-500 text-sm">
            Seja o primeiro a comentar!
          </div>
        </div>
      </div>
    </div>
  );
}