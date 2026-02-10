"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, Button, Badge } from "@/components/ui/ModernComponents";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function Navbar({ profile }) {
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.LOGIN);
  };

  const menuItems = profile?.role === 'admin' || profile?.role === 'developer'
    ? [
        { href: ROUTES.DASHBOARD, label: "Dashboard", id: 'dashboard' },
        { href: '/analytics', label: "Admin", id: 'admin' },
      ]
    : [
        { href: ROUTES.DASHBOARD, label: "Dashboard", id: 'dashboard' },
      ];

  const visibleMenuItems = menuItems;

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: scrolled 
          ? '1px solid rgba(0, 0, 0, 0.08)' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: scrolled 
          ? '0 8px 32px rgba(0, 0, 0, 0.08)' 
          : '0 1px 3px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px'
        }}>
          {/* Left Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Logo */}
            <Link href={ROUTES.DASHBOARD} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: '8px 12px',
              borderRadius: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124, 109, 242, 0.08)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(124, 109, 242, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                color: 'white',
                fontWeight: '700'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  animation: 'shimmer 2s infinite'
                }} />
                T
              </div>
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}>
                  ToolStack
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  Workspace
                </div>
              </div>
            </Link>

            {/* Navigation Items */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden lg:flex">
              {visibleMenuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textDecoration: 'none',
                    background: 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(124, 109, 242, 0.1)';
                    e.currentTarget.style.color = '#1a1a1a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>



          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => {/* Add dark mode toggle */}}
              aria-label="Toggle dark mode"
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: '#6b7280'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                style={{
                  position: 'relative',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: notificationsOpen ? 'rgba(124, 109, 242, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: '#6b7280'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '320px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                  zIndex: 50
                }}>
                  <div style={{ padding: '12px 8px', borderBottom: '1px solid #e5e7eb', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Notifications</h3>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
                      No new notifications
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 12px 6px 6px',
                  borderRadius: '12px',
                  border: 'none',
                  background: profileMenuOpen ? 'rgba(124, 109, 242, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: profileMenuOpen ? '0 4px 12px rgba(124, 109, 242, 0.15)' : 'none'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.full_name}
                    fallback={profile?.full_name}
                    size="md"
                    status="online"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '12px',
                    height: '12px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }} />
                </div>
                <div className="hidden sm:block">
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    textAlign: 'left',
                    lineHeight: '1.2'
                  }}>
                    {profile?.full_name || "User"}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {profile?.role}
                  </div>
                </div>
                <svg
                  style={{
                    width: '14px',
                    height: '14px',
                    color: '#9ca3af',
                    transform: profileMenuOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '280px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                  zIndex: 50,
                  animation: 'slideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {/* Profile Header */}
                  <div style={{
                    padding: '16px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <Avatar
                        src={profile?.avatar_url}
                        alt={profile?.full_name}
                        fallback={profile?.full_name}
                        size="lg"
                      />
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          marginBottom: '2px'
                        }}>
                          {profile?.full_name || "User"}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          {profile?.email}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="primary" 
                      size="sm"
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none'
                      }}
                    >
                      {profile?.role}
                    </Badge>
                  </div>
                  
                  {/* Menu Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <Link
                      href={ROUTES.PROFILE}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(124, 109, 242, 0.08)';
                        e.currentTarget.style.color = '#1a1a1a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      <span style={{ fontSize: '16px', marginRight: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z" />
                        </svg>
                      </span>
                      Settings & Privacy
                    </Link>
                    
                    <Link
                      href="#"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(124, 109, 242, 0.08)';
                        e.currentTarget.style.color = '#1a1a1a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      <span style={{ fontSize: '16px', marginRight: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                        </svg>
                      </span>
                      Help & Support
                    </Link>
                    
                    <div style={{
                      height: '1px',
                      background: 'rgba(0, 0, 0, 0.06)',
                      margin: '8px 0'
                    }} />
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ fontSize: '16px', marginRight: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                      </span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            zIndex: 40
          }}>
            {visibleMenuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  textDecoration: 'none',
                  marginBottom: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(124, 109, 242, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </>
  );
}