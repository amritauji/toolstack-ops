// Simplified memory cleanup for client-side only
export function forceMemoryCleanup() {
  if (typeof window !== 'undefined' && window.gc) {
    window.gc();
  }
}