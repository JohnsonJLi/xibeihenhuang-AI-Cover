'use client';

// components/generator/PromptInput.tsx - 提示词输入组件

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const EXAMPLE_PROMPTS = [
  '科技感未来主题',
  '温馨的咖啡店场景',
  '极简主义设计风格',
  '复古怀旧的城市街景',
];

const MIN_LENGTH = 5;
const MAX_LENGTH = 200;

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  const [charCount, setCharCount] = useState(value.length);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // 限制最大长度
    if (newValue.length <= MAX_LENGTH) {
      onChange(newValue);
      setCharCount(newValue.length);
    }
  };

  const handleExampleClick = (example: string) => {
    onChange(example);
    setCharCount(example.length);
  };

  const isValid = charCount >= MIN_LENGTH && charCount <= MAX_LENGTH;
  const showError = charCount > 0 && !isValid;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="prompt" className="text-base font-semibold">
          描述你想要的封面内容
        </Label>
        <span
          className={`text-sm ${
            showError
              ? 'text-destructive'
              : charCount > MAX_LENGTH * 0.9
                ? 'text-yellow-600'
                : 'text-muted-foreground'
          }`}
        >
          {charCount}/{MAX_LENGTH}
        </span>
      </div>

      <Textarea
        id="prompt"
        placeholder="例如：科技感十足的产品发布会海报，蓝色调，包含未来元素..."
        value={value}
        onChange={handleChange}
        disabled={disabled}
        rows={4}
        className={`resize-none ${showError ? 'border-destructive' : ''}`}
      />

      {showError && (
        <p className="text-sm text-destructive">
          {charCount < MIN_LENGTH
            ? `至少需要 ${MIN_LENGTH} 个字符`
            : `不能超过 ${MAX_LENGTH} 个字符`}
        </p>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">试试这些示例：</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick(example)}
              disabled={disabled}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
