// Suppress known harmless errors in development
if (typeof window === 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Suppress refresh token errors (harmless in server components)
    if (message.includes('Invalid Refresh Token') || 
        message.includes('Refresh Token Not Found') ||
        message.includes('refresh_token_not_found')) {
      return;
    }
    
    originalConsoleError.apply(console, args);
  };
}
