import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-slow"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 right-6 z-50 w-full max-w-[400px] animate-fade-in shadow-2xl rounded-xl">
      <ChatInterface onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default HealthChatbot;


