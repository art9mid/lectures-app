import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import './global.css';
import { Inter } from 'next/font/google';

// latin-ext carries ă â î ș ț, cyrillic the Russian text
const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
});

export const metadata: Metadata = {
  title: { default: 'Limba Română · подготовка к экзамену', template: '%s · Limba Română' },
  description: 'Румынский язык для экзамена на гражданство: уроки, случайные тесты, прогресс.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
