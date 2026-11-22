import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useQuiz from './useQuiz';

describe('useQuiz', () => {
  it('starts a ten-question round and locks double taps', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz());
    expect(result.current.status).toBe('playing');
    expect(result.current.questions).toHaveLength(10);
    const first = result.current.currentQuestion.category;
    act(() => { result.current.answerQuestion(first); result.current.answerQuestion('Organik'); });
    expect(result.current.status).toBe('feedback');
  });

  it('finishes and records a round', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz());
    for (let i = 0; i < 10; i += 1) {
      act(() => result.current.answerQuestion(result.current.currentQuestion.category));
      act(() => result.current.nextQuestion());
    }
    expect(result.current.status).toBe('finished');
  });
});
