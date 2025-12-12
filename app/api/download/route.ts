// app/api/download/route.ts - 下载代理 API

import { NextRequest, NextResponse } from 'next/server';

// 允许的图片域名白名单
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'ark.cn-beijing.volces.com', // 集梦 API 域名
  'volces.com',
  'bytedance.com'
];

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 请求超时时间 (30秒)
const REQUEST_TIMEOUT = 30000;

/**
 * 验证 URL 是否安全
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // 检查协议
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // 检查域名白名单
    const hostname = urlObj.hostname;
    const isAllowed = ALLOWED_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    return isAllowed;
  } catch {
    return false;
  }
}

/**
 * 获取文件扩展名
 */
function getFileExtension(url: string, contentType?: string): string {
  // 从 Content-Type 获取扩展名
  if (contentType) {
    const typeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg'
    };

    const ext = typeToExt[contentType.toLowerCase()];
    if (ext) return ext;
  }

  // 从 URL 获取扩展名
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const lastDot = path.lastIndexOf('.');
    if (lastDot > 0) {
      return path.substring(lastDot);
    }
  } catch {
    // 忽略 URL 解析错误
  }

  // 默认扩展名
  return '.png';
}

/**
 * GET /api/download?url=<imageUrl>
 *
 * 代理下载图片，解决跨域问题
 */
export async function GET(request: NextRequest) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少 URL 参数' },
        { status: 400 }
      );
    }

    // 验证 URL 安全性
    if (!isValidUrl(imageUrl)) {
      return NextResponse.json(
        { error: '不允许的 URL' },
        { status: 403 }
      );
    }

    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      // 发起请求
      const response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AICover-Downloader/1.0)',
          'Accept': 'image/*',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: `图片下载失败: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      // 检查 Content-Type
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.startsWith('image/')) {
        return NextResponse.json(
          { error: '无效的图片格式' },
          { status: 400 }
        );
      }

      // 检查文件大小
      const contentLength = response.headers.get('Content-Length');
      if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: '文件过大' },
          { status: 413 }
        );
      }

      // 获取图片数据
      const imageBuffer = await response.arrayBuffer();

      // 再次检查大小（以防服务器没有返回 Content-Length）
      if (imageBuffer.byteLength > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: '文件过大' },
          { status: 413 }
        );
      }

      // 生成文件名
      const fileExt = getFileExtension(imageUrl, contentType);
      const timestamp = Date.now();
      const filename = `aicover_${timestamp}${fileExt}`;

      // 设置响应头
      const headers = new Headers({
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // 缓存 1 小时
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*', // 允许跨域
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      });

      return new NextResponse(imageBuffer, {
        status: 200,
        headers
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: '请求超时' },
          { status: 408 }
        );
      }

      throw fetchError;
    }

  } catch (error) {
    console.error('下载代理 API 错误:', error);

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/download
 *
 * 处理 CORS 预检请求
 */
export async function OPTIONS() {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400' // 24 小时
  });

  return new NextResponse(null, {
    status: 200,
    headers
  });
}