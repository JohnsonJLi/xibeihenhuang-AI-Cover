'use client';

// components/generator/ResolutionSelect.tsx - 分辨率选择器

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Resolution } from '@/types';

const RESOLUTIONS: { value: Resolution; label: string; description: string }[] = [
  { value: '1024', label: '1024×1024', description: '标准分辨率' },
  { value: '2K', label: '2K', description: '高清' },
  { value: '4K', label: '4K', description: '超高清' },
];

interface ResolutionSelectProps {
  value: Resolution;
  onChange: (value: Resolution) => void;
  disabled?: boolean;
}

export function ResolutionSelect({ value, onChange, disabled }: ResolutionSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="resolution" className="text-sm font-medium">
        分辨率
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="resolution">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RESOLUTIONS.map((res) => (
            <SelectItem key={res.value} value={res.value}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{res.label}</span>
                <span className="text-xs text-muted-foreground">
                  {res.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
