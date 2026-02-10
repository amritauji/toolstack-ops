"use client";

import { useTheme } from '@/contexts/ThemeContext';
import ModernNavbar from '@/components/landing/ModernNavbar';
import ModernHero from '@/components/landing/ModernHero';
import ProblemStatement from '@/components/landing/ProblemStatement';
import ThreePillars from '@/components/landing/ThreePillars';
import AIFeaturesSection from '@/components/landing/AIFeaturesSection';
import ProductDemoSection from '@/components/landing/ProductDemoSection';
import ModernTestimonials from '@/components/landing/ModernTestimonials';
import ModernPricingPage from '@/components/ModernPricingPage';
import ModernFooter from '@/components/landing/ModernFooter';

export default function LandingPage() {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'} overflow-hidden relative`} data-barba-namespace="home">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`} />
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10' : 'bg-gradient-to-r from-indigo-400/8 to-purple-400/8'} rounded-full blur-3xl`} style={{ willChange: 'auto' }} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-gradient-to-r from-emerald-600/10 to-teal-600/10' : 'bg-gradient-to-r from-emerald-400/8 to-teal-400/8'} rounded-full blur-3xl`} style={{ willChange: 'auto', animationDelay: '2s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${isDark ? 'bg-gradient-to-r from-amber-600/8 to-orange-600/8' : 'bg-gradient-to-r from-amber-400/4 to-orange-400/4'} rounded-full blur-3xl`} style={{ willChange: 'auto', animationDelay: '4s' }} />
      </div>
      
      <ModernNavbar />
      
      <main className="relative z-10">
        <ModernHero />
        <div id="features">
          <ProblemStatement />
        </div>
        <ThreePillars />
        
        {/* Transition */}
        <div style={{ textAlign: 'center', padding: '40px 20px', background: isDark ? '#1e293b' : '#f9fafb' }}>
          <p style={{ fontSize: '20px', color: isDark ? '#cbd5e1' : '#374151', fontWeight: '600' }}>
            But here's what makes us different →
          </p>
        </div>
        
        <AIFeaturesSection />
        <div id="demo">
          <ProductDemoSection />
        </div>
        <div id="testimonials">
          <ModernTestimonials />
        </div>
        
        {/* Transition */}
        <div style={{ textAlign: 'center', padding: '40px 20px', background: isDark ? '#0f172a' : 'white' }}>
          <p style={{ fontSize: '20px', color: isDark ? '#cbd5e1' : '#374151', fontWeight: '600' }}>
            Ready to ship faster? Choose your plan →
          </p>
        </div>
        
        <div id="pricing">
          <ModernPricingPage />
        </div>
      </main>
      
      <ModernFooter />

      <style jsx global>{`
        * {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        @keyframes fadeInUp {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}