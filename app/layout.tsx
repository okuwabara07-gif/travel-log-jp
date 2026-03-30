import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '旅行LOG | K-Beauty Portal',
  description: '旅行・ホテル・旅行グッズの最新比較ランキング',
  openGraph: { title: '旅行LOG', description: '旅行・ホテル・旅行グッズの最新比較ランキング', siteName: 'K-Beauty Portal', type: 'website' },
  twitter: { card: 'summary_large_image', title: '旅行LOG', description: '旅行・ホテル・旅行グッズの最新比較ランキング', site: '@beauty_note_j' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;700&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
