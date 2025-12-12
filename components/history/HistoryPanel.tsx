'use client';

// components/history/HistoryPanel.tsx - 历史记录面板组件

import { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Trash2,
  Download,
  RefreshCw,
  FileOutput,
  FileInput,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import { HistoryEmpty } from './HistoryEmpty';
import { HistoryItem } from './HistoryItem';
import { historyStorage } from '@/lib/storage/history';
import type { HistoryItem as HistoryItemType, GeneratedImage } from '@/types';

interface HistoryPanelProps {
  onDownload: (image: GeneratedImage) => void;
  onBatchDownload: (images: GeneratedImage[]) => void;
  onRegenerate: (prompt: string, settings: HistoryItemType['settings'], images: GeneratedImage[]) => void;
}

export function HistoryPanel({
  onDownload,
  onBatchDownload,
  onRegenerate
}: HistoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 加载历史记录
  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = historyStorage.get();
      setHistory(data);
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  // 过滤和排序历史记录
  const filteredHistory = useMemo(() => {
    let filtered = history;

    // 搜索过滤
    if (searchQuery.trim()) {
      filtered = historyStorage.search(searchQuery);
    }

    // 排序
    if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => a.timestamp - b.timestamp);
    } else {
      filtered = [...filtered].sort((a, b) => b.timestamp - a.timestamp);
    }

    return filtered;
  }, [history, searchQuery, sortBy]);

  // 处理删除单个记录
  const handleDeleteItem = (itemId: string) => {
    const success = historyStorage.delete(itemId);
    if (success) {
      setHistory(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // 处理清空所有记录
  const handleClearAll = () => {
    const success = historyStorage.clear();
    if (success) {
      setHistory([]);
      setShowClearDialog(false);
    }
  };

  // 处理导出历史记录
  const handleExportHistory = () => {
    const exportData = historyStorage.export();
    if (exportData) {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aicover_history_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // 处理导入历史记录
  const handleImportHistory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const result = historyStorage.import(text);

          if (result.success) {
            loadHistory(); // 重新加载历史记录
            alert(`成功导入 ${result.importedCount} 条记录`);
          } else {
            alert(`导入失败: ${result.error}`);
          }
        } catch (error) {
          alert('导入失败: 文件格式错误');
        }
      }
    };
    input.click();
  };

  // 获取统计信息
  const stats = historyStorage.getStats();

  return (
    <div className="w-full bg-background border rounded-lg overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg">历史记录</h3>
          <Badge variant="secondary" className="text-xs">
            {stats.total} 条
          </Badge>
          {stats.todayCount > 0 && (
            <Badge variant="outline" className="text-xs">
              今日 {stats.todayCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 搜索框 */}
          {isExpanded && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索历史记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          )}

          {/* 排序选择 */}
          {isExpanded && (
            <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新优先</SelectItem>
                <SelectItem value="oldest">最旧优先</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* 更多操作菜单 */}
          {isExpanded && history.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportHistory}>
                  <FileOutput className="h-4 w-4 mr-2" />
                  导出历史记录
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportHistory}>
                  <FileInput className="h-4 w-4 mr-2" />
                  导入历史记录
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowClearDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  清空所有记录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* 刷新按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={loadHistory}
            disabled={isLoading}
            title="刷新"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* 展开/收起按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">加载中...</span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <HistoryEmpty className="py-8" />
          ) : (
            <div className="p-4 space-y-4">
              {searchQuery && (
                <div className="text-sm text-muted-foreground">
                  搜索到 {filteredHistory.length} 条记录
                </div>
              )}
              {filteredHistory.map((item) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  onDownload={onDownload}
                  onBatchDownload={onBatchDownload}
                  onRegenerate={(prompt, settings) => onRegenerate(prompt, settings, item.images)}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 清空确认弹窗 */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>清空所有历史记录</AlertDialogTitle>
            <AlertDialogDescription>
              确定要清空所有历史记录吗？此操作不可恢复。
              <br />
              将删除 {history.length} 条记录。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认清空
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}