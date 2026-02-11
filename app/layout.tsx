import { Inter } from 'next/font/google'
import { AuthProvider } from "./providers";
import { UIProvider } from '@/components/UIProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css'
import './mobile.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  metadataBase: new URL('https://nexboard.me'),
  title: {
    default: 'Nexboard - Modern Project Management & Task Tracking Software',
    template: '%s | Nexboard'
  },
  description: 'Nexboard is a powerful project management platform with real-time collaboration, kanban boards, task tracking, and team productivity tools. Free to start, built for modern teams.',
  keywords: [
    'project management',
    'task management',
    'kanban board',
    'team collaboration',
    'productivity software',
    'task tracking',
    'project planning',
    'agile project management',
    'team management software',
    'workflow management',
    'nexboard',
    'free project management tool',
    'real-time collaboration',
    'task organizer',
    'project tracker'
  ],
  authors: [{ name: 'Nexboard', url: 'https://nexboard.me' }],
  creator: 'Nexboard',
  publisher: 'Nexboard',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'q_-7RAKa-UmKFiezvG_v1fZdvUZv8fx5mMg-sTSLmME',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexboard.me',
    title: 'Nexboard - Modern Project Management & Task Tracking',
    description: 'Powerful project management with real-time collaboration, kanban boards, and task tracking. Free to start.',
    siteName: 'Nexboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nexboard - Project Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexboard - Modern Project Management',
    description: 'Powerful project management with real-time collaboration and task tracking.',
    images: ['/og-image.png'],
    creator: '@nexboard',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://nexboard.me',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <UIProvider>
            <AuthProvider>{children}</AuthProvider>
          </UIProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
