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
  title: {
    default: 'ToolStack Ops - Modern Project Management',
    template: '%s | ToolStack Ops'
  },
  description: 'Advanced project management platform with real-time collaboration, built for modern teams.',
  keywords: ['project management', 'collaboration', 'productivity', 'teams'],
  authors: [{ name: 'ToolStack Ops' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  }
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
