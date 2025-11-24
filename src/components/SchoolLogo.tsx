/**
 * SchoolLogo Component
 * 
 * Displays school logo with graceful fallback handling
 * - Attempts to load logo from assets folder
 * - Falls back to initials if logo not found
 * - Supports custom sizes
 */

import { useState } from "react";

interface SchoolLogoProps {
  schoolName: string;
  logoPath: string | null;
  size?: number;
  className?: string;
}

/**
 * Get initials from school name
 * e.g. "Twalumbu Educational Center" -> "TEC"
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .filter(char => char && char.match(/[A-Z]/i))
    .join('')
    .substring(0, 3)
    .toUpperCase();
}

export function SchoolLogo({ schoolName, logoPath, size = 32, className = "" }: SchoolLogoProps) {
  const [imageError, setImageError] = useState(false);

  // If no logo path or image failed to load, show initials
  if (!logoPath || imageError) {
    const initials = getInitials(schoolName);
    
    return (
      <div 
        className={`flex items-center justify-center rounded-[6px] bg-gradient-to-br from-[#95e36c] to-[#003630] flex-shrink-0 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <span 
          className="font-['IBM_Plex_Sans:SemiBold',sans-serif] text-white"
          style={{ fontSize: `${size * 0.35}px` }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={logoPath} 
      alt={`${schoolName} logo`}
      className={`object-contain rounded-[6px] flex-shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onError={() => setImageError(true)}
    />
  );
}
