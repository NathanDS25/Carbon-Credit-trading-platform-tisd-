// UI Enhanced v2 — 3D Map + Motion + Glassmorphism
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Send, Search, MoreVertical, MessageSquare, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatTerminal = () => {
  const { user, role } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversations.length > 0 && conversations[activeChat]) {
      fetchMessages(conversations[activeChat].id);
    }
  }, [activeChat, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const response = await api.get(`/chat/${contactId}`);
      setMessages(response.data.data || []);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversations[activeChat]) return;

    try {
      const response = await api.post('/chat', {
        receiverId: conversations[activeChat].id,
        content: newMessage
      });
      setMessages([...messages, response.data.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Safe checks for rendering
  const activeContact = conversations[activeChat] || null;

  return (
    <DashboardLayout role={role || 'COMPANY'}>
      <div className="h-[calc(100vh-160px)] flex gap-6">
        {/* Contacts Sidebar */}
        <div className="w-80 glass rounded-3xl border border-white/5 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.01]">
            <h2 className="text-xl font-black tracking-tighter text-text-primary">Network <span className="text-gradient">Hub</span></h2>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              <input 
                type="text" 
                placeholder="Search encrypted channels..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center animate-pulse text-text-muted text-[10px] uppercase font-black">Syncing Channels...</div>
            ) : conversations.length === 0 ? (
              <p className="p-8 text-center text-xs text-text-secondary">
                {role === 'NGO' ? 'Waiting for business inquiries...' : 'No active connections. Start a deal from the marketplace!'}
              </p>
            ) : conversations.map((contact, i) => (
              <motion.div 
                key={contact.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                onClick={() => setActiveChat(i)}
                className={`p-4 flex items-center gap-4 cursor-pointer border-l-4 transition-all ${activeChat === i ? 'bg-primary/5 border-primary shadow-[inset_4px_0_0_0_#00C896]' : 'border-transparent text-text-secondary hover:text-white'}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-glow-green border border-primary/20">
                  {contact.name?.[0] || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-xs font-black uppercase tracking-widest truncate">{contact.name || 'Anonymous User'}</h4>
                  <p className="text-[10px] text-text-muted truncate mt-0.5">{contact.role || 'Partner'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass rounded-3xl border border-white/5 flex flex-col overflow-hidden relative">
          {/* Decorative background logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <ShieldCheck size={400} />
          </div>

          {activeContact ? (
            <>
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01] relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black shadow-glow-green border border-primary/30">
                    {activeContact.name?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em]">{activeContact.name || 'Secure Channel'}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-green animate-pulse" />
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Active Connection</p>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-xl hover:bg-white/5 text-text-secondary transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-8 space-y-6 custom-scrollbar relative z-10">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <MessageSquare size={48} className="text-primary" />
                    <p className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted Channel Established</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={m.id} 
                    className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                      m.senderId === user?.id 
                        ? 'bg-gradient-to-br from-primary to-info text-background font-bold shadow-glow-green rounded-tr-none' 
                        : 'glass border border-white/10 text-white rounded-tl-none'
                    }`}>
                      {m.content}
                      <div className={`text-[9px] mt-2 opacity-50 font-mono ${m.senderId === user?.id ? 'text-background' : 'text-text-secondary'}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-6 bg-white/[0.01] border-t border-white/5 relative z-10">
                <div className="relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Transmit encrypted data..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:border-primary outline-none transition-all placeholder:text-text-muted"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary text-background shadow-glow-green hover:brightness-110 transition-all"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-30">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <User size={48} className="text-primary" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em]">Select a channel to begin transmission</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatTerminal;
