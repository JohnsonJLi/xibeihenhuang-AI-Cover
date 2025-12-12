# 西北很荒 AI封面生成器 - 开发任务清单

**项目状态**: 🚧 开发中
**开始日期**: 2025-12-12
**预计完成**: 8-10 个工作日
**当前进度**: 0/28 (0%)

---

## 📊 进度总览

- **Phase 1 - 基础搭建**: 0/6 ⬜⬜⬜⬜⬜⬜
- **Phase 2.1 - 图片生成模块**: 0/7 ⬜⬜⬜⬜⬜⬜⬜
- **Phase 2.2 - 历史与下载**: 0/6 ⬜⬜⬜⬜⬜⬜
- **Phase 3 - 优化测试**: 0/6 ⬜⬜⬜⬜⬜⬜
- **Phase 4 - 部署上线**: 0/3 ⬜⬜⬜

---

## 🔧 Phase 1：基础搭建 (1-2天)

**目标**: 搭建项目基础架构和配置

- [ ] 1. 创建基础布局组件（Header, Container, Footer）
  - 文件: `components/layout/Header.tsx`, `Container.tsx`, `Footer.tsx`
  - 优先级: P0
  - 预计时间: 2h

- [ ] 2. 配置环境变量（.env.local 和 .env.example）
  - 文件: `.env.local`, `.env.example`
  - 优先级: P0
  - 预计时间: 0.5h
  - 注意: 包含集梦 API Key

- [ ] 3. 创建 TypeScript 类型定义（types/index.ts）
  - 文件: `types/index.ts`, `types/api.ts`, `types/style.ts`, `types/history.ts`
  - 优先级: P0
  - 预计时间: 1.5h
  - 内容: 所有接口和类型定义

- [ ] 4. 创建风格系统配置（lib/styles/templates.ts）
  - 文件: `lib/styles/templates.ts`, `lib/styles/constants.ts`
  - 优先级: P0
  - 预计时间: 2h
  - 内容: 8种风格的完整 Prompt 模板

- [ ] 5. 添加必要依赖（jszip, uuid, date-fns）
  - 命令: `pnpm add jszip uuid date-fns`
  - 命令: `pnpm add -D @types/uuid`
  - 优先级: P0
  - 预计时间: 0.5h

- [ ] 6. 安装 shadcn/ui 基础组件
  - 组件: button, input, card, select, toast, dialog, textarea, label, badge
  - 命令: `pnpm dlx shadcn@latest add button input card select toast dialog textarea label badge`
  - 优先级: P0
  - 预计时间: 1h

**Phase 1 完成标志**: ✅ 项目框架搭建完成，可运行基础界面

---

## 🎨 Phase 2.1：图片生成模块 (2天)

**目标**: 实现核心的图片生成功能

- [ ] 7. 实现提示词输入组件（PromptInput.tsx）
  - 文件: `components/generator/PromptInput.tsx`
  - 优先级: P0
  - 预计时间: 3h
  - 功能:
    - 多行文本输入
    - 字数统计和验证（5-200字）
    - 示例提示词按钮
    - 输入优化（去空格、标点）

- [ ] 8. 实现参数选择器组件（分辨率/比例/风格）
  - 文件:
    - `components/generator/ResolutionSelect.tsx`
    - `components/generator/RatioSelect.tsx`
    - `components/generator/StyleSelect.tsx`
    - `components/generator/ParameterSelector.tsx`
  - 优先级: P0
  - 预计时间: 4h
  - 功能: 分辨率、比例、风格多选（最多3个）

- [ ] 9. 创建集梦 API 路由（app/api/generate/route.ts）
  - 文件: `app/api/generate/route.ts`
  - 优先级: P0
  - 预计时间: 3h
  - 功能:
    - 接收生成请求
    - 并发调用集梦 API
    - 错误处理和重试
    - 返回图片 URL

- [ ] 10. 实现图片生成 Hook（useImageGeneration.ts）
  - 文件: `lib/hooks/useImageGeneration.ts`
  - 优先级: P0
  - 预计时间: 2h
  - 功能: 状态管理、API调用封装

- [ ] 11. 实现加载状态和错误处理
  - 文件: `components/generator/LoadingState.tsx`, `components/generator/ErrorDisplay.tsx`
  - 优先级: P0
  - 预计时间: 2h
  - 功能: 骨架屏、进度条、错误提示

- [ ] 12. 实现生成结果展示组件（ImageCard, GeneratedImages）
  - 文件:
    - `components/result/ImageCard.tsx`
    - `components/result/GeneratedImages.tsx`
  - 优先级: P0
  - 预计时间: 3h
  - 功能: 图片卡片、风格标签、下载按钮

- [ ] 13. 实现图片预览弹窗（ImagePreview.tsx）
  - 文件: `components/result/ImagePreview.tsx`
  - 优先级: P1
  - 预计时间: 2h
  - 功能: 全屏预览、缩放、拖拽、键盘快捷键

**Phase 2.1 完成标志**: ✅ 可以成功生成图片并展示

---

## 📦 Phase 2.2：历史与下载模块 (1-2天)

**目标**: 实现历史记录和下载功能

- [ ] 14. 实现 LocalStorage 历史记录存储
  - 文件:
    - `lib/storage/history.ts`
    - `lib/storage/localStorage.ts`
  - 优先级: P0
  - 预计时间: 2h
  - 功能: 存储、读取、删除、最多50条

- [ ] 15. 实现历史记录 UI 组件
  - 文件:
    - `components/history/HistoryPanel.tsx`
    - `components/history/HistoryItem.tsx`
    - `components/history/HistoryEmpty.tsx`
  - 优先级: P0
  - 预计时间: 3h
  - 功能: 展开折叠、删除、重新生成

- [ ] 16. 实现单张图片下载功能
  - 文件: `lib/utils/download.ts`
  - 优先级: P0
  - 预计时间: 1.5h
  - 功能: 下载单张图片、文件命名

- [ ] 17. 创建下载代理 API（app/api/download/route.ts）
  - 文件: `app/api/download/route.ts`
  - 优先级: P0
  - 预计时间: 1h
  - 功能: 解决跨域下载问题

- [ ] 18. 实现批量打包下载（使用 JSZip）
  - 文件: `components/result/BatchDownloadButton.tsx`
  - 优先级: P0
  - 预计时间: 2h
  - 功能: 打包3张图片为ZIP

- [ ] 19. 实现历史记录管理（删除、清空）
  - 文件: 已包含在 HistoryPanel 中
  - 优先级: P0
  - 预计时间: 1h
  - 功能: 单条删除、清空全部、确认弹窗

**Phase 2.2 完成标志**: ✅ 全部功能完成，MVP 可用

---

## 🚀 Phase 3：优化与测试 (2-3天)

**目标**: 优化性能和用户体验

- [ ] 20. 性能优化（懒加载、代码分割）
  - 优先级: P1
  - 预计时间: 3h
  - 内容:
    - 图片懒加载
    - 路由代码分割
    - 组件动态导入

- [ ] 21. 移动端适配测试
  - 优先级: P0
  - 预计时间: 4h
  - 测试设备: iPhone, Android, iPad
  - 内容: 响应式布局、触摸交互

- [ ] 22. 浏览器兼容性测试
  - 优先级: P1
  - 预计时间: 2h
  - 测试浏览器: Chrome, Safari, Firefox, Edge
  - 内容: 功能测试、样式检查

- [ ] 23. 错误边界和异常处理
  - 文件: `app/error.tsx`, `components/ErrorBoundary.tsx`
  - 优先级: P0
  - 预计时间: 2h
  - 功能: 全局错误捕获、友好提示

- [ ] 24. UI 细节优化和动画效果
  - 优先级: P1
  - 预计时间: 3h
  - 内容:
    - 过渡动画
    - 加载动画
    - 悬停效果
    - 微交互

- [ ] 25. 撰写 README 文档
  - 文件: `README.md`
  - 优先级: P1
  - 预计时间: 2h
  - 内容:
    - 项目介绍
    - 安装说明
    - 使用指南
    - API 文档

**Phase 3 完成标志**: ✅ 经过测试的稳定版本

---

## 🌐 Phase 4：部署上线 (1天)

**目标**: 部署到生产环境

- [ ] 26. 配置生产环境变量
  - 优先级: P0
  - 预计时间: 0.5h
  - 内容: Vercel 环境变量配置

- [ ] 27. Vercel 部署配置
  - 优先级: P0
  - 预计时间: 1h
  - 内容:
    - 连接 Git 仓库
    - 配置构建命令
    - 环境变量设置

- [ ] 28. 上线验证测试
  - 优先级: P0
  - 预计时间: 1h
  - 内容:
    - 功能完整性测试
    - 性能测试
    - API 调用测试

**Phase 4 完成标志**: ✅ 线上可访问的产品

---

## 📝 开发日志

### 2025-12-12
- ✅ 初始化项目（Next.js + TypeScript + Tailwind CSS + shadcn/ui）
- ✅ 创建 Git 仓库并完成初始提交
- ✅ 创建 PRD 文档
- ✅ 创建开发任务清单

---

## 🎯 里程碑

| 里程碑 | 预计日期 | 状态 | 关键交付物 |
|--------|---------|------|-----------|
| M1: 项目启动 | Day 1 | ✅ 完成 | 项目框架搭建完成 |
| M2: Alpha版本 | Day 4 | ⬜ 待完成 | 基础生成功能完成 |
| M3: Beta版本 | Day 6 | ⬜ 待完成 | 全部功能完成 |
| M4: RC版本 | Day 8 | ⬜ 待完成 | 测试优化完成 |
| M5: 正式发布 | Day 10 | ⬜ 待完成 | 上线发布 |

---

## 🔗 相关文档

- [PRD 产品需求文档](./PRD.md)
- [项目 README](./README.md)
- [Git 提交记录](./git-log.md)

---

## 📌 注意事项

1. **API Key 安全**:
   - 集梦 API Key 只存储在 `.env.local` 中
   - 不要提交到 Git 仓库
   - 生产环境在 Vercel 中配置

2. **代码规范**:
   - 使用 TypeScript 严格模式
   - 遵循 ESLint 规则
   - 组件使用函数式组件 + Hooks
   - 及时进行 Git 提交

3. **测试要点**:
   - 每个功能完成后立即测试
   - 重点测试错误边界情况
   - 移动端优先测试

4. **性能目标**:
   - 首屏加载 < 2秒
   - API 响应 < 15秒
   - 交互响应 < 100ms

---

**最后更新**: 2025-12-12
**维护者**: Claude Code
