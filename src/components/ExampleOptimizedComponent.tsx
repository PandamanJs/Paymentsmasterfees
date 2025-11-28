/**
 * Example Optimized Component
 * Demonstrates best practices for performance optimization
 * 
 * This file serves as a reference for implementing:
 * - TypeScript strict mode compliance
 * - Performance tracking
 * - Lazy loading
 * - Memoization
 */

import { memo, useMemo, useCallback } from 'react';
import { useRenderTimeTracking, useSlowRenderDetection } from '../hooks/usePerformanceTracking';
import performanceMonitor from '../utils/performanceMonitor';

// ==========================================
// TypeScript Strict Mode Examples
// ==========================================

/**
 * Properly typed component props
 */
interface ExampleComponentProps {
  title: string;
  description?: string; // Optional property
  items: string[];
  onItemClick: (item: string) => void;
  metadata?: {
    author: string;
    date: Date;
  } | null; // Explicitly allow null
}

/**
 * Example Optimized Component
 * 
 * Features:
 * - Strict TypeScript types
 * - Performance tracking
 * - Memoization for expensive calculations
 * - Slow render detection
 */
const ExampleOptimizedComponent = memo(({
  title,
  description = 'Default description', // Default value for optional prop
  items,
  onItemClick,
  metadata = null
}: ExampleComponentProps) => {
  
  // ==========================================
  // Performance Tracking
  // ==========================================
  
  // Track render time
  useRenderTimeTracking('ExampleOptimizedComponent');
  
  // Detect slow renders (warn if > 16.67ms)
  useSlowRenderDetection('ExampleOptimizedComponent', 16.67);
  
  // ==========================================
  // Memoization for Expensive Calculations
  // ==========================================
  
  /**
   * Memoize expensive calculations
   * Only recalculates when items change
   */
  const processedItems = useMemo(() => {
    console.log('[Performance] Processing items...');
    
    // Simulate expensive calculation
    return items.map(item => ({
      original: item,
      uppercase: item.toUpperCase(),
      length: item.length
    }));
  }, [items]);
  
  /**
   * Calculate statistics (memoized)
   */
  const statistics = useMemo(() => {
    return {
      totalItems: items.length,
      averageLength: items.reduce((sum, item) => sum + item.length, 0) / items.length,
      longestItem: items.reduce((longest, item) => 
        item.length > longest.length ? item : longest, 
        ''
      )
    };
  }, [items]);
  
  // ==========================================
  // Optimized Event Handlers
  // ==========================================
  
  /**
   * Memoized callback to prevent unnecessary re-renders
   * of child components
   */
  const handleItemClick = useCallback((item: string) => {
    // Track user interaction
    performanceMonitor.startMetric('item-click', { item });
    
    try {
      onItemClick(item);
      performanceMonitor.endMetric('item-click', { success: true });
    } catch (error) {
      performanceMonitor.endMetric('item-click', { success: false, error });
    }
  }, [onItemClick]);
  
  /**
   * Example of tracking an async operation
   */
  const handleAsyncOperation = useCallback(async () => {
    performanceMonitor.startMetric('async-operation');
    
    try {
      // Simulate async work
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      performanceMonitor.endMetric('async-operation', { 
        success: true,
        duration: '1000ms'
      });
    } catch (error) {
      performanceMonitor.endMetric('async-operation', { 
        success: false, 
        error 
      });
    }
  }, []);
  
  // ==========================================
  // TypeScript Strict Null Checks
  // ==========================================
  
  /**
   * Safely access optional/nullable properties
   */
  const renderMetadata = () => {
    // TypeScript forces us to check for null/undefined
    if (metadata === null || metadata === undefined) {
      return <p className="text-gray-400">No metadata available</p>;
    }
    
    return (
      <div className="space-y-2">
        <p>Author: {metadata.author}</p>
        <p>Date: {metadata.date.toLocaleDateString()}</p>
      </div>
    );
  };
  
  /**
   * Safe array access with noUncheckedIndexedAccess
   */
  const renderFirstItem = () => {
    const firstItem = items[0]; // Type: string | undefined
    
    // Must check for undefined
    if (firstItem === undefined) {
      return <p>No items available</p>;
    }
    
    return <p>First item: {firstItem}</p>;
  };
  
  // ==========================================
  // Render
  // ==========================================
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#003630]">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      {/* Metadata */}
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Metadata</h3>
        {renderMetadata()}
      </div>
      
      {/* Statistics */}
      <div className="mb-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Statistics</h3>
        <div className="space-y-1">
          <p>Total Items: {statistics.totalItems}</p>
          <p>Average Length: {statistics.averageLength.toFixed(2)}</p>
          <p>Longest Item: {statistics.longestItem}</p>
        </div>
      </div>
      
      {/* First Item */}
      <div className="mb-4">
        {renderFirstItem()}
      </div>
      
      {/* Items List */}
      <div className="space-y-2">
        <h3 className="font-semibold">Items</h3>
        <ul className="space-y-1">
          {processedItems.map((item, index) => (
            <li 
              key={index}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => handleItemClick(item.original)}
            >
              <span className="font-medium">{item.uppercase}</span>
              <span className="text-gray-500 ml-2">({item.length} chars)</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Action Button */}
      <button
        onClick={handleAsyncOperation}
        className="mt-4 px-4 py-2 bg-[#003630] text-white rounded hover:bg-[#004d45] transition-colors"
      >
        Trigger Async Operation
      </button>
    </div>
  );
});

// Set display name for debugging
ExampleOptimizedComponent.displayName = 'ExampleOptimizedComponent';

// ==========================================
// Helper Functions with Strict Types
// ==========================================

/**
 * Type guard to check if metadata is valid
 */
function isValidMetadata(
  metadata: ExampleComponentProps['metadata']
): metadata is NonNullable<ExampleComponentProps['metadata']> {
  return metadata !== null && metadata !== undefined;
}

/**
 * Process items with proper error handling
 */
function processItemsSafely(items: string[]): string[] {
  try {
    return items.filter((item): item is string => {
      // Type guard to ensure item is string
      return typeof item === 'string' && item.length > 0;
    });
  } catch (error) {
    console.error('Error processing items:', error);
    return [];
  }
}

export default ExampleOptimizedComponent;
export { isValidMetadata, processItemsSafely };
export type { ExampleComponentProps };
