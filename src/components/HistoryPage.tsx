import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-g99px4v16h";
import headerSvgPaths from "../imports/svg-co0ktog99f";
import pathSvgPaths from "../imports/svg-d7byi594ix";
import pathStrokeSvgPaths from "../imports/svg-zrcfpc6p5c";
import treeSvgPaths from "../imports/svg-e66apwwwrzk";
import { getStudentsByPhone } from "../data/students";
import { generateReceiptPDF } from "../utils/pdfGenerator";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./ui/sonner";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Filter, X } from "lucide-react";

export interface PaymentReceipt {
  date: string;
  day: string;
  receiptNo: string;
  paymentMethod: string;
  amount: string;
  balanceAfter: string;
}

export interface PaymentData {
  date: string;
  day: string;
  title: string;
  subtitle: string;
  amount: string;
  invoiceNo?: string;
  termInfo?: string;
  currentBalance?: string;
  receipts?: PaymentReceipt[];
  term?: number; // 1, 2, or 3
  year?: number; // e.g., 2024, 2025
}

interface HistoryPageProps {
  userName: string;
  userPhone: string;
  onBack: () => void;
  onViewAllReceipts?: (studentName: string, studentId: string, paymentData: Record<string, PaymentData[]>) => void;
}

function Logo() {
  return (
    <div className="size-[31px]">
      <div className="relative size-full">
        <div className="absolute bottom-[-22.63%] left-[-9.72%] right-[-9.72%] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 39">
            <g id="Group 15">
              <g filter="url(#filter0_d_2_352)" id="rect84">
                <path d={headerSvgPaths.p24506700} fill="var(--fill-0, #003630)" />
                <path d={headerSvgPaths.p24506700} stroke="var(--stroke-0, white)" strokeWidth="3" />
              </g>
              <g id="path60">
                <path d={headerSvgPaths.p8fdf600} fill="var(--fill-0, #003630)" />
                <path d={headerSvgPaths.p8fdf600} stroke="var(--stroke-0, #95E36C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
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

function MenuMoreVertical({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`${className} cursor-pointer touch-manipulation active:opacity-60 transition-opacity`} 
      data-name="Menu / More_Vertical"
      aria-label="More options"
    >
      <div className="absolute inset-[20.83%_45.83%]" data-name="Vector">
        <div className="absolute inset-[-2.14%_-15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
            <g id="Vector">
              <path d={svgPaths.p1533b880} fill="var(--fill-0, #2D3648)" />
              <path d={svgPaths.p2de19e00} fill="var(--fill-0, #2D3648)" />
              <path d={svgPaths.p2b40bf80} fill="var(--fill-0, #2D3648)" />
              <path d={svgPaths.p1533b880} stroke="var(--stroke-0, #2D3648)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2de19e00} stroke="var(--stroke-0, #2D3648)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2b40bf80} stroke="var(--stroke-0, #2D3648)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}

function ChildPill({ name, id, isActive, onClick }: { name: string; id: string; isActive: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        ${isActive 
          ? 'bg-gradient-to-br from-[#95e36c] to-[#7dd054] shadow-[0px_4px_12px_rgba(149,227,108,0.3)]' 
          : 'bg-[#f9fafb] hover:bg-[#f3f4f6] shadow-sm'
        } 
        rounded-[12px] px-[24px] py-[12px] cursor-pointer touch-manipulation active:scale-95 transition-all flex-shrink-0 border-[1.5px] 
        ${isActive ? 'border-[#7dd054]' : 'border-[#e5e7eb]'}
      `}
    >
      <div className={`font-['Inter:${isActive ? 'Bold' : 'Medium'},sans-serif] ${isActive ? 'font-bold' : 'font-medium'} leading-[15px] text-[11px] tracking-[-0.15px] ${isActive ? 'text-[#003630]' : 'text-[#6b7280]'}`}>
        <p className="mb-0">{name}</p>
        <p className={`${isActive ? 'opacity-90' : 'opacity-70'}`}>{id}</p>
      </div>
    </button>
  );
}

function PaymentPopup({ 
  onClose, 
  onViewReceipt,
  paymentData
}: { 
  onClose: () => void; 
  onViewReceipt: () => void;
  paymentData?: {
    title: string;
    subtitle: string;
    amount: string;
    studentName: string;
    studentId: string;
  };
}) {
  const handleDownloadReceipt = () => {
    if (!paymentData) {
      toast.error("Payment data not available");
      return;
    }

    try {
      // Extract receipt number from subtitle
      const receiptNumberMatch = paymentData.subtitle.match(/Receipt No\\.\\s*(\d+)/);
      const receiptNumber = receiptNumberMatch ? receiptNumberMatch[1] : "0000";
      
      // Parse amount - remove "K" prefix and parse as number
      const amountValue = parseFloat(paymentData.amount.replace('K', '').replace(/,/g, ''));
      
      // Generate a reference number from receipt number
      const refNumber = `000${receiptNumber}`.slice(-12);
      
      // Generate current date and time
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
      
      generateReceiptPDF({
        schoolName: "Twalumbu Educational Center",
        totalAmount: amountValue,
        refNumber,
        dateTime,
        scheduleId,
        services: [{
          id: '1',
          description: paymentData.title.replace('Paid ', ''),
          amount: amountValue,
          invoiceNo: receiptNumber,
          studentName: `${paymentData.studentName} - ${paymentData.studentId}`
        }]
      });
      
      toast.success("Receipt downloaded successfully!");
      onClose();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download receipt. Please try again.");
    }
  };
  return (
    <>
      {/* Backdrop with Layered Blur */}
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/25" />
        <div className="absolute inset-0 backdrop-blur-[4px]" />
      </motion.div>
      
      {/* Bottom Sheet Popup */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[600px]"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ 
          type: "spring",
          damping: 30,
          stiffness: 350,
          mass: 0.8
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[6px]">
          <div className="w-[36px] h-[5px] bg-white/90 rounded-full shadow-sm" />
        </div>

        <div className="bg-white/98 backdrop-blur-[20px] rounded-t-[32px] shadow-[0px_-6px_24px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#95e36c]/50 to-transparent" />
          
          {/* Content */}
          <div className="px-[24px] pt-[24px] pb-[32px]">
            <h3 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[20px] text-[#003630] tracking-[-0.4px] mb-[20px]">
              Receipt Options
            </h3>
            
            <div className="space-y-[10px]">
              {/* View Receipt Button */}
              <button 
                onClick={onViewReceipt}
                className="w-full group touch-manipulation active:scale-[0.98] transition-transform"
              >
                <div className="relative rounded-[14px] px-[20px] py-[16px] bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm transition-all">
                  <div className="flex items-center gap-[14px]">
                    <div className="w-[40px] h-[40px] bg-gradient-to-br from-[#f5f7f9] to-[#e5e7eb] rounded-[12px] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 3.75C5.83333 3.75 2.275 6.34167 1.25 10C2.275 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.725 13.6583 18.75 10C17.725 6.34167 14.1667 3.75 10 3.75Z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[15px] text-[#003630] tracking-[-0.2px]">
                      View Receipt
                    </span>
                  </div>
                </div>
              </button>
              
              {/* Download Receipt Button */}
              <button
                onClick={handleDownloadReceipt}
                className="w-full group touch-manipulation active:scale-[0.98] transition-transform"
              >
                <div className="relative rounded-[14px] px-[20px] py-[16px] bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm transition-all">
                  <div className="flex items-center gap-[14px]">
                    <div className="w-[40px] h-[40px] bg-gradient-to-br from-[#f5f7f9] to-[#e5e7eb] rounded-[12px] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[15px] text-[#003630] tracking-[-0.2px]">
                      Download Receipt
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Safe Area */}
          <div className="h-[env(safe-area-inset-bottom,20px)] bg-white/98" />
        </div>
      </motion.div>
    </>
  );
}

function FilterPopup({
  onClose,
  selectedTerm,
  selectedYear,
  onApply,
}: {
  onClose: () => void;
  selectedTerm: number | null;
  selectedYear: number | null;
  onApply: (term: number | null, year: number | null) => void;
}) {
  const [localTerm, setLocalTerm] = useState<number | null>(selectedTerm);
  const [localYear, setLocalYear] = useState<number | null>(selectedYear);

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const terms = [1, 2, 3];

  const handleApply = () => {
    onApply(localTerm, localYear);
    onClose();
  };

  const handleClear = () => {
    setLocalTerm(null);
    setLocalYear(null);
  };

  return (
    <>
      {/* Backdrop with unique blur pattern */}
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 backdrop-blur-[8px]" />
      </motion.div>

      {/* Bottom Sheet Style Popup */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[600px]"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ 
          type: "spring",
          damping: 35,
          stiffness: 400,
          mass: 0.8
        }}
      >
        {/* Drag handle area */}
        <div className="flex justify-center pt-[12px] pb-[8px]">
          <div className="w-[36px] h-[5px] bg-white/80 rounded-full shadow-sm" />
        </div>

        <div className="bg-white/95 backdrop-blur-[20px] rounded-t-[32px] shadow-[0px_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Decorative gradient top border */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#95e36c] to-transparent" />
          
          {/* Content */}
          <div className="px-[24px] pt-[28px] pb-[40px]">
            {/* Header with unique close button */}
            <div className="flex items-start justify-between mb-[32px]">
              <div>
                <div className="flex items-center gap-[8px] mb-[6px]">
                  <div className="w-[4px] h-[20px] bg-gradient-to-b from-[#95e36c] to-[#7dd054] rounded-full" />
                  <h2 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[24px] text-[#003630] tracking-[-0.5px] leading-[1.1]">
                    Filter
                  </h2>
                </div>
                <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.1px] ml-[12px]">
                  Refine your payment history
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[#f5f7f9]/60 backdrop-blur-sm border border-[#e5e7eb]/50 hover:bg-[#e5e7eb]/80 active:scale-90 transition-all touch-manipulation shadow-sm"
              >
                <X className="w-[16px] h-[16px] text-[#6b7280]" strokeWidth={2.5} />
              </button>
            </div>

            {/* Term Selection - Segmented Control Style */}
            <div className="mb-[28px]">
              <label className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#6b7280] mb-[12px] block uppercase tracking-[1px] pl-[4px]">
                Academic Term
              </label>
              <div className="relative bg-[#f5f7f9]/80 backdrop-blur-sm rounded-[16px] p-[4px] border border-[#e5e7eb]/50">
                <div className="grid grid-cols-4 gap-[4px] relative">
                  {[null, ...terms].map((term, index) => {
                    const isSelected = localTerm === term;
                    return (
                      <button
                        key={term === null ? 'all' : term}
                        onClick={() => setLocalTerm(term)}
                        className="relative z-10 py-[12px] rounded-[12px] font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[14px] transition-all touch-manipulation active:scale-95"
                        style={{
                          color: isSelected ? '#003630' : '#9ca3af',
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="termSelector"
                            className="absolute inset-0 bg-white rounded-[12px] shadow-[0px_2px_8px_rgba(0,0,0,0.08),0px_1px_2px_rgba(0,0,0,0.06)]"
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 35 
                            }}
                          />
                        )}
                        <span className="relative z-10">
                          {term === null ? 'All' : `T${term}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Year Selection - Card Style */}
            <div className="mb-[32px]">
              <label className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#6b7280] mb-[12px] block uppercase tracking-[1px] pl-[4px]">
                Academic Year
              </label>
              <div className="space-y-[8px]">
                {[null, ...years].map((year) => {
                  const isSelected = localYear === year;
                  return (
                    <button
                      key={year === null ? 'all' : year}
                      onClick={() => setLocalYear(year)}
                      className="w-full relative group touch-manipulation active:scale-[0.98] transition-transform"
                    >
                      <div className={`
                        relative rounded-[14px] px-[20px] py-[16px] transition-all duration-200
                        ${isSelected 
                          ? 'bg-gradient-to-r from-[#95e36c]/10 to-[#7dd054]/5 border-[1.5px] border-[#95e36c]' 
                          : 'bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db]'
                        }
                      `}>
                        {/* Checkmark indicator */}
                        <div className="flex items-center justify-between">
                          <span className={`
                            font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[15px] tracking-[-0.2px] transition-colors
                            ${isSelected ? 'text-[#003630]' : 'text-[#6b7280]'}
                          `}>
                            {year === null ? 'All Years' : year}
                          </span>
                          <div className={`
                            w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all
                            ${isSelected 
                              ? 'bg-[#95e36c] scale-100' 
                              : 'bg-transparent border-[2px] border-[#d1d5db] scale-90 opacity-50'
                            }
                          `}>
                            {isSelected && (
                              <motion.svg
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 25
                                }}
                                width="12"
                                height="10"
                                viewBox="0 0 12 10"
                                fill="none"
                              >
                                <path
                                  d="M1.5 5L4.5 8L10.5 2"
                                  stroke="white"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons - Unique Style */}
            <div className="flex gap-[12px]">
              <button
                onClick={handleClear}
                className="flex-1 h-[52px] rounded-[16px] bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] active:scale-[0.97] transition-all font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[15px] text-[#6b7280] tracking-[-0.2px] touch-manipulation shadow-sm"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 h-[52px] rounded-[16px] bg-[#003630] hover:bg-[#004d45] active:scale-[0.97] transition-all font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] text-white tracking-[-0.2px] shadow-[0px_4px_16px_rgba(0,54,48,0.24),0px_1px_3px_rgba(0,54,48,0.12)] touch-manipulation relative overflow-hidden group"
              >
                <span className="relative z-10">Apply</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </div>

          {/* Bottom safe area */}
          <div className="h-[env(safe-area-inset-bottom,20px)] bg-white/95" />
        </div>
      </motion.div>
    </>
  );
}

function PaymentItem({ 
  date, 
  day, 
  title, 
  subtitle, 
  amount,
  onMenuClick,
  termInfo,
  currentBalance,
}: { 
  date: string; 
  day: string; 
  title: string; 
  subtitle: string; 
  amount: string;
  onMenuClick?: () => void;
  termInfo?: string;
  currentBalance?: string;
}) {
  return (
    <div className="flex items-center justify-between w-full px-[12px] py-[10px]">
      <div className="flex flex-col gap-[2px] items-center size-[18px] shrink-0">
        <div className="font-['Inter:Light',sans-serif] h-[8px] text-[8px] tracking-[-0.08px] text-black leading-[15px]">
          {date}
        </div>
        <div className="font-['Inter:Medium',sans-serif] h-[8px] text-[12px] tracking-[-0.12px] text-black leading-[15px]">
          {day}
        </div>
      </div>
      <div className="flex gap-[20px] items-start flex-1 ml-[12px]">
        <div className="flex flex-col gap-[2px] flex-1">
          <div className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[14px] text-black tracking-[-0.14px] leading-[15px]">
            {title}
          </div>
          {termInfo && currentBalance ? (
            <div className="flex gap-[10px] font-['Inter:Medium',sans-serif] text-[8px] text-neutral-900 tracking-[-0.08px] leading-[15px]">
              <span>{termInfo}</span>
              <span>{currentBalance}</span>
            </div>
          ) : (
            <div className="font-['Inter:Medium',sans-serif] text-[8px] text-[#a7aaa7] tracking-[-0.08px] leading-[15px]">
              {subtitle}
            </div>
          )}
        </div>
        <div className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[14px] text-black tracking-[-0.14px] leading-[15px] whitespace-nowrap">
          {amount}
        </div>
        <MenuMoreVertical className="overflow-clip relative shrink-0 size-[20px]" onClick={onMenuClick} />
      </div>
    </div>
  );
}

function PaymentReceiptItem({
  date,
  day,
  receiptNo,
  paymentMethod,
  amount,
  balanceAfter,
  onMenuClick,
}: {
  date: string;
  day: string;
  receiptNo: string;
  paymentMethod: string;
  amount: string;
  balanceAfter: string;
  onMenuClick?: () => void;
}) {
  return (
    <div className="flex gap-[4px] items-end w-full">
      {/* Tree connector line */}
      <div className="h-[57px] relative shrink-0 w-[42px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 57">
          <g id="Frame 1707478934">
            <path d="M10 12V45H32" id="Vector 1" stroke="var(--stroke-0, black)" />
          </g>
        </svg>
      </div>

      {/* Receipt content */}
      <div className="flex gap-[19px] items-center flex-1">
        <div className="flex flex-col gap-[2px] items-center size-[18px] shrink-0">
          <div className="font-['Inter:Light',sans-serif] h-[8px] text-[8px] tracking-[-0.08px] text-black leading-[15px]">
            {date}
          </div>
          <div className="font-['Inter:Medium',sans-serif] h-[8px] text-[12px] tracking-[-0.12px] text-black leading-[15px]">
            {day}
          </div>
        </div>

        <div className="flex gap-[23px] items-start flex-1">
          <div className="flex flex-col gap-[2px] flex-1">
            <div className="font-['IBM_Plex_Sans_Devanagari:Light',sans-serif] text-[10px] text-black tracking-[-0.1px] leading-[15px]">
              {receiptNo} - {paymentMethod}
            </div>
            <div className="font-['Inter:Light',sans-serif] text-[8px] text-neutral-900 tracking-[-0.08px] leading-[15px]">
              Balance after payment: {balanceAfter}
            </div>
          </div>
          <div className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[12px] text-black tracking-[-0.12px] leading-[15px] whitespace-nowrap">
            {amount}
          </div>
          <MenuMoreVertical className="overflow-clip relative shrink-0 size-[20px]" onClick={onMenuClick} />
        </div>
      </div>
    </div>
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

export default function HistoryPage({ userName, userPhone, onBack, onViewAllReceipts }: HistoryPageProps) {
  // Get students for the logged-in parent based on their phone number
  const studentData = getStudentsByPhone(userPhone);
  const students = studentData.map(s => ({ name: s.name, id: s.id }));
  
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "C20012");
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [allPaymentData, setAllPaymentData] = useState<Record<string, Record<string, PaymentData[]>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  /**
   * Fetch payment history from backend
   * Transforms backend data into UI-friendly format
   */
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!userPhone) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6550ac6/payments/${userPhone}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${publicAnonKey}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error("Failed to fetch payment history:", result);
          // Load demo data if backend fails
          setAllPaymentData(getDemoPaymentData());
          setIsLoading(false);
          return;
        }

        // Transform backend payment data to UI format
        const groupedData: Record<string, Record<string, PaymentData[]>> = {};

        result.payments.forEach((payment: any) => {
          const date = new Date(payment.timestamp);
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayOfMonth = date.getDate().toString();
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

          // Extract student ID and payment-level term/year
          const studentId = payment.studentId || "Unknown";
          const paymentTerm = payment.term || 1;
          const paymentYear = payment.year || date.getFullYear();
          
          if (!groupedData[studentId]) {
            groupedData[studentId] = {};
          }
          
          if (!groupedData[studentId][monthKey]) {
            groupedData[studentId][monthKey] = [];
          }

          // Create payment entry (one entry per payment, not per service)
          const serviceDescriptions = payment.services.map((s: any) => s.description).join(", ");
          const paymentEntry: PaymentData = {
            date: dayOfWeek,
            day: dayOfMonth,
            title: `Paid ${serviceDescriptions}`,
            subtitle: `Receipt No. ${payment.services[0]?.invoiceNo || 'N/A'}`,
            amount: `K${payment.totalAmount.toLocaleString()}`,
            term: paymentTerm,
            year: paymentYear,
            termInfo: `Term ${paymentTerm} ${paymentYear}`,
            currentBalance: 'K0',
          };

          groupedData[studentId][monthKey].push(paymentEntry);
        });

        // Merge with demo data to show examples
        const mergedData = { ...getDemoPaymentData(), ...groupedData };
        setAllPaymentData(mergedData);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        // Load demo data on error
        setAllPaymentData(getDemoPaymentData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [userPhone]);

  const handleViewReceipt = () => {
    setOpenPopupId(null);
    if (onViewAllReceipts) {
      const currentStudent = students.find(s => s.id === selectedStudentId);
      const studentName = currentStudent?.name || "Student";
      const studentPayments = allPaymentData[selectedStudentId] || {};
      onViewAllReceipts(studentName, selectedStudentId, studentPayments);
    }
  };

  // Get current date and calculate last 3 months
  const getLastThreeMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      const year = date.getFullYear();
      const isCurrentMonth = i === 0;
      
      months.push({
        key: `${year}-${date.getMonth()}`,
        label: isCurrentMonth ? 'This Month' : `${monthName} ${year}`,
        month: date.getMonth(),
        year: year,
      });
    }
    
    return months;
  };

  const paymentsByMonth = allPaymentData[selectedStudentId] || {};

  const lastThreeMonths = getLastThreeMonths();

  // Filter payments based on selected term and year
  const filterPayments = (payments: PaymentData[]): PaymentData[] => {
    if (!selectedTerm && !selectedYear) {
      return payments;
    }

    return payments.filter(payment => {
      const termMatch = !selectedTerm || payment.term === selectedTerm;
      const yearMatch = !selectedYear || payment.year === selectedYear;
      return termMatch && yearMatch;
    });
  };

  // Apply filters and check if there are any filtered payments
  const hasAnyFilteredPayments = lastThreeMonths.some(month => {
    const payments = paymentsByMonth[month.key] || [];
    return filterPayments(payments).length > 0;
  });

  const handleApplyFilter = (term: number | null, year: number | null) => {
    setSelectedTerm(term);
    setSelectedYear(year);
  };

  return (
    <div className="bg-white min-h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[600px] md:max-w-[700px] lg:max-w-[800px] min-h-screen mx-auto">
        
        {/* Header */}
        <div className="relative h-[60px] w-full">
          <Header onBack={onBack} />
        </div>

        {/* Content */}
        <div className="relative px-[21px] pt-[53px]">
          {/* Title and Filter Button */}
          <div className="flex items-center justify-between mb-[32px]">
            <h1 className="font-['Inter:Regular',sans-serif] text-[18px] text-black tracking-[-0.18px] leading-[0.5]">
              Payment History
            </h1>
            <button
              onClick={() => setShowFilterPopup(true)}
              className="relative group touch-manipulation active:scale-95 transition-transform"
            >
              <div className={`
                relative flex items-center gap-[8px] px-[16px] py-[10px] rounded-[14px] transition-all duration-200
                ${(selectedTerm || selectedYear)
                  ? 'bg-gradient-to-r from-[#003630] to-[#004d45] shadow-[0px_4px_12px_rgba(0,54,48,0.2)]'
                  : 'bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm'
                }
              `}>
                <Filter 
                  className={`w-[16px] h-[16px] transition-colors ${
                    (selectedTerm || selectedYear) ? 'text-white' : 'text-[#003630]'
                  }`}
                  strokeWidth={2.5}
                />
                <span className={`
                  font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[13px] tracking-[-0.2px] transition-colors
                  ${(selectedTerm || selectedYear) ? 'text-white' : 'text-[#003630]'}
                `}>
                  {(selectedTerm || selectedYear) ? 'Filtered' : 'Filter'}
                </span>
                {(selectedTerm || selectedYear) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-[18px] h-[18px] bg-[#95e36c] rounded-full flex items-center justify-center"
                  >
                    <span className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[10px] text-[#003630]">
                      {(selectedTerm ? 1 : 0) + (selectedYear ? 1 : 0)}
                    </span>
                  </motion.div>
                )}
              </div>
            </button>
          </div>

          {/* Active Filters Display - Unique Chips */}
          <AnimatePresence mode="popLayout">
            {(selectedTerm || selectedYear) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="overflow-hidden mb-[24px]"
              >
                <div className="flex flex-wrap gap-[10px]">
                  {selectedTerm && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                      className="group relative"
                    >
                      <div className="relative flex items-center gap-[10px] pl-[16px] pr-[12px] py-[10px] bg-gradient-to-r from-[#e0f7d4] to-[#d0f0c0] rounded-[12px] border-[1.5px] border-[#95e36c]/30 shadow-sm">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[#95e36c] rounded-r-full" />
                        <span className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[13px] text-[#003630] tracking-[-0.1px]">
                          Term {selectedTerm}
                        </span>
                        <button
                          onClick={() => setSelectedTerm(null)}
                          className="w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white/60 hover:bg-white active:scale-90 transition-all border border-[#95e36c]/20"
                        >
                          <X className="w-[11px] h-[11px] text-[#003630]" strokeWidth={2.5} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {selectedYear && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: 0.05
                      }}
                      className="group relative"
                    >
                      <div className="relative flex items-center gap-[10px] pl-[16px] pr-[12px] py-[10px] bg-gradient-to-r from-[#e0f7d4] to-[#d0f0c0] rounded-[12px] border-[1.5px] border-[#95e36c]/30 shadow-sm">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[#95e36c] rounded-r-full" />
                        <span className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[13px] text-[#003630] tracking-[-0.1px]">
                          {selectedYear}
                        </span>
                        <button
                          onClick={() => setSelectedYear(null)}
                          className="w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white/60 hover:bg-white active:scale-90 transition-all border border-[#95e36c]/20"
                        >
                          <X className="w-[11px] h-[11px] text-[#003630]" strokeWidth={2.5} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Child Pills */}
          <div className="flex gap-[15px] mb-[25px] overflow-x-auto overflow-y-hidden scrollbar-hide -mx-[21px] px-[21px] pb-[5px] touch-pan-x">
            {students.map((student) => (
              <ChildPill 
                key={student.id}
                name={student.name} 
                id={student.id} 
                isActive={selectedStudentId === student.id}
                onClick={() => setSelectedStudentId(student.id)}
              />
            ))}
          </div>

          {/* No Results Message for Filters - Unique Empty State */}
          {(selectedTerm || selectedYear) && !hasAnyFilteredPayments && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="relative mt-[40px] mb-[40px]"
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <Filter className="w-[180px] h-[180px] text-[#95e36c]" strokeWidth={0.5} />
              </div>

              <div className="relative bg-gradient-to-br from-white via-[#fafbfc] to-white rounded-[24px] border-[1.5px] border-[#e5e7eb] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-[32px] mx-[8px]">
                {/* Accent bar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[4px] bg-gradient-to-r from-transparent via-[#95e36c] to-transparent rounded-b-full" />
                
                <div className="flex flex-col items-center text-center">
                  {/* Icon container with unique design */}
                  <div className="relative mb-[24px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#95e36c]/20 to-[#7dd054]/10 blur-xl rounded-full" />
                    <div className="relative w-[72px] h-[72px] bg-gradient-to-br from-[#f5f7f9] to-[#e5e7eb] rounded-[20px] flex items-center justify-center border-[1.5px] border-white shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
                      <div className="absolute inset-[8px] bg-white rounded-[14px]" />
                      <Filter className="relative z-10 w-[32px] h-[32px] text-[#95e36c]" strokeWidth={2} />
                      
                      {/* Animated search indicator */}
                      <motion.div
                        className="absolute -right-[4px] -top-[4px] w-[20px] h-[20px] bg-[#003630] rounded-full flex items-center justify-center shadow-sm"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <X className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                      </motion.div>
                    </div>
                  </div>

                  <h3 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[17px] text-[#003630] mb-[8px] tracking-[-0.3px]">
                    No Results Found
                  </h3>
                  <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#6b7280] leading-[20px] max-w-[240px] tracking-[-0.1px]">
                    We couldn't find any payments matching your filters. Try selecting different criteria.
                  </p>

                  {/* Quick action button */}
                  <button
                    onClick={() => {
                      setSelectedTerm(null);
                      setSelectedYear(null);
                    }}
                    className="mt-[20px] px-[20px] py-[10px] rounded-[12px] bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#95e36c] active:scale-95 transition-all shadow-sm group"
                  >
                    <span className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[13px] text-[#6b7280] group-hover:text-[#003630] transition-colors tracking-[-0.1px]">
                      Clear All Filters
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dynamic Month Sections */}
          {lastThreeMonths.map((month) => {
            const allPayments = paymentsByMonth[month.key] || [];
            const payments = filterPayments(allPayments);
            const hasPayments = payments.length > 0;

            // Skip rendering month if no payments after filtering
            if (!hasPayments && (selectedTerm || selectedYear)) {
              return null;
            }

            return (
              <div key={month.key} className="mb-[20px]">
                <div className="relative bg-gradient-to-r from-[#f9fafb] via-[#f3f4f6] to-[#f9fafb] h-[32px] flex items-center px-[22px] mb-[12px] -mx-[21px] border-y border-[#e5e7eb]/50">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#95e36c] to-[#7dd054]" />
                  <p className="font-['Inter:Bold',sans-serif] text-[11px] text-[#003630] tracking-[-0.15px] leading-[15px] uppercase">
                    {month.label}
                  </p>
                </div>
                
                {hasPayments ? (
                  <>
                    {payments.map((payment, index) => {
                      const paymentId = `${month.key}-${index}`;
                      const hasReceipts = payment.receipts && payment.receipts.length > 0;
                      
                      return (
                        <div key={index}>
                          {/* Main Invoice/Payment Item */}
                          <PaymentItem
                            date={payment.date}
                            day={payment.day}
                            title={payment.title}
                            subtitle={payment.subtitle}
                            amount={payment.amount}
                            termInfo={payment.termInfo}
                            currentBalance={payment.currentBalance}
                            onMenuClick={() => {
                              setOpenPopupId(paymentId);
                              setSelectedPayment(payment);
                            }}
                          />
                          
                          {/* Receipt Sub-items with Tree Lines */}
                          {hasReceipts && payment.receipts!.map((receipt, receiptIndex) => (
                            <PaymentReceiptItem
                              key={receiptIndex}
                              date={receipt.date}
                              day={receipt.day}
                              receiptNo={receipt.receiptNo}
                              paymentMethod={receipt.paymentMethod}
                              amount={receipt.amount}
                              balanceAfter={receipt.balanceAfter}
                              onMenuClick={() => {
                                setOpenPopupId(`${paymentId}-receipt-${receiptIndex}`);
                                setSelectedPayment({
                                  ...payment,
                                  title: receipt.receiptNo,
                                  subtitle: receipt.paymentMethod,
                                  amount: receipt.amount,
                                });
                              }}
                            />
                          ))}
                          
                          {index < payments.length - 1 && (
                            <div className="h-[1px] bg-[#f5f4f7] mx-[22px]" />
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex justify-center py-[20px]">
                    <p className="font-['Inter:Semi_Bold',sans-serif] text-[10px] text-[rgba(45,54,72,0.52)] tracking-[-0.1px] leading-[15px]">
                      No Payments in {month.label === 'This Month' ? 'This Month' : month.label.split(' ')[0]}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Popup */}
        {openPopupId && (
          <PaymentPopup 
            onClose={() => setOpenPopupId(null)} 
            onViewReceipt={handleViewReceipt}
            paymentData={selectedPayment ? {
              title: selectedPayment.title,
              subtitle: selectedPayment.subtitle,
              amount: selectedPayment.amount,
              studentName: students.find(s => s.id === selectedStudentId)?.name || "Student",
              studentId: selectedStudentId
            } : undefined}
          />
        )}

        {/* Filter Popup */}
        <AnimatePresence>
          {showFilterPopup && (
            <FilterPopup
              onClose={() => setShowFilterPopup(false)}
              selectedTerm={selectedTerm}
              selectedYear={selectedYear}
              onApply={handleApplyFilter}
            />
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
}

/**
 * Demo payment data showcasing hierarchical structure
 * Shows invoices with multiple receipt payments across different terms and years
 */
const getDemoPaymentData = (): Record<string, Record<string, PaymentData[]>> => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  return {
    'C20012': {
      [`${currentYear}-${currentMonth}`]: [
        {
          date: 'Wed',
          day: '19',
          title: 'School Fees - Grade 3B',
          subtitle: 'Invoice No. INV-001',
          amount: 'K1,500',
          invoiceNo: 'INV-001',
          termInfo: 'Term 1 2025',
          currentBalance: 'K500',
          term: 1,
          year: currentYear,
          receipts: [
            {
              date: 'Wed',
              day: '19',
              receiptNo: 'Receipt No. 00352',
              paymentMethod: 'Airtel Money',
              amount: 'K500',
              balanceAfter: 'K1,000',
            },
            {
              date: 'Fri',
              day: '21',
              receiptNo: 'Receipt No. 00355',
              paymentMethod: 'MTN Mobile Money',
              amount: 'K500',
              balanceAfter: 'K500',
            },
          ],
        },
        {
          date: 'Mon',
          day: '17',
          title: 'Lab Fees - Science Department',
          subtitle: 'Invoice No. INV-002',
          amount: 'K300',
          invoiceNo: 'INV-002',
          termInfo: 'Term 1 2025',
          currentBalance: 'K0',
          term: 1,
          year: currentYear,
          receipts: [
            {
              date: 'Mon',
              day: '17',
              receiptNo: 'Receipt No. 00348',
              paymentMethod: 'Airtel Money',
              amount: 'K300',
              balanceAfter: 'K0',
            },
          ],
        },
        {
          date: 'Fri',
          day: '22',
          title: 'School Bus - January',
          subtitle: 'Invoice No. INV-006',
          amount: 'K200',
          invoiceNo: 'INV-006',
          termInfo: 'Term 1 2025',
          currentBalance: 'K0',
          term: 1,
          year: currentYear,
          receipts: [
            {
              date: 'Fri',
              day: '22',
              receiptNo: 'Receipt No. 00358',
              paymentMethod: 'Bank Transfer',
              amount: 'K200',
              balanceAfter: 'K0',
            },
          ],
        },
      ],
      [`${currentYear}-${currentMonth - 1}`]: [
        {
          date: 'Thu',
          day: '12',
          title: 'School Fees - Grade 3B',
          subtitle: 'Invoice No. INV-003',
          amount: 'K1,800',
          invoiceNo: 'INV-003',
          termInfo: 'Term 3 2024',
          currentBalance: 'K0',
          term: 3,
          year: currentYear - 1,
          receipts: [
            {
              date: 'Thu',
              day: '12',
              receiptNo: 'Receipt No. 00290',
              paymentMethod: 'Bank Transfer',
              amount: 'K900',
              balanceAfter: 'K900',
            },
            {
              date: 'Fri',
              day: '20',
              receiptNo: 'Receipt No. 00295',
              paymentMethod: 'Airtel Money',
              amount: 'K900',
              balanceAfter: 'K0',
            },
          ],
        },
        {
          date: 'Tue',
          day: '8',
          title: 'Canteen Fees - December',
          subtitle: 'Invoice No. INV-007',
          amount: 'K150',
          invoiceNo: 'INV-007',
          termInfo: 'Term 3 2024',
          currentBalance: 'K0',
          term: 3,
          year: currentYear - 1,
          receipts: [
            {
              date: 'Tue',
              day: '8',
              receiptNo: 'Receipt No. 00288',
              paymentMethod: 'MTN Mobile Money',
              amount: 'K150',
              balanceAfter: 'K0',
            },
          ],
        },
      ],
      [`${currentYear}-${currentMonth - 2}`]: [
        {
          date: 'Mon',
          day: '5',
          title: 'School Fees - Grade 3B',
          subtitle: 'Invoice No. INV-008',
          amount: 'K1,500',
          invoiceNo: 'INV-008',
          termInfo: 'Term 2 2024',
          currentBalance: 'K0',
          term: 2,
          year: currentYear - 1,
          receipts: [
            {
              date: 'Mon',
              day: '5',
              receiptNo: 'Receipt No. 00250',
              paymentMethod: 'Bank Transfer',
              amount: 'K750',
              balanceAfter: 'K750',
            },
            {
              date: 'Wed',
              day: '14',
              receiptNo: 'Receipt No. 00255',
              paymentMethod: 'Airtel Money',
              amount: 'K750',
              balanceAfter: 'K0',
            },
          ],
        },
      ],
    },
    'C30013': {
      [`${currentYear}-${currentMonth}`]: [
        {
          date: 'Fri',
          day: '22',
          title: 'School Fees - Grade 4A',
          subtitle: 'Invoice No. INV-004',
          amount: 'K2,000',
          invoiceNo: 'INV-004',
          termInfo: 'Term 1 2025',
          currentBalance: 'K800',
          term: 1,
          year: currentYear,
          receipts: [
            {
              date: 'Fri',
              day: '22',
              receiptNo: 'Receipt No. 00360',
              paymentMethod: 'MTN Mobile Money',
              amount: 'K600',
              balanceAfter: 'K1,400',
            },
            {
              date: 'Mon',
              day: '25',
              receiptNo: 'Receipt No. 00362',
              paymentMethod: 'Airtel Money',
              amount: 'K600',
              balanceAfter: 'K800',
            },
          ],
        },
      ],
      [`${currentYear}-${currentMonth - 1}`]: [
        {
          date: 'Wed',
          day: '18',
          title: 'Sports Fees - Athletics',
          subtitle: 'Invoice No. INV-005',
          amount: 'K150',
          invoiceNo: 'INV-005',
          termInfo: 'Term 3 2024',
          currentBalance: 'K0',
          term: 3,
          year: currentYear - 1,
          receipts: [
            {
              date: 'Wed',
              day: '18',
              receiptNo: 'Receipt No. 00285',
              paymentMethod: 'Airtel Money',
              amount: 'K150',
              balanceAfter: 'K0',
            },
          ],
        },
      ],
      [`${currentYear}-${currentMonth - 2}`]: [
        {
          date: 'Thu',
          day: '10',
          title: 'Uniform Purchase',
          subtitle: 'Invoice No. INV-009',
          amount: 'K350',
          invoiceNo: 'INV-009',
          termInfo: 'Term 2 2024',
          currentBalance: 'K0',
          term: 2,
          year: currentYear - 1,
          receipts: [
            {
              date: 'Thu',
              day: '10',
              receiptNo: 'Receipt No. 00260',
              paymentMethod: 'Bank Transfer',
              amount: 'K350',
              balanceAfter: 'K0',
            },
          ],
        },
      ],
    },
    'C20013': {
      [`${currentYear}-${currentMonth}`]: [
        {
          date: 'Mon',
          day: '17',
          title: 'School Fees - Grade 5A',
          subtitle: 'Invoice No. INV-006',
          amount: 'K1,200',
          invoiceNo: 'INV-006',
          termInfo: 'Term 1 2025',
          currentBalance: 'K400',
          term: 1,
          year: currentYear,
          receipts: [
            {
              date: 'Mon',
              day: '17',
              receiptNo: 'Receipt No. 00350',
              paymentMethod: 'Bank Transfer',
              amount: 'K400',
              balanceAfter: 'K800',
            },
            {
              date: 'Wed',
              day: '19',
              receiptNo: 'Receipt No. 00353',
              paymentMethod: 'MTN Mobile Money',
              amount: 'K400',
              balanceAfter: 'K400',
            },
          ],
        },
      ],
      [`${currentYear}-${currentMonth - 1}`]: [
        {
          date: 'Tue',
          day: '15',
          title: 'Library Fees',
          subtitle: 'Invoice No. INV-007',
          amount: 'K80',
          invoiceNo: 'INV-007',
          termInfo: 'Term 3 2024',
          currentBalance: 'K0',
          term: 3,
          year: currentYear - 1,
          receipts: [
            {
              date: 'Tue',
              day: '15',
              receiptNo: 'Receipt No. 00280',
              paymentMethod: 'Airtel Money',
              amount: 'K80',
              balanceAfter: 'K0',
            },
          ],
        },
      ],
      [`${currentYear}-${currentMonth - 2}`]: [],
    },
    'C20014': {
      [`${currentYear}-${currentMonth}`]: [],
      [`${currentYear}-${currentMonth - 1}`]: [],
      [`${currentYear}-${currentMonth - 2}`]: [
        {
          date: 'Tue',
          day: '05',
          title: 'School Fees - Grade 6B',
          subtitle: 'Invoice No. INV-008',
          amount: 'K1,000',
          invoiceNo: 'INV-008',
          termInfo: 'Term 3 2024',
          currentBalance: 'K0',
          receipts: [
            {
              date: 'Tue',
              day: '05',
              receiptNo: 'Receipt No. 00180',
              paymentMethod: 'Bank Transfer',
              amount: 'K500',
              balanceAfter: 'K500',
            },
            {
              date: 'Thu',
              day: '14',
              receiptNo: 'Receipt No. 00185',
              paymentMethod: 'Airtel Money',
              amount: 'K500',
              balanceAfter: 'K0',
            },
          ],
        },
      ],
    },
  };
};