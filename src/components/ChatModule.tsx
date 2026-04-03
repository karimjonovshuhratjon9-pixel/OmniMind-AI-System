import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ai, MODELS } from '../lib/gemini';
import { cn } from '../lib/utils';

export const ChatModule = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'OmniMind NLU System Online. How can I assist your research today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: userMsg,
        config: {
          systemInstruction: "You are OmniMind, a world-class AI assistant. You provide technically deep, accurate, and helpful responses. Maintain a professional yet accessible tone."
        }
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || "I encountered an error processing that request." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "System Error: Connection to NLU core failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Bot className="w-5 h-5 text-brand-primary" />
        <h2 className="font-semibold tracking-tight">NLU Core</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 cyber-grid">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-brand-secondary" : "bg-brand-primary/20 text-brand-primary"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-brand-secondary/20 text-white" : "bg-white/5 text-slate-300"
              )}>
                <div className="markdown-body prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white/5 text-slate-400 text-sm italic">
              OmniMind is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the system..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
