import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, X, Sparkles, User, Bot, Loader2 } from 'lucide-react';

export default function AICopilot({ isOpen, onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am Xeno AI. What would you like to achieve today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/copilot/chat', { messages: newMessages });
      const { content, action } = response.data;
      setMessages(prev => [...prev, { role: 'assistant', content, action }]);
    } catch (err) {
      console.error('Copilot Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col transform transition-transform duration-300">
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-blue-200" />
          <h2 className="font-semibold text-lg">Xeno AI Copilot</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-gray-200' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} className="text-gray-600" /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              {msg.action && (
                <button 
                  onClick={() => {
                    onNavigate(msg.action.route);
                    onClose();
                  }}
                  className="mt-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium w-full hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  {msg.action.label}
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-4 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Xeno to build an audience, launch a campaign..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button onClick={() => setInput("Find inactive customers")} className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full text-xs font-medium border border-blue-100 transition-colors">Find inactive</button>
          <button onClick={() => setInput("Launch VIP campaign")} className="whitespace-nowrap px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full text-xs font-medium border border-purple-100 transition-colors">VIP Campaign</button>
        </div>
      </div>
    </div>
  );
}
