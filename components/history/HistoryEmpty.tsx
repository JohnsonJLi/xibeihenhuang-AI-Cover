'use client';

// components/history/HistoryEmpty.tsx - 历史记录空状态组件

import { Palette, Sparkles } from 'lucide-react';

interface HistoryEmptyProps {
  className?: string;
}

export function HistoryEmpty({ className = '' }: HistoryEmptyProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {/* 图标区域 */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <Palette className="w-10 h-10 text-blue-600" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
      </div>

      {/* 标题和描述 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        还没有生成记录
      </h3>
      <p className="text-gray-500 max-w-md">
        快来创建你的第一张 AI 封面吧！
        <br />
        输入描述文字，选择喜欢的风格，点击生成即可。
      </p>

      {/* 装饰性元素 */}
      <div className="mt-6 flex gap-2">
        <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-200 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-pink-200 rounded-full animate-pulse delay-150"></div>
      </div>

      <style jsx>{`
        .delay-75 {
          animation-delay: 75ms;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
}