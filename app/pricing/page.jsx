"use client";

import { useTheme } from '@/contexts/ThemeContext';
import ModernNavbar from '@/components/landing/ModernNavbar';
import ModernPricingPage from '@/components/ModernPricingPage';
import ModernFooter from '@/components/landing/ModernFooter';

export default function Pricing() {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'}`}>
      <ModernNavbar />
      
      <main style={{ paddingTop: '72px' }}>
        <ModernPricingPage />
      </main>
      
      <ModernFooter />
    </div>
  );
}
