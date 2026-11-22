import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, BotMessageSquare, Copy, RotateCcw, Send, Sparkles, User, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { sendChatMessage } from '../services/chatbotService';
import { copyToClipboard } from '../utils/shareCard';

const INITIAL_MESSAGES = [{
  id: 'welcome',
  role: 'assistant',
  content: 'Halo! Saya asisten BilahBeu. Tanyakan apa saja tentang pemilahan sampah, daur ulang, kompos, limbah B3, atau cara membuang sampah dengan aman.',
  source: 'online',
}];

const parseInline = (text, keyPrefix = 'inline') => {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;
  let index = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**')) parts.push(<strong key={`${keyPrefix}-b-${index}`}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith('`')) parts.push(<code key={`${keyPrefix}-c-${index}`}>{token.slice(1, -1)}</code>);
    else parts.push(<em key={`${keyPrefix}-i-${index}`}>{token.slice(1, -1)}</em>);
    lastIndex = match.index + token.length;
    index += 1;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

const PureMarkdown = ({ text }) => {
  const lines = String(text || '').split('\n');
  const elements = [];
  let bulletItems = [];
  let numberedItems = [];

  const flushLists = () => {
    if (bulletItems.length) {
      elements.push(<ul key={`ul-${elements.length}`}>{bulletItems.map((item, index) => <li key={index}>{parseInline(item, `ul-${index}`)}</li>)}</ul>);
      bulletItems = [];
    }
    if (numberedItems.length) {
      elements.push(<ol key={`ol-${elements.length}`}>{numberedItems.map((item, index) => <li key={index}>{parseInline(item, `ol-${index}`)}</li>)}</ol>);
      numberedItems = [];
    }
  };

  lines.forEach((line, index) => {
    const value = line.trim();
    if (!value) {
      flushLists();
      return;
    }
    if (/^[-*]\s+/.test(value)) {
      bulletItems.push(value.replace(/^[-*]\s+/, ''));
      return;
    }
    if (/^\d+\.\s+/.test(value)) {
      if (bulletItems.length) flushLists();
      numberedItems.push(value.replace(/^\d+\.\s+/, ''));
      return;
    }
    flushLists();
    if (value.startsWith('### ')) elements.push(<h3 key={`h-${index}`}>{parseInline(value.slice(4), `h-${index}`)}</h3>);
    else elements.push(<p key={`p-${index}`}>{parseInline(value, `p-${index}`)}</p>);
  });
  flushLists();
  return <>{elements}</>;
};

const ChatbotPage = () => {
  const location = useLocation();
  const [contextItem, setContextItem] = useState(location.state?.contextItem || null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const toast = useToast();

  const quickPrompts = useMemo(() => contextItem ? [
    `Bagaimana cara memilah ${contextItem.name}?`,
    `${contextItem.name} termasuk kategori ${contextItem.category}, apa langkah aman berikutnya?`,
    `Apakah ${contextItem.name} bisa didaur ulang atau dikomposkan?`,
  ] : [
    'Bagaimana cara memilah botol plastik?',
    'Apa bedanya sampah organik dan anorganik?',
    'Baterai bekas harus dibuang ke mana?',
    'Bagaimana membuat kompos dari sisa makanan?',
  ], [contextItem]);

  useEffect(() => {
    if (messages.length > 1 || isSending) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isSending]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = async (message) => {
    const trimmed = typeof message === 'string' ? message.trim() : '';
    if (!trimmed || isSending) return;
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content: trimmed }]);
    setInput('');
    setError('');
    setIsSending(true);
    try {
      const response = await sendChatMessage(trimmed, { contextItem });
      setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: 'assistant', content: response.reply, source: response.source }]);
    } catch (err) {
      setError(err?.message || 'Pesan gagal dikirim.');
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (event) => { event.preventDefault(); sendMessage(input); };
  const clearChat = () => { setMessages(INITIAL_MESSAGES); setError(''); setInput(''); };

  return (
    <div className="chatbot-page animate-slide-up">
      <header className="chatbot-header">
        <div className="chatbot-header__icon" aria-hidden="true"><BotMessageSquare size={24} /></div>
        <div className="chatbot-header__text"><h1 className="chatbot-header__title">Chatbot BilahBeu</h1><p className="chatbot-header__subtitle">Asisten edukasi pemilahan sampah berbasis Gemini</p></div>
        <button type="button" className="chatbot-header__clear" onClick={clearChat}><RotateCcw size={16} /> Mulai Baru</button>
      </header>

      {contextItem && (
        <div className="chatbot-context" role="status">
          <span>Membahas hasil scan: {contextItem.name} ({contextItem.category})</span>
          <button type="button" onClick={() => setContextItem(null)} aria-label="Tutup konteks hasil scan"><X size={18} /></button>
        </div>
      )}

      <section className="chatbot-shell" aria-label="Percakapan chatbot BilahBeu">
        <div ref={messagesContainerRef} className="chatbot-messages" role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            const Icon = isUser ? User : Sparkles;
            return (
              <article key={message.id} className={`chatbot-message ${isUser ? 'chatbot-message--user' : 'chatbot-message--assistant'}`}>
                <div className="chatbot-message__avatar" aria-hidden="true"><Icon size={16} /></div>
                <div className="chatbot-message__bubble">
                  {isUser ? message.content : <PureMarkdown text={message.content} />}
                  {!isUser && (
                    <div className="chatbot-message__meta">
                      {message.source === 'offline' && <span className="chatbot-message__offline">Mode Offline</span>}
                      <button type="button" onClick={async () => { const copied = await copyToClipboard(message.content); toast?.addToast?.(copied ? 'Jawaban berhasil disalin.' : 'Jawaban tidak dapat disalin.', copied ? 'success' : 'error'); }} aria-label="Salin jawaban"><Copy size={14} /> Salin</button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
          {isSending && <article className="chatbot-message chatbot-message--assistant"><div className="chatbot-message__avatar" aria-hidden="true"><Sparkles size={16} /></div><div className="chatbot-message__bubble chatbot-message__bubble--loading">Sedang menyusun jawaban...</div></article>}
        </div>

        <div className="chatbot-prompts" aria-label="Contoh pertanyaan">
          {quickPrompts.map((prompt) => <button key={prompt} type="button" className="chatbot-prompts__item" onClick={() => sendMessage(prompt)} disabled={isSending}>{prompt}</button>)}
        </div>
        {error && <div className="chatbot-error" role="alert"><AlertCircle size={16} aria-hidden="true" /><span>{error}</span></div>}
        <form className="chatbot-composer" onSubmit={handleSubmit}>
          <textarea ref={textareaRef} className="chatbot-composer__input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tanya cara memilah sampah..." rows={2} disabled={isSending} aria-label="Pertanyaan untuk chatbot BilahBeu" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(input); } }} />
          <Button type="submit" variant="primary" size="md" icon={<Send size={17} />} disabled={!canSend} aria-label="Kirim pertanyaan">Kirim</Button>
        </form>
      </section>

      <style>{`
        .chatbot-page{min-height:calc(100vh - 64px);background:var(--color-surface);padding:32px;display:flex;flex-direction:column;gap:20px}
        .chatbot-header{display:flex;align-items:center;gap:16px;padding-bottom:18px;border-bottom:1px solid var(--color-border)}.chatbot-header__icon{width:48px;height:48px;border-radius:12px;color:var(--color-primary-text, var(--color-primary));background:var(--color-primary-bg);display:grid;place-items:center;flex-shrink:0}.chatbot-header__text{flex:1;min-width:0}.chatbot-header__title{font-size:1.5rem;font-weight:800;color:var(--color-text-primary);margin:0 0 4px}.chatbot-header__subtitle{color:var(--color-text-secondary);font-size:.9375rem;margin:0}.chatbot-header__clear{min-height:44px;display:flex;align-items:center;gap:7px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-text-primary);padding:8px 12px;font-weight:700;flex-shrink:0}
        .chatbot-context{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:920px;width:100%;margin:0 auto;padding:10px 12px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-primary-bg);color:var(--color-text-primary)}.chatbot-context button{width:44px;height:44px;display:grid;place-items:center;border:0;background:transparent;color:var(--color-text-secondary)}
        .chatbot-shell{flex:1;min-height:0;display:flex;flex-direction:column;gap:16px;max-width:920px;width:100%;margin:0 auto}.chatbot-messages{flex:1;min-height:280px;max-height:54vh;overflow-y:auto;display:flex;flex-direction:column;gap:14px;padding:4px}.chatbot-message{display:flex;align-items:flex-start;gap:10px;max-width:82%}.chatbot-message--user{align-self:flex-end;flex-direction:row-reverse}.chatbot-message__avatar{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:var(--color-primary-bg);color:var(--color-primary-text, var(--color-primary))}.chatbot-message--user .chatbot-message__avatar{background:var(--color-anorganik-bg);color:var(--color-anorganik-text, #1D4ED8)}
        .chatbot-message__bubble{padding:13px 15px;border-radius:14px;background:var(--color-bg-secondary);color:var(--color-text-primary);line-height:1.6;font-size:.9375rem;overflow-wrap:anywhere}.chatbot-message--user .chatbot-message__bubble{background:var(--color-primary-btn, #15803D);color:#fff}.chatbot-message__bubble p,.chatbot-message__bubble h3{margin:.35em 0}.chatbot-message__bubble ul,.chatbot-message__bubble ol{margin:.35em 0;padding-left:22px}.chatbot-message__bubble code{padding:2px 5px;border-radius:5px;background:rgba(0,0,0,.08);font-family:monospace}.chatbot-message--user .chatbot-message__bubble code{background:rgba(255,255,255,.18)}
        .chatbot-message__meta{display:flex;align-items:center;gap:8px;margin-top:8px}.chatbot-message__meta button{min-height:44px;display:flex;align-items:center;gap:6px;border:0;border-radius:8px;background:transparent;color:var(--color-text-secondary);font-weight:700}.chatbot-message__offline{padding:4px 8px;border:1px solid var(--color-border);border-radius:999px;color:var(--color-text-secondary);font-size:.72rem;font-weight:700}.chatbot-message__bubble--loading{color:var(--color-text-secondary);font-style:italic}
        .chatbot-prompts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.chatbot-prompts__item{min-height:44px;border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text-secondary);border-radius:10px;padding:11px 12px;text-align:left;font:inherit;font-size:.875rem;cursor:pointer}.chatbot-prompts__item:hover:not(:disabled){border-color:var(--color-primary-text, var(--color-primary));color:var(--color-text-primary);background:var(--color-primary-bg)}.chatbot-prompts__item:disabled{opacity:.6;cursor:not-allowed}
        .chatbot-error{display:flex;align-items:center;gap:8px;color:var(--color-danger-text, #991B1B);background:var(--color-danger-bg, #FEE2E2);border:1px solid var(--color-danger, #FECACA);border-radius:10px;padding:11px 12px;font-size:.875rem}.chatbot-composer{display:flex;gap:12px;align-items:flex-end;padding:4px 0}.chatbot-composer__input{flex:1;min-height:50px;max-height:130px;resize:vertical;border:1px solid var(--color-border);border-radius:12px;padding:13px 14px;font:inherit;font-size:.9375rem;line-height:1.5;color:var(--color-text-primary);background:var(--color-surface);outline:none}.chatbot-composer__input:focus{border-color:var(--color-primary);box-shadow:0 0 0 3px rgba(34,197,94,.14)}
        @media(max-width:767px){.chatbot-page{min-height:0;padding:18px 16px 36px;gap:16px}.chatbot-header{align-items:flex-start;padding-bottom:14px}.chatbot-header__icon{display:none}.chatbot-header__title{font-size:1.25rem}.chatbot-header__clear{margin-left:auto;font-size:.8rem}.chatbot-messages{min-height:200px;max-height:none;overflow-y:visible}.chatbot-message{max-width:96%}.chatbot-prompts{grid-template-columns:1fr}.chatbot-composer{flex-direction:column;align-items:stretch;padding-top:8px}.chatbot-composer .btn{width:100%}}
      `}</style>
    </div>
  );
};

export default ChatbotPage;
