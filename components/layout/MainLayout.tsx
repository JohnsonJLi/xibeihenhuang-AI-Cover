// components/layout/MainLayout.tsx - 主布局组件

import { Header } from "./Header";
import { Footer } from "./Footer";
import { Container } from "./Container";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
