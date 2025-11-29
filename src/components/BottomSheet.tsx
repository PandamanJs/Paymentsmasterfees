import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 bg-black/40 z-[999]"
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              duration: 0.4, 
              ease: [0.16, 1, 0.3, 1] // Apple's spring-smooth
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[1000] max-h-[90vh] overflow-y-auto"
            style={{ 
              paddingBottom: 'env(safe-area-inset-bottom)',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-4">
              <div className="w-[36px] h-[5px] bg-black/10 rounded-full" />
            </div>
            
            {/* Title */}
            {title && (
              <div className="px-6 pb-4">
                <h2 className="text-[20px] font-semibold text-[#003630] tracking-[-0.3px]">
                  {title}
                </h2>
              </div>
            )}
            
            {/* Content */}
            <div className="px-6 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
