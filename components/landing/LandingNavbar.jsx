"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      transition: 'all 0.3s ease',
      background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#4f46e5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
            <span style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827'
            }}>ToolStack Ops</span>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              <Link href="#features" style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}>Features</Link>
              <Link href="#pricing" style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}>Pricing</Link>
              <Link href="#use-cases" style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}>Use Cases</Link>
              <Link href="#reviews" style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}>Reviews</Link>
            </div>
          )}

          {/* CTA Buttons */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <Link href="/login" style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}>Login</Link>
              <Link href="/signup" style={{
                background: '#4f46e5',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background 0.2s ease'
              }}>Get Started</Link>
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <span style={{
                  background: '#111827',
                  display: 'block',
                  height: '2px',
                  width: '24px',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  transform: isMenuOpen ? 'rotate(45deg) translateY(4px)' : 'translateY(-2px)'
                }}></span>
                <span style={{
                  background: '#111827',
                  display: 'block',
                  height: '2px',
                  width: '24px',
                  borderRadius: '2px',
                  margin: '2px 0',
                  transition: 'all 0.3s ease',
                  opacity: isMenuOpen ? 0 : 1
                }}></span>
                <span style={{
                  background: '#111827',
                  display: 'block',
                  height: '2px',
                  width: '24px',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  transform: isMenuOpen ? 'rotate(-45deg) translateY(-4px)' : 'translateY(2px)'
                }}></span>
              </div>
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && isMobile && (
          <div style={{
            background: 'white',
            borderTop: '1px solid #e5e7eb',
            padding: '8px 0 12px 0'
          }}>
            <div style={{
              padding: '0 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <Link href="#features" style={{
                display: 'block',
                padding: '8px 12px',
                color: '#6b7280',
                textDecoration: 'none'
              }}>Features</Link>
              <Link href="#pricing" style={{
                display: 'block',
                padding: '8px 12px',
                color: '#6b7280',
                textDecoration: 'none'
              }}>Pricing</Link>
              <Link href="/login" style={{
                display: 'block',
                padding: '8px 12px',
                color: '#6b7280',
                textDecoration: 'none'
              }}>Login</Link>
              <Link href="/signup" style={{
                display: 'block',
                padding: '8px 12px',
                background: '#4f46e5',
                color: 'white',
                borderRadius: '8px',
                margin: '0 12px',
                textAlign: 'center',
                textDecoration: 'none'
              }}>Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}