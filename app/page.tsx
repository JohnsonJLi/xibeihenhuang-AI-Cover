'use client';

import { useState } from 'react';
import { EditorPanel } from '@/components/layout/EditorPanel';
import { DisplayPanel } from '@/components/layout/DisplayPanel';
import { useImageGeneration } from '@/lib/hooks/useImageGeneration';
import { downloadImage, downloadImagesAsZip } from '@/lib/utils/download';
import type { GenerateSettings, GeneratedImage, HistoryItem } from '@/types';

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
  const handleRegenerate = async (prompt: string, settings: HistoryItem['settings'], images: GeneratedImage[]) => {
    // 从历史记录的图片中提取风格
    const styles = images.map(img => img.style);

    // 构造完整的 GenerateSettings
    const fullSettings: GenerateSettings = {
      prompt,
      resolution: settings.resolution,
      ratio: settings.ratio,
      styles
    };
    await generate(fullSettings);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">西北很慌 AI封面生成器</h1>
              <p className="text-sm text-gray-600">使用集梦 API 生成专业级封面图片</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 左右分栏布局 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧编辑区域 - 1/3 宽度 */}
        <EditorPanel
          onGenerate={handleGenerate}
          isGenerating={status === 'loading'}
        />

        {/* 右侧展示区域 - 2/3 宽度 */}
        <DisplayPanel
          status={status}
          images={images}
          error={error}
          reset={reset}
          onDownload={handleDownload}
          onBatchDownload={handleBatchDownload}
          onRegenerate={handleRegenerate}
        />
      </main>
    </div>
  );
}
