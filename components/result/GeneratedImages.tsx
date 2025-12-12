'use client';

// components/result/GeneratedImages.tsx - 生成结果展示容器组件

import { ImageCard } from './ImageCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { GeneratedImage } from '@/types';

interface GeneratedImagesProps {
  images: GeneratedImage[];
  onDownload?: (image: GeneratedImage) => void;
  onBatchDownload?: (images: GeneratedImage[]) => void;
  onPreview?: (image: GeneratedImage) => void;
  onReset?: () => void;
}

export function GeneratedImages({
  images,
  onDownload,
  onBatchDownload,
  onPreview,
  onReset,
}: GeneratedImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          生成成功！共 {images.length} 张图片
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
        >
          重新生成
        </Button>
      </div>

      {/* 图片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onDownload={onDownload}
            onPreview={onPreview}
          />
        ))}
      </div>

      {/* 批量下载按钮 */}
      {onBatchDownload && images.length > 1 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onBatchDownload(images)}
          >
            <Download className="w-4 h-4 mr-2" />
            全部打包下载 ({images.length}张)
          </Button>
        </div>
      )}
    </div>
  );
}
