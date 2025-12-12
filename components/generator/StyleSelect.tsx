'use client';

// components/generator/StyleSelect.tsx - 风格选择器（多选）

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getRecommendedStyles, getAllStyles } from '@/lib/styles/templates';
import type { StyleId } from '@/types';

const MAX_STYLES = 3;

interface StyleSelectProps {
  value: StyleId[];
  onChange: (value: StyleId[]) => void;
  disabled?: boolean;
}

export function StyleSelect({ value, onChange, disabled }: StyleSelectProps) {
  const recommendedStyles = getRecommendedStyles();
  const allStyles = getAllStyles();

  const handleToggle = (styleId: StyleId) => {
    if (disabled) return;

    const isSelected = value.includes(styleId);

    if (isSelected) {
      // 取消选中
      onChange(value.filter((id) => id !== styleId));
    } else {
      // 选中（如果未达到最大数量）
      if (value.length < MAX_STYLES) {
        onChange([...value, styleId]);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          选择风格（最多 {MAX_STYLES} 个）
        </Label>
        <span className="text-sm text-muted-foreground">
          已选 {value.length}/{MAX_STYLES}
        </span>
      </div>

      {/* 推荐风格 */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">推荐风格：</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {recommendedStyles.map((style) => {
            const isSelected = value.includes(style.id);
            const canSelect = value.length < MAX_STYLES || isSelected;

            return (
              <button
                key={style.id}
                onClick={() => handleToggle(style.id)}
                disabled={disabled || !canSelect}
                className={`
                  p-3 rounded-lg border-2 text-left transition-all
                  ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }
                  ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{style.name}</span>
                      {isSelected && (
                        <Badge variant="default" className="h-4 px-1 text-[10px]">
                          {value.indexOf(style.id) + 1}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {style.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 更多风格 */}
      <details className="space-y-2">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          更多风格 ▾
        </summary>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
          {allStyles
            .filter((style) => !style.recommended)
            .map((style) => {
              const isSelected = value.includes(style.id);
              const canSelect = value.length < MAX_STYLES || isSelected;

              return (
                <button
                  key={style.id}
                  onClick={() => handleToggle(style.id)}
                  disabled={disabled || !canSelect}
                  className={`
                    p-3 rounded-lg border-2 text-left transition-all
                    ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }
                    ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{style.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{style.name}</span>
                        {isSelected && (
                          <Badge variant="default" className="h-4 px-1 text-[10px]">
                            {value.indexOf(style.id) + 1}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {style.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </details>
    </div>
  );
}
