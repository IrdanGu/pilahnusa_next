import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../components/ui/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../utils/shareCard', () => ({
  buildWhatsAppShareUrl: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  copyToClipboard: vi.fn(async () => true),
}));

vi.mock('../hooks/useQuiz', async () => {
  const questions = [
    { id: 'q1', item: 'Kulit pisang', hint: 'Sisa buah dapur', category: 'Organik', explanation: 'Kulit pisang dapat dikomposkan.', funFact: 'Kompos memperbaiki tanah.' },
    { id: 'q2', item: 'Botol PET', hint: 'Kemasan air mineral', category: 'Anorganik', explanation: 'Bilas dan setorkan ke bank sampah.', funFact: 'PET dapat didaur ulang.' },
  ];
  const mockState = {
    status: 'idle',
    currentIndex: 0,
    score: 0,
    streak: 0,
    correctCount: 0,
    feedback: null,
  };
  mockState.status = 'idle';
  mockState.currentIndex = 0;
  mockState.score = 0;
  mockState.streak = 0;
  mockState.correctCount = 0;
  mockState.feedback = null;

  return {
    default: () => {
      const startQuiz = () => { mockState.status = 'playing'; };
      const answerQuestion = (answer) => {
        if (mockState.status !== 'playing') return null;
        const correct = answer === questions[mockState.currentIndex].category;
        const nextStreak = correct ? mockState.streak + 1 : 0;
        const earned = correct ? 10 + (nextStreak > 1 ? 5 : 0) : 0;
        mockState.score += earned;
        mockState.streak = nextStreak;
        mockState.correctCount += correct ? 1 : 0;
        mockState.feedback = { correct, earned, explanation: questions[mockState.currentIndex].explanation, funFact: questions[mockState.currentIndex].funFact };
        mockState.status = 'feedback';
        return { correct, earned };
      };
      const nextQuestion = () => {
        if (mockState.currentIndex + 1 >= questions.length) mockState.status = 'finished';
        else { mockState.currentIndex += 1; mockState.feedback = null; mockState.status = 'playing'; }
      };

      return {
        status: mockState.status, questions, currentIndex: mockState.currentIndex,
        currentQuestion: questions[mockState.currentIndex] || null,
        score: mockState.score, streak: mockState.streak, correctCount: mockState.correctCount,
        bestScore: 1, feedback: mockState.feedback,
        startQuiz, answerQuestion, nextQuestion,
        resetQuiz: () => { mockState.status = 'idle'; },
      };
    },
  };
});

import QuizPage from './QuizPage';

const renderPage = () => render(<MemoryRouter><QuizPage /></MemoryRouter>);

describe('QuizPage', () => {
  it('starts, answers, explains, advances, and reaches the completion summary', () => {
    const view = renderPage();
    expect(screen.getByRole('heading', { name: 'Eco Challenge', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Skor Terbaik: 1/10')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mulai Tantangan' }));
    view.rerender(<MemoryRouter><QuizPage /></MemoryRouter>);
    expect(screen.getByText('Soal 1 / 2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kulit pisang' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Organik, shortcut 1' }));
    view.rerender(<MemoryRouter><QuizPage /></MemoryRouter>);
    expect(screen.getByRole('status')).toHaveTextContent('Benar');
    expect(screen.getByText('Kulit pisang dapat dikomposkan.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Soal Berikutnya' }));
    view.rerender(<MemoryRouter><QuizPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Botol PET' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Anorganik, shortcut 2' }));
    view.rerender(<MemoryRouter><QuizPage /></MemoryRouter>);
    expect(screen.getByRole('status')).toHaveTextContent('Benar');
    fireEvent.click(screen.getByRole('button', { name: 'Lihat Hasil' }));
    view.rerender(<MemoryRouter><QuizPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Hasil Eco Challenge' })).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByText('Lencana Master Kuis Terbuka!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lihat DampakKu' })).toHaveAttribute('href', '/dampak');
  });
});
