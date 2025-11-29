import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
}

export default function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(y, [0, threshold], [0, 360]);
  const scale = useTransform(y, [0, threshold], [0, 1]);
  const opacity = useTransform(y, [0, threshold], [0, 1]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start pull if already at top
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, (currentY - startY.current) * 0.5); // Damping effect
      
      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        setPullDistance(distance);
        y.set(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      isPulling = false;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(threshold);
        y.set(threshold);
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          y.set(0);
        }
      } else {
        setPullDistance(0);
        y.set(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, threshold, isRefreshing, onRefresh, y]);

  return (
    <div 
      ref={containerRef}
      className="relative h-full overflow-y-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{
          top: -60,
          width: 40,
          height: 40,
          scale,
          opacity
        }}
      >
        <motion.div
          style={{ rotate }}
          className="text-[#003630]"
        >
          <RefreshCw 
            size={24} 
            className={isRefreshing ? 'animate-spin' : ''}
          />
        </motion.div>
      </motion.div>

      {/* Content with pull offset */}
      <motion.div
        style={{ y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
