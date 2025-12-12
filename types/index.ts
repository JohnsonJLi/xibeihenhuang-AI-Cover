// types/index.ts - 主类型文件

// ========== 基础类型 ==========

/** 分辨率选项 */
export type Resolution = '1024' | '2K' | '4K';

/** 比例选项 */
export type Ratio = '1:1' | '16:9' | '9:16' | '4:3';

/** 风格ID */
export type StyleId =
  | 'xiaohongshu'
  | 'business'
  | 'minimalist'
  | 'handDrawn'
  | 'cyberpunk'
  | 'chinese'
  | 'watercolor'
  | 'photography'
  | 'gradient'
  | 'neon'
  | 'vintage'
  | 'cartoon'
  | 'anime'
  | 'oil_painting'
  | 'sketch'
  | 'collage'
  | 'paper_cut'
  | 'pixel_art'
  | 'isometric'
  | 'surreal';

// ========== 风格系统 ==========

/** 风格分类 */
export type StyleCategory = 'social' | 'business' | 'art' | 'tech';

/** 风格模板 */
export interface StyleTemplate {
  id: StyleId;
  name: string;              // 显示名称
  tag: string;               // 标签文字
  icon: string;              // emoji图标
  prompt: string;            // prompt模板
  description: string;       // 描述
  recommended: boolean;      // 是否推荐
  category: StyleCategory;   // 分类
}

// ========== 生成参数 ==========

/** 生成配置 */
export interface GenerateSettings {
  prompt: string;            // 用户输入
  resolution: Resolution;    // 分辨率
  ratio: Ratio;              // 比例
  styles: StyleId[];         // 选中的风格（1-3个）
}

/** 生成状态 */
export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error';

// ========== 图片数据 ==========

/** 生成的图片 */
export interface GeneratedImage {
  id: string;                // 图片唯一ID
  url: string;               // 图片URL
  style: StyleId;            // 风格ID
  styleName: string;         // 风格名称
  styleIcon: string;         // 风格图标
  timestamp: number;         // 生成时间
}

// ========== 历史记录 ==========

/** 历史记录项 */
export interface HistoryItem {
  id: string;                // 记录唯一ID (UUID)
  timestamp: number;         // 生成时间戳
  prompt: string;            // 提示词
  settings: {
    resolution: Resolution;
    ratio: Ratio;
  };
  images: GeneratedImage[];  // 生成的图片列表
}

/** 历史记录存储 */
export interface HistoryStorage {
  version: string;           // 数据版本号
  lastUpdated: number;       // 最后更新时间
  data: HistoryItem[];       // 历史记录数组
}

// ========== API类型 ==========

/** API请求 */
export interface GenerateRequest {
  prompt: string;
  resolution: Resolution;
  ratio: Ratio;
  styles: StyleId[];
}

/** API响应 */
export interface GenerateResponse {
  success: boolean;
  data?: {
    images: GeneratedImage[];
  };
  error?: ApiError;
}

/** API错误 */
export interface ApiError {
  code: ErrorCode;
  message: string;
}

/** 错误码 */
export enum ErrorCode {
  INVALID_PROMPT = 'INVALID_PROMPT',
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  CONTENT_VIOLATION = 'CONTENT_VIOLATION',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

// ========== UI状态 ==========

/** 生成器状态 */
export interface GeneratorState {
  status: GenerateStatus;
  progress: number;          // 进度 0-100
  currentStep: number;       // 当前步骤 1-3
  totalSteps: number;        // 总步骤数
  error: ApiError | null;
  result: GeneratedImage[] | null;
}
