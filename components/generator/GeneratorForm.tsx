'use client';

// components/generator/GeneratorForm.tsx - 生成器表单主组件

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PromptInput } from './PromptInput';
import { ResolutionSelect } from './ResolutionSelect';
import { RatioSelect } from './RatioSelect';
import { StyleSelect } from './StyleSelect';
import type { GenerateSettings, Resolution, Ratio, StyleId } from '@/types';

interface GeneratorFormProps {
  onGenerate: (settings: GenerateSettings) => void;
  isGenerating?: boolean;
}

export function GeneratorForm({ onGenerate, isGenerating = false }: GeneratorFormProps) {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<Resolution>('1024');
  const [ratio, setRatio] = useState<Ratio>('16:9');
  const [styles, setStyles] = useState<StyleId[]>(['xiaohongshu']);

  const canGenerate =
    prompt.trim().length >= 5 &&
    prompt.trim().length <= 200 &&
    styles.length > 0 &&
    styles.length <= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canGenerate) return;

    onGenerate({
      prompt: prompt.trim(),
      resolution,
      ratio,
      styles,
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 提示词输入 */}
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          disabled={isGenerating}
        />

        {/* 参数选择 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResolutionSelect
            value={resolution}
            onChange={setResolution}
            disabled={isGenerating}
          />
          <RatioSelect
            value={ratio}
            onChange={setRatio}
            disabled={isGenerating}
          />
        </div>

        {/* 风格选择 */}
        <StyleSelect
          value={styles}
          onChange={setStyles}
          disabled={isGenerating}
        />

        {/* 生成按钮 */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!canGenerate || isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              正在生成...
            </span>
          ) : (
            `生成 ${styles.length} 张封面图`
          )}
        </Button>

        {!canGenerate && prompt.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            {prompt.trim().length < 5
              ? '提示词至少需要 5 个字符'
              : styles.length === 0
                ? '请至少选择 1 个风格'
                : ''}
          </p>
        )}
      </form>
    </Card>
  );
}
