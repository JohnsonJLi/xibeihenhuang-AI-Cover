'use client';

import { useState } from 'react';
import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { GeneratedImages } from '@/components/result/GeneratedImages';
import { ImagePreview } from '@/components/result/ImagePreview';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { useImageGeneration } from '@/lib/hooks/useImageGeneration';
import { downloadImage, downloadImagesAsZip } from '@/lib/utils/download';
import type { GenerateSettings, GeneratedImage } from '@/types';

export default function Home() {
  const { status, images, error, generate, reset } = useImageGeneration();
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async (settings: GenerateSettings) => {
    await generate(settings);
  };

  const handlePreview = (image: GeneratedImage) => {
    setPreviewImage(image);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  // 处理单张图片下载
  const handleDownload = async (image: GeneratedImage) => {
    try {
      await downloadImage(image);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  // 处理批量下载
  const handleBatchDownload = async (images: GeneratedImage[]) => {
    try {
      await downloadImagesAsZip(images);
    } catch (error) {
      console.error('批量下载失败:', error);
      alert('批量下载失败，请重试');
    }
  };

  // 处理重新生成
  const handleRegenerate = async (prompt: string, settings: GenerateSettings) => {
    await generate(settings);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h1 className="text-xl font-bold">西北很荒 AI封面生成器</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-8">
            {/* 标题区 */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                AI 封面生成器
              </h2>
              <p className="text-muted-foreground">
                使用集梦 API 生成不同风格的 AI 封面图片
              </p>
            </div>

            {/* 生成器表单 */}
            <GeneratorForm
              onGenerate={handleGenerate}
              isGenerating={status === 'loading'}
            />

            {/* 加载状态 */}
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground">正在生成图片，请稍候...</p>
              </div>
            )}

            {/* 错误提示 */}
            {status === 'error' && error && (
              <div className="p-6 border border-destructive bg-destructive/10 rounded-lg">
                <h3 className="font-semibold text-destructive mb-2">生成失败</h3>
                <p className="text-sm text-muted-foreground">{error.message}</p>
                <button
                  onClick={reset}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  重新尝试
                </button>
              </div>
            )}

            {/* 成功结果 */}
            {status === 'success' && images && images.length > 0 && (
              <GeneratedImages
                images={images}
                onReset={reset}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onBatchDownload={handleBatchDownload}
              />
            )}

            {/* 历史记录面板 */}
            <HistoryPanel
              onDownload={handleDownload}
              onBatchDownload={handleBatchDownload}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-12">
        <div className="container flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 西北很荒 AI封面生成器. 使用集梦API提供支持.
          </p>
        </div>
      </footer>

      {/* 图片预览弹窗 */}
      <ImagePreview
        image={previewImage}
        open={!!previewImage}
        onClose={handleClosePreview}
      />
    </div>
  );
}
