import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Leaf, Recycle, Trophy } from 'lucide-react';
import useQuiz from '../hooks/useQuiz';
import { copyToClipboard, buildWhatsAppShareUrl } from '../utils/shareCard';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

const categoryOptions = [
  { name: 'Organik', Icon: Leaf },
  { name: 'Anorganik', Icon: Recycle },
  { name: 'B3', Icon: AlertTriangle },
];

const QuizPage = () => {
  const {
    status, questions, currentIndex, currentQuestion, score, streak,
    correctCount, bestScore, feedback, startQuiz, answerQuestion,
    nextQuestion, resetQuiz,
  } = useQuiz();
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (status === 'playing' && ['1', '2', '3'].includes(event.key)) {
        event.preventDefault();
        answerQuestion(categoryOptions[Number(event.key) - 1].name);
      }
      if (status === 'feedback' && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        nextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerQuestion, nextQuestion, status]);

  const shareWhatsApp = () => {
    const text = `Aku mendapat ${correctCount} / ${questions.length || 10} pada Eco Challenge BilahBeu AI dan ${score} poin. Bisakah kamu mengalahkan skorku?`;
    window.open(buildWhatsAppShareUrl(text), '_blank', 'noopener,noreferrer');
  };

  const copyScore = async () => {
    const text = `Skor Eco Challenge BilahBeu AI: ${correctCount} / ${questions.length || 10}, ${score} poin.`;
    const copied = await copyToClipboard(text);
    toast?.addToast?.(copied ? 'Skor kuis disalin.' : 'Skor kuis gagal disalin.', copied ? 'success' : 'error');
  };

  return (
    <div className="quiz-page">
      {status === 'idle' && (
        <section className="quiz-hero" aria-labelledby="quiz-title">
          <div className="quiz-hero__icon" aria-hidden="true">
            <Trophy size={42} strokeWidth={1.6} />
          </div>
          <h1 id="quiz-title">Eco Challenge</h1>
          <p className="quiz-hero__description">
            Uji ketepatanmu memilah 10 jenis sampah rumah tangga ke dalam kategori Organik, Anorganik, atau B3.
          </p>
          <div className="quiz-hero__best tabular">Skor Terbaik: {bestScore}/10</div>
          <div className="quiz-rules" aria-label="Aturan tantangan">
            <div><span>10</span><p>Jenis sampah acak</p></div>
            <div><Leaf size={22} aria-hidden="true" /><p>Pilih satu kategori</p></div>
            <div><Trophy size={22} aria-hidden="true" /><p>Raih poin beruntun</p></div>
          </div>
          <Button size="lg" icon={<Leaf size={18} />} onClick={startQuiz}>Mulai Tantangan</Button>
        </section>
      )}

      {(status === 'playing' || status === 'feedback') && currentQuestion && (
        <div className="quiz-session">
          <div className="quiz-status" aria-label="Status tantangan">
            <div className="quiz-status__progress">
              <span>Soal {currentIndex + 1} / {questions.length}</span>
              <div
                role="progressbar"
                aria-label="Kemajuan kuis"
                aria-valuemin={0}
                aria-valuemax={questions.length}
                aria-valuenow={currentIndex + 1}
              >
                <span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
              </div>
            </div>
            <div className="quiz-status__stats">
              <span className="tabular">{score} poin</span>
              <span className="tabular">Streak {streak}x</span>
            </div>
          </div>

          <section className="quiz-question" aria-labelledby="quiz-question-title">
            <div className="quiz-question__heading">
              <h1 id="quiz-question-title">{currentQuestion.item}</h1>
              <p>{currentQuestion.hint}</p>
            </div>
            <div className="quiz-options" role="group" aria-label="Pilih kategori sampah">
              {categoryOptions.map(({ name, Icon }, index) => (
                <button
                  type="button"
                  key={name}
                  className={`quiz-option quiz-option--${name.toLowerCase()}`}
                  onClick={() => answerQuestion(name)}
                  disabled={status === 'feedback'}
                  aria-label={`${name}, shortcut ${index + 1}`}
                >
                  <Icon size={30} strokeWidth={1.7} aria-hidden="true" />
                  <span>{name}</span>
                  <kbd>{index + 1}</kbd>
                </button>
              ))}
            </div>

            {status === 'feedback' && feedback && (
              <div
                className={`quiz-feedback ${feedback.correct ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect'}`}
                role="status"
                aria-live="polite"
              >
                <div className="quiz-feedback__title">
                  {feedback.correct ? (
                    <><Leaf size={20} aria-hidden="true" /><strong>Benar (+{feedback.earned} poin)</strong></>
                  ) : (
                    <><AlertTriangle size={20} aria-hidden="true" /><strong>Belum Tepat · Jawaban: {currentQuestion.category}</strong></>
                  )}
                </div>
                <p>{feedback.explanation}</p>
                <p className="quiz-feedback__fact">{feedback.funFact}</p>
                <Button
                  size="lg"
                  onClick={nextQuestion}
                  aria-label={currentIndex + 1 >= questions.length ? 'Lihat Hasil' : 'Soal Berikutnya'}
                >
                  {currentIndex + 1 >= questions.length ? 'Lihat Hasil' : 'Soal Berikutnya'}
                </Button>
              </div>
            )}
          </section>
        </div>
      )}

      {status === 'finished' && (
        <section className="quiz-result" aria-labelledby="quiz-result-title">
          <div className="quiz-result__icon" aria-hidden="true"><Trophy size={44} strokeWidth={1.6} /></div>
          <h1 id="quiz-result-title">Hasil Eco Challenge</h1>
          <div className="quiz-result__score tabular">{correctCount} / {questions.length}</div>
          <p className="quiz-result__points tabular">{score} poin</p>
          <div className="quiz-result__best tabular">Skor Terbaik: {bestScore}/{questions.length || 10}</div>
          {correctCount === questions.length && (
            <div className="quiz-result__master">
              <Trophy size={20} aria-hidden="true" />
              <strong>Lencana Master Kuis Terbuka!</strong>
            </div>
          )}
          <div className="quiz-result__actions" role="group" aria-label="Aksi setelah kuis">
            <Button icon={<Recycle size={17} />} onClick={resetQuiz}>Main Lagi</Button>
            <Button variant="outline" onClick={shareWhatsApp}>Bagikan ke WhatsApp</Button>
            <Button variant="ghost" onClick={copyScore}>Salin Skor</Button>
            <Button as={Link} to="/dampak" variant="outline" icon={<Leaf size={17} />}>Lihat DampakKu</Button>
          </div>
        </section>
      )}

      <style>{`
        .quiz-page { max-width:920px; min-height:calc(100vh - 120px); margin:0 auto; display:grid; place-items:center; padding:32px 20px 56px; color:var(--color-text-primary); }
        .quiz-hero { width:min(100%,680px); text-align:center; padding:44px; border:1px solid var(--color-border); border-radius:var(--radius-2xl); background:var(--color-surface); }
        .quiz-hero__icon { width:76px; height:76px; display:grid; place-items:center; margin:0 auto 18px; border-radius:var(--radius-xl); background:var(--color-primary-bg-md); color:var(--color-primary-text, var(--color-primary)); }
        .quiz-hero h1 { font-family:var(--font-heading); font-size:clamp(2.25rem,7vw,4.25rem); line-height:1; letter-spacing:-0.04em; }
        .quiz-hero__description { max-width:540px; margin:16px auto 14px; color:var(--color-text-secondary); line-height:1.65; }
        .quiz-hero__best { display:inline-block; margin-bottom:22px; padding:8px 12px; border-radius:var(--radius-full); background:var(--color-primary-bg); color:var(--color-primary-text, var(--color-primary-dark)); font-weight:800; font-size:0.875rem; }
        .quiz-rules { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin-bottom:24px; }
        .quiz-rules div { min-height:96px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; border:1px solid var(--color-border); border-radius:var(--radius-lg); color:var(--color-primary-text, var(--color-primary)); }
        .quiz-rules span { font-size:1.25rem; font-weight:800; }
        .quiz-rules p { color:var(--color-text-secondary); font-size:0.8125rem; }
        .quiz-session { width:min(100%,760px); align-self:start; }
        .quiz-status { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:14px; }
        .quiz-status__progress { flex:1; max-width:420px; }
        .quiz-status__progress > span { display:block; margin-bottom:7px; font-size:0.875rem; font-weight:700; }
        .quiz-status__progress > div { height:8px; overflow:hidden; border-radius:var(--radius-full); background:var(--color-bg-secondary); }
        .quiz-status__progress > div span { display:block;height:100%;border-radius:inherit;background:var(--color-primary);transition:width 400ms ease-out; }
        .quiz-status__stats { display:flex; gap:8px; }
        .quiz-status__stats span { padding:8px 10px; border:1px solid var(--color-border); border-radius:var(--radius-full); background:var(--color-surface); font-size:0.8125rem; font-weight:800; }
        .quiz-question { padding:32px; border:1px solid var(--color-border); border-radius:var(--radius-2xl); background:var(--color-surface); }
        .quiz-question__heading { text-align:center; margin-bottom:24px; }
        .quiz-question__heading h1 { font-size:clamp(1.75rem,5vw,2.75rem); letter-spacing:-0.035em; }
        .quiz-question__heading p { margin-top:7px; color:var(--color-text-secondary); }
        .quiz-options { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
        .quiz-option { min-height:150px; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; border:2px solid var(--color-border); border-radius:var(--radius-xl); background:var(--color-surface); color:var(--color-text-primary); cursor:pointer; font-weight:800; transition:background-color 180ms ease-out,border-color 180ms ease-out,box-shadow 180ms ease-out; }
        .quiz-option:hover:not(:disabled) { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .quiz-option:active:not(:disabled) { transform:translateY(0); }
        .quiz-option:disabled { cursor:default; opacity:0.72; }
        .quiz-option:focus-visible { outline:3px solid var(--color-primary); outline-offset:3px; }
        .quiz-option kbd { position:absolute; top:10px; right:10px; width:26px; height:26px; display:grid; place-items:center; border:1px solid var(--color-border); border-radius:var(--radius-sm); background:var(--color-bg-secondary); color:var(--color-text-secondary); font-family:var(--font-body); font-size:0.75rem; }
        .quiz-option--organik { color:var(--color-organik-text, var(--color-primary-text)); }
        .quiz-option--organik:hover:not(:disabled) { background:var(--color-organik-bg); border-color:var(--color-organik); }
        .quiz-option--anorganik { color:var(--color-anorganik-text, #1D4ED8); }
        .quiz-option--anorganik:hover:not(:disabled) { background:var(--color-anorganik-bg); border-color:var(--color-anorganik); }
        .quiz-option--b3 { color:var(--color-b3-text, #B91C1C); }
        .quiz-option--b3:hover:not(:disabled) { background:var(--color-b3-bg); border-color:var(--color-b3); }
        .quiz-feedback { margin-top:16px; padding:20px; border:1px solid var(--color-border); border-radius:var(--radius-xl); }
        .quiz-feedback--correct { background:var(--color-primary-bg); border-color:var(--color-primary-light); }
        .quiz-feedback--incorrect { background:var(--color-b3-bg); border-color:var(--color-danger, #FCA5A5); }
        .quiz-feedback__title { display:flex; align-items:center; gap:8px; }
        .quiz-feedback p { margin:8px 0 0; line-height:1.55; }
        .quiz-feedback__fact { color:var(--color-text-secondary); font-size:0.875rem; }
        .quiz-feedback .btn { margin-top:16px; width:100%; }
        .quiz-result { width:min(100%,680px); text-align:center; padding:44px; border:1px solid var(--color-border); border-radius:var(--radius-2xl); background:var(--color-surface); }
        .quiz-result__icon { width:76px;height:76px;display:grid;place-items:center;margin:0 auto 16px;border-radius:var(--radius-xl);background:var(--color-primary-bg-md);color:var(--color-primary-text, var(--color-primary)); }
        .quiz-result h1 { font-size:clamp(1.75rem,5vw,2.5rem); }
        .quiz-result__score { margin-top:16px;font-size:clamp(3rem,10vw,5rem);line-height:1;font-weight:800;letter-spacing:-0.04em;color:var(--color-primary-text, var(--color-primary)); }
        .quiz-result__points { margin-top:8px; font-size:1.125rem;font-weight:800; }
        .quiz-result__best { display:inline-block;margin-top:14px;padding:8px 12px;border-radius:var(--radius-full);background:var(--color-bg-secondary);font-size:0.875rem;font-weight:800; }
        .quiz-result__master { display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;padding:12px;border:1px solid var(--color-primary-light);border-radius:var(--radius-lg);background:var(--color-primary-bg);color:var(--color-primary-text, var(--color-primary-dark)); }
        .quiz-result__actions { display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:22px; }
        @media (prefers-reduced-motion: reduce) { .quiz-option,.quiz-status__progress > div span { transition:none; } }
        @media (max-width:600px) {
          .quiz-page { padding:20px 12px 40px; place-items:start center; }
          .quiz-hero,.quiz-result { padding:28px 18px; }
          .quiz-rules { grid-template-columns:1fr; }
          .quiz-rules div { min-height:70px; }
          .quiz-status { align-items:flex-end; }
          .quiz-status__stats { flex-direction:column; align-items:flex-end; }
          .quiz-question { padding:20px 12px; }
          .quiz-options { grid-template-columns:1fr; }
          .quiz-option { min-height:86px; flex-direction:row; }
          .quiz-option kbd { top:50%; transform:translateY(-50%); }
          .quiz-result__actions { flex-direction:column; }
          .quiz-result__actions .btn { width:100%; }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;
