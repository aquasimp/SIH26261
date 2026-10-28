import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
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
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0B0F17" />
        {/* Google Fonts: Inter (matching Image 2), JetBrains Mono, Noto Sans Devanagari */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen text-[var(--text-primary)] antialiased selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-100 font-sans`}>
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
