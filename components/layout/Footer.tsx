// components/layout/Footer.tsx - 页面底部组件

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container flex h-16 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {currentYear} 西北很荒 AI封面生成器. 使用集梦API提供支持.
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href="#"
            className="hover:text-foreground transition-colors"
          >
            关于
          </a>
          <a
            href="#"
            className="hover:text-foreground transition-colors"
          >
            帮助
          </a>
        </div>
      </div>
    </footer>
  );
}
