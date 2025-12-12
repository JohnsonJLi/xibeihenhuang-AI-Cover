'use client';

import { useState } from 'react';
import { GeneratorForm } from '@/components/generator/GeneratorForm';
import type { GenerateSettings } from '@/types';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (settings: GenerateSettings) => {
    console.log('开始生成:', settings);
    setIsGenerating(true);

    // TODO: 调用 API 生成图片
    setTimeout(() => {
      setIsGenerating(false);
      console.log('生成完成');
    }, 2000);
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
              isGenerating={isGenerating}
            />

            {/* 生成结果将在这里显示 */}
            <div id="results" className="min-h-[200px]">
              {/* TODO: 添加生成结果展示组件 */}
            </div>
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
    </div>
  );
}
