"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, Button, Badge } from "@/components/ui/ModernComponents";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function Navbar({ profile }) {
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3); // Mock notifications

  // Icon path helper
  const getIconPath = (iconName) => {
    const icons = {
      home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
      briefcase: "M20 6h-2.5l-1.1-1.4c-.3-.4-.7-.6-1.2-.6H8.8c-.5 0-.9.2-1.2.6L6.5 6H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z",
      users: "M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm5 4c-.83 0-1.5.67-1.5 1.5v9c0 .83.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5H9z",
      inbox: "M19 3H4.99c-1.11 0-1.99.89-1.99 2L3 19c0 1.1.88 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H5V5h14v10z"
    };
    return icons[iconName] || icons.home;
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.LOGIN);
  };

  const menuItems = [
    { href: ROUTES.DASHBOARD, icon: "home", label: "Home", roles: ['user', 'admin', 'developer'], isActive: true, id: 'home' },
    { href: ROUTES.DASHBOARD, icon: "briefcase", label: "My Work", roles: ['user', 'admin', 'developer'], id: 'mywork' },
    { href: ROUTES.ADMIN, icon: "users", label: "Teams", roles: ['admin'], id: 'teams' },
    { href: ROUTES.DEVELOPER, icon: "inbox", label: "Inbox", roles: ['developer'], id: 'inbox' },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(profile?.role)
  );

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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: item.isActive ? '#1a1a1a' : '#6b7280',
                    textDecoration: 'none',
                    background: item.isActive ? 'rgba(124, 109, 242, 0.1)' : 'transparent',
                    border: item.isActive ? '1px solid rgba(124, 109, 242, 0.2)' : '1px solid transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!item.isActive) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.color = '#1a1a1a';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span style={{ fontSize: '14px', marginRight: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d={getIconPath(item.icon)} />
                    </svg>
                  </span>
                  {item.label}
                  {item.isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '2px',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      borderRadius: '1px'
                    }} />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Center - Search */}
          <div style={{
            flex: 1,
            maxWidth: '400px',
            margin: '0 32px',
            position: 'relative'
          }} className="hidden md:block">
            <div style={{
              position: 'relative',
              background: searchFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.04)',
              borderRadius: '12px',
              border: searchFocused ? '2px solid #667eea' : '2px solid transparent',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: searchFocused ? '0 8px 32px rgba(102, 126, 234, 0.15)' : 'none'
            }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: searchFocused ? '#667eea' : '#9ca3af',
                transition: 'color 0.2s ease',
                fontSize: '16px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '12px'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden lg:flex">
              <button style={{
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(124, 109, 242, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </button>
              
              <button style={{
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(124, 109, 242, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                {notifications > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    borderRadius: '50%',
                    border: '2px solid white',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                background: hamburgerMenuOpen ? 'rgba(124, 109, 242, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '18px'
              }}
              className="lg:hidden"
            >
              {hamburgerMenuOpen ? '✕' : '☰'}
            </button>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
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
        {hamburgerMenuOpen && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px) saturate(180%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '20px',
              animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="lg:hidden"
          >
            {/* Mobile Search */}
            <div style={{
              marginBottom: '20px',
              background: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#9ca3af' }}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#1a1a1a'
                }}
              />
            </div>
            
            {/* Mobile Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {visibleMenuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: item.isActive ? '#1a1a1a' : '#6b7280',
                    textDecoration: 'none',
                    background: item.isActive ? 'rgba(124, 109, 242, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                    marginBottom: '4px'
                  }}
                  onClick={() => setHamburgerMenuOpen(false)}
                  onMouseEnter={(e) => {
                    if (!item.isActive) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px', marginRight: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={getIconPath(item.icon)} />
                    </svg>
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
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