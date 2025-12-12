// app/api/generate/route.ts - 图片生成 API 路由

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getStyleById } from '@/lib/styles/templates';
import type { GenerateRequest, GeneratedImage, ErrorCode } from '@/types';

const JIMENG_API_KEY = process.env.JIMENG_API_KEY;
const JIMENG_API_URL = process.env.JIMENG_API_URL;
const JIMENG_MODEL_ENDPOINT = process.env.JIMENG_MODEL_ENDPOINT;

// 集梦 API 请求接口
interface JiMengRequest {
  model: string;
  prompt: string;
  n?: number;
  size?: string;
  quality?: string;
}

// 集梦 API 响应接口
interface JiMengResponse {
  data?: Array<{
    url: string;
  }>;
  error?: {
    message: string;
    type: string;
  };
}

/**
 * 将我们的分辨率转换为集梦 API 的 size 格式
 * 注意：Seedream API 要求最小尺寸为 3686400 像素（约 1920x1920）
 */
function convertResolution(resolution: string, ratio: string): string {
  // 根据分辨率设置基础尺寸，确保满足最小像素要求
  const baseSize = resolution === '4K' ? 4096 : resolution === '2K' ? 2048 : 1920;

  switch (ratio) {
    case '1:1':
      return `${baseSize}x${baseSize}`;
    case '16:9': {
      const width = Math.round(baseSize * 16/9);
      return `${width}x${baseSize}`;
    }
    case '9:16': {
      const height = Math.round(baseSize * 16/9);
      return `${baseSize}x${height}`;
    }
    case '4:3': {
      const width = Math.round(baseSize * 4/3);
      return `${width}x${baseSize}`;
    }
    default:
      return `${baseSize}x${baseSize}`;
  }
}

/**
 * 调用集梦 API 生成单张图片
 */
async function generateSingleImage(
  finalPrompt: string,
  size: string
): Promise<string> {
  if (!JIMENG_API_KEY || !JIMENG_API_URL || !JIMENG_MODEL_ENDPOINT) {
    throw new Error('API配置缺失：请检查 JIMENG_API_KEY、JIMENG_API_URL 和 JIMENG_MODEL_ENDPOINT 环境变量');
  }

  const requestBody: JiMengRequest = {
    model: JIMENG_MODEL_ENDPOINT, // 使用环境变量中的 endpoint ID
    prompt: finalPrompt,
    n: 1,
    size,
    quality: 'standard',
  };

  const response = await fetch(JIMENG_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JIMENG_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
  }

  const data: JiMengResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.data || data.data.length === 0) {
    throw new Error('API未返回图片');
  }

  return data.data[0].url;
}

/**
 * POST /api/generate
 * 生成图片
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, resolution, ratio, styles } = body;

    // 验证参数
    if (!prompt || prompt.trim().length < 5 || prompt.trim().length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PROMPT' as ErrorCode,
            message: '提示词长度必须在5-200字符之间',
          },
        },
        { status: 400 }
      );
    }

    if (!styles || styles.length === 0 || styles.length > 3) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PROMPT' as ErrorCode,
            message: '必须选择1-3个风格',
          },
        },
        { status: 400 }
      );
    }

    // 转换尺寸
    const size = convertResolution(resolution, ratio);

    // 并发生成所有风格的图片
    const generatePromises = styles.map(async (styleId) => {
      const style = getStyleById(styleId);
      if (!style) {
        throw new Error(`未找到风格: ${styleId}`);
      }

      // 将用户输入替换到风格 prompt 模板中
      const finalPrompt = style.prompt.replace('{用户输入}', prompt.trim());

      try {
        // 调用集梦 API
        const imageUrl = await generateSingleImage(finalPrompt, size);

        const generatedImage: GeneratedImage = {
          id: uuidv4(),
          url: imageUrl,
          style: styleId,
          styleName: style.name,
          styleIcon: style.icon,
          timestamp: Date.now(),
        };

        return generatedImage;
      } catch (error) {
        console.error(`生成风格 ${styleId} 失败:`, error);
        throw error;
      }
    });

    // 等待所有图片生成完成
    const images = await Promise.all(generatePromises);

    return NextResponse.json({
      success: true,
      data: { images },
    });

  } catch (error) {
    console.error('生成图片错误:', error);

    const errorMessage = error instanceof Error ? error.message : '未知错误';
    let errorCode: ErrorCode = 'API_ERROR';

    // 根据错误信息判断错误类型
    if (errorMessage.includes('配置缺失')) {
      errorCode = 'API_ERROR';
    } else if (errorMessage.includes('限流') || errorMessage.includes('rate limit')) {
      errorCode = 'RATE_LIMIT';
    } else if (errorMessage.includes('违规') || errorMessage.includes('content')) {
      errorCode = 'CONTENT_VIOLATION';
    } else if (errorMessage.includes('网络') || errorMessage.includes('network')) {
      errorCode = 'NETWORK_ERROR';
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
