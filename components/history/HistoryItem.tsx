'use client';

// components/history/HistoryItem.tsx - 单条历史记录组件

import { useState } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  RotateCcw,
  Download,
  Clock,
  Settings,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { ImagePreview } from '@/components/result/ImagePreview';
import type { HistoryItem, GeneratedImage } from '@/types';

interface HistoryItemProps {
  item: HistoryItem;
  onDownload: (image: GeneratedImage) => void;
  onBatchDownload: (images: GeneratedImage[]) => void;
  onRegenerate: (prompt: string, settings: HistoryItem['settings']) => void;
  onDelete: (itemId: string) => void;
}

export function HistoryItem({
  item,
  onDownload,
  onBatchDownload,
  onRegenerate,
  onDelete
}: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 格式化时间显示
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const itemDate = new Date(timestamp);
    const diffMs = now.getTime() - itemDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `今天 ${format(itemDate, 'HH:mm', { locale: zhCN })}`;
    } else if (diffDays === 1) {
      return `昨天 ${format(itemDate, 'HH:mm', { locale: zhCN })}`;
    } else if (diffDays < 7) {
      return `${format(itemDate, 'EEEE HH:mm', { locale: zhCN })}`;
    } else {
      return format(itemDate, 'MM月dd日 HH:mm', { locale: zhCN });
    }
  };

  // 处理删除确认
  const handleDeleteConfirm = () => {
    onDelete(item.id);
    setShowDeleteDialog(false);
  };

  // 处理重新生成
  const handleRegenerate = () => {
    onRegenerate(item.prompt, item.settings);
  };

  // 处理图片预览
  const handleImagePreview = (image: GeneratedImage) => {
    setPreviewImage(image);
  };

  // 处理批量下载
  const handleBatchDownload = () => {
    onBatchDownload(item.images);
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* 头部信息 */}
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 展开/收起图标 */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {/* 时间和提示词 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <p className="font-medium text-sm truncate pr-2">
                  {item.prompt}
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBatchDownload();
                }}
                title="打包下载"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerate();
                }}
                title="重新生成"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                title="删除记录"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 参数信息 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings className="h-3 w-3" />
            <span>分辨率: {item.settings.resolution}</span>
            <span>•</span>
            <span>比例: {item.settings.ratio}</span>
            <span>•</span>
            <span>图片: {item.images.length}张</span>
          </div>
        </CardHeader>

        {/* 展开的图片内容 */}
        {isExpanded && (
          <CardContent className="pt-0 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {item.images.map((image, index) => (
                <div key={image.id || index} className="group relative">
                  <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
                    {/* 图片区域 */}
                    <div
                      className="aspect-square cursor-pointer relative overflow-hidden bg-muted"
                      onClick={() => handleImagePreview(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.styleName}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* 悬浮遮罩 */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImagePreview(image);
                            }}
                          >
                            查看大图
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownload(image);
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            下载
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 图片信息 */}
                    <div className="p-3 bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{image.styleIcon}</span>
                          <span className="font-medium text-sm">{image.styleName}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Image className="w-3 h-3 mr-1" />
                          封面
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* 批量操作区域 */}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                共 {item.images.length} 张图片
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBatchDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  全部打包下载
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新生成
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 图片预览弹窗 */}
      <ImagePreview
        image={previewImage}
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        onDownload={onDownload}
      />

      {/* 删除确认弹窗 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条历史记录吗？此操作不可恢复。
              <br />
              <span className="font-medium">&quot;{item.prompt}&quot;</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}