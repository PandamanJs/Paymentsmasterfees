/**
 * Security Configuration for Production
 * Contains security headers, CSP policies, and validation rules
 */

export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'https://*.supabase.co', 'https://api.paymentgateway.com'],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },

  // Security Headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // Input Validation
  VALIDATION_RULES: {
    PHONE_REGEX: /^[0-9]{9}$/,
    AMOUNT_MAX: 1000000, // Maximum payment amount
    PIN_REGEX: /^[0-9]{4}$/,
    NAME_REGEX: /^[a-zA-Z\s]{2,50}$/,
  },

  // Rate Limiting
  RATE_LIMITS: {
    PAYMENT_ATTEMPTS: 3, // Max payment attempts per hour
    LOGIN_ATTEMPTS: 5,   // Max login attempts per 15 minutes
    API_REQUESTS: 100,   // Max API requests per minute
  },
};

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 1000); // Limit length
};

/**
 * Validate payment amount
 */
export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= SECURITY_CONFIG.VALIDATION_RULES.AMOUNT_MAX;
};

/**
 * Generate secure transaction ID
 */
export const generateSecureTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `TXN_${timestamp}_${randomPart}`.toUpperCase();
};
