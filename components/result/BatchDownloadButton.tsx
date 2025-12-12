'use client';

// components/result/BatchDownloadButton.tsx - 批量下载按钮组件

import { useState } from 'react';
import { Download, Loader2, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { downloadImagesAsZip } from '@/lib/utils/download';
import type { GeneratedImage } from '@/types';

interface BatchDownloadButtonProps {
  images: GeneratedImage[];
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function BatchDownloadButton({
  images,
  className = '',
  variant = 'outline',
  size = 'default'
}: BatchDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理批量下载
  const handleBatchDownload = async () => {
    if (images.length === 0) {
      setError('没有可下载的图片');
      return;
    }

    setIsDownloading(true);
    setProgress(0);
    setShowProgress(true);
    setError(null);

    try {
      await downloadImagesAsZip(images, (progressValue) => {
        setProgress(progressValue);
      });

      // 下载成功后延迟关闭进度对话框
      setTimeout(() => {
        setShowProgress(false);
        setProgress(0);
      }, 1500);

    } catch (error) {
      console.error('批量下载失败:', error);
      setError(error instanceof Error ? error.message : '下载失败，请重试');
      setShowProgress(false);
      setProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  // 格式化进度文本
  const getProgressText = () => {
    if (progress === 0) return '准备下载...';
    if (progress === 100) return '下载完成！';
    return `下载中... ${Math.round(progress)}%`;
  };

  return (
    <>
      <Button
        onClick={handleBatchDownload}
        disabled={isDownloading || images.length === 0}
        variant={variant}
        size={size}
        className={className}
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Archive className="w-4 h-4 mr-2" />
        )}
        {images.length > 0 ? `全部打包下载 (${images.length}张)` : '无图片可下载'}
      </Button>

      {/* 进度对话框 */}
      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              批量下载图片
            </DialogTitle>
            <DialogDescription>
              正在将 {images.length} 张图片打包下载，请稍候...
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{getProgressText()}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {/* 状态图标 */}
            <div className="flex justify-center">
              {progress === 100 ? (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              )}
            </div>

            {/* 提示信息 */}
            <div className="text-center text-sm text-muted-foreground">
              {progress === 100
                ? 'ZIP 文件已开始下载'
                : '请保持网络连接，不要关闭页面'
              }
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 错误提示 */}
      {error && (
        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </>
  );
}