import { motion } from "motion/react";
import svgPaths from "../imports/svg-4boykq1z8d";
import pathSvgPaths from "../imports/svg-d7byi594ix";
import pathStrokeSvgPaths from "../imports/svg-zrcfpc6p5c";
import { generateReceiptPDF } from "../utils/pdfGenerator";
import { toast } from "sonner@2.0.3";
import { Download } from "lucide-react";
import { Toaster } from "./ui/sonner";

export interface PaymentData {
  date: string;
  day: string;
  title: string;
  subtitle: string;
  amount: string;
}

interface AllReceiptsProps {
  onBack: () => void;
  studentName?: string;
  studentId?: string;
  paymentData?: Record<string, PaymentData[]>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="overflow-clip relative shrink-0 size-[24px] touch-manipulation active:opacity-70 transition-opacity"
      data-name="icon-x"
    >
      <div className="absolute inset-[20.833%]" data-name="Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <path d={svgPaths.p371efd00} fill="var(--fill-0, #2D3648)" id="Shape" />
        </svg>
      </div>
    </button>
  );
}

function Logo() {
  return (
    <div className="size-[31px]">
      <div className="relative size-full">
        <div className="absolute bottom-[-22.63%] left-[-9.72%] right-[-9.72%] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 39">
            <g id="Group 15">
              <g filter="url(#filter0_d_2_352)" id="rect84">
                <path d={svgPaths.p24506700} fill="var(--fill-0, #003630)" />
                <path d={svgPaths.p24506700} stroke="var(--stroke-0, white)" strokeWidth="3" />
              </g>
              <g id="path60">
                <path d={svgPaths.p8fdf600} fill="var(--fill-0, #003630)" />
                <path d={svgPaths.p8fdf600} stroke="var(--stroke-0, #95E36C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </g>
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="37.0294" id="filter0_d_2_352" width="37.0294" x="5.96046e-08" y="0.985283">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_352" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_352" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative size-full">
      <div aria-hidden="true" className="absolute border-[#e6e6e6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="absolute left-1/2 translate-x-[-50%] top-[17px] flex items-center gap-[16px]">
        <Logo />
        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] leading-[normal] not-italic text-[20px] text-black text-nowrap whitespace-pre">master-fees</p>
      </div>
    </div>
  );
}

interface ReceiptCardProps {
  title: string;
  studentInfo: string;
  amount: string;
  date: string;
  hasTopBorder?: boolean;
  receiptNumber: string;
  schoolName: string;
}

function ReceiptCard({ title, studentInfo, amount, date, hasTopBorder, receiptNumber, schoolName }: ReceiptCardProps) {
  const handleDownload = () => {
    try {
      // Parse amount - remove "K" prefix and parse as number
      const amountValue = parseFloat(amount.replace('K', '').replace(/,/g, ''));
      
      // Generate a reference number from receipt number
      const refNumber = `000${receiptNumber}`.slice(-12);
      
      // Use the date from the card
      const dateTime = date;
      
      // Generate schedule ID
      const scheduleId = `#${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
      
      generateReceiptPDF({
        schoolName,
        totalAmount: amountValue,
        refNumber,
        dateTime,
        scheduleId,
        services: [{
          id: '1',
          description: title.split(' - ')[0],
          amount: amountValue,
          invoiceNo: receiptNumber,
          studentName: studentInfo.split(' - ')[0]
        }]
      });
      
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download receipt. Please try again.");
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white w-full rounded-[16px] border-[1.5px] border-[#e5e7eb] shadow-[0px_8px_24px_rgba(0,54,48,0.08)] hover:shadow-[0px_12px_32px_rgba(0,54,48,0.12)] hover:border-[#95e36c] transition-all relative overflow-hidden group touch-manipulation"
    >
      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-[140px] h-[140px] bg-gradient-to-br from-[#95e36c]/10 via-[#95e36c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Accent bar */}
      <div className="absolute left-0 top-0 w-[4px] h-full bg-gradient-to-b from-[#95e36c] to-[#003630] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-[20px] relative">
        <div className="flex justify-between items-start mb-[16px]">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-[12px]">
              {/* Receipt Icon */}
              <div className="flex-shrink-0 w-[44px] h-[44px] bg-gradient-to-br from-[#95e36c] to-[#7dd054] rounded-[12px] flex items-center justify-center shadow-[0px_4px_12px_rgba(149,227,108,0.3)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[14px] leading-[1.4] text-[#003630] mb-[6px] tracking-[-0.14px]">
                  {title.split(' - ')[0]}
                </p>
                <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[11px] leading-[1.4] text-[#6b7280] mb-[4px]">
                  {studentInfo}
                </p>
                <div className="inline-flex items-center gap-[6px] bg-[#e0f7d4] px-[8px] py-[4px] rounded-[6px]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" fill="#95e36c" />
                  </svg>
                  <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[10px] text-[#003630] tracking-[0.3px] uppercase">
                    Receipt #{receiptNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-[4px] px-[14px] py-[10px] rounded-[12px] bg-[#f9fafb] hover:bg-[#003630] border-[1.5px] border-[#e5e7eb] hover:border-[#003630] transition-all touch-manipulation group/btn active:scale-95 shadow-sm"
          >
            <Download className="w-[18px] h-[18px] text-[#003630] group-hover/btn:text-white transition-colors" />
            <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[10px] text-[#003630] group-hover/btn:text-white tracking-[-0.10px] whitespace-nowrap transition-colors uppercase">
              PDF
            </p>
          </button>
        </div>
        
        <div className="flex items-center justify-between pt-[16px] border-t border-[#f0f1f3]">
          <div className="flex items-center gap-[6px] text-[#6b7280]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 2H10V1C10 0.734784 9.89464 0.48043 9.70711 0.292893C9.51957 0.105357 9.26522 0 9 0C8.73478 0 8.48043 0.105357 8.29289 0.292893C8.10536 0.48043 8 0.734784 8 1V2H6V1C6 0.734784 5.89464 0.48043 5.70711 0.292893C5.51957 0.105357 5.26522 0 5 0C4.73478 0 4.48043 0.105357 4.29289 0.292893C4.10536 0.48043 4 0.734784 4 1V2H3C2.20435 2 1.44129 2.31607 0.87868 2.87868C0.316071 3.44129 0 4.20435 0 5V11C0 11.7956 0.316071 12.5587 0.87868 13.1213C1.44129 13.6839 2.20435 14 3 14H11C11.7956 14 12.5587 13.6839 13.1213 13.1213C13.6839 12.5587 14 11.7956 14 11V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2ZM12 11C12 11.2652 11.8946 11.5196 11.7071 11.7071C11.5196 11.8946 11.2652 12 11 12H3C2.73478 12 2.48043 11.8946 2.29289 11.7071C2.10536 11.5196 2 11.2652 2 11V7H12V11ZM12 5H2V5C2 4.73478 2.10536 4.48043 2.29289 4.29289C2.48043 4.10536 2.73478 4 3 4H4V5C4 5.26522 4.10536 5.51957 4.29289 5.70711C4.48043 5.89464 4.73478 6 5 6C5.26522 6 5.51957 5.89464 5.70711 5.70711C5.89464 5.51957 6 5.26522 6 5V4H8V5C8 5.26522 8.10536 5.51957 8.29289 5.70711C8.48043 5.89464 8.73478 6 9 6C9.26522 6 9.51957 5.89464 9.70711 5.70711C9.89464 5.51957 10 5.26522 10 5V4H11C11.2652 4 11.5196 4.10536 11.7071 4.29289C11.8946 4.48043 12 4.73478 12 5V5Z" fill="currentColor"/>
            </svg>
            <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[11px] tracking-[-0.11px]">
              {date}
            </p>
          </div>
          <div className="text-right">
            <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[10px] text-[#6b7280] mb-[2px] uppercase tracking-[0.3px]">
              Amount Paid
            </p>
            <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[18px] text-[#003630] tracking-[-0.18px]">
              {amount}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wavy water effect */}
      <motion.div
        className="absolute w-[200%] h-[200%] opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(149, 227, 108, 0.3) 0%, transparent 50%)",
        }}
        animate={{
          x: ["-25%", "-15%", "-25%"],
          y: ["-25%", "-15%", "-25%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[200%] h-[200%] opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 54, 48, 0.2) 0%, transparent 50%)",
        }}
        animate={{
          x: ["-15%", "-25%", "-15%"],
          y: ["-15%", "-25%", "-15%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating path shapes */}
      <motion.div
        className="absolute w-[120px] h-[80px]"
        style={{ top: "15%", left: "5%" }}
        animate={{
          y: [0, -60, 30, -40, 0],
          x: [0, 50, -20, 40, 0],
          rotate: [0, 25, -15, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative size-full" data-name="path60">
          <div className="absolute inset-[-30.2%_-15.09%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 151 93">
              <path d={pathSvgPaths.p36f25d00} stroke="#E0F7D4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.67" strokeWidth="35" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute w-[140px] h-[90px]"
        style={{ top: "55%", right: "5%" }}
        animate={{
          y: [0, 70, -30, 50, 0],
          x: [0, -60, 25, -45, 0],
          rotate: [0, -30, 20, -25, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative size-full" data-name="path60 (Stroke)">
          <div className="absolute inset-[-1.63%_-1%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 154 96">
              <path d={pathStrokeSvgPaths.p24f69200} stroke="#003630" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.03" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute w-[100px] h-[70px]"
        style={{ bottom: "20%", left: "10%" }}
        animate={{
          y: [0, -50, 20, -35, 0],
          x: [0, 40, -30, 35, 0],
          rotate: [0, 18, -12, 15, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative size-full" data-name="path60">
          <div className="absolute inset-[-30.2%_-15.09%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 151 93">
              <path d={pathSvgPaths.p36f25d00} stroke="#E0F7D4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="35" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute w-[110px] h-[75px]"
        style={{ top: "40%", left: "60%" }}
        animate={{
          y: [0, -45, 35, -30, 0],
          x: [0, -50, 30, -40, 0],
          rotate: [0, -22, 15, -18, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative size-full" data-name="path60 (Stroke)">
          <div className="absolute inset-[-1.63%_-1%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 154 96">
              <path d={pathStrokeSvgPaths.p24f69200} stroke="#003630" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.05" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AllReceipts({ 
  onBack, 
  studentName = "Isaiah Kapambwe",
  studentId = "C20012",
  paymentData = {}
}: AllReceiptsProps) {
  const schoolName = "Twalumbu Educational Center";
  // Helper function to extract receipt number from subtitle
  const extractReceiptNumber = (subtitle: string): string => {
    const match = subtitle.match(/Receipt No\.\s*(\d+)/);
    return match ? match[1] : "0000";
  };

  // Helper function to format date from year-month key and day
  const formatDate = (monthKey: string, day: string): string => {
    const [year, month] = monthKey.split('-');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  // Helper function to get month name
  const getMonthName = (monthKey: string): string => {
    const [year, month] = monthKey.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Sort month keys in descending order (newest first)
  const sortedMonthKeys = Object.keys(paymentData).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    if (yearA !== yearB) return yearB - yearA;
    return monthB - monthA;
  });

  return (
    <div className="bg-gradient-to-br from-[#f9fafb] via-white to-[#f5f7f9] min-h-screen w-full overflow-hidden flex items-center justify-center relative" data-name="All Receipts">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="relative w-full max-w-[450px] md:max-w-[500px] lg:max-w-[600px] min-h-screen mx-auto">
        {/* Header - Enhanced */}
        <div className="relative h-[72px] w-full bg-white/80 backdrop-blur-lg border-b border-[#e5e7eb] shadow-sm">
          <div className="absolute inset-0 flex items-center px-[20px]">
            <button
              onClick={onBack}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-[12px] hover:bg-[#f5f7f9] active:scale-95 transition-all touch-manipulation"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 16L6 10L12 4" stroke="#003630" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 flex items-center justify-center gap-[12px]">
              <Logo />
              <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[18px] text-[#003630] tracking-[-0.18px]">
                master-fees
              </p>
            </div>
            <div className="w-[40px]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative px-[20px] py-[28px] overflow-y-auto" style={{ height: 'calc(100vh - 72px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-[800px] mx-auto pb-[40px] relative z-10"
          >
            {/* Page Header with Stats */}
            <div className="text-center mb-[32px]">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h1 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[28px] text-[#003630] tracking-[-0.28px] mb-[8px]">
                  Payment Receipts
                </h1>
                <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.13px] mb-[20px] leading-relaxed">
                  View and download your payment history
                </p>
                
                {/* Stats Card */}
                {sortedMonthKeys.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-gradient-to-br from-[#95e36c] to-[#7dd054] rounded-[16px] p-[20px] shadow-[0px_8px_24px_rgba(149,227,108,0.3)] mb-[8px]"
                  >
                    <div className="flex items-center justify-around">
                      <div className="text-center">
                        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[24px] text-white tracking-[-0.24px]">
                          {Object.values(paymentData).flat().length}
                        </p>
                        <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-white/80 uppercase tracking-[0.5px]">
                          Total Receipts
                        </p>
                      </div>
                      <div className="w-[1px] h-[40px] bg-white/30" />
                      <div className="text-center">
                        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[24px] text-white tracking-[-0.24px]">
                          {sortedMonthKeys.length}
                        </p>
                        <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-white/80 uppercase tracking-[0.5px]">
                          Months
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {sortedMonthKeys.length === 0 ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-[60px] bg-white rounded-[16px] border border-[#e5e7eb] shadow-sm"
              >
                <div className="w-[80px] h-[80px] bg-[#f5f7f9] rounded-full flex items-center justify-center mx-auto mb-[20px]">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M13.5 7.5H10.5C8.84315 7.5 7.5 8.84315 7.5 10.5V28.5C7.5 30.1569 8.84315 31.5 10.5 31.5H25.5C27.1569 31.5 28.5 30.1569 28.5 28.5V10.5C28.5 8.84315 27.1569 7.5 25.5 7.5H22.5M13.5 7.5C13.5 9.15685 14.8431 10.5 16.5 10.5H19.5C21.1569 10.5 22.5 9.15685 22.5 7.5M13.5 7.5C13.5 5.84315 14.8431 4.5 16.5 4.5H19.5C21.1569 4.5 22.5 5.84315 22.5 7.5M18 18H22.5M18 24H22.5M13.5 18H13.515M13.5 24H13.515" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[16px] text-[#003630] mb-[8px]">
                  No Receipts Yet
                </p>
                <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[12px] text-[#6b7280] max-w-[260px] mx-auto leading-relaxed">
                  Your payment receipts will appear here after you make a payment
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-[28px]">
                {sortedMonthKeys.map((monthKey, monthIndex) => {
                  const payments = paymentData[monthKey];
                  
                  // Skip empty months
                  if (!payments || payments.length === 0) return null;

                  return (
                    <motion.div
                      key={monthKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: monthIndex * 0.08 }}
                    >
                      {/* Month Header - Enhanced */}
                      <div className="flex items-center gap-[12px] mb-[16px]">
                        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-[#e5e7eb]" />
                        <h2 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[14px] text-[#003630] tracking-[0.5px] uppercase">
                          {getMonthName(monthKey)}
                        </h2>
                        <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-[#e5e7eb]" />
                      </div>

                      {/* Receipts for this month */}
                      <div className="flex flex-col gap-[12px]">
                        {payments.map((payment, paymentIndex) => {
                          const receiptNumber = extractReceiptNumber(payment.subtitle);
                          const formattedDate = formatDate(monthKey, payment.day);
                          
                          return (
                            <ReceiptCard
                              key={`${monthKey}-${paymentIndex}`}
                              title={`${payment.title.replace('Paid ', '')} - Receipt No. ${receiptNumber}`}
                              studentInfo={`${studentName} - ${studentId}`}
                              amount={payment.amount}
                              date={formattedDate}
                              hasTopBorder={paymentIndex === 0 && monthIndex === 0}
                              receiptNumber={receiptNumber}
                              schoolName={schoolName}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}