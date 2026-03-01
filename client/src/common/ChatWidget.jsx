import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Geist+Mono:wght@300;400&family=Instrument+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #f5f0e8;
    --cream-dark: #ede7d9;
    --espresso: #1a1208;
    --espresso-mid: #2e2418;
    --warm-gray: #8a7f72;
    --warm-gray-light: #b8b0a4;
    --gold: #c9a96e;
    --gold-light: #e8d5b0;
    --white: #fefcf8;
    --border: rgba(26,18,8,0.08);
    --border-strong: rgba(26,18,8,0.14);
  }

  .cw-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .cw-root {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    font-family: 'Instrument Sans', sans-serif;
  }

  /* ── Trigger ── */
  .cw-trigger {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: none;
    background: var(--espresso);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    box-shadow: 0 2px 12px rgba(26,18,8,0.22), 0 8px 32px rgba(26,18,8,0.14);
    position: relative;
  }
  .cw-trigger::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 1px solid var(--gold);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: scale(0.9);
  }
  .cw-trigger:hover { transform: scale(1.06); }
  .cw-trigger:hover::before { opacity: 1; transform: scale(1); }
  .cw-trigger-icon {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .cw-trigger.open .cw-trigger-icon { transform: rotate(135deg); }

  .cw-notif {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background: var(--gold);
    border-radius: 50%;
    border: 2px solid var(--white);
    animation: notifPulse 2.5s ease infinite;
  }
  @keyframes notifPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.25); opacity: 0.6; }
  }

  /* ── Panel ── */
  .cw-panel {
    position: absolute;
    bottom: 70px;
    right: 0;
    width: 348px;
    height: 540px;
    background: var(--white);
    border-radius: 18px;
    box-shadow:
      0 0 0 1px var(--border),
      0 8px 24px rgba(26,18,8,0.06),
      0 32px 80px rgba(26,18,8,0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: bottom right;
    animation: panelIn 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
  }
  @keyframes panelIn {
    from { opacity: 0; transform: scale(0.9) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* ── Header ── */
  .cw-header {
    padding: 18px 20px 15px;
    background: var(--espresso);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  .cw-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.5;
  }
  .cw-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cw-brand {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  .cw-avatar {
    width: 36px;
    height: 36px;
    background: rgba(201,169,110,0.12);
    border: 1px solid rgba(201,169,110,0.28);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: var(--gold-light);
    font-weight: 300;
  }
  .cw-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 300;
    color: var(--cream);
    letter-spacing: 0.04em;
    line-height: 1.1;
  }
  .cw-brand-name em {
    font-style: italic;
    color: var(--gold-light);
  }
  .cw-status {
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    color: var(--warm-gray-light);
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 4px;
    text-transform: uppercase;
  }
  .cw-dot {
    width: 5px;
    height: 5px;
    background: #4ade80;
    border-radius: 50%;
    animation: blink 2s ease infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  .cw-close {
    width: 30px;
    height: 30px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--warm-gray-light);
    transition: all 0.2s ease;
  }
  .cw-close:hover {
    background: rgba(255,255,255,0.12);
    color: var(--cream);
    border-color: rgba(255,255,255,0.2);
  }

  /* ── Messages ── */
  .cw-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    scroll-behavior: smooth;
    background: var(--white);
  }
  .cw-messages::-webkit-scrollbar { width: 3px; }
  .cw-messages::-webkit-scrollbar-track { background: transparent; }
  .cw-messages::-webkit-scrollbar-thumb { background: var(--cream-dark); border-radius: 99px; }

  .cw-msg {
    max-width: 80%;
    animation: msgIn 0.28s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
    opacity: 0;
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .cw-msg.user { align-self: flex-end; }
  .cw-msg.assistant { align-self: flex-start; }

  .cw-bubble {
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 13.5px;
    line-height: 1.6;
    font-weight: 300;
    letter-spacing: 0.01em;
  }
  .cw-msg.user .cw-bubble {
    background: var(--espresso);
    color: var(--cream);
    border-bottom-right-radius: 3px;
    font-weight: 400;
  }
  .cw-msg.assistant .cw-bubble {
    background: var(--cream);
    color: var(--espresso);
    border-bottom-left-radius: 3px;
    border: 1px solid var(--border);
  }
  .cw-msg-time {
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    color: var(--warm-gray-light);
    margin-top: 3px;
    letter-spacing: 0.05em;
    padding: 0 3px;
  }
  .cw-msg.user .cw-msg-time { text-align: right; }

  /* ── Typing ── */
  .cw-typing {
    align-self: flex-start;
    padding: 12px 16px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 14px;
    border-bottom-left-radius: 3px;
    display: flex;
    gap: 5px;
    align-items: center;
    animation: msgIn 0.28s ease forwards;
  }
  .cw-typing span {
    width: 4px;
    height: 4px;
    background: var(--warm-gray);
    border-radius: 50%;
    animation: typingBounce 1.4s ease infinite;
  }
  .cw-typing span:nth-child(2) { animation-delay: 0.16s; }
  .cw-typing span:nth-child(3) { animation-delay: 0.32s; }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  /* ── Empty state ── */
  .cw-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 28px 20px;
    text-align: center;
  }
  .cw-empty-glyph {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    color: var(--gold);
    line-height: 1;
    margin-bottom: 4px;
    opacity: 0.75;
  }
  .cw-empty h4 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px;
    font-weight: 300;
    font-style: italic;
    color: var(--espresso);
    letter-spacing: 0.01em;
  }
  .cw-empty p {
    font-size: 12px;
    color: var(--warm-gray);
    font-weight: 300;
    max-width: 215px;
    line-height: 1.65;
    margin-top: 2px;
  }
  .cw-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin: 12px 0 8px;
  }
  .cw-divider::before, .cw-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .cw-divider span {
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    color: var(--warm-gray-light);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .cw-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  }
  .cw-suggestion {
    padding: 6px 13px;
    background: var(--white);
    border: 1px solid var(--border-strong);
    border-radius: 99px;
    font-size: 11.5px;
    color: var(--espresso-mid);
    cursor: pointer;
    transition: all 0.22s ease;
    font-family: 'Instrument Sans', sans-serif;
    font-weight: 300;
    letter-spacing: 0.01em;
  }
  .cw-suggestion:hover {
    background: var(--espresso);
    color: var(--cream);
    border-color: var(--espresso);
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(26,18,8,0.12);
  }

  /* ── Input ── */
  .cw-input-area {
    padding: 10px 14px 12px;
    background: var(--white);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: flex-end;
    gap: 9px;
  }
  .cw-input {
    flex: 1;
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
    font-family: 'Instrument Sans', sans-serif;
    font-weight: 300;
    color: var(--espresso);
    background: var(--cream);
    resize: none;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
    line-height: 1.5;
    max-height: 100px;
    overflow-y: auto;
  }
  .cw-input::placeholder { color: var(--warm-gray-light); }
  .cw-input:focus { border-color: var(--gold); background: var(--white); }
  .cw-input::-webkit-scrollbar { width: 0; }

  .cw-send {
    width: 38px;
    height: 38px;
    min-width: 38px;
    border: none;
    background: var(--espresso);
    color: var(--cream);
    border-radius: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }
  .cw-send::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,169,110,0.3) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .cw-send:hover:not(:disabled)::after { opacity: 1; }
  .cw-send:hover:not(:disabled) {
    transform: scale(1.07) translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,18,8,0.2);
  }
  .cw-send:disabled { opacity: 0.28; cursor: not-allowed; }
  .cw-send svg { position: relative; z-index: 1; }

  /* ── Footer ── */
  .cw-footer {
    padding: 7px 14px 9px;
    background: var(--white);
    text-align: center;
    border-top: 1px solid var(--border);
  }
  .cw-footer span {
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    color: var(--warm-gray-light);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ── Mobile ── */
  .cw-handle { display: none; }

  @media (max-width: 480px) {
    .cw-root { bottom: 0; right: 0; }
    .cw-trigger { position: fixed; bottom: 18px; right: 18px; width: 44px; height: 44px; }
    .cw-trigger .cw-trigger-icon svg { transform: scale(0.85); }
    .cw-panel {
      position: fixed;
      bottom: 0; right: 0; left: 0;
      width: 100%;
      height: 92dvh;
      border-radius: 22px 22px 0 0;
      transform-origin: bottom center;
      animation: panelInMobile 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
    }
    @keyframes panelInMobile {
      from { opacity: 0; transform: translateY(60px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cw-handle {
      display: flex;
      justify-content: center;
      padding: 10px 0 0;
      background: var(--white);
    }
    .cw-handle-bar {
      width: 32px;
      height: 3px;
      background: var(--border-strong);
      border-radius: 99px;
    }
    .cw-input-area { padding: 10px 14px 24px; }
  }
`;

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
      const { data } = await axios.post('/api/chat', {
        messages: updated.map(({ role, content }) => ({ role, content })),
        cartItems: JSON.parse(localStorage.getItem('cart') || '[]'),
      });
      setMessages([...updated, { role: 'assistant', content: data.reply, time: getTime() }]);
    } catch {
      setMessages([...updated, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        time: getTime()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cw-root">
      <style>{styles}</style>

      {open && (
        <div className="cw-panel">
          <div className="cw-handle"><div className="cw-handle-bar" /></div>

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-row">
              <div className="cw-brand">
                <div className="cw-avatar">✦</div>
                <div>
                  <div className="cw-brand-name">Shopping <em>Assistant</em></div>
                  <div className="cw-status"><span className="cw-dot" />Online</div>
                </div>
              </div>
              <button className="cw-close" onClick={() => setOpen(false)} aria-label="Close chat">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cw-messages">
            {messages.length === 0 ? (
              <div className="cw-empty">
                <div className="cw-empty-glyph">✦</div>
                <h4>How may I assist you?</h4>
                <p>Ask about products, your order, sizing, or anything else.</p>
                <div className="cw-divider"><span>Quick questions</span></div>
                <div className="cw-suggestions">
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="cw-suggestion" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div key={i} className={`cw-msg ${m.role}`}>
                    <div className="cw-bubble">{m.content}</div>
                    {m.time && <div className="cw-msg-time">{m.time}</div>}
                  </div>
                ))}
                {loading && (
                  <div className="cw-typing"><span /><span /><span /></div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="cw-input-area">
            <textarea
              ref={textareaRef}
              className="cw-input"
              value={input}
              onChange={handleInput}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask me anything…"
              rows={1}
            />
            <button className="cw-send" onClick={() => sendMessage()} disabled={!input.trim() || loading} aria-label="Send message">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 11.5V2.5M2.5 7L7 2.5 11.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="cw-footer">
            <span>Powered by Claude AI</span>
          </div>
        </div>
      )}

      {/* Trigger */}
      <button
        className={`cw-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle chat"
      >
        {showNotif && !open && <span className="cw-notif" />}
        <span className="cw-trigger-icon">
          {open ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#f5f0e8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h9M3 14h6" stroke="#f5f0e8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}