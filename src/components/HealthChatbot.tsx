import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  mythStatus?: 'TRUE' | 'FALSE';
}

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseResponse = (text: string): { status: 'TRUE' | 'FALSE' | null; formatted: string } => {
    const statusMatch = text.match(/Status:\s*(TRUE|FALSE)/i);
    const status = statusMatch ? (statusMatch[1].toUpperCase() as 'TRUE' | 'FALSE') : null;
    return { status, formatted: text };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('health-chat', {
        body: { message: inputValue },
      });

      if (error) throw error;

      const { status, formatted } = parseResponse(data.reply);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: formatted,
        sender: 'assistant',
        timestamp: new Date(),
        mythStatus: status || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button with Pulsing Glow */}
      <div className="fixed bottom-24 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light shadow-elegant hover:shadow-glow hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse"
            style={{
              boxShadow: '0 0 30px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.4)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
            aria-label="Open health myth checker"
          >
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </button>
        )}
      </div>

      {/* Chat Window with Entrance Animation */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-scale-in">
          <div 
            className="bg-background border-2 border-primary/20 rounded-2xl overflow-hidden flex flex-col h-[600px] max-h-[calc(100vh-3rem)]"
            style={{
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 30px hsl(var(--primary) / 0.3)'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-lg">Health Myth Checker</h3>
                  <p className="text-sm opacity-90">💬 Bust Your Health Myths Now!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-12 animate-fade-in">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-base font-medium">Ask me about any health myth!</p>
                  <p className="text-sm mt-2">मुझसे कोई भी स्वास्थ्य मिथक पूछें!</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-500 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm shadow-soft'
                        : message.mythStatus === 'TRUE'
                        ? 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 dark:from-green-950 dark:via-green-900 dark:to-emerald-950 text-foreground shadow-lg border-2 border-green-400 dark:border-green-600 rounded-bl-sm'
                        : message.mythStatus === 'FALSE'
                        ? 'bg-gradient-to-br from-red-100 via-red-50 to-rose-100 dark:from-red-950 dark:via-red-900 dark:to-rose-950 text-foreground shadow-lg border-2 border-red-400 dark:border-red-600 rounded-bl-sm'
                        : 'bg-background border-2 border-primary/20 rounded-bl-sm'
                    }`}
                  >
                    {message.sender === 'assistant' && message.mythStatus && (
                      <div className="mb-3 pb-3 border-b-2 border-current/20">
                        <h4 className={`font-bold text-xl flex items-center gap-2 ${
                          message.mythStatus === 'TRUE' 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {message.mythStatus === 'TRUE' ? '✅ Myth is True' : '❌ Myth is False'}
                        </h4>
                      </div>
                    )}
                    <div className="text-sm space-y-3">
                      {message.text.split('\n').map((line, i) => {
                        if (line.startsWith('Status:')) return null;
                        if (line.startsWith('English:')) {
                          return (
                            <div key={i}>
                              <p className="font-semibold text-xs text-muted-foreground mb-1">English:</p>
                              <p className="font-medium leading-relaxed">{line.replace('English:', '').trim()}</p>
                            </div>
                          );
                        }
                        if (line.startsWith('Hindi:')) {
                          return (
                            <div key={i}>
                              <p className="font-semibold text-xs text-muted-foreground mb-1">हिंदी:</p>
                              <p className="leading-relaxed opacity-90">{line.replace('Hindi:', '').trim()}</p>
                            </div>
                          );
                        }
                        return line.trim() && <p key={i} className="leading-relaxed">{line}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-background border-2 border-primary/20 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-background border-t-2 border-primary/20">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a health myth to verify..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground transition-all"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary hover:bg-primary-light rounded-xl px-6"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Ask in English or Hindi • English या Hindi में पूछें
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HealthChatbot;
