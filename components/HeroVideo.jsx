"use client";

import { useState } from 'react';

export default function HeroVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{
      position: 'relative',
      maxWidth: '600px',
      margin: '0 auto 40px',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
    }}>
      {/* Video Container */}
      <div style={{
        position: 'relative',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        height: 0,
        overflow: 'hidden'
      }}>
        {!isPlaying ? (
          // Video Thumbnail with Play Button
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }} onClick={() => setIsPlaying(true)}>
            {/* Avatar Preview */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#4f46e5'
            }}>
              👨‍💻
            </div>
            
            {/* Play Button */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            
            {/* Video Title Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              color: 'white',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                Meet ToolStack Ops
              </h3>
              <p style={{
                fontSize: '14px',
                opacity: 0.9
              }}>
                See how we're revolutionizing project management • 30 seconds
              </p>
            </div>
          </div>
        ) : (
          // Actual Video (Replace with your avatar video URL)
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            src="https://your-avatar-video-url.mp4" // Replace with your video URL
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}
      </div>
      
      {/* Video Stats */}
      <div style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#64748b'
      }}>
        <span>🎯 30-second product overview</span>
        <span>👥 10,000+ views</span>
      </div>
    </div>
  );
}