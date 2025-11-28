import { motion } from "motion/react";
import svgPaths from "../imports/svg-b4tvwhugf4";
import { generateReceiptPDF } from "../utils/pdfGenerator";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./ui/sonner";

interface CheckoutService {
  id: string;
  description: string;
  amount: number;
  invoiceNo: string;
  studentName: string;
}

interface DownloadReceiptPageProps {
  totalAmount: number;
  schoolName: string;
  services?: CheckoutService[];
  onGoHome: () => void;
}

function MasterFeesLogo() {
  return (
    <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
      <div className="[grid-area:1_/_1] relative size-[24px] ml-0 mt-[2.535px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="Group 15">
            <path d={svgPaths.p2f27c900} fill="var(--fill-0, #003630)" id="rect84" />
            <path d={svgPaths.p82a2280} id="path60" stroke="var(--stroke-0, #95E36C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] leading-[normal] ml-[32.63px] mt-0 not-italic text-[20px] text-black w-[136.486px]">master-fees</p>
    </div>
  );
}

export default function DownloadReceiptPage({ 
  totalAmount, 
  schoolName,
  services,
  onGoHome 
}: DownloadReceiptPageProps) {
  // Generate reference number
  const refNumber = `000${Math.floor(Math.random() * 100000000)}`.slice(-12);
  
  // Get current date and time
  const now = new Date();
  const dateTime = now.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  // Generate schedule ID
  const scheduleId = `#${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

  const handleDownloadReceipt = () => {
    try {
      generateReceiptPDF({
        schoolName,
        totalAmount,
        refNumber,
        dateTime,
        scheduleId,
        services
      });
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download receipt. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f9fafb] via-white to-[#f5f7f9] min-h-screen flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-6 py-[17px] border-b-[1.5px] border-[#e5e7eb] bg-white/95 backdrop-blur-[20px]">
        <div className="flex items-center justify-center">
          <MasterFeesLogo />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[368px] flex flex-col gap-4">
          {/* Success Card */}
          <motion.div 
            className="bg-gradient-to-br from-[#003630] to-[#004d45] rounded-[20px] shadow-[0px_12px_32px_rgba(0,54,48,0.3)] px-6 pt-6 pb-9 flex flex-col items-center gap-2 border-[1.5px] border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Success Icon */}
            <motion.div 
              className="overflow-clip relative size-[100px] shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2 
              }}
            >
              <div className="absolute inset-[12.5%]">
                <div className="absolute inset-[-4%]" style={{ "--stroke-0": "rgba(149, 227, 108, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 81 81">
                    <motion.path 
                      d={svgPaths.p3f23eb00} 
                      stroke="var(--stroke-0, #95E36C)" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.4,
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            <p className="font-['Inter:Extra_Light',sans-serif] font-extralight leading-[24px] text-[16px] text-white tracking-[-0.16px]">
              Payment Success
            </p>
            <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] leading-[24px] text-[32px] text-white tracking-[-0.32px]">
              K{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </motion.div>

          {/* Payment Details Card */}
          <motion.div 
            className="bg-white rounded-[20px] p-6 flex flex-col gap-2 border-[1.5px] border-[#e5e7eb] shadow-[0px_8px_24px_rgba(0,0,0,0.06)]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] leading-[24px] text-[#003630] text-[18px] tracking-[-0.3px] mb-3">
              Payment Details
            </p>
            
            {/* Ref Number */}
            <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
              <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.2px]">Ref Number</p>
              <p className="font-['IBM_Plex_Sans_Condensed:SemiBold',sans-serif] text-[14px] text-[#003630] tracking-[-0.2px]">{refNumber}</p>
            </div>

            {/* Payment Status */}
            <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
              <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.2px]">Payment Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#95e36c] rounded-full" />
                <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[14px] text-[#003630] tracking-[-0.2px]">Success</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
              <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.2px]">Date & Time</p>
              <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[14px] text-[#003630] tracking-[-0.2px]">{dateTime}</p>
            </div>

            {/* Schedule ID */}
            <div className="flex justify-between items-center py-2">
              <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.2px]">Schedule ID</p>
              <p className="font-['IBM_Plex_Sans_Condensed:SemiBold',sans-serif] text-[14px] text-[#003630] tracking-[-0.2px]">{scheduleId}</p>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div 
            className="flex flex-col gap-2 mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Download Receipts Button */}
            <button
              onClick={handleDownloadReceipt}
              className="relative h-[59px] rounded-[16px] overflow-hidden group"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-[#003630] group-hover:bg-[#004d45] transition-colors" />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              {/* Shadow */}
              <div className="absolute inset-0 shadow-[0px_6px_20px_rgba(0,54,48,0.25)] group-active:shadow-[0px_2px_8px_rgba(0,54,48,0.2)] transition-shadow" />
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center gap-[10px] h-full group-active:scale-[0.97] transition-transform">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3.33337V12.5M10 12.5L13.3333 9.16671M10 12.5L6.66667 9.16671M3.33333 16.6667H16.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[18px] text-white tracking-[-0.3px]">
                  Download Receipt
                </p>
              </div>
            </button>

            {/* Go to Homepage Button */}
            <button
              onClick={onGoHome}
              className="relative h-[60px] rounded-[16px] border-[1.5px] border-[#e5e7eb] overflow-hidden group"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-white group-hover:bg-[#f9fafb] transition-colors" />
              
              {/* Shadow */}
              <div className="absolute inset-0 shadow-sm group-hover:shadow-md group-active:shadow-sm transition-shadow" />
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center gap-[10px] h-full group-active:scale-[0.97] transition-transform">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2.25 9H15.75M9 2.25L15.75 9L9 15.75" stroke="#003630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[16px] text-[#003630] tracking-[-0.2px]">
                  Go to homepage
                </p>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
