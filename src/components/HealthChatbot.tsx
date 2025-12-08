import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  mythStatus?: 'TRUE' | 'FALSE';
  english?: string;
  hindi?: string;
}

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseResponse = (text: string): { status?: 'TRUE' | 'FALSE'; english?: string; hindi?: string } => {
    
    const cleanText = text.replace(/\*\*/g, '');
    
    
    const statusMatch = cleanText.match(/(?:Status|Verdict):\s*(.*?)(?:\n|$)/i);
    const englishMatch = cleanText.match(/English:\s*([\s\S]*?)(?=\n\s*Hindi:|$)/i);
    const hindiMatch = cleanText.match(/Hindi:\s*([\s\S]*?)$/i);

    const statusText = statusMatch?.[1]?.toLowerCase() || '';
    
    return {
      status: statusText.includes('true') ? 'TRUE' : statusText.includes('false') ? 'FALSE' : undefined,
      english: englishMatch?.[1]?.trim(),
      hindi: hindiMatch?.[1]?.trim(),
    };
  };

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text },
      });

      if (error) throw error;
      if (!data.audioContent) throw new Error("No audio content");

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error('Error with TTS:', error);
      setIsSpeaking(false);
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('health-chat', {
        body: { message: input },
      });

      if (error) throw error;

      const reply = data.reply || data.message || 'Sorry, I could not process that.';
      const parsed = parseResponse(reply);

      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: reply, 
        timestamp: new Date(),
        mythStatus: parsed.status,
        english: parsed.english,
        hindi: parsed.hindi,
      }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 right-6 z-50 w-96 h-[600px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Health Myth Checker</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">Ask me to verify any health myth!</p>
            <p className="text-xs mt-2">I'll respond in English and Hindi</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {/* Only show raw text if we didn't successfully parse the English/Hindi parts */}
{(!msg.english && !msg.hindi) && (
  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
)}
              
              {msg.sender === 'assistant' && (
                <>
                  {msg.mythStatus && (
                    <div className={`mt-2 p-3 rounded-lg text-sm font-semibold ${
                      msg.mythStatus === 'TRUE' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {msg.mythStatus === 'TRUE' ? '✅ Myth is True' : '❌ Myth is False'}
                    </div>
                  )}
                  
                  {(msg.english || msg.hindi) && (
                    <div className="mt-3 space-y-2">
                      {msg.english && (
                        <div className="p-2 bg-primary/5 rounded border-l-2 border-primary">
                          <p className="text-xs font-semibold text-primary mb-1">English:</p>
                          <p className="text-sm">{msg.english}</p>
                        </div>
                      )}
                      {msg.hindi && (
                        <div className="p-2 bg-secondary/5 rounded border-l-2 border-secondary">
                          <p className="text-xs font-semibold text-secondary mb-1">हिंदी:</p>
                          <p className="text-sm">{msg.hindi}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => speakText(msg.text)}
                    disabled={isSpeaking}
                    className="mt-2 text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Volume2 className="h-3 w-3" />
                    {isSpeaking ? 'Speaking...' : 'Read Aloud'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about a health myth..."
            className="flex-1 px-4 py-2 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isTyping || !input.trim()}
            size="icon"
            className="rounded-full shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthChatbot;
