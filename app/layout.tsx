import type { Metadata } from 'next';
import './globals.css';
import 'blobatar/motion.css';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider, FilterProvider } from '@/lib/context';
import { AppShellClient } from '@/components/shell/AppShellClient';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  metadataBase: new URL('https://aicte-scrutiny.vercel.app'),
  title: {
    default: 'AICTE Regulatory Scrutiny & Forensic Document Intelligence Workstation (PS 26261)',
    template: '%s | AICTE Regulatory Scrutiny',
  },
  description:
    'Evidence-Linked AI Decision-Support, Multi-Spectral Document Forensics (TruFor & ELA), CAD Blueprint Geometry, Ghost Faculty Deduplication, and National DPI Authority Bridge for All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India.',
  keywords: [
    'AICTE',
    'Smart India Hackathon',
    'SIH 2026',
    'PS 26261',
    'Regulatory Scrutiny',
    'Document Forensics',
    'TruFor',
    'Error Level Analysis',
    'CAD Blueprint',
    'Shoelace Formula',
    'Ghost Faculty',
    'ArcFace',
    'EPFO ECR',
    'DigiLocker',
    'APH 2024-2027',
  ],
  authors: [{ name: 'Regulation Bureau, AICTE' }],
  creator: 'Regulation Bureau, AICTE',
  publisher: 'Ministry of Education, Government of India',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aicte-scrutiny.vercel.app',
    siteName: 'AICTE Regulatory Scrutiny Workstation',
    title: 'AICTE Regulatory Scrutiny & Forensic Document Intelligence (PS 26261)',
    description:
      'Automated institutional compliance under APH 2024–2027: Multi-spectral document forensics (TruFor & ELA), CAD blueprint CV, ghost faculty deduplication, and national DPI authority verification.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AICTE Regulatory Scrutiny Workstation Preview Card',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AICTE Regulatory Scrutiny & Forensic Document Intelligence (PS 26261)',
    description:
      'Automated institutional compliance under APH 2024–2027: Multi-spectral document forensics, CAD blueprint CV, ghost faculty deduplication, and national DPI authority verification.',
    images: ['/og-image.png'],
    creator: '@AICTE_INDIA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#060A12" />
        {/* Google Fonts: Plus Jakarta Sans, Instrument Serif, JetBrains Mono, Noto Sans Devanagari, Khand */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&family=Khand:wght@500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-[var(--text-primary)] antialiased selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-100">
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
