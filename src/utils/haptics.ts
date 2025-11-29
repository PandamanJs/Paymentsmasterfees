/**
 * Haptic Feedback Utility
 * Provides visual and physical feedback for touch interactions
 * Follows iOS Human Interface Guidelines
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticOptions {
  visual?: boolean; // Apply visual scale effect
  vibration?: boolean; // Trigger device vibration (if supported)
}

/**
 * Trigger haptic feedback
 * @param style - The intensity/type of haptic feedback
 * @param options - Configuration for visual and vibration effects
 */
export function triggerHaptic(
  style: HapticStyle = 'light',
  options: HapticOptions = { visual: true, vibration: true }
) {
  // Visual feedback (already handled via CSS classes)
  // Apply classes: haptic-light, haptic-medium, haptic-heavy
  
  // Physical vibration feedback (if supported and enabled)
  if (options.vibration && 'vibrate' in navigator) {
    const vibrationPatterns: Record<HapticStyle, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [30, 100, 30, 100, 30]
    };
    
    navigator.vibrate(vibrationPatterns[style]);
  }
  
  // iOS Haptic Engine (if available in WebKit)
  if ('ontouchstart' in window) {
    try {
      // @ts-ignore - Webkit Haptics API
      if (window.webkit?.messageHandlers?.hapticFeedback) {
        // @ts-ignore
        window.webkit.messageHandlers.hapticFeedback.postMessage(style);
      }
    } catch (e) {
      // Silently fail if not available
    }
  }
}

/**
 * Higher-level haptic feedback helpers
 */
export const haptics = {
  selection: () => triggerHaptic('light'),
  impact: () => triggerHaptic('medium'),
  notification: (type: 'success' | 'warning' | 'error') => triggerHaptic(type),
  buttonPress: () => triggerHaptic('light'),
  toggle: () => triggerHaptic('light'),
  longPress: () => triggerHaptic('medium'),
  delete: () => triggerHaptic('heavy')
};

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
  return {
    trigger: triggerHaptic,
    ...haptics
  };
}

/**
 * Wrapper component for adding haptic feedback to any element
 */
import { cloneElement, ReactElement } from 'react';

interface HapticWrapperProps {
  children: ReactElement;
  hapticStyle?: HapticStyle;
  onPress?: () => void;
}

export function HapticWrapper({ children, hapticStyle = 'light', onPress }: HapticWrapperProps) {
  const handlePress = () => {
    triggerHaptic(hapticStyle);
    onPress?.();
  };

  return cloneElement(children, {
    onTouchStart: handlePress,
    onClick: handlePress,
    className: `${children.props.className || ''} haptic-${hapticStyle}`
  });
}
