export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim();
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
