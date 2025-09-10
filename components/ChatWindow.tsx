import React, { useState, useRef, useEffect } from 'react';
import type { Message, User } from '../types';
import MessageBubble from './Message';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  user: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  error: string | null;
  connectionStatus: 'disconnected' | 'connecting' | 'subscribed' | 'error';
  logs: string[];
  onTypingChange: (isTyping: boolean) => void;
  typingUsers: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, messages, onSendMessage, error, connectionStatus, logs, onTypingChange, typingUsers }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const isSubscribed = connectionStatus === 'subscribed';
  const typingTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);
  
  useEffect(() => {
    if (logsContainerRef.current) {
        logsContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  useEffect(() => {
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }

    if (inputText.trim()) {
        onTypingChange(true); // Backend'e yazdığımızı bildir
        typingTimeoutRef.current = window.setTimeout(() => {
            onTypingChange(false); // 2 saniye hareketsizlikten sonra yazmayı bıraktığımızı bildir
        }, 2000);
    } else {
        onTypingChange(false); // Giriş temizlenirse hemen durduğumuzu bildir
    }

    return () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [inputText, onTypingChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && isSubscribed) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const getPlaceholderText = () => {
    switch (connectionStatus) {
      case 'subscribed':
        return "Bir mesaj yazın...";
      case 'connecting':
        return "Sohbete bağlanılıyor...";
      case 'error':
        return "Bağlantı hatası! Sayfayı yenileyin.";
      case 'disconnected':
        return "Bağlantı kesildi.";
      default:
        return "Bekleniyor...";
    }
  };

  return (
    <div className="flex flex-col h-full md:h-[95vh] w-full max-w-3xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Genel Sohbet</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cihazlar arası gerçek zamanlı sohbet</p>
          </div>
        </header>

        {/* DEBUG LOG PANEL */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 px-1">Olay Günlüğü (Debug)</h3>
            <div ref={logsContainerRef} className="h-24 overflow-y-auto bg-black text-green-400 font-mono text-xs p-2 rounded">
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
        </div>
        
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUser={user} />
          ))}
          <TypingIndicator typingUsers={typingUsers} />
          <div ref={messagesEndRef} />
        </main>
        
        {error && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <p className="text-sm text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-2 rounded-md">{error}</p>
          </div>
        )}

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getPlaceholderText()}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              aria-label="Mesaj girişi"
              disabled={!isSubscribed}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || !isSubscribed}
              className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Mesaj gönder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatWindow;