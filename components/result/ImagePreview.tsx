'use client';

// components/result/ImagePreview.tsx - 图片预览弹窗组件

import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { GeneratedImage } from '@/types';
import { useState } from 'react';

interface ImagePreviewProps {
  image: GeneratedImage | null;
  open: boolean;
  onClose: () => void;
  onDownload?: (image: GeneratedImage) => void;
}

export function ImagePreview({ image, open, onClose, onDownload }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(100);

  if (!image) return null;

  const handleDownload = () => {
    if (image) {
      onDownload?.(image);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleReset = () => {
    setZoom(100);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* 头部工具栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{image.styleIcon}</span>
              <div>
                <h3 className="font-semibold text-lg">{image.styleName}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(image.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 缩放控制 */}
              <div className="flex items-center gap-1 px-3 py-1 border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <button
                  className="px-2 text-sm font-medium min-w-[3rem] text-center hover:bg-muted rounded"
                  onClick={handleReset}
                >
                  {zoom}%
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* 下载按钮 */}
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>

              {/* 关闭按钮 */}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 图片展示区域 */}
          <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-8">
            <img
              src={image.url}
              alt={image.styleName}
              className="max-w-full h-auto transition-transform duration-200"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          </div>

          {/* 底部信息栏 */}
          <div className="px-6 py-3 border-t bg-muted/50">
            <p className="text-sm text-muted-foreground">
              按 ESC 关闭预览 • 使用缩放按钮调整大小
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
