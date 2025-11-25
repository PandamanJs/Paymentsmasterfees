/**
 * Lenco Payment Integration Utility
 * 
 * Handles payment processing through Lenco's payment gateway
 * Supports both card and mobile money payments
 * Includes retry mechanism and detailed error handling
 */

// Extend the Window interface to include LencoPay
declare global {
  interface Window {
    LencoPay: {
      getPaid: (config: LencoPaymentConfig) => void;
    };
  }
}

export interface LencoCustomer {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface LencoBilling {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface LencoPaymentConfig {
  key: string;
  reference: string;
  email: string;
  amount: number;
  currency?: string;
  label?: string;
  bearer?: 'merchant' | 'customer';
  channels?: ('card' | 'mobile-money')[];
  customer?: LencoCustomer;
  billing?: LencoBilling;
  onSuccess?: (response: LencoSuccessResponse) => void;
  onClose?: () => void;
  onConfirmationPending?: () => void;
}

export interface LencoSuccessResponse {
  reference: string;
  status: string;
  message: string;
}

export interface LencoPaymentData {
  userName: string;
  userPhone: string;
  userEmail: string;
  amount: number;
  schoolName: string;
  services: Array<{ name: string; amount: number }>;
}

/**
 * Load Lenco script dynamically with retry mechanism
 * Uses exponential backoff for retries
 * 
 * @param retryCount - Current retry attempt
 * @param maxRetries - Maximum number of retries
 * @returns Promise that resolves when script is loaded
 */
export async function loadLencoScript(retryCount = 0, maxRetries = 3): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.LencoPay) {
      console.log('✅ Lenco widget already loaded');
      resolve(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="lenco.co"]');
    if (existingScript) {
      console.log('🔄 Lenco script tag exists, waiting for load...');
      
      // Wait up to 10 seconds for the script to load
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.LencoPay) {
          console.log('✅ Lenco widget loaded successfully');
          clearInterval(checkInterval);
          resolve(true);
        } else if (attempts >= 100) { // 10 seconds
          console.warn('⚠️ Lenco script exists but widget not available after 10s');
          clearInterval(checkInterval);
          
          // Try retry if we have attempts left
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`🔄 Retrying Lenco load in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              // Remove existing script and try again
              existingScript.remove();
              loadLencoScript(retryCount + 1, maxRetries).then(resolve);
            }, delay);
          } else {
            console.error('❌ Lenco widget failed to load after all retries');
            resolve(false);
          }
        }
      }, 100);
      return;
    }

    console.log(`📦 Loading Lenco payment widget (attempt ${retryCount + 1}/${maxRetries + 1})...`);
    
    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://pay.sandbox.lenco.co/js/v1/inline.js'; // Sandbox URL for demo payments
    script.crossOrigin = 'anonymous';
    script.async = false;
    
    script.onload = () => {
      // Wait a bit for the widget to initialize
      setTimeout(() => {
        if (window.LencoPay) {
          console.log('✅ Lenco widget loaded successfully');
          resolve(true);
        } else {
          console.warn('⚠️ Script loaded but LencoPay not available');
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`🔄 Retrying in ${delay}ms...`);
            setTimeout(() => {
              script.remove();
              loadLencoScript(retryCount + 1, maxRetries).then(resolve);
            }, delay);
          } else {
            resolve(false);
          }
        }
      }, 500);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Lenco script:', error);
      
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`🔄 Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`);
        
        setTimeout(() => {
          script.remove();
          loadLencoScript(retryCount + 1, maxRetries).then(resolve);
        }, delay);
      } else {
        console.error('❌ Lenco script failed to load after all retries');
        logTroubleshootingInfo();
        resolve(false);
      }
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Log detailed troubleshooting information
 */
export function logTroubleshootingInfo(): void {
  console.group('🔍 Lenco Payment Troubleshooting Information');
  
  // Check network connectivity
  console.log('📡 Network Status:', navigator.onLine ? 'Online' : 'Offline');
  
  // Check if script tag exists
  const scriptTags = document.querySelectorAll('script[src*="lenco"]');
  console.log('📜 Lenco Script Tags Found:', scriptTags.length);
  scriptTags.forEach((tag, index) => {
    console.log(`   Script ${index + 1}:`, (tag as HTMLScriptElement).src);
  });
  
  // Check window.LencoPay
  console.log('🪟 window.LencoPay:', window.LencoPay ? 'Available ✅' : 'Not Available ❌');
  
  // Note about public key
  console.log('🔑 Public Key: Fetched from server endpoint');
  
  // Check browser extensions
  console.log('🔌 Possible Issues:');
  console.log('   1. Ad blocker or privacy extension blocking payment scripts');
  console.log('   2. CORS or Content Security Policy restrictions');
  console.log('   3. Lenco sandbox service temporarily unavailable');
  console.log('   4. Network firewall blocking payment gateway domains');
  console.log('   5. Browser in private/incognito mode with strict settings');
  
  // Recommendations
  console.log('💡 Troubleshooting Steps:');
  console.log('   1. Disable ad blockers and privacy extensions');
  console.log('   2. Check browser console Network tab for failed requests');
  console.log('   3. Try in a different browser or incognito mode');
  console.log('   4. Verify Lenco sandbox is operational at status.lenco.co');
  console.log('   5. Contact Lenco support with your public key');
  
  console.groupEnd();
}

/**
 * Generate a unique reference for the payment
 * Format: MF-YYYYMMDD-TIMESTAMP-RANDOM
 * 
 * @returns Unique payment reference string
 */
export function generatePaymentReference(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `MF-${dateStr}-${timestamp}-${random}`;
}

/**
 * Split full name into first name and last name
 * 
 * @param fullName - Full name of the customer
 * @returns Object with firstName and lastName
 */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      lastName: '',
    };
  }
  
  return {
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' '),
  };
}

/**
 * Format phone number for Lenco (remove formatting characters)
 * 
 * @param phone - Phone number with possible formatting
 * @returns Clean phone number string
 */
export function formatPhoneForLenco(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 260, keep as is
  if (cleaned.startsWith('260')) {
    return `0${cleaned.slice(3)}`;
  }
  
  // If it starts with 0, keep as is
  if (cleaned.startsWith('0')) {
    return cleaned;
  }
  
  // Otherwise add 0
  return `0${cleaned}`;
}

/**
 * Initialize Lenco payment widget
 * 
 * @param paymentData - Payment information
 * @param publicKey - Lenco public key
 * @param onSuccess - Callback for successful payment
 * @param onClose - Callback for closed payment window
 * @param onConfirmationPending - Callback for pending confirmation
 */
export function initializeLencoPayment(
  paymentData: LencoPaymentData,
  publicKey: string,
  onSuccess: (reference: string) => void,
  onClose: () => void,
  onConfirmationPending: () => void
): void {
  // Check if LencoPay is available
  if (!window.LencoPay) {
    console.error('Lenco payment widget not loaded');
    throw new Error('Payment system not available. Please refresh the page.');
  }

  // Generate unique reference
  const reference = generatePaymentReference();

  // Split customer name
  const { firstName, lastName } = splitName(paymentData.userName);

  // Format phone number
  const formattedPhone = formatPhoneForLenco(paymentData.userPhone);

  // Configure payment
  const config: LencoPaymentConfig = {
    key: publicKey,
    reference: reference,
    email: paymentData.userEmail,
    amount: paymentData.amount,
    currency: 'ZMW',
    label: `${paymentData.schoolName} - School Fees`,
    bearer: 'customer',
    channels: ['card', 'mobile-money'],
    customer: {
      firstName: firstName,
      lastName: lastName,
      phone: formattedPhone,
    },
    onSuccess: (response: LencoSuccessResponse) => {
      console.log('Payment successful:', response);
      onSuccess(response.reference);
    },
    onClose: () => {
      console.log('Payment window closed');
      onClose();
    },
    onConfirmationPending: () => {
      console.log('Payment confirmation pending');
      onConfirmationPending();
    },
  };

  // Initialize payment widget
  window.LencoPay.getPaid(config);
}

/**
 * Verify payment status on the backend
 * 
 * @param reference - Payment reference to verify
 * @returns Promise with verification result
 */
export async function verifyPayment(reference: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/verify-payment?reference=${reference}`);
    
    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if Lenco widget is loaded and ready
 * 
 * @returns true if Lenco is available
 */
export function isLencoReady(): boolean {
  return typeof window !== 'undefined' && !!window.LencoPay;
}