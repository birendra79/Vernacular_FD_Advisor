import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot({ language, t }) {
  const [messages, setMessages] = useState([
    { text: t?.chatGreeting || "Namaste! Main Vernacular FD Advisor hoon. Aapko Fixed Deposit (FD) ke baare mein kya janna hai?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === "bot") {
      setMessages([{ text: t?.chatGreeting || "Namaste! Main Vernacular FD Advisor hoon. Aapko Fixed Deposit (FD) ke baare mein kya janna hai?", sender: "bot" }]);
    }
  }, [language, t, messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.post(`${backendUrl}/api/chat`, {
        message: input,
        language: language
      });
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, network error. Please try again.", sender: 'bot' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 max-w-2xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto space-y-5 no-scrollbar pb-6 px-1 mt-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Bot size={16} className="text-indigo-600" />
                </div>
              )}
              <div 
                className={`max-w-[80%] rounded-[1.25rem] p-3.5 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
                }`}
              >
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex justify-start items-center"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0">
              <Bot size={16} className="text-indigo-600" />
            </div>
            <div className="bg-white rounded-[1.25rem] rounded-bl-sm p-4 shadow-sm border border-slate-100 flex space-x-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="pt-2 pb-4">
        <div className="flex items-center bg-white rounded-full p-1.5 shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input 
            type="text"
            className="flex-1 outline-none bg-transparent px-4 text-sm text-slate-800 placeholder-slate-400"
            placeholder={t?.chatPlaceholder || "Ask about Fixed Deposits..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
          >
             <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
