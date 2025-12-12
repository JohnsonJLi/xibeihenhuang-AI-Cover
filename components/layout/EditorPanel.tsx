'use client';

// components/layout/EditorPanel.tsx - 左侧编辑区组件

import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { historyStorage } from '@/lib/storage/history';

interface EditorPanelProps {
  onGenerate: (settings: any) => Promise<void>;
  isGenerating: boolean;
}

export function EditorPanel({ onGenerate, isGenerating }: EditorPanelProps) {
  // 获取统计信息
  const stats = historyStorage.getStats();

  return (
    <div className="w-1/3 min-w-0 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* 生成器表单 */}
        <GeneratorForm
          onGenerate={onGenerate}
          isGenerating={isGenerating}
        />

        {/* 快速统计 */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">📊 快速统计</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">今日生成</span>
              <span className="text-sm font-medium text-gray-900">{stats.todayCount}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">历史记录</span>
              <span className="text-sm font-medium text-blue-900">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">存储位置</span>
              <span className="text-sm font-medium text-green-900">本地</span>
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="pt-6 border-t border-gray-200">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 使用提示</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• 描述词越详细，生成效果越好</li>
              <li>• 可以同时选择多种风格对比</li>
              <li>• 点击右侧查看历史记录</li>
              <li>• 支持批量下载所有图片</li>
            </ul>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="pt-6 border-t border-gray-200 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            <div>© 2025 西北很慌</div>
            <div>由集梦 AI 提供技术支持</div>
          </div>
        </div>
      </div>
    </div>
  );
}