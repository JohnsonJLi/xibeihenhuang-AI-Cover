'use client';

// lib/hooks/useImageGeneration.ts - 图片生成 Hook

import { useState, useCallback } from 'react';
import type {
  GenerateSettings,
  GeneratedImage,
  GenerateStatus,
  ApiError,
  ErrorCode,
} from '@/types';

interface UseImageGenerationReturn {
  status: GenerateStatus;
  images: GeneratedImage[] | null;
  error: ApiError | null;
  generate: (settings: GenerateSettings) => Promise<void>;
  reset: () => void;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [status, setStatus] = useState<GenerateStatus>('idle');
  const [images, setImages] = useState<GeneratedImage[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const generate = useCallback(async (settings: GenerateSettings) => {
    setStatus('loading');
    setError(null);
    setImages(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || '生成失败');
      }

      setImages(data.data.images);
      setStatus('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';

      setError({
        code: 'API_ERROR' as ErrorCode,
        message: errorMessage,
      });
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setImages(null);
    setError(null);
  }, []);

  return {
    status,
    images,
    error,
    generate,
    reset,
  };
}
