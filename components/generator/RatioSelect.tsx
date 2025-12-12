'use client';

// components/generator/RatioSelect.tsx - 比例选择器

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Ratio } from '@/types';

const RATIOS: { value: Ratio; label: string; description: string }[] = [
  { value: '1:1', label: '1:1', description: '正方形' },
  { value: '16:9', label: '16:9', description: '横向' },
  { value: '9:16', label: '9:16', description: '竖向' },
  { value: '4:3', label: '4:3', description: '标准' },
];

interface RatioSelectProps {
  value: Ratio;
  onChange: (value: Ratio) => void;
  disabled?: boolean;
}

export function RatioSelect({ value, onChange, disabled }: RatioSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="ratio" className="text-sm font-medium">
        画面比例
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="ratio">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RATIOS.map((ratio) => (
            <SelectItem key={ratio.value} value={ratio.value}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{ratio.label}</span>
                <span className="text-xs text-muted-foreground">
                  {ratio.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
