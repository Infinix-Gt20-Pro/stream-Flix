import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'STREAMFLIX — Watch TV Shows Online, Watch Movies Online',
  description: 'Stream unlimited blockbuster movies, award-winning series, and originals with an ultra-cinematic experience.',
};

export const viewport: Viewport = {
  themeColor: '#060608',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#060608] text-white min-h-screen selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}
