import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, ChartLine, ListChecks } from 'lucide-react';
import { appName } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <span className="font-semibold">🇷🇴 {appName}</span>,
    },
    links: [
      { text: 'Уроки', url: '/docs', icon: <BookOpen />, active: 'nested-url' },
      { text: 'Тесты', url: '/teste', icon: <ListChecks />, active: 'nested-url' },
      { text: 'Прогресс', url: '/progres', icon: <ChartLine /> },
    ],
  };
}
