import ModernNavbar from '@/components/landing/ModernNavbar';
import ModernHero from '@/components/landing/ModernHero';
import ModernFeatures from '@/components/landing/ModernFeatures';
import ProductDemoSection from '@/components/landing/ProductDemoSection';
import ModernTestimonials from '@/components/landing/ModernTestimonials';
import ModernPricingPage from '@/components/ModernPricingPage';
import ModernFooter from '@/components/landing/ModernFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative" data-barba-namespace="home">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/8 to-purple-400/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-400/4 to-orange-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <ModernNavbar />
      
      <main className="relative z-10">
        <ModernHero />
        <ModernFeatures />
        <ProductDemoSection />
        <ModernTestimonials />
        <ModernPricingPage />
      </main>
      
      <ModernFooter />
    </div>
  );
}