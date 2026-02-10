"use client";

import { useState, useEffect } from "react";

export default function OnboardingTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      target: '[data-create-task]',
      title: 'Create Your First Task',
      description: 'Click here to create a new task. You can also use Ctrl+K for quick access.',
      position: 'bottom'
    },
    {
      target: '[data-search-input]',
      title: 'Search Tasks',
      description: 'Quickly find tasks by typing here. Press / to focus.',
      position: 'bottom'
    },
    {
      target: '[data-view-switcher]',
      title: 'Switch Views',
      description: 'Toggle between Board, Table, and Calendar views. Use 1, 2, 3 keys.',
      position: 'bottom'
    },
    {
      target: '[data-stats]',
      title: 'Track Progress',
      description: 'Monitor your task statistics and completion rate here.',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('onboarding_complete');
    if (!hasSeenTour) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const targetElement = document.querySelector(step.target);
  const rect = targetElement?.getBoundingClientRect();

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9998
      }} />

      {/* Spotlight */}
      {rect && (
        <div style={{
          position: 'fixed',
          left: `${rect.left - 8}px`,
          top: `${rect.top - 8}px`,
          width: `${rect.width + 16}px`,
          height: `${rect.height + 16}px`,
          border: '3px solid #7c6df2',
          borderRadius: '12px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          pointerEvents: 'none'
        }} />
      )}

      {/* Tooltip */}
      {rect && (
        <div style={{
          position: 'fixed',
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.bottom + 20}px`,
          transform: 'translateX(-50%)',
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          zIndex: 10000,
          maxWidth: '400px',
          width: '90vw'
        }}>
          {/* Progress */}
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '16px'
          }}>
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: '3px',
                  background: index <= currentStep ? '#7c6df2' : '#e2e8f0',
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>

          {/* Content */}
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            {step.title}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            {step.description}
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              Skip tour
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>
                {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={handleNext}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
