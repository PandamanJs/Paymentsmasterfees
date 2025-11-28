import { useState, useEffect, useRef } from "react";
import svgPaths from "../imports/svg-f4rs0uzy0h";
import headerSvgPaths from "../imports/svg-4boykq1z8d";
import ReceiptsPage from "./ReceiptsPage";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Service {
  id: string;
  description: string;
  amount: number;
  invoiceNo: string;
  studentName: string;
}

interface CheckoutPage2Props {
  services: Service[];
  onBack: () => void;
  onProceed: (amount: number) => void;
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-[66px] w-full relative">
      <div aria-hidden="true" className="absolute border-[#e6e6e6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="absolute left-1/2 translate-x-[-50%] top-[17px] flex items-center gap-[16px]">
        <Logo />
        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] leading-[normal] not-italic text-[20px] text-black text-nowrap whitespace-pre">master-fees</p>
      </div>
    </div>
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

function ServiceItem({ description, amount }: { description: string; amount: number }) {
  return (
    <div className="flex items-center justify-between w-full py-2">
      <div className="flex flex-col gap-1">
        <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[13px] text-black leading-tight">{description}</p>
        <p className="font-['IBM_Plex_Sans_Devanagari:Light',sans-serif] text-[10px] text-gray-500">Term 1 2025</p>
      </div>
      <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[13px] text-black">K{amount.toLocaleString()}</p>
    </div>
  );
}

function AmountInput({ serviceId, value, onChange }: { serviceId: string; value: number; onChange: (serviceId: string, value: number) => void }) {
  const [inputValue, setInputValue] = useState(value.toFixed(2));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Parse the value and update parent state
    const parsed = parseFloat(newValue.replace(/,/g, ''));
    if (!isNaN(parsed)) {
      onChange(serviceId, parsed);
    } else if (newValue === '' || newValue === '0') {
      onChange(serviceId, 0);
    }
  };

  return (
    <div className="relative w-full h-[48px] mt-2">
      <div className="box-border flex items-center gap-2 h-full px-3 rounded-[12px] border-[1.5px] border-[#e5e7eb] bg-[#f9fafb] focus-within:border-[#95e36c] focus-within:bg-white transition-all shadow-sm">
        <span className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-[#6b7280] shrink-0">ZMW</span>
        <input 
          type="text" 
          value={inputValue}
          onChange={handleChange}
          className="flex-1 min-w-0 font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[15px] text-right text-[#003630] bg-transparent outline-none pr-1 tracking-[-0.2px]"
        />
      </div>
    </div>
  );
}

function StudentServiceGroup({ 
  studentName, 
  services, 
  inputAmounts, 
  onAmountChange 
}: { 
  studentName: string; 
  services: Service[]; 
  inputAmounts: Record<string, number>;
  onAmountChange: (serviceId: string, value: number) => void;
}) {
  return (
    <div className="w-full animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="mb-4 flex items-center gap-2 bg-gradient-to-br from-[#95e36c]/15 to-[#7dd054]/5 border-[1.5px] border-[#95e36c]/30 rounded-[12px] py-[8px] px-[12px] shadow-sm">
        <div className="h-[12px] w-[3px] bg-gradient-to-b from-[#95e36c] to-[#7dd054] rounded-full"></div>
        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[11px] text-[#003630] tracking-[-0.15px] uppercase">
          {studentName}
        </p>
      </div>
      <div className="glass-light rounded-[14px] p-3 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-thin border-[1.5px] border-[#e5e7eb] shadow-sm" 
        style={{
          background: 'linear-gradient(135deg, rgba(248, 249, 250, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
        }}>
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className="card card-interactive rounded-[14px] p-3 animate-fade-in group flex-shrink-0 w-[280px] snap-center border-[1.5px] border-[#e5e7eb] shadow-sm"
            style={{ 
              animationDelay: `${150 + index * 50}ms`,
              background: 'white'
            }}
          >
            <ServiceItem 
              description={service.description}
              amount={service.amount}
            />
            <div className="mt-2 pt-2 border-t border-gradient">
              <AmountInput 
                serviceId={service.id}
                value={inputAmounts[service.id] || 0}
                onChange={onAmountChange}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentCarouselCard({ 
  studentName, 
  services, 
  inputAmounts, 
  onAmountChange 
}: { 
  studentName: string; 
  services: Service[]; 
  inputAmounts: Record<string, number>;
  onAmountChange: (serviceId: string, value: number) => void;
}) {
  return (
    <div className="w-full px-2">
      <div className="w-full animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="mb-4 flex items-center gap-2 justify-center bg-gradient-to-br from-[#95e36c]/15 to-[#7dd054]/5 border-[1.5px] border-[#95e36c]/30 rounded-[12px] py-[10px] px-[16px] shadow-sm">
          <div className="h-[14px] w-[3px] bg-gradient-to-b from-[#95e36c] to-[#7dd054] rounded-full"></div>
          <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[13px] text-[#003630] tracking-[-0.15px] uppercase">
            {studentName}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="card card-interactive rounded-[14px] p-3 animate-fade-in group w-full border-[1.5px] border-[#e5e7eb] shadow-sm"
              style={{ 
                animationDelay: `${150 + index * 50}ms`,
                background: 'linear-gradient(135deg, rgba(248, 249, 250, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
              }}
            >
              <ServiceItem 
                description={service.description}
                amount={service.amount}
              />
              <div className="mt-2 pt-2 border-t border-gradient">
                <AmountInput 
                  serviceId={service.id}
                  value={inputAmounts[service.id] || 0}
                  onChange={onAmountChange}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Group({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[12px] text-black">Total</p>
      <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[24px] text-black">{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  );
}

function Frame20({ total }: { total: number }) {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] rounded-[18px] w-full max-w-[327px] mx-auto">
      <div className="box-border content-stretch flex flex-col gap-[12px] items-start overflow-clip pb-[24px] pt-[18px] px-[18px] relative rounded-[inherit] border-[1.5px] border-[#e5e7eb] bg-gradient-to-br from-[#f9fafb] via-white to-[#f3f4f6] shadow-[0px_4px_12px_rgba(0,54,48,0.08)]">
        <div className="h-[28px] overflow-clip relative shrink-0 w-[28px] p-[4px] rounded-[8px] bg-gradient-to-br from-[#95e36c]/15 to-[#7dd054]/5 border-[1.5px] border-[#95e36c]/30" data-name="Interface / Shopping_Bag_01">
          <div className="absolute inset-[16.67%_12.5%]" data-name="Vector">
            <div className="absolute inset-[-6%_-5.56%]" style={{ "--stroke-0": "rgba(0, 54, 48, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
                <path d={svgPaths.p2be3f780} id="Vector" stroke="var(--stroke-0, #003630)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-[#003630] tracking-[-0.2px] w-[min-content]">Credit Payment</p>
        <Group total={total} />
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.9998781681060791)+(var(--transform-inner-height)*0.015611708164215088)))] items-center justify-center right-[calc(40%)] top-[-16px] w-[calc(1px*((var(--transform-inner-height)*0.9998781681060791)+(var(--transform-inner-width)*0.015611708164215088)))]" style={{ "--transform-inner-width": "77.734375", "--transform-inner-height": "39.03125" } as React.CSSProperties}>
          <div className="flex-none rotate-[270.895deg]">
            <div className="h-[39.042px] relative w-[77.746px]" data-name="path60">
              <div className="absolute inset-[-32.02%_-16.08%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 103 65">
                  <path d={svgPaths.p1c1f0680} id="path60" stroke="var(--stroke-0, #E0F7D4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.9937769770622253)+(var(--transform-inner-height)*0.11138830333948135)))] items-center justify-center right-[calc(30%)] top-[-34.81px] w-[calc(1px*((var(--transform-inner-height)*0.9937769770622253)+(var(--transform-inner-width)*0.11138830333948135)))]" style={{ "--transform-inner-width": "102.734375", "--transform-inner-height": "64.03125" } as React.CSSProperties}>
          <div className="flex-none rotate-[263.605deg]">
            <div className="h-[64.042px] relative w-[102.745px]" data-name="path60 (Stroke)">
              <div className="absolute inset-[-0.78%_-0.49%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 104 66">
                  <path d={svgPaths.p32888500} id="path60 (Stroke)" stroke="var(--stroke-0, #003630)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.9519173502922058)+(var(--transform-inner-height)*0.3063550889492035)))] items-center justify-center right-[calc(15%)] top-[-35px] w-[calc(1px*((var(--transform-inner-height)*0.9519173502922058)+(var(--transform-inner-width)*0.3063550889492035)))]" style={{ "--transform-inner-width": "77.734375", "--transform-inner-height": "39.03125" } as React.CSSProperties}>
          <div className="flex-none rotate-[252.16deg]">
            <div className="h-[39.042px] relative w-[77.746px]" data-name="path60">
              <div className="absolute inset-[-32.02%_-16.08%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 103 65">
                  <path d={svgPaths.p1c1f0680} id="path60" stroke="var(--stroke-0, #003630)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[18px]" />
    </div>
  );
}

function IconRightWrapper() {
  return (
    <div className="h-[24px] relative shrink-0 w-[16px]" data-name="Icon Right Wrapper">
      <div className="absolute left-0 overflow-clip size-[24px] top-0" data-name="Icon Right" />
    </div>
  );
}

function Group1({ 
  services, 
  inputAmounts, 
  onAmountChange, 
  onProceed 
}: { 
  services: Service[]; 
  inputAmounts: Record<string, number>;
  onAmountChange: (serviceId: string, value: number) => void;
  onProceed: () => void;
}) {
  // Calculate total from input amounts
  const total = Object.values(inputAmounts).reduce((sum, amount) => sum + amount, 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Group services by student
  const servicesByStudent = services.reduce((acc, service) => {
    if (!acc[service.studentName]) {
      acc[service.studentName] = [];
    }
    acc[service.studentName].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const studentEntries = Object.entries(servicesByStudent);
  const totalStudents = studentEntries.length;

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const swipeThreshold = 50;
    const distance = touchStart - touchEnd;
    
    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0 && currentSlide < totalStudents - 1) {
        // Swipe left - go to next
        setCurrentSlide(currentSlide + 1);
      } else if (distance < 0 && currentSlide > 0) {
        // Swipe right - go to previous
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < totalStudents - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-4">
      <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] leading-[24px] not-italic text-[18px] text-black tracking-[-0.18px] mb-4">Checkout</p>
      
      <div className="mb-4">
        <Frame20 total={total} />
      </div>
      
      <div className="flex-1 min-h-0 mb-4">
        <div className="bg-white box-border flex flex-col gap-4 h-full overflow-y-auto pb-6 pt-5 px-4 rounded-[18px] w-full max-w-[327px] mx-auto relative">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[12px] text-black">Enter the amount you want to pay.</p>
            {totalStudents > 1 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-[#003630] to-[#004d45] px-[10px] py-[6px] rounded-[10px] shadow-[0px_2px_8px_rgba(0,54,48,0.2)] border-[1.5px] border-[#003630]">
                <span className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[11px] text-white tracking-[-0.1px]">
                  {currentSlide + 1}/{totalStudents}
                </span>
              </div>
            )}
          </div>
          
          {/* Swipe Instruction Banner */}
          {totalStudents > 1 && (
            <div className="relative">
              <div className="bg-gradient-to-r from-[#95e36c]/20 via-[#95e36c]/10 to-[#95e36c]/20 rounded-[12px] px-4 py-[10px] mb-3 flex items-center justify-center gap-2 border-[1.5px] border-[#95e36c]/30 shadow-[0px_2px_8px_rgba(149,227,108,0.15)] backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-[12px]" style={{ animationDuration: '2s' }}></div>
                <ChevronLeft className="w-4 h-4 text-[#003630] relative z-10" style={{ animation: 'bounce-horizontal 1.5s ease-in-out infinite' }} />
                <span className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-[#003630] tracking-[-0.1px] relative z-10">
                  Swipe to view other students
                </span>
                <ChevronRight className="w-4 h-4 text-[#003630] relative z-10" style={{ animation: 'bounce-horizontal 1.5s ease-in-out infinite', animationDelay: '0.75s' }} />
              </div>
              <style>{`
                @keyframes bounce-horizontal {
                  0%, 100% { transform: translateX(0); }
                  50% { transform: translateX(4px); }
                }
              `}</style>
            </div>
          )}
          
          <div className="relative">
            {totalStudents > 1 ? (
              <>
                <div className="relative">
                  {/* Left Arrow Button */}
                  {currentSlide > 0 && (
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#003630] rounded-full p-2 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] active:scale-95 transition-all hover:bg-[#003630] hover:text-white group"
                      style={{ marginLeft: '-12px' }}
                    >
                      <ChevronLeft className="w-5 h-5 text-[#003630] group-hover:text-white" />
                    </button>
                  )}
                  
                  {/* Right Arrow Button */}
                  {currentSlide < totalStudents - 1 && (
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#003630] rounded-full p-2 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] active:scale-95 transition-all hover:bg-[#003630] hover:text-white group"
                      style={{ marginRight: '-12px' }}
                    >
                      <ChevronRight className="w-5 h-5 text-[#003630] group-hover:text-white" />
                    </button>
                  )}
                  
                  <div 
                    ref={containerRef}
                    className="overflow-hidden relative rounded-[14px]"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Left Edge Indicator */}
                    {currentSlide > 0 && (
                      <div className="absolute left-0 top-0 bottom-0 w-[32px] bg-gradient-to-r from-[#95e36c]/20 to-transparent z-10 pointer-events-none flex items-center justify-start pl-1">
                        <ChevronLeft className="w-5 h-5 text-[#003630] drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)] animate-pulse" style={{ animationDuration: '2s' }} />
                      </div>
                    )}
                    
                    {/* Right Edge Indicator */}
                    {currentSlide < totalStudents - 1 && (
                      <div className="absolute right-0 top-0 bottom-0 w-[32px] bg-gradient-to-l from-[#95e36c]/20 to-transparent z-10 pointer-events-none flex items-center justify-end pr-1">
                        <ChevronRight className="w-5 h-5 text-[#003630] drop-shadow-[0px_2px_4px_rgba(255,255,255,0.9)] animate-pulse" style={{ animationDuration: '2s' }} />
                      </div>
                    )}
                    
                    <div 
                      className="flex transition-transform duration-300 ease-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {studentEntries.map(([studentName, studentServices]) => (
                        <div key={studentName} className="w-full flex-shrink-0">
                          <StudentCarouselCard 
                            studentName={studentName}
                            services={studentServices}
                            inputAmounts={inputAmounts}
                            onAmountChange={onAmountChange}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-4 bg-gradient-to-r from-[#f9fafb] via-[#f3f4f6] to-[#f9fafb] rounded-full py-[10px] px-[16px] mx-auto w-fit border-[1.5px] border-[#e5e7eb] shadow-sm">
                  {studentEntries.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-[6px] rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'w-[24px] bg-gradient-to-r from-[#003630] to-[#004d45] shadow-[0px_2px_6px_rgba(0,54,48,0.3)]' 
                          : 'w-[6px] bg-[#95e36c] hover:bg-[#7dd054] active:scale-90'
                      }`}
                      aria-label={`Go to student ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-5">
                {studentEntries.map(([studentName, studentServices]) => (
                  <StudentServiceGroup 
                    key={studentName}
                    studentName={studentName}
                    services={studentServices}
                    inputAmounts={inputAmounts}
                    onAmountChange={onAmountChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button 
        onClick={onProceed}
        disabled={total <= 0}
        className={`relative h-[59px] w-full max-w-[327px] mx-auto rounded-[16px] overflow-hidden touch-manipulation ${
          total <= 0 ? 'cursor-not-allowed' : 'group'
        }`}
        data-name="Button"
      >
        {/* Background */}
        <div className={`absolute inset-0 transition-colors ${
          total <= 0 
            ? 'bg-[#d1d5db]' 
            : 'bg-[#003630] group-hover:bg-[#004d45]'
        }`} />
        
        {/* Shine Effect */}
        {total > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        )}
        
        {/* Shadow */}
        <div className={`absolute inset-0 transition-shadow ${
          total <= 0
            ? 'shadow-sm'
            : 'shadow-[0px_6px_20px_rgba(0,54,48,0.25)] group-active:shadow-[0px_2px_8px_rgba(0,54,48,0.2)]'
        }`} />
        
        {/* Content */}
        <div className={`relative z-10 flex items-center justify-center gap-[10px] h-full transition-transform ${
          total > 0 && 'group-active:scale-[0.97]'
        }`}>
          <p className={`font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[18px] tracking-[-0.3px] ${
            total <= 0 ? 'text-white/60' : 'text-white'
          }`}>Proceed</p>
          {total > 0 && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}

export default function CheckoutPage2({ services, onBack, onProceed }: CheckoutPage2Props) {
  const [showReceipts, setShowReceipts] = useState(false);
  
  // Initialize input amounts with service amounts
  const [inputAmounts, setInputAmounts] = useState<Record<string, number>>(() => {
    const amounts: Record<string, number> = {};
    services.forEach(service => {
      amounts[service.id] = service.amount;
    });
    return amounts;
  });

  const handleAmountChange = (serviceId: string, value: number) => {
    setInputAmounts(prev => ({
      ...prev,
      [serviceId]: value
    }));
  };

  // Calculate total from input amounts
  const totalAmount = Object.values(inputAmounts).reduce((sum, amount) => sum + amount, 0);

  if (showReceipts) {
    return (
      <ReceiptsPage 
        onBack={() => setShowReceipts(false)}
        onNext={() => onProceed(totalAmount)}
        totalAmount={totalAmount}
      />
    );
  }

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex justify-center">
      <div className="flex flex-col w-full max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-screen shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" data-name="Checkout page 2">
        <Header onBack={onBack} />
        <div className="flex-1 min-h-0">
          <Group1 
            services={services} 
            inputAmounts={inputAmounts}
            onAmountChange={handleAmountChange}
            onProceed={() => setShowReceipts(true)} 
          />
        </div>
      </div>
    </div>
  );
}