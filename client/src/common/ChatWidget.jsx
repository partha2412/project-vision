import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../api/chatApi';
import { MessageCircle, X, Trash2, Send } from 'lucide-react';

const SUGGESTIONS = ['Track my order', 'New arrivals?', 'Return policy', 'Size guide'];

function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNotif, setShowNotif] = useState(true);

    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (open) setShowNotif(false);
    }, [open]);

    const handleInput = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
    };

    const sendMessage = async (text) => {
        const content = text || input.trim();
        if (!content || loading) return;

        const userMsg = { role: 'user', content, time: getTime() };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setLoading(true);

        try {
            const data = await sendChatMessage(
                updated.map(({ role, content }) => ({ role, content })), // 👈 full history for context
                JSON.parse(localStorage.getItem('cart') || '[]')
            );
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message,
                time: getTime()
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Something went wrong. Please try again.',
                time: getTime()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => setMessages([]);

    return (
        <>
            {/* ── PANEL ── */}
            {open && (
                <div className="fixed bottom-24 right-6 w-[340px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden
                        sm:w-[340px] max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:h-[92dvh] max-sm:rounded-t-2xl max-sm:rounded-b-none"
                    style={{ animation: 'panelIn 0.32s cubic-bezier(0.34,1.4,0.64,1) forwards' }}>

                    {/* Header */}
                    <div className="bg-gray-900 px-4 py-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                                V
                            </button>
                            <div>
                                <p className="text-white text-sm font-medium">Vision Assistant</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-gray-400 text-[10px] tracking-wide uppercase">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={clearChat}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                                    V
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">How can I help you?</p>
                                    <p className="text-gray-400 text-xs mt-1">Ask about products, orders, sizing, or returns.</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center mt-2">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => sendMessage(s)}
                                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                                ? 'bg-gray-900 text-white rounded-br-sm'
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                                            }`}>
                                            {m.content}
                                        </div>
                                        {m.time && (
                                            <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
                                        )}
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {loading && (
                                    <div className="flex items-start">
                                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-end gap-2 shrink-0">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                            }}
                            placeholder="Ask me anything..."
                            rows={1}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition max-h-[100px] overflow-y-auto"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || loading}
                            className="w-9 h-9 min-w-[36px] bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="py-1.5 bg-white text-center border-t border-gray-50 shrink-0">
                        <span className="text-[10px] text-gray-300 tracking-widest uppercase">Powered by Claude AI</span>
                    </div>
                </div>
            )}

            {/* ── TRIGGER ── */}
            <button
                onClick={() => setOpen(o => !o)}
                className={`fixed bottom-6 right-6 w-13 h-13 w-[52px] h-[52px] rounded-full bg-gray-900 text-white shadow-lg flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 hover:shadow-xl ${open ? 'max-sm:hidden' : ''}`}
            >
                {/* Notification dot */}
                {showNotif && !open && (
                    <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white" />
                )}
                <div style={{ transition: 'transform 0.3s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                </div>
            </button>

            {/* Animation keyframes */}
            <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 480px) {
          @keyframes panelIn {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
        </>
    );
}