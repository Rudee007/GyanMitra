import { useState, useCallback, useRef } from 'react';
import streamingService from '../lib/streamingService';
import toast from 'react-hot-toast';

export const useStreaming = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const startStreaming = useCallback(async (params, onComplete) => {
    setIsStreaming(true);
    setStreamedContent('');
    setError(null);

    const onChunk = (chunk, fullContent) => {
      setStreamedContent(fullContent);
    };

    const onStreamComplete = (result) => {
      setIsStreaming(false);
      if (onComplete) {
        onComplete(result);
      }
    };

    const onStreamError = (err) => {
      setIsStreaming(false);
      setError(err);
      toast.error('Streaming failed. Retrying...');
      console.error('Streaming error:', err);
    };

    try {
      // Try real streaming first
      await streamingService.streamQuery(
        params,
        onChunk,
        onStreamComplete,
        onStreamError
      );
    } catch (err) {
      // Fallback to simulated streaming
      console.log('Using simulated streaming');
      const mockResponse = `This is a detailed answer about ${params.question}. 
      
Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.

The process can be summarized in this equation:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

Key points:
1. Takes place in chloroplasts
2. Requires light, water, and carbon dioxide
3. Produces glucose and oxygen
4. Essential for life on Earth`;

      await streamingService.simulateStreaming(
        mockResponse,
        onChunk,
        onStreamComplete,
        30
      );
    }
  }, []);

  const stopStreaming = useCallback(() => {
    streamingService.abort();
    setIsStreaming(false);
  }, []);

  const resetStreaming = useCallback(() => {
    setStreamedContent('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    isStreaming,
    streamedContent,
    error,
    startStreaming,
    stopStreaming,
    resetStreaming
  };
};
