"use client";

import { useState, useEffect } from 'react';
import { REGIONS, detectUserRegion } from '@/lib/pricing';

export default function RegionSelector() {
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage first
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion) {
      setSelectedRegion(savedRegion);
    } else {
      // Auto-detect region
      detectUserRegion().then(region => {
        setSelectedRegion(region);
        localStorage.setItem('selectedRegion', region);
      });
    }
  }, []);

  const handleRegionChange = (regionCode) => {
    setSelectedRegion(regionCode);
    localStorage.setItem('selectedRegion', regionCode);
    setIsOpen(false);
    
    // Trigger custom event for other components to update
    window.dispatchEvent(new CustomEvent('regionChanged', { detail: regionCode }));
  };

  const currentRegion = REGIONS[selectedRegion];

  return (
    <div style={styles.container}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.button}
        aria-label="Select region"
      >
        <span style={styles.flag}>{currentRegion.flag}</span>
        <span style={styles.currency}>{currentRegion.currency}</span>
        <svg
          style={{ ...styles.icon, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div style={styles.overlay} onClick={() => setIsOpen(false)} />
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <span style={styles.dropdownTitle}>Select Region</span>
            </div>
            <div style={styles.regionList}>
              {Object.values(REGIONS).map((region) => (
                <button
                  key={region.code}
                  onClick={() => handleRegionChange(region.code)}
                  style={{
                    ...styles.regionItem,
                    ...(selectedRegion === region.code ? styles.regionItemActive : {})
                  }}
                >
                  <span style={styles.regionFlag}>{region.flag}</span>
                  <div style={styles.regionInfo}>
                    <span style={styles.regionName}>{region.name}</span>
                    <span style={styles.regionCurrency}>
                      {region.currency} ({region.symbol})
                    </span>
                  </div>
                  {selectedRegion === region.code && (
                    <svg
                      style={styles.checkIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M13 4L6 11L3 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    transition: 'all 0.2s',
  },
  flag: {
    fontSize: 18,
  },
  currency: {
    fontSize: 14,
    fontWeight: 500,
  },
  icon: {
    transition: 'transform 0.2s',
    color: '#6b7280',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 280,
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    zIndex: 1000,
    maxHeight: 400,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  regionList: {
    maxHeight: 340,
    overflowY: 'auto',
  },
  regionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textAlign: 'left',
  },
  regionItemActive: {
    background: '#eff6ff',
  },
  regionFlag: {
    fontSize: 24,
  },
  regionInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  regionName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#111827',
  },
  regionCurrency: {
    fontSize: 12,
    color: '#6b7280',
  },
  checkIcon: {
    color: '#3b82f6',
  },
};
