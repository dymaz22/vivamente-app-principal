import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../lib/gemini';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const Companheiro = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || !user) return;

    const userText = inputText;
    setInputText('');
    setIsLoading(true);

    await supabase.from('chat_messages').insert({
      user_id: user.id,
      text: userText,
      sender: 'user',
    });

    const updatedMessages = [
      ...messages,
      { id: Date.now(), text: userText, sender: 'user' },
    ];
    setMessages(updatedMessages);

    try {
      const aiText = await sendMessageToGemini(userText, updatedMessages);

      await supabase.from('chat_messages').insert({
        user_id: user.id,
        text: aiText,
        sender: 'ai',
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: aiText, sender: 'ai' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: 'Tive um probleminha agora 😕\n\nQuer tentar de novo?',
          sender: 'ai',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-3">
        <div className="p-2 bg-purple-600/20 rounded-full">
          <Bot className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-lg">Companheiro</h1>
          <p className="text-xs text-gray-400">Sempre aqui para você</p>
          <p className="text-[11px] text-gray-500 mt-1">
            IA: <span className="text-gray-300">OpenAI</span> •{' '}
            <span className="text-gray-300">gpt-4o-mini</span>
          </p>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-2xl border border-gray-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-xs text-gray-400">Digitando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-grow bg-gray-900 border border-gray-700 rounded-full px-4 py-3 text-sm text-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-purple-600 rounded-full disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Companheiro;
