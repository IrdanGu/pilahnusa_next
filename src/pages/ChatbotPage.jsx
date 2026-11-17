import React, { useMemo, useRef, useState } from 'react';
import { BotMessageSquare, Send, Sparkles, User, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { sendChatbotMessage } from '../services/chatbotService';

const QUICK_PROMPTS = [
  'Bagaimana cara memilah botol plastik?',
  'Apa bedanya sampah organik dan anorganik?',
  'Baterai bekas harus dibuang ke mana?',
  'Bagaimana membuat kompos dari sisa makanan?',
];

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Halo! Saya asisten BilahBeu. Tanyakan apa saja tentang pemilahan sampah, daur ulang, kompos, limbah B3, atau cara membuang sampah dengan aman.',
  },
];

const ChatbotPage = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = async (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');
    setIsSending(true);

    try {
      const reply = await sendChatbotMessage(trimmedMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="chatbot-page animate-slide-up">
      <header className="chatbot-header">
        <div className="chatbot-header__icon" aria-hidden="true">
          <BotMessageSquare size={24} />
        </div>
        <div>
          <h1 className="chatbot-header__title">Chatbot BilahBeu</h1>
          <p className="chatbot-header__subtitle">
            Asisten edukasi pemilahan sampah berbasis Gemini
          </p>
        </div>
      </header>

      <section className="chatbot-shell" aria-label="Percakapan chatbot BilahBeu">
        <div className="chatbot-messages" role="log" aria-live="polite">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            const Icon = isUser ? User : Sparkles;

            return (
              <article
                key={message.id}
                className={`chatbot-message ${isUser ? 'chatbot-message--user' : 'chatbot-message--assistant'}`}
              >
                <div className="chatbot-message__avatar" aria-hidden="true">
                  <Icon size={16} />
                </div>
                <div className="chatbot-message__bubble">
                  {message.content}
                </div>
              </article>
            );
          })}

          {isSending && (
            <article className="chatbot-message chatbot-message--assistant">
              <div className="chatbot-message__avatar" aria-hidden="true">
                <Sparkles size={16} />
              </div>
              <div className="chatbot-message__bubble chatbot-message__bubble--loading">
                Sedang menyusun jawaban...
              </div>
            </article>
          )}
        </div>

        <div className="chatbot-prompts" aria-label="Contoh pertanyaan">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="chatbot-prompts__item"
              onClick={() => sendMessage(prompt)}
              disabled={isSending}
            >
              {prompt}
            </button>
          ))}
        </div>

        {error && (
          <div className="chatbot-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form className="chatbot-composer" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="chatbot-composer__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tanya cara memilah sampah..."
            rows={2}
            disabled={isSending}
            aria-label="Pertanyaan untuk chatbot BilahBeu"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Send size={17} />}
            disabled={!canSend}
            aria-label="Kirim pertanyaan"
          >
            Kirim
          </Button>
        </form>
      </section>

      <style>{`
        .chatbot-page {
          min-height: 100vh;
          background: var(--color-white);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .chatbot-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--color-border-light);
        }

        .chatbot-header__icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          color: var(--color-primary);
          background: var(--color-primary-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chatbot-header__title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin: 0 0 4px;
        }

        .chatbot-header__subtitle {
          color: var(--color-text-secondary);
          font-size: 0.9375rem;
          margin: 0;
        }

        .chatbot-shell {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 920px;
          width: 100%;
          margin: 0 auto;
        }

        .chatbot-messages {
          flex: 1;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 4px;
        }

        .chatbot-message {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          max-width: 82%;
        }

        .chatbot-message--user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .chatbot-message__avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--color-primary-bg);
          color: var(--color-primary);
        }

        .chatbot-message--user .chatbot-message__avatar {
          background: #EFF6FF;
          color: #2563EB;
        }

        .chatbot-message__bubble {
          padding: 13px 15px;
          border-radius: 14px;
          background: var(--color-bg);
          color: var(--color-text-primary);
          line-height: 1.6;
          font-size: 0.9375rem;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .chatbot-message--user .chatbot-message__bubble {
          background: var(--color-primary);
          color: white;
        }

        .chatbot-message__bubble--loading {
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .chatbot-prompts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .chatbot-prompts__item {
          border: 1px solid var(--color-border);
          background: var(--color-white);
          color: var(--color-text-secondary);
          border-radius: 10px;
          padding: 11px 12px;
          text-align: left;
          font-family: var(--font-body);
          font-size: 0.875rem;
          line-height: 1.35;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .chatbot-prompts__item:hover:not(:disabled) {
          border-color: var(--color-primary);
          color: var(--color-text-primary);
          background: var(--color-primary-bg);
        }

        .chatbot-prompts__item:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .chatbot-error {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #B91C1C;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 11px 12px;
          font-size: 0.875rem;
        }

        .chatbot-composer {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          padding-top: 4px;
        }

        .chatbot-composer__input {
          flex: 1;
          min-height: 50px;
          max-height: 130px;
          resize: vertical;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 13px 14px;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.5;
          color: var(--color-text-primary);
          background: var(--color-white);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .chatbot-composer__input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14);
        }

        @media (max-width: 767px) {
          .chatbot-page {
            padding: 20px;
            gap: 18px;
          }

          .chatbot-header__title {
            font-size: 1.25rem;
          }

          .chatbot-shell {
            gap: 14px;
          }

          .chatbot-messages {
            min-height: 360px;
          }

          .chatbot-message {
            max-width: 100%;
          }

          .chatbot-prompts {
            grid-template-columns: 1fr;
          }

          .chatbot-composer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;
