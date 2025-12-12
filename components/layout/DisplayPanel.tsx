'use client';

// components/layout/DisplayPanel.tsx - 右侧展示区组件

import { useState, useEffect } from 'react';
import { GeneratedImages } from '@/components/result/GeneratedImages';
import { ImagePreview } from '@/components/result/ImagePreview';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  History,
  Sparkles,
  Download,
  RefreshCw
} from 'lucide-react';
import type { GenerateSettings, GeneratedImage, HistoryItem } from '@/types';
import { downloadImage, downloadImagesAsZip } from '@/lib/utils/download';

interface DisplayPanelProps {
  status: any;
  images: GeneratedImage[] | null;
  error: any;
  reset: () => void;
  onDownload: (image: GeneratedImage) => void;
  onBatchDownload: (images: GeneratedImage[]) => void;
  onRegenerate: (prompt: string, settings: HistoryItem['settings'], images: GeneratedImage[]) => void;
}

export function DisplayPanel({
  status,
  images,
  error,
  reset,
  onDownload,
  onBatchDownload,
  onRegenerate
}: DisplayPanelProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);

  const handlePreview = (image: GeneratedImage) => {
    setPreviewImage(image);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  // 根据状态决定显示哪个标签
  const shouldShowCurrentTab = status === 'success' && images && images.length > 0;
  const shouldShowHistoryTab = true; // 历史记录总是可以显示

  // 如果当前有结果，自动切换到当前生成标签
  useEffect(() => {
    if (shouldShowCurrentTab) {
      setActiveTab('current');
    }
  }, [status, images]);

  return (
    <div className="flex-1 min-w-0 bg-gray-50 h-full overflow-hidden flex flex-col">
      {/* 标题栏和标签切换 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">🎨 生成结果</h2>
            <div className="flex items-center gap-1">
              {status === 'success' && (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {images?.length} 张图片
                </Badge>
              )}
            </div>
          </div>

          {/* 标签切换 */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={activeTab === 'current' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('current')}
              disabled={!shouldShowCurrentTab}
              className={activeTab === 'current' ? 'shadow-sm' : ''}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              当前生成
              {!shouldShowCurrentTab && <span className="opacity-50">(暂无)</span>}
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('history')}
              className={activeTab === 'history' ? 'shadow-sm' : ''}
            >
              <History className="w-4 h-4 mr-2" />
              历史记录
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* 当前生成内容 */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {/* 加载状态 */}
              {status === 'loading' && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-lg font-medium text-gray-700">正在生成图片，请稍候...</p>
                  <p className="text-sm text-gray-500">
                    这可能需要 10-15 秒，请耐心等待
                  </p>
                </div>
              )}

              {/* 错误提示 */}
              {status === 'error' && error && (
                <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">❌ 生成失败</h3>
                  <p className="text-sm text-red-600 mb-4">{error.message}</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={reset}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      重新尝试
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('history')}
                    >
                      查看历史记录
                    </Button>
                  </div>
                </div>
              )}

              {/* 成功结果 */}
              {status === 'success' && images && images.length > 0 && (
                <div className="space-y-4">
                  {/* 结果统计 */}
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">生成成功！</h3>
                        <p className="text-sm text-green-600">
                          已为您生成 {images.length} 张不同风格的封面图片
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBatchDownload(images)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        全部下载
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={reset}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        重新生成
                      </Button>
                    </div>
                  </div>

                  {/* 图片展示 */}
                  <GeneratedImages
                    images={images}
                    onReset={reset}
                    onPreview={handlePreview}
                    onDownload={onDownload}
                    onBatchDownload={onBatchDownload}
                  />
                </div>
              )}

              {/* 空状态（当前标签但无结果） */}
              {status === 'idle' && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <div className="text-center max-w-md">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      准备开始创作
                    </h3>
                    <p className="text-gray-600 mb-4">
                      请在左侧输入描述文字，选择您喜欢的风格和参数，然后点击生成按钮
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('history')}
                    >
                      <History className="w-4 h-4 mr-2" />
                      查看历史记录
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 历史记录内容 */}
          {activeTab === 'history' && (
            <HistoryPanel
              onDownload={onDownload}
              onBatchDownload={onBatchDownload}
              onRegenerate={onRegenerate}
            />
          )}
        </div>
      </div>

      {/* 图片预览弹窗 */}
      <ImagePreview
        image={previewImage}
        open={!!previewImage}
        onClose={handleClosePreview}
        onDownload={onDownload}
      />
    </div>
  );
}