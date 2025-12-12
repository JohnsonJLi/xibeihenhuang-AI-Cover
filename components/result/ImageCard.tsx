'use client';

// components/result/ImageCard.tsx - 单张图片卡片组件

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import type { GeneratedImage } from '@/types';

interface ImageCardProps {
  image: GeneratedImage;
  onDownload?: (image: GeneratedImage) => void;
  onPreview?: (image: GeneratedImage) => void;
}

export function ImageCard({ image, onDownload, onPreview }: ImageCardProps) {
  const handleDownload = () => {
    onDownload?.(image);
  };

  const handlePreview = () => {
    onPreview?.(image);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* 图片区域 */}
      <div
        className="relative aspect-video bg-muted cursor-pointer group"
        onClick={handlePreview}
      >
        <img
          src={image.url}
          alt={image.styleName}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* 悬浮遮罩 */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <p className="text-white text-sm font-medium px-3 py-1 bg-black/50 rounded">点击查看大图</p>
        </div>
      </div>

      {/* 信息区域 */}
      <CardFooter className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{image.styleIcon}</span>
          <span className="font-medium">{image.styleName}</span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-1" />
          下载
        </Button>
      </CardFooter>
    </Card>
  );
}
