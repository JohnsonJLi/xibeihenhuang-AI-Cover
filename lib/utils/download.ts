// lib/utils/download.ts - 下载工具函数

import JSZip from 'jszip';
import type { GeneratedImage } from '@/types';

/**
 * 生成文件名
 */
export function generateImageFileName(image: GeneratedImage): string {
  const timestamp = new Date(image.timestamp).toISOString().replace(/[:.]/g, '-');
  return `封面_${image.styleName}_${timestamp}.png`;
}

/**
 * 检查图片 URL 是否为同源
 */
export function isSameOrigin(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * 下载单张图片
 */
export async function downloadImage(image: GeneratedImage): Promise<void> {
  try {
    const fileName = generateImageFileName(image);

    // 如果是同源图片，直接下载
    if (isSameOrigin(image.url)) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // 跨域图片通过代理下载
    const response = await fetch(`/api/download?url=${encodeURIComponent(image.url)}`);

    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 清理对象 URL
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error('下载图片失败:', error);
    throw new Error('下载失败，请重试');
  }
}

/**
 * 批量下载图片打包成 ZIP
 */
export async function downloadImagesAsZip(
  images: GeneratedImage[],
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    if (images.length === 0) {
      throw new Error('没有图片可下载');
    }

    const zip = new JSZip();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `AI封面_${timestamp}`;

    // 下载所有图片并添加到 ZIP
    const downloadPromises = images.map(async (image, index) => {
      try {
        const fileName = generateImageFileName(image);

        // 如果是同源图片，直接获取
        if (isSameOrigin(image.url)) {
          const response = await fetch(image.url);
          const blob = await response.blob();
          zip.file(`${folderName}/${fileName}`, blob);
        } else {
          // 跨域图片通过代理下载
          const response = await fetch(`/api/download?url=${encodeURIComponent(image.url)}`);

          if (!response.ok) {
            throw new Error(`图片 ${index + 1} 下载失败`);
          }

          const blob = await response.blob();
          zip.file(`${folderName}/${fileName}`, blob);
        }

        // 更新进度
        if (onProgress) {
          onProgress((index + 1) / images.length * 100);
        }

        return true;
      } catch (error) {
        console.error(`下载图片 ${index + 1} 失败:`, error);
        throw error;
      }
    });

    // 等待所有图片下载完成
    await Promise.all(downloadPromises);

    // 生成 ZIP 文件
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // 下载 ZIP 文件
    const zipUrl = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 清理对象 URL
    window.URL.revokeObjectURL(zipUrl);

  } catch (error) {
    console.error('批量下载失败:', error);
    throw new Error('批量下载失败，请重试');
  }
}

/**
 * 验证图片 URL 是否可访问
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('Content-Type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

/**
 * 获取图片信息
 */
export async function getImageInfo(url: string): Promise<{
  size: number;
  type: string;
  width?: number;
  height?: number;
} | null> {
  try {
    const response = await fetch(url, { method: 'HEAD' });

    if (!response.ok) {
      return null;
    }

    const size = parseInt(response.headers.get('Content-Length') || '0');
    const type = response.headers.get('Content-Type') || '';

    // 获取图片尺寸
    let width: number | undefined;
    let height: number | undefined;

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      width = img.naturalWidth;
      height = img.naturalHeight;
    } catch {
      // 如果无法获取尺寸，继续处理
    }

    return { size, type, width, height };
  } catch {
    return null;
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

/**
 * 下载进度类型
 */
export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number; // bytes per second
  estimatedTimeRemaining?: number; // seconds
}

/**
 * 带进度的下载函数
 */
export async function downloadWithProgress(
  url: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    let startTime = Date.now();
    let lastLoaded = 0;

    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const loaded = event.loaded;
        const total = event.total;
        const percentage = (loaded / total) * 100;

        const currentTime = Date.now();
        const timeDiff = (currentTime - startTime) / 1000; // seconds
        const speed = timeDiff > 0 ? (loaded - lastLoaded) / timeDiff : 0;

        const estimatedTimeRemaining = speed > 0
          ? (total - loaded) / speed
          : undefined;

        if (onProgress) {
          onProgress({
            loaded,
            total,
            percentage,
            speed,
            estimatedTimeRemaining
          });
        }

        lastLoaded = loaded;
        startTime = currentTime;
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`下载失败: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('网络错误'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('下载被取消'));
    });

    xhr.send();
  });
}