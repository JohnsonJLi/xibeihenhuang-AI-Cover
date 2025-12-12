// lib/storage/history.ts - 历史记录存储管理

import { v4 as uuidv4 } from 'uuid';
import type { HistoryItem, HistoryStorage, GenerateSettings, GeneratedImage } from '@/types';

// 存储键名常量
export const STORAGE_KEYS = {
  HISTORY: 'aicover_history',
  VERSION: 'aicover_version',
  USER_SETTINGS: 'aicover_settings'
} as const;

// 数据版本号
const STORAGE_VERSION = '1.0.0';

// 最大历史记录数量
const MAX_HISTORY_ITEMS = 50;

/**
 * LocalStorage 封装类
 */
class LocalStorageManager {
  /**
   * 获取存储的数据
   */
  get<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined') return null;

      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`获取LocalStorage数据失败 [${key}]:`, error);
      return null;
    }
  }

  /**
   * 设置存储数据
   */
  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined') return false;

      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`设置LocalStorage数据失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 删除存储数据
   */
  remove(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;

      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除LocalStorage数据失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 清空所有存储
   */
  clear(): boolean {
    try {
      if (typeof window === 'undefined') return false;

      localStorage.clear();
      return true;
    } catch (error) {
      console.error('清空LocalStorage失败:', error);
      return false;
    }
  }
}

// 创建 LocalStorage 管理实例
const storage = new LocalStorageManager();

/**
 * 历史记录管理类
 */
export class HistoryManager {
  /**
   * 获取所有历史记录
   */
  static getHistory(): HistoryItem[] {
    try {
      const historyStorage: HistoryStorage | null = storage.get(STORAGE_KEYS.HISTORY);

      if (!historyStorage) {
        return [];
      }

      // 检查版本兼容性
      if (historyStorage.version !== STORAGE_VERSION) {
        console.warn('历史记录数据版本不匹配，将清空旧数据');
        this.clearHistory();
        return [];
      }

      return historyStorage.data || [];
    } catch (error) {
      console.error('获取历史记录失败:', error);
      return [];
    }
  }

  /**
   * 保存历史记录
   */
  static saveHistory(historyItems: HistoryItem[]): boolean {
    try {
      // 限制记录数量，保留最新的记录
      const limitedItems = historyItems.slice(-MAX_HISTORY_ITEMS);

      const historyStorage: HistoryStorage = {
        version: STORAGE_VERSION,
        lastUpdated: Date.now(),
        data: limitedItems
      };

      return storage.set(STORAGE_KEYS.HISTORY, historyStorage);
    } catch (error) {
      console.error('保存历史记录失败:', error);
      return false;
    }
  }

  /**
   * 添加新的历史记录
   */
  static addHistoryItem(
    prompt: string,
    settings: GenerateSettings,
    images: GeneratedImage[]
  ): boolean {
    try {
      const history = this.getHistory();

      const newHistoryItem: HistoryItem = {
        id: uuidv4(),
        timestamp: Date.now(),
        prompt: prompt.trim(),
        settings,
        images
      };

      // 添加到历史记录开头
      history.unshift(newHistoryItem);

      // 限制记录数量
      const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

      return this.saveHistory(limitedHistory);
    } catch (error) {
      console.error('添加历史记录失败:', error);
      return false;
    }
  }

  /**
   * 删除指定的历史记录
   */
  static deleteHistoryItem(itemId: string): boolean {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter(item => item.id !== itemId);

      return this.saveHistory(filteredHistory);
    } catch (error) {
      console.error('删除历史记录失败:', error);
      return false;
    }
  }

  /**
   * 清空所有历史记录
   */
  static clearHistory(): boolean {
    try {
      return storage.remove(STORAGE_KEYS.HISTORY);
    } catch (error) {
      console.error('清空历史记录失败:', error);
      return false;
    }
  }

  /**
   * 获取历史记录统计信息
   */
  static getHistoryStats(): {
    total: number;
    todayCount: number;
    thisWeekCount: number;
    thisMonthCount: number;
    oldestTimestamp: number | null;
    newestTimestamp: number | null;
  } {
    const history = this.getHistory();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const stats = {
      total: history.length,
      todayCount: 0,
      thisWeekCount: 0,
      thisMonthCount: 0,
      oldestTimestamp: null as number | null,
      newestTimestamp: null as number | null
    };

    if (history.length === 0) {
      return stats;
    }

    history.forEach(item => {
      const timeDiff = now - item.timestamp;

      if (timeDiff < oneDay) stats.todayCount++;
      if (timeDiff < oneWeek) stats.thisWeekCount++;
      if (timeDiff < oneMonth) stats.thisMonthCount++;
    });

    stats.oldestTimestamp = history[history.length - 1]?.timestamp || null;
    stats.newestTimestamp = history[0]?.timestamp || null;

    return stats;
  }

  /**
   * 根据时间范围获取历史记录
   */
  static getHistoryByTimeRange(startTime: number, endTime: number): HistoryItem[] {
    const history = this.getHistory();

    return history.filter(item =>
      item.timestamp >= startTime && item.timestamp <= endTime
    );
  }

  /**
   * 搜索历史记录
   */
  static searchHistory(query: string): HistoryItem[] {
    const history = this.getHistory();
    const lowercaseQuery = query.toLowerCase().trim();

    if (!lowercaseQuery) {
      return history;
    }

    return history.filter(item =>
      item.prompt.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * 检查历史记录数据完整性
   */
  static validateHistoryData(): {
    isValid: boolean;
    corruptedItems: number;
    totalItems: number;
  } {
    const history = this.getHistory();
    let corruptedItems = 0;

    history.forEach(item => {
      if (!item.id || !item.prompt || !item.images || !Array.isArray(item.images)) {
        corruptedItems++;
      }
    });

    return {
      isValid: corruptedItems === 0,
      corruptedItems,
      totalItems: history.length
    };
  }

  /**
   * 清理损坏的历史记录
   */
  static cleanupCorruptedHistory(): boolean {
    try {
      const history = this.getHistory();
      const validHistory = history.filter(item =>
        item.id &&
        item.prompt &&
        item.images &&
        Array.isArray(item.images) &&
        item.images.length > 0
      );

      return this.saveHistory(validHistory);
    } catch (error) {
      console.error('清理损坏历史记录失败:', error);
      return false;
    }
  }

  /**
   * 导出历史记录为 JSON
   */
  static exportHistory(): string | null {
    try {
      const history = this.getHistory();
      const exportData = {
        version: STORAGE_VERSION,
        exportTime: Date.now(),
        data: history
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('导出历史记录失败:', error);
      return null;
    }
  }

  /**
   * 导入历史记录 JSON
   */
  static importHistory(jsonData: string): {
    success: boolean;
    importedCount: number;
    error?: string;
  } {
    try {
      const importData = JSON.parse(jsonData);

      if (!importData.data || !Array.isArray(importData.data)) {
        return {
          success: false,
          importedCount: 0,
          error: '无效的导入数据格式'
        };
      }

      // 验证数据格式
      const validHistoryItems = importData.data.filter((item: any) =>
        item.id &&
        item.prompt &&
        item.images &&
        Array.isArray(item.images)
      );

      if (validHistoryItems.length === 0) {
        return {
          success: false,
          importedCount: 0,
          error: '没有有效的历史记录数据'
        };
      }

      // 合并现有历史记录
      const existingHistory = this.getHistory();
      const mergedHistory = [...validHistoryItems, ...existingHistory];

      // 去重（根据ID）
      const uniqueHistory = mergedHistory.filter((item, index, array) =>
        array.findIndex(i => i.id === item.id) === index
      );

      // 按时间倒序排列
      uniqueHistory.sort((a, b) => b.timestamp - a.timestamp);

      // 限制数量
      const limitedHistory = uniqueHistory.slice(0, MAX_HISTORY_ITEMS);

      const success = this.saveHistory(limitedHistory);

      return {
        success,
        importedCount: validHistoryItems.length,
        error: success ? undefined : '保存导入数据失败'
      };
    } catch (error) {
      return {
        success: false,
        importedCount: 0,
        error: `导入失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}

/**
 * 便捷的历史记录操作函数
 */
export const historyStorage = {
  get: () => HistoryManager.getHistory(),
  add: (prompt: string, settings: GenerateSettings, images: GeneratedImage[]) =>
    HistoryManager.addHistoryItem(prompt, settings, images),
  delete: (itemId: string) => HistoryManager.deleteHistoryItem(itemId),
  clear: () => HistoryManager.clearHistory(),
  getStats: () => HistoryManager.getHistoryStats(),
  search: (query: string) => HistoryManager.searchHistory(query),
  export: () => HistoryManager.exportHistory(),
  import: (jsonData: string) => HistoryManager.importHistory(jsonData),
  validate: () => HistoryManager.validateHistoryData(),
  cleanup: () => HistoryManager.cleanupCorruptedHistory()
};