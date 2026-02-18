"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RegionSelector from '../RegionSelector';
import { useTheme } from '@/contexts/ThemeContext';

export default function ModernNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'all 0.3s ease',
      background: isScrolled || isMobileMenuOpen 
        ? (isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)') 
        : 'transparent',
      backdropFilter: isScrolled || isMobileMenuOpen ? 'blur(12px)' : 'none',
      borderBottom: isScrolled ? (isDark ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid rgba(226, 232, 240, 0.5)') : 'none',
      boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} onClick={closeMobileMenu}>
            <span style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: isDark ? '#f8fafc' : '#0f172a'
            }}>
              Nexboard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="/#features" style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
            <a href="/#demo" style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Demo</a>
            <Link href="/pricing" style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</Link>
            <a href="/#testimonials" style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Reviews</a>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '12px' }}>
            <RegionSelector />
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#475569">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            
            <Link href="/login" style={{
              fontSize: '14px',
              fontWeight: 500,
              color: isDark ? '#cbd5e1' : '#475569',
              textDecoration: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}>Sign In</Link>
            <Link href="/signup" style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.2s'
            }}>Get Started</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            style={{
              display: isMobile ? 'block' : 'none',
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            aria-label="Toggle menu"
          >
            <svg style={{ width: '24px', height: '24px', color: isDark ? '#cbd5e1' : '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{
          background: isDark ? '#0f172a' : 'white',
          borderTop: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          padding: '16px'
        }} className="md:hidden">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/#features" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', fontWeight: 500 }}>Features</a>
            <a href="/#demo" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', fontWeight: 500 }}>Demo</a>
            <Link href="/pricing" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <a href="/#testimonials" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: isDark ? '#cbd5e1' : '#475569', textDecoration: 'none', fontWeight: 500 }}>Reviews</a>
            <div style={{ borderTop: isDark ? '1px solid #334155' : '1px solid #e2e8f0', marginTop: '8px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/login" onClick={closeMobileMenu} style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px', color: isDark ? '#cbd5e1' : '#374151', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
              <Link href="/signup" onClick={closeMobileMenu} style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
