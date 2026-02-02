"use client";

import { useState, useRef, useEffect } from 'react';

// Modern Button Component with Advanced States
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700',
    secondary: 'bg-white text-neutral-700 border border-neutral-200 shadow-sm hover:bg-neutral-50 hover:shadow-md',
    ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
    danger: 'bg-error-500 text-white shadow-md hover:bg-error-600 hover:shadow-lg'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${isPressed ? 'scale-95' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {loading && (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {leftIcon && !loading && leftIcon}
      {children}
      {rightIcon && !loading && rightIcon}
    </button>
  );
}

// Advanced Card Component with Hover Effects
export function Card({ 
  children, 
  hover = true, 
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`
        bg-white rounded-xl border border-neutral-200 shadow-sm
        transition-all duration-300 ease-out
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 hover:border-neutral-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// Modern Input with Floating Labels
export function Input({ 
  label, 
  error, 
  leftIcon, 
  rightIcon, 
  className = '',
  ...props 
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            w-full px-4 py-3 text-base bg-white border rounded-lg
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            placeholder-transparent
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-error-500 focus:ring-error-500' : 'border-neutral-200'}
          `}
          placeholder={label}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          {...props}
        />
        
        {label && (
          <label className={`
            absolute left-4 transition-all duration-200 ease-out pointer-events-none
            ${focused || hasValue || props.value
              ? '-top-2 text-xs bg-white px-1 text-primary-600'
              : 'top-1/2 -translate-y-1/2 text-neutral-500'
            }
            ${leftIcon && !focused && !hasValue ? 'left-10' : ''}
          `}>
            {label}
          </label>
        )}
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
}

// Advanced Badge Component
export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  dot = false,
  className = '' 
}) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`
      inline-flex items-center gap-1 font-medium rounded-full
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {dot && (
        <div className={`w-1.5 h-1.5 rounded-full ${
          variant === 'primary' ? 'bg-primary-500' :
          variant === 'success' ? 'bg-success-500' :
          variant === 'warning' ? 'bg-warning-500' :
          variant === 'error' ? 'bg-error-500' :
          'bg-neutral-500'
        }`} />
      )}
      {children}
    </span>
  );
}

// Modern Avatar with Status Indicator
export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  status,
  fallback,
  className = '' 
}) {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-success-500',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
    offline: 'bg-neutral-400'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`
        ${sizes[size]} rounded-full overflow-hidden bg-neutral-100
        flex items-center justify-center font-medium text-neutral-600
      `}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{fallback || alt?.charAt(0)?.toUpperCase() || '?'}</span>
        )}
      </div>
      
      {status && (
        <div className={`
          absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
          ${statusColors[status]}
        `} />
      )}
    </div>
  );
}

// Modern Progress Bar
export function Progress({ 
  value = 0, 
  max = 100, 
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '' 
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const variants = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-neutral-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${variants[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Modern Tooltip
export function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`
          absolute z-50 px-2 py-1 text-xs text-white bg-neutral-900 rounded-md
          whitespace-nowrap pointer-events-none
          animate-in fade-in-0 zoom-in-95 duration-200
          ${positions[position]}
        `}>
          {content}
        </div>
      )}
    </div>
  );
}