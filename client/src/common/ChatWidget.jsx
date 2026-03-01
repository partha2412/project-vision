import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital@0;1&display=swap');

  .cw-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .cw-root {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    font-family: 'DM Sans', sans-serif;
  }

  /* Trigger Button */
  .cw-trigger {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: #0f0f0f;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  }
  .cw-trigger:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  }
  .cw-trigger svg { transition: transform 0.3s ease; }
  .cw-trigger.open svg { transform: rotate(45deg); }

  /* Panel */
  .cw-panel {
    position: absolute;
    bottom: 68px;
    right: 0;
    width: 340px;
    height: 520px;
    background: #fafaf9;
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: bottom right;
    animation: panelIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes panelIn {
    from { opacity: 0; transform: scale(0.88) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .cw-root {
      bottom: 0;
      right: 0;
    }
    .cw-trigger {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }
    .cw-panel {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: 92dvh;
      border-radius: 24px 24px 0 0;
      transform-origin: bottom center;
      animation: panelInMobile 0.38s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
    }
    @keyframes panelInMobile {
      from { opacity: 0; transform: translateY(60px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cw-header {
      padding: 16px 18px 14px;
    }
    .cw-input-area {
      padding: 10px 14px 20px;
    }
  }

  /* Mobile drag handle */
  .cw-handle { display: none; }
  @media (max-width: 480px) {
    .cw-handle {
      display: flex;
      justify-content: center;
      padding: 10px 0 2px;
      background: #fafaf9;
    }
    .cw-handle-bar {
      width: 36px;
      height: 4px;
      background: rgba(0,0,0,0.12);
      border-radius: 99px;
    }
  }

  /* Backdrop */
  .cw-backdrop { display: none; }
  @media (max-width: 480px) {
    .cw-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.28);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 9998;
      animation: fadeIn 0.25s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  }

  /* Header */
  .cw-header {
    padding: 20px 22px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    background: #fff;
  }
  .cw-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cw-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cw-avatar {
    width: 34px;
    height: 34px;
    background: #0f0f0f;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }
  .cw-brand-text h3 {
    font-size: 13px;
    font-weight: 500;
    color: #0f0f0f;
    letter-spacing: -0.01em;
  }
  .cw-brand-text span {
    font-size: 11px;
    color: #999;
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .cw-dot {
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .cw-close {
    width: 28px;
    height: 28px;
    border: none;
    background: #f3f3f2;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    color: #666;
  }
  .cw-close:hover { background: #e8e8e7; color: #0f0f0f; }

  /* Messages */
  .cw-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-behavior: smooth;
  }
  .cw-messages::-webkit-scrollbar { width: 0; }

  .cw-msg {
    max-width: 82%;
    animation: msgIn 0.25s ease forwards;
    opacity: 0;
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cw-msg.user { align-self: flex-end; }
  .cw-msg.assistant { align-self: flex-start; }

  .cw-bubble {
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 13.5px;
    line-height: 1.55;
    font-weight: 400;
  }
  .cw-msg.user .cw-bubble {
    background: #0f0f0f;
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .cw-msg.assistant .cw-bubble {
    background: #fff;
    color: #1a1a1a;
    border-bottom-left-radius: 4px;
    border: 1px solid rgba(0,0,0,0.07);
  }

  /* Typing */
  .cw-typing {
    align-self: flex-start;
    padding: 10px 16px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px;
    border-bottom-left-radius: 4px;
    display: flex;
    gap: 4px;
    align-items: center;
    animation: msgIn 0.25s ease forwards;
  }
  .cw-typing span {
    width: 5px;
    height: 5px;
    background: #bbb;
    border-radius: 50%;
    animation: bounce 1.2s ease infinite;
  }
  .cw-typing span:nth-child(2) { animation-delay: 0.15s; }
  .cw-typing span:nth-child(3) { animation-delay: 0.30s; }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-4px); }
  }

  /* Empty state */
  .cw-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    text-align: center;
  }
  .cw-empty-icon {
    font-size: 28px;
    margin-bottom: 4px;
  }
  .cw-empty h4 {
    font-size: 14px;
    font-weight: 500;
    color: #0f0f0f;
    font-family: 'Playfair Display', serif;
    font-style: italic;
  }
  .cw-empty p {
    font-size: 12px;
    color: #aaa;
    font-weight: 300;
    max-width: 200px;
  }
  .cw-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    margin-top: 8px;
  }
  .cw-suggestion {
    padding: 6px 12px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px;
    font-size: 11.5px;
    color: #555;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .cw-suggestion:hover {
    background: #0f0f0f;
    color: #fff;
    border-color: #0f0f0f;
  }

  /* Input */
  .cw-input-area {
    padding: 12px 14px;
    background: #fff;
    border-top: 1px solid rgba(0,0,0,0.06);
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }
  .cw-input {
    flex: 1;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #0f0f0f;
    background: #fafaf9;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    line-height: 1.5;
    max-height: 100px;
    overflow-y: auto;
  }
  .cw-input::placeholder { color: #bbb; }
  .cw-input:focus { border-color: rgba(0,0,0,0.25); }

  .cw-send {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border: none;
    background: #0f0f0f;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    margin-bottom: 1px;
  }
  .cw-send:hover:not(:disabled) { transform: scale(1.08); background: #333; }
  .cw-send:disabled { opacity: 0.35; cursor: not-allowed; }

  /* Footer */
  .cw-footer {
    padding: 8px 14px 10px;
    background: #fff;
    text-align: center;
  }
  .cw-footer span {
    font-size: 10.5px;
    color: #ccc;
    font-weight: 300;
    letter-spacing: 0.02em;
  }
`;

const SUGGESTIONS = ['Track my order', 'Best sellers?', 'Return policy', 'Size guide'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const { data } = await axios.post('/api/chat', {
        messages: updated,
        cartItems: JSON.parse(localStorage.getItem('cart') || '[]'),
      });
      setMessages([...updated, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cw-root">
      <style>{styles}</style>

      {open && <div className="cw-backdrop" onClick={() => setOpen(false)} />}

      {open && (
        <div className="cw-panel">
          {/* Mobile drag handle */}
          <div className="cw-handle"><div className="cw-handle-bar" /></div>

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-top">
              <div className="cw-brand">
                <div className="cw-avatar">🛍</div>
                <div className="cw-brand-text">
                  <h3>Shopping Assistant</h3>
                  <span><i className="cw-dot" /> Online now</span>
                </div>
              </div>
              <button className="cw-close" onClick={() => setOpen(false)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cw-messages">
            {messages.length === 0 ? (
              <div className="cw-empty">
                <div className="cw-empty-icon">✦</div>
                <h4>How can I help you?</h4>
                <p>Ask me about products, orders, or anything else.</p>
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
                  </div>
                ))}
                {loading && (
                  <div className="cw-typing">
                    <span /><span /><span />
                  </div>
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
              placeholder="Message…"
              rows={1}
            />
            <button className="cw-send" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 12V2M2 7l5-5 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="cw-footer">
            <span>Powered by Claude AI</span>
          </div>
        </div>
      )}

      {/* Trigger */}
      <button className={`cw-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {open ? (
            <path d="M4 4l10 10M14 4L4 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          ) : (
            <>
              <path d="M3 5.5h12M3 9h8M3 12.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </>
          )}
        </svg>
      </button>
    </div>
  );
}