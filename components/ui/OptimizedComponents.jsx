import { memo } from 'react';
import { motion } from 'framer-motion';

// Production-ready optimized button component
export const OptimizedButton = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled || loading ? 0.6 : 1
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: 'white',
      boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)'
    },
    secondary: {
      background: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' }
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -1, scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
      }}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <svg 
          style={{ width: '16px', height: '16px', marginRight: '8px' }}
          className="animate-spin" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            opacity="0.25"
          />
          <path 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
});

OptimizedButton.displayName = 'OptimizedButton';

// Production-ready card component
export const OptimizedCard = memo(({ 
  children, 
  hover = true, 
  className = '',
  onClick,
  ...props 
}) => {
  const cardStyles = {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)' } : {}}
      style={cardStyles}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';