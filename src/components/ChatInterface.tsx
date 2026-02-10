import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Phone, CheckCircle2, AlertTriangle, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

// Hardcoded client for Chatbot only (as per specific user request)
const CHAT_SUPABASE_URL = "https://ymcejzgkvlxepjaihqzs.supabase.co";
const CHAT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY2Vqemdrdmx4ZXBqYWlocXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTEwNDUsImV4cCI6MjA3NzU2NzA0NX0.hn6zvDSSvg0Nn5vCyzia-bEOwChxrY88V53dCm5Jek4";
const chatSupabase = createClient(CHAT_SUPABASE_URL, CHAT_SUPABASE_KEY);

interface Message {
    id: string;
    textEn: string;
    textHi?: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatInterfaceProps {
    onClose?: () => void;
}

export const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            textEn: "Namaste! I am Sehat Saathi. Tell me your health problem.",
            textHi: "नमस्ते! मैं सेहत साथी हूँ। मुझे अपनी स्वास्थ्य समस्या बताएं।",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

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

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            textEn: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const { data, error } = await chatSupabase.functions.invoke('health-chat', {
                body: { message: userMsg.textEn }
            });

            if (error) throw error;

            const aiText = data.reply;
            const parsed = parseResponse(aiText);

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                textEn: parsed.english || aiText, // Fallback to full text if parse fails
                textHi: parsed.hindi,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                textEn: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Check console for details.`,
                textHi: "त्रुटि: कृपया कंसोल जांचें।",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-[#e5ddd5] rounded-xl overflow-hidden shadow-2xl relative border border-gray-200">
            {/* WhatsApp Header */}
            <div className="bg-[#008069] p-3 text-white flex items-center gap-3 shadow-sm z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-lg leading-none">Sehat Saathi Bot</h3>
                        <CheckCircle2 className="w-4 h-4 text-blue-200 fill-blue-500" />
                    </div>
                    <p className="text-xs text-white/80">Running on Gemini 1.5 Flash</p>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full mb-2",
                            msg.sender === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[80%] rounded-lg p-3 relative shadow-sm text-sm",
                                msg.sender === 'user'
                                    ? "bg-[#d9fdd3] rounded-tr-none text-gray-800"
                                    : "bg-white rounded-tl-none text-gray-800"
                            )}
                        >
                            <p className="text-[15px] leading-relaxed">{msg.textEn}</p>
                            {msg.textHi && (
                                <p className="text-[15px] leading-relaxed mt-2 pt-2 border-t border-black/10 text-gray-900 font-medium">
                                    {msg.textHi}
                                </p>
                            )}

                            <span className="text-[10px] text-gray-500 float-right mt-1 ml-2">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start w-full">
                        <div className="bg-white rounded-lg p-3 rounded-tl-none shadow-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-100">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message / संदेश लिखें"
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder:text-gray-500 text-sm"
                    />
                </div>
                <Button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    size="icon"
                    className="bg-[#008069] hover:bg-[#006d59] rounded-full h-10 w-10 shrink-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5 text-white ml-0.5" />
                </Button>
            </div>
        </div>
    );
};
