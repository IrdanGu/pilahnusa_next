import { useState, useCallback, useEffect, useRef } from 'react';
import { classifyWaste } from '../services/aiService';

/**
 * Custom hook for AI waste classification
 */
const useClassifier = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const mountedRef = useRef(true);
  const analyzingRef = useRef(false);

  useEffect(() => () => { mountedRef.current = false; }, []);

  /**
   * Analyze a waste image
   * @param {string} base64Image - Base64 image data
   */
  const analyze = useCallback(async (base64Image) => {
    if (analyzingRef.current) return null;
    analyzingRef.current = true;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (mountedRef.current) setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 400);

    try {
      const classificationResult = await classifyWaste(base64Image);

      if (mountedRef.current) {
        setProgress(100);
        setResult(classificationResult);
      }
      return classificationResult;
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'Terjadi kesalahan saat menganalisis gambar.');
      return null;
    } finally {
      clearInterval(progressInterval);
      analyzingRef.current = false;
      if (mountedRef.current) setIsAnalyzing(false);
    }
  }, []);

  /** Reset classifier state */
  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    isAnalyzing,
    result,
    error,
    progress,
    analyze,
    reset,
  };
};

export default useClassifier;
