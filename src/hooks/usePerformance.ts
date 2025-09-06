import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  isSlowDevice: boolean;
  prefersReducedMotion: boolean;
  connectionType: string;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isSlowDevice: false,
    prefersReducedMotion: false,
    connectionType: 'unknown'
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if device is slow based on hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    const isSlowDevice = cores < 4;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check connection type
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const connectionType = connection?.effectiveType || 'unknown';

    setMetrics({
      isSlowDevice,
      prefersReducedMotion,
      connectionType
    });
  }, []);

  return metrics;
}
