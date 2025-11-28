/**
 * Performance Tracking Hooks
 * React hooks for tracking component render performance
 */

import { useEffect, useRef } from 'react';
import performanceMonitor from '../utils/performanceMonitor';

/**
 * Hook to track component render time
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   useRenderTimeTracking('MyComponent');
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useRenderTimeTracking(componentName: string) {
  const renderStartRef = useRef<number>(0);

  // Track render start
  renderStartRef.current = performance.now();

  useEffect(() => {
    // Track render complete
    const renderTime = performance.now() - renderStartRef.current;
    performanceMonitor.trackComponentRender(componentName, renderTime);
  });
}

/**
 * Hook to track mount time (initial render only)
 */
export function useMountTimeTracking(componentName: string) {
  const mountStartRef = useRef<number>(performance.now());
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!hasTrackedRef.current) {
      const mountTime = performance.now() - mountStartRef.current;
      performanceMonitor.trackComponentRender(`${componentName}-mount`, mountTime);
      hasTrackedRef.current = true;
    }
  }, [componentName]);
}

/**
 * Hook to track async operations
 * Usage:
 * ```tsx
 * const trackOperation = useOperationTracking('fetchUserData');
 * 
 * const fetchData = async () => {
 *   const endTracking = trackOperation();
 *   await api.fetchUser();
 *   endTracking();
 * };
 * ```
 */
export function useOperationTracking(operationName: string) {
  return () => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      performanceMonitor.trackComponentRender(operationName, duration);
    };
  };
}

/**
 * Hook to track component lifecycle events
 */
export function useLifecycleTracking(componentName: string) {
  const mountTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    // Mount
    const mountDuration = performance.now() - mountTimeRef.current;
    console.log(`[Lifecycle] ${componentName} mounted in ${mountDuration.toFixed(2)}ms`);

    // Unmount
    return () => {
      console.log(`[Lifecycle] ${componentName} unmounted`);
    };
  }, [componentName]);
}

/**
 * Hook to detect slow renders
 * Logs a warning if render time exceeds threshold
 */
export function useSlowRenderDetection(componentName: string, thresholdMs: number = 16.67) {
  const renderStartRef = useRef<number>(0);
  renderStartRef.current = performance.now();

  useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current;
    if (renderTime > thresholdMs) {
      console.warn(
        `[Performance] ⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (threshold: ${thresholdMs}ms)`
      );
    }
  });
}

export default useRenderTimeTracking;
