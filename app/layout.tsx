import { Inter } from 'next/font/google'
import { AuthProvider } from "./providers";
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import './globals.css'

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
  authors: [{ name: 'ToolStack Ops' }]
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SmoothScrollProvider>
          <AuthProvider>{children}</AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
