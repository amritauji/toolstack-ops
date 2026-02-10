"use client";

import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

export const fadeInUp = (isVisible, delay = 0) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
});

export const fadeIn = (isVisible, delay = 0) => ({
  opacity: isVisible ? 1 : 0,
  transition: `opacity 0.8s ease ${delay}s`
});

export const scaleIn = (isVisible, delay = 0) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'scale(1)' : 'scale(0.95)',
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
});

export const slideInLeft = (isVisible, delay = 0) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
});

export const slideInRight = (isVisible, delay = 0) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
});
