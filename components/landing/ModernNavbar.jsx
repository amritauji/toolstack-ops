"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RegionSelector from '../RegionSelector';

export default function ModernNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      background: isScrolled || isMobileMenuOpen ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: isScrolled || isMobileMenuOpen ? 'blur(12px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(226, 232, 240, 0.5)' : 'none',
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
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>ToolStack</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
            <Link href="#features" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Features</Link>
            <Link href="#demo" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Demo</Link>
            <Link href="/pricing" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</Link>
            <Link href="#testimonials" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Reviews</Link>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden md:flex">
            <RegionSelector />
            <Link href="/login" style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#475569',
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
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <svg style={{ width: '24px', height: '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          padding: '16px'
        }} className="md:hidden">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="#features" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Features</Link>
            <Link href="#demo" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Demo</Link>
            <Link href="/pricing" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <Link href="#testimonials" onClick={closeMobileMenu} style={{ display: 'block', padding: '12px 16px', borderRadius: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Reviews</Link>
            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/login" onClick={closeMobileMenu} style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
              <Link href="/signup" onClick={closeMobileMenu} style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
