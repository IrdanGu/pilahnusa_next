import { useCallback, useRef, useState } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { recordImpactQuiz } from '../utils/storageUtils';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const useQuiz = () => {
  const [status, setStatus] = useState('idle');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [bestScore, setBestScore] = useState(() => {
    try { return Number(localStorage.getItem('bilahbeu_quiz_best')) || 0; } catch { return 0; }
  });
  const lockedRef = useRef(false);

  const startQuiz = useCallback(() => {
    setQuestions(shuffle(quizQuestions).slice(0, 10));
    setCurrentIndex(0); setScore(0); setStreak(0); setCorrectCount(0); setFeedback(null);
    lockedRef.current = false; setStatus('playing');
  }, []);

  const answerQuestion = useCallback((answer) => {
    if (lockedRef.current || status !== 'playing') return null;
    lockedRef.current = true;
    const question = questions[currentIndex];
    const correct = answer === question.category;
    const nextStreak = correct ? streak + 1 : 0;
    const earned = correct ? 10 + (nextStreak > 1 ? 5 : 0) : 0;
    const nextScore = score + earned;
    const nextCorrect = correctCount + (correct ? 1 : 0);
    setStreak(nextStreak); setScore(nextScore); setCorrectCount(nextCorrect);
    setFeedback({ correct, explanation: question.explanation, funFact: question.funFact, earned });
    setStatus('feedback');
    return { correct, earned };
  }, [correctCount, currentIndex, questions, score, status, streak]);

  const nextQuestion = useCallback(() => {
    lockedRef.current = false;
    if (currentIndex + 1 >= questions.length) {
      setStatus('finished');
      recordImpactQuiz(correctCount, questions.length);
      setBestScore((best) => {
        const next = Math.max(best, correctCount);
        try { localStorage.setItem('bilahbeu_quiz_best', String(next)); } catch (error) { console.error('Gagal menyimpan skor kuis:', error); }
        return next;
      });
      return;
    }
    setCurrentIndex((index) => index + 1);
    setFeedback(null);
    setStatus('playing');
  }, [correctCount, currentIndex, questions.length]);

  const resetQuiz = useCallback(() => {
    lockedRef.current = false;
    setStatus('idle'); setQuestions([]); setCurrentIndex(0); setScore(0); setStreak(0); setCorrectCount(0); setFeedback(null);
  }, []);

  return {
    status, questions, currentIndex, currentQuestion: questions[currentIndex] || null,
    score, streak, correctCount, bestScore, feedback, startQuiz, answerQuestion, nextQuestion, resetQuiz,
  };
};

export default useQuiz;
