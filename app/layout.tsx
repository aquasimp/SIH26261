import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider, FilterProvider } from '@/lib/context';
import { AppShellClient } from '@/components/shell/AppShellClient';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'AICTE Regulatory Scrutiny & Forensic Intelligence Workstation (PS 26261)',
  description:
    'Evidence-Linked AI Decision-Support, Multi-Spectral Document Forensics, Blueprint CV, and National DPI Authority Bridge for All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts: Plus Jakarta Sans, Instrument Serif, JetBrains Mono, Noto Sans Devanagari, Khand */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&family=Khand:wght@500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-slate-900 dark:text-slate-100 bg-[#F4F7FB] dark:bg-[#0B132B] antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>
            <FilterProvider>
              <AppShellClient>{children}</AppShellClient>
              <Toaster position="top-right" richColors closeButton />
            </FilterProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
