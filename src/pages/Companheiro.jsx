import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const Companheiro = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!data || data.length === 0) {
        setMessages([
          {
            id: 'intro',
            text: 'Oi 🙂\n\nTô aqui com você.\n\nComo você tá se sentindo hoje?',
            sender: 'ai',
          },
        ]);
      } else {
        setMessages(data);
      }
    };

    loadInitialData();
  }, [user]);

  useEffect(scrollToBottom, [messages, isLoading, errorMsg]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || !user) return;

    const userText = inputText;
    setInputText('');
    setIsLoading(true);
    setErrorMsg(null);

    // 1. Salva msg do usuário e atualiza UI
    const tempId = Date.now();
    const updatedMessages = [
      ...messages,
      { id: tempId, text: userText, sender: 'user' },
    ];
    setMessages(updatedMessages);

    try {
      // Salva no Supabase (backup)
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        text: userText,
        sender: 'user',
      });

      // 2. Chama nossa Function (Backend)
      const response = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: userText,
          history: updatedMessages.slice(-6) // Envia contexto curto
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na comunicação com a IA');
      }

      const aiText = data.text;

      // 3. Salva resposta da IA e atualiza UI
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        text: aiText,
        sender: 'ai',
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: aiText, sender: 'ai' },
      ]);

    } catch (err) {
      console.error('Erro no Chat:', err);
      setErrorMsg('A IA está descansando um pouco. Tente novamente em alguns segundos.');
      
      // Opcional: Remover mensagem do usuário se falhou? 
      // Não, melhor deixar para ele copiar e tentar de novo.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-3 shadow-sm">
        <div className="p-2 bg-purple-600/20 rounded-full">
          <Bot className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-lg">Companheiro</h1>
          <p className="text-xs text-gray-400">Inteligência Vivamente</p>
        </div>
      </header>

      {/* Área de Chat */}
      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-xs text-gray-400">Pensando...</span>
            </div>
          </div>
        )}

        {/* Mensagem de Erro (Discreta) */}
        {errorMsg && (
          <div className="flex justify-center my-2">
            <div className="bg-red-900/50 border border-red-800 text-red-200 text-xs px-4 py-2 rounded-full flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              {errorMsg}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Converse comigo..."
            className="flex-grow bg-gray-900 border border-gray-700 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-purple-600 rounded-full text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-900/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Companheiro;