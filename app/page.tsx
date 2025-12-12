export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h1 className="text-xl font-bold">西北很荒 AI封面生成器</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                欢迎使用 AI 封面生成器
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                使用集梦 API 生成不同风格的 AI 封面图片。支持小红书、商业海报、极简风格等 8 种风格，
                让您的内容更具吸引力。
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
              <div className="p-6 border rounded-lg space-y-2">
                <div className="text-3xl">📱</div>
                <h3 className="font-semibold">小红书风格</h3>
                <p className="text-sm text-muted-foreground">
                  清新温暖，适合社交分享
                </p>
              </div>
              <div className="p-6 border rounded-lg space-y-2">
                <div className="text-3xl">💼</div>
                <h3 className="font-semibold">商业海报</h3>
                <p className="text-sm text-muted-foreground">
                  专业高端，适合品牌宣传
                </p>
              </div>
              <div className="p-6 border rounded-lg space-y-2">
                <div className="text-3xl">⚪</div>
                <h3 className="font-semibold">简约扁平</h3>
                <p className="text-sm text-muted-foreground">
                  现代简洁，适合科技产品
                </p>
              </div>
              <div className="p-6 border rounded-lg space-y-2">
                <div className="text-3xl">🎨</div>
                <h3 className="font-semibold">更多风格</h3>
                <p className="text-sm text-muted-foreground">
                  手绘、赛博、国潮等多种选择
                </p>
              </div>
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p>Phase 1 基础搭建已完成，功能开发中...</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 西北很荒 AI封面生成器. 使用集梦API提供支持.
          </p>
        </div>
      </footer>
    </div>
  );
}
