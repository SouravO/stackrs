import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Zap, ShieldAlert, Cpu } from 'lucide-react';

const IndustrialChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "UPLINK ESTABLISHED. SYSTEM IS IN PRE-ALPHA PHASE.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Push User Message
    const userMessage = { 
      id: Date.now(), 
      text: input.toUpperCase(), 
      sender: 'user' 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Standardized Response Protocol
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "U CAN USE AI FEATURES SOON. THANK YOU.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* 1. CIRCULAR AI TRIGGER */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#e1ff00] border-4 border-black rounded-full flex items-center justify-center text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        initial={{ x: 100 }}
        animate={{ x: isOpen ? 200 : 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Bot size={32} strokeWidth={2.5} />
        <div className="absolute top-0 right-0 bg-[#ef6925] text-white text-[10px] font-black px-1.5 py-0.5 border-2 border-black rounded-sm">
          LIVE
        </div>
      </motion.button>

      {/* 2. CHAT INTERFACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-0 right-0 md:bottom-8 md:right-8 z-[100] w-full md:w-[400px] h-full md:h-[600px] bg-black border-[6px] border-black flex flex-col shadow-[20px_20px_0px_0px_rgba(239,105,37,1)]"
          >
            {/* HEADER */}
            <div className="bg-[#ef6925] p-4 flex items-center justify-between border-b-4 border-black">
              <div className="flex items-center gap-3">
                <div className="bg-black p-2 border border-[#e1ff00] rounded-full">
                  <Bot className="text-[#e1ff00]" size={20} />
                </div>
                <div>
                  <h3 className="font-black text-black uppercase tracking-tighter leading-none">AI_SUPPORT_UNIT</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#e1ff00] animate-pulse rounded-full" />
                    <p className="text-[10px] font-mono font-bold text-black uppercase">Status: Pending</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-black text-white p-1 hover:bg-[#e1ff00] hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* MESSAGE THEATER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#111] custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`mt-auto p-1 border-2 rounded-full ${msg.sender === 'user' ? 'bg-[#e1ff00] border-black' : 'bg-[#ef6925] border-black'}`}>
                      {msg.sender === 'user' ? <Cpu size={14} /> : <Zap size={14} />}
                    </div>
                    <div className={`p-3 font-mono text-xs font-bold border-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${
                      msg.sender === 'user' 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent text-[#e1ff00] border-[#e1ff00]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[8px] font-mono mt-1 opacity-40 uppercase tracking-widest text-white">
                    {msg.sender} // {new Date().toLocaleTimeString()}
                  </span>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 items-center text-[#e1ff00] font-mono text-[10px]">
                  <ShieldAlert size={14} className="animate-spin" />
                  <span>ACCESSING_SERVER_NODES...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT PROTOCOL */}
            <div className="p-4 bg-black border-t-4 border-[#ef6925]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="ENTER_QUERY_"
                  className="flex-1 bg-[#222] border-2 border-[#444] p-3 text-[#e1ff00] font-mono text-sm outline-none focus:border-[#e1ff00] transition-all uppercase"
                />
                <button
                  onClick={handleSend}
                  className="bg-[#e1ff00] text-black px-4 font-black hover:bg-[#ef6925] hover:text-white transition-all border-2 border-black"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[8px] font-mono text-white/30 mt-2 text-center tracking-tighter">
                MODULE_STATUS: INACTIVE // AI_GATEWAY_LOCKED
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ef6925;
        }
      `}</style>
    </>
  );
};

export default IndustrialChatbot;