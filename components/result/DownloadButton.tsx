'use client';

// components/result/DownloadButton.tsx - 单张图片下载按钮组件

import { useState } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadImage } from '@/lib/utils/download';
import type { GeneratedImage } from '@/types';

interface DownloadButtonProps {
  image: GeneratedImage;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
}

export function DownloadButton({
  image,
  className = '',
  variant = 'default',
  size = 'default',
  showText = true,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 重置状态
  const resetStatus = () => {
    setTimeout(() => {
      setDownloadStatus('idle');
    }, 2000); // 2秒后重置状态
  };

  // 处理下载
  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadStatus('idle');
    onDownloadStart?.();

    try {
      await downloadImage(image);
      setDownloadStatus('success');
      onDownloadComplete?.();
      resetStatus();
    } catch (error) {
      console.error('图片下载失败:', error);
      setDownloadStatus('error');
      const errorObj = error instanceof Error ? error : new Error('下载失败');
      onDownloadError?.(errorObj);
      resetStatus();
    } finally {
      setIsDownloading(false);
    }
  };

  // 获取按钮内容
  const getButtonContent = () => {
    if (downloadStatus === 'success') {
      return (
        <>
          <CheckCircle className="w-4 h-4 text-green-600" />
          {showText && <span className="text-green-600">下载成功</span>}
        </>
      );
    }

    if (downloadStatus === 'error') {
      return (
        <>
          <AlertCircle className="w-4 h-4 text-red-600" />
          {showText && <span className="text-red-600">下载失败</span>}
        </>
      );
    }

    if (isDownloading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span>下载中...</span>}
        </>
      );
    }

    return (
      <>
        <Download className="w-4 h-4" />
        {showText && <span>下载</span>}
      </>
    );
  };

  // 根据状态设置按钮变体
  const getButtonVariant = () => {
    if (downloadStatus === 'success') return 'default';
    if (downloadStatus === 'error') return 'destructive';
    return variant;
  };

  // 根据状态禁用按钮
  const isDisabled = isDownloading || downloadStatus !== 'idle';

  return (
    <Button
      onClick={handleDownload}
      disabled={isDisabled}
      variant={getButtonVariant()}
      size={size}
      className={`transition-all duration-200 ${className}`}
      title={downloadStatus === 'success' ? '下载成功' : downloadStatus === 'error' ? '下载失败，请重试' : '下载图片'}
    >
      {getButtonContent()}
    </Button>
  );
}