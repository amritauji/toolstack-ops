import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = typeof window === 'undefined' 
  ? new JSDOM('').window 
  : window;

const purify = DOMPurify(window);

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return purify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function sanitizeObject(obj) {
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}
