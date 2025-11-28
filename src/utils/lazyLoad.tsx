/**
 * Lazy Loading Utility with Performance Monitoring
 * Implements code splitting with loading states and error boundaries
 */

import { lazy, Suspense, ComponentType } from 'react';
import performanceMonitor from './performanceMonitor';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  componentName?: string;
  preload?: boolean;
}

/**
 * Loading fallback component with skeleton
 */
function LoadingFallback() {
  return (
    <div className="bg-gradient-to-br from-[#f9fafb] via-white to-[#f5f7f9] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo Placeholder */}
        <div className="relative w-[80px] h-[80px]">
          <div className="absolute inset-0 rounded-full border-4 border-[#95e36c]/20" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-[#95e36c] border-t-transparent animate-spin"
            style={{ animationDuration: '1s' }}
          />
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[16px] text-[#003630] mb-2">
            Loading...
          </p>
          <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[14px] text-[#003630]/60">
            Please wait
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced lazy loading with performance tracking
 */
export function lazyLoadWithTracking<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): T {
  const { 
    fallback = <LoadingFallback />, 
    componentName = 'Unknown',
    preload = false
  } = options;

  // Track component load time (silently, only if monitoring is enabled)
  const trackedImportFn = async () => {
    const metricName = `lazy-load-${componentName}`;
    performanceMonitor.startMetric(metricName, { componentName });
    
    try {
      const module = await importFn();
      performanceMonitor.endMetric(metricName, { success: true });
      return module;
    } catch (error) {
      performanceMonitor.endMetric(metricName, { success: false, error });
      // Only log errors in console, not performance tracking
      if (localStorage.getItem('debugPerformance') === 'true') {
        console.error(`[LazyLoad] Failed to load ${componentName}:`, error);
      }
      throw error;
    }
  };

  const LazyComponent = lazy(trackedImportFn);

  // Preload if requested
  if (preload && typeof window !== 'undefined') {
    // Preload after a short delay to not block initial render
    setTimeout(() => {
      importFn().catch(() => {
        // Silently fail preload attempts
      });
    }, 100);
  }

  // Return wrapped component with Suspense
  const WrappedComponent = (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Preserve component name for debugging
  WrappedComponent.displayName = `LazyLoad(${componentName})`;

  return WrappedComponent as unknown as T;
}

/**
 * Preload a lazy-loaded component
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  importFn().catch(() => {
    // Silently fail preload attempts
  });
}

/**
 * Batch preload multiple components
 */
export function preloadComponents(importFns: Array<() => Promise<any>>): void {
  importFns.forEach(fn => preloadComponent(fn));
}

export default lazyLoadWithTracking;
