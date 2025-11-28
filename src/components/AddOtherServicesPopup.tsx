import { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-rwvnsqykxb";
import { getSchoolServices, getInstitutionType } from "../data/schoolData";
import type { SchoolService } from "../data/schoolData";

interface AddOtherServicesPopupProps {
  onClose: () => void;
  onDone: (services: Array<{ 
    id: string; 
    name: string; 
    amount: number; 
    category: string; 
    term: string; 
    route?: string;
    paymentPeriod?: string;
    uniformItems?: string[];
  }>) => void;
  schoolName: string;
}

/**
 * Bus routes available for each school
 */
const BUS_ROUTES: Record<string, string[]> = {
  "Twalumbu Educational Center": ["Route A - Central", "Route B - East", "Route C - West"],
  "Chimilute Trust Academy": ["Route 1 - Kabulonga", "Route 2 - Roma", "Route 3 - Woodlands", "Route 4 - Chelston"],
  "Julani School": ["Route A - Town Center", "Route B - Parklands", "Route C - Riverside"],
  "Crested Crane Academy": ["Route 1 - CBD", "Route 2 - Northrise", "Route 3 - Kansenshi", "Route 4 - Masala"],
  "International Maarif School": ["Route A - Embassy Area", "Route B - Kabulonga", "Route C - Roma", "Route D - Woodlands", "Route E - Mass Media"],
  "African Christian University": ["City Center - Main Campus", "Chelston - Main Campus", "Kabulonga - Main Campus", "Meanwood - Main Campus", "Rhodes Park - Main Campus"]
};

const TERM_OPTIONS = ["Term 1", "Term 2", "Term 3"];
const SEMESTER_OPTIONS = ["Semester 1", "Semester 2"];

/**
 * Premium Dropdown Component
 * Apple-inspired dropdown with clean design
 */
function PremiumDropdown({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: string[]; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="w-full">
      <label className="block font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#6b7280] tracking-[1px] uppercase mb-[10px] pl-[4px]">
        {label}
      </label>
      <div className="relative group">
        {/* Dropdown Container */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[48px] px-[16px] pr-[44px] bg-[#f9fafb] border-[1.5px] border-[#e5e7eb] rounded-[12px] font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[14px] text-[#003630] appearance-none cursor-pointer hover:bg-white hover:border-[#d1d5db] focus:bg-white focus:border-[#95e36c] focus:outline-none focus:ring-0 transition-all touch-manipulation shadow-sm tracking-[-0.2px]"
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow Icon */}
        <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-calc(50%-1px)]">
          <div className="w-[20px] h-[20px] bg-white rounded-[6px] border border-[#e5e7eb] flex items-center justify-center shadow-sm">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Uniform Item Selector - Redesigned for clarity
 */
function UniformSelector({
  subItems,
  selectedItems,
  onItemsChange
}: {
  subItems: Array<{ id: string; name: string; amount: number }>;
  selectedItems: string[];
  onItemsChange: (items: string[]) => void;
}) {
  const toggleItem = (itemId: string) => {
    // If selecting "complete set", deselect all individual items
    if (itemId === "uniform-complete") {
      onItemsChange(selectedItems.includes(itemId) ? [] : [itemId]);
    } else {
      // If selecting individual item, deselect "complete set"
      const newItems = selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems.filter(id => id !== "uniform-complete"), itemId];
      onItemsChange(newItems);
    }
  };

  const completeSet = subItems.find(item => item.id === "uniform-complete");
  const individualItems = subItems.filter(item => item.id !== "uniform-complete");

  return (
    <div className="space-y-[14px]">
      <label className="block font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#6b7280] tracking-[1px] uppercase pl-[4px]">
        Select Items
      </label>
      
      {/* Complete Set Option - Premium Featured Card */}
      {completeSet && (
        <button
          onClick={() => toggleItem(completeSet.id)}
          className="w-full group touch-manipulation active:scale-[0.98] transition-transform"
        >
          <div className={`
            relative rounded-[14px] p-[16px] transition-all duration-200
            ${selectedItems.includes(completeSet.id)
              ? 'bg-gradient-to-br from-[#95e36c] to-[#7dd054] shadow-[0px_4px_16px_rgba(149,227,108,0.25)]'
              : 'bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm'
            }
          `}>
            {/* Sparkle decoration for selected state */}
            {selectedItems.includes(completeSet.id) && (
              <>
                <div className="absolute top-[12px] right-[12px] w-[6px] h-[6px] bg-white/40 rounded-full" />
                <div className="absolute top-[20px] right-[20px] w-[4px] h-[4px] bg-white/30 rounded-full" />
              </>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[14px]">
                {/* Custom Radio/Checkbox */}
                <div className={`
                  w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all shadow-sm
                  ${selectedItems.includes(completeSet.id)
                    ? 'bg-white'
                    : 'bg-[#f5f7f9] border-[1.5px] border-[#e5e7eb]'
                  }
                `}>
                  {selectedItems.includes(completeSet.id) && (
                    <motion.svg
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 25
                      }}
                      width="14" 
                      height="11" 
                      viewBox="0 0 14 11" 
                      fill="none"
                    >
                      <path d="M1.5 5.5L5 9L12.5 1.5" stroke="#95e36c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>
                
                <div className="text-left">
                  <p className={`font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[14px] tracking-[-0.2px] mb-[2px] ${
                    selectedItems.includes(completeSet.id) ? 'text-white' : 'text-[#003630]'
                  }`}>
                    {completeSet.name}
                  </p>
                  <p className={`font-['Inter:Regular',sans-serif] text-[11px] tracking-[-0.1px] ${
                    selectedItems.includes(completeSet.id) ? 'text-white/80' : 'text-[#6b7280]'
                  }`}>
                    All items included • Best value
                  </p>
                </div>
              </div>
              
              <div className={`px-[12px] py-[8px] rounded-[10px] ${
                selectedItems.includes(completeSet.id)
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-[#f5f7f9]'
              }`}>
                <p className={`font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] tracking-[-0.2px] ${
                  selectedItems.includes(completeSet.id) ? 'text-white' : 'text-[#003630]'
                }`}>
                  {completeSet.amount}
                </p>
                <p className={`font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[10px] tracking-[-0.1px] text-center ${
                  selectedItems.includes(completeSet.id) ? 'text-white/70' : 'text-[#9ca3af]'
                }`}>
                  ZMW
                </p>
              </div>
            </div>
          </div>
        </button>
      )}
      
      {/* Divider with Unique Style */}
      <div className="relative py-[8px]">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-[16px] py-[4px] bg-[#fafbfc] rounded-[8px] border border-[#f0f1f3] font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[10px] text-[#9ca3af] uppercase tracking-[1px]">
            Or Choose Items
          </span>
        </div>
      </div>
      
      {/* Individual Items - Premium Grid */}
      <div className="grid grid-cols-2 gap-[10px] max-h-[240px] overflow-y-auto pr-[4px] scrollbar-thin scrollbar-thumb-[#e5e7eb] scrollbar-track-transparent">
        {individualItems.map((item, index) => {
          const isItemSelected = selectedItems.includes(item.id);
          return (
            <motion.button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group touch-manipulation active:scale-[0.97] transition-transform"
            >
              <div className={`
                relative rounded-[12px] p-[14px] transition-all duration-200
                ${isItemSelected
                  ? 'bg-gradient-to-br from-[#e0f7d4] to-[#d0f0c0] border-[1.5px] border-[#95e36c]/50 shadow-sm'
                  : 'bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm'
                }
              `}>
                {/* Selection indicator dot */}
                {isItemSelected && (
                  <div className="absolute top-[10px] right-[10px] w-[6px] h-[6px] bg-[#95e36c] rounded-full" />
                )}
                
                <div className="flex flex-col gap-[10px]">
                  {/* Checkbox */}
                  <div className={`
                    w-[20px] h-[20px] rounded-[7px] flex items-center justify-center transition-all
                    ${isItemSelected
                      ? 'bg-[#95e36c] shadow-[0px_2px_6px_rgba(149,227,108,0.3)]'
                      : 'bg-[#f5f7f9] border-[1.5px] border-[#e5e7eb]'
                    }
                  `}>
                    {isItemSelected && (
                      <motion.svg
                        initial={{ scale: 0, rotate: -90 }}
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
                        <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="text-left">
                    <p className={`font-['IBM_Plex_Sans_Devanagari:${isItemSelected ? 'Bold' : 'Medium'}',sans-serif] text-[12px] text-[#003630] tracking-[-0.1px] leading-[1.3] mb-[6px]`}>
                      {item.name}
                    </p>
                    <div className={`
                      inline-flex items-baseline gap-[4px] px-[10px] py-[4px] rounded-[8px]
                      ${isItemSelected
                        ? 'bg-white/60 backdrop-blur-sm'
                        : 'bg-[#f5f7f9]'
                      }
                    `}>
                      <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[13px] text-[#003630] tracking-[-0.1px] leading-[1]">
                        {item.amount}
                      </p>
                      <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[9px] text-[#6b7280] tracking-[-0.1px]">
                        ZMW
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Service Checkbox Item with all selection options
 */
function ServiceCheckbox({ 
  service, 
  isSelected, 
  onToggle,
  term,
  onTermChange,
  route,
  onRouteChange,
  paymentPeriod,
  onPaymentPeriodChange,
  uniformItems,
  onUniformItemsChange,
  schoolName,
  isUniversity
}: { 
  service: SchoolService; 
  isSelected: boolean; 
  onToggle: () => void;
  term: string;
  onTermChange: (term: string) => void;
  route?: string;
  onRouteChange?: (route: string) => void;
  paymentPeriod?: string;
  onPaymentPeriodChange?: (period: string) => void;
  uniformItems?: string[];
  onUniformItemsChange?: (items: string[]) => void;
  schoolName: string;
  isUniversity?: boolean;
}) {
  const isTransport = service.category === 'transport';
  const isMeals = service.category === 'meals';
  const isUniform = service.category === 'uniform';
  const hasPaymentPeriods = service.paymentPeriods && service.paymentPeriods.length > 0;
  const busRoutes = BUS_ROUTES[schoolName] || [];
  
  // Calculate current amount based on selections
  let displayAmount = service.amount;
  
  if (isUniform && uniformItems && uniformItems.length > 0) {
    displayAmount = service.subItems
      ?.filter(item => uniformItems.includes(item.id))
      .reduce((sum, item) => sum + item.amount, 0) || service.amount;
  } else if (hasPaymentPeriods && paymentPeriod) {
    const period = service.paymentPeriods?.find(p => p.period === paymentPeriod);
    if (period) {
      displayAmount = period.amount;
      // If transport with route pricing, adjust the period amount based on route
      if (isTransport && route && service.routePricing) {
        const baseRoutePrice = service.routePricing[route] || service.amount;
        const basePeriodPrice = service.amount;
        const ratio = baseRoutePrice / basePeriodPrice;
        displayAmount = Math.round(period.amount * ratio);
      }
    }
  } else if (isTransport && route && service.routePricing) {
    displayAmount = service.routePricing[route] || service.amount;
  }

  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className="w-full text-left group touch-manipulation active:scale-[0.99] transition-transform"
      >
        <div className={`
          relative rounded-[16px] transition-all duration-200
          ${isSelected 
            ? 'bg-gradient-to-br from-white via-[#fafbfc] to-white border-[1.5px] border-[#95e36c] shadow-[0px_2px_12px_rgba(149,227,108,0.15)]' 
            : 'bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm'
          }
        `}>
          {/* Selection Indicator Bar */}
          {isSelected && (
            <motion.div
              layoutId={`selection-${service.id}`}
              className="absolute left-0 top-[12px] bottom-[12px] w-[4px] bg-gradient-to-b from-[#95e36c] to-[#7dd054] rounded-r-full"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
          
          <div className="px-[20px] py-[18px] flex items-start gap-[16px]">
            {/* Unique Checkbox Design */}
            <div className="mt-[2px] flex-shrink-0">
              <div className={`
                w-[24px] h-[24px] rounded-[8px] flex items-center justify-center transition-all duration-200
                ${isSelected 
                  ? 'bg-[#95e36c] shadow-[0px_2px_8px_rgba(149,227,108,0.4)]' 
                  : 'bg-[#f5f7f9] border-[1.5px] border-[#e5e7eb]'
                }
              `}>
                {isSelected ? (
                  <motion.svg
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 500,
                      damping: 25
                    }}
                    width="14" 
                    height="11" 
                    viewBox="0 0 14 11" 
                    fill="none"
                  >
                    <path 
                      d="M1.5 5.5L5 9L12.5 1.5" 
                      stroke="white" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                ) : (
                  <div className="w-[10px] h-[10px] rounded-[3px] bg-white/60" />
                )}
              </div>
            </div>
            
            {/* Service Details */}
            <div className="flex-1 min-w-0">
              <p className={`font-['IBM_Plex_Sans_Devanagari:${isSelected ? 'Bold' : 'SemiBold'}',sans-serif] text-[15px] text-[#003630] tracking-[-0.2px] mb-[6px] leading-[1.3]`}>
                {service.name}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.1px] mb-[12px] leading-[1.5]">
                {service.description}
              </p>
              
              {/* Price and Category Tags */}
              <div className="flex items-center gap-[10px] flex-wrap">
                {/* Price Badge */}
                <div className={`
                  inline-flex items-baseline gap-[6px] px-[14px] py-[8px] rounded-[10px] transition-all
                  ${isSelected
                    ? 'bg-gradient-to-r from-[#e0f7d4] to-[#d0f0c0] border border-[#95e36c]/20'
                    : 'bg-[#f5f7f9] border border-[#e5e7eb]'
                  }
                `}>
                  <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] text-[#003630] tracking-[-0.2px] leading-[1]">
                    {displayAmount.toLocaleString()}
                  </p>
                  <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-[#6b7280] tracking-[-0.1px]">
                    ZMW
                  </p>
                </div>
                
                {/* Category Badge */}
                <span className="inline-flex items-center px-[12px] py-[6px] bg-white/60 backdrop-blur-sm border border-[#e5e7eb] rounded-[8px] text-[10px] font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[#6b7280] uppercase tracking-[0.8px]">
                  {service.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Options (shown when selected) - Collapsible with Animation */}
      {isSelected && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-[20px] pb-[20px] pt-[16px] space-y-[16px] bg-gradient-to-b from-[#fafbfc]/50 to-transparent">
            {/* Uniform Items Selector */}
            {isUniform && service.subItems && onUniformItemsChange && (
              <UniformSelector
                subItems={service.subItems}
                selectedItems={uniformItems || []}
                onItemsChange={onUniformItemsChange}
              />
            )}
            
            {/* Payment Period Selector - Unique Segmented Design */}
            {!isUniform && hasPaymentPeriods && onPaymentPeriodChange && (
              <div className="w-full">
                <label className="block font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#6b7280] tracking-[1px] uppercase mb-[12px] pl-[4px]">
                  Payment Frequency
                </label>
                <div className="relative bg-[#f5f7f9]/80 backdrop-blur-sm rounded-[14px] p-[4px] border border-[#e5e7eb]/50">
                  <div className="grid grid-cols-3 gap-[4px] relative">
                    {service.paymentPeriods?.map((p) => {
                      const isActive = (paymentPeriod || 'term') === p.period;
                      return (
                        <button
                          key={p.period}
                          onClick={() => onPaymentPeriodChange(p.period)}
                          className="relative z-10 py-[12px] px-[8px] rounded-[10px] transition-all touch-manipulation active:scale-95"
                        >
                          {isActive && (
                            <motion.div
                              layoutId={`period-${service.id}`}
                              className="absolute inset-0 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_1px_2px_rgba(0,0,0,0.04)]"
                              transition={{ 
                                type: "spring", 
                                stiffness: 500, 
                                damping: 30 
                              }}
                            />
                          )}
                          <div className="relative z-10">
                            <p className={`font-['IBM_Plex_Sans_Devanagari:${isActive ? 'Bold' : 'Medium'}',sans-serif] text-[12px] tracking-[-0.1px] text-center leading-tight mb-[4px] transition-colors ${
                              isActive ? 'text-[#003630]' : 'text-[#9ca3af]'
                            }`}>
                              {p.period === 'term' ? (isUniversity ? 'Semester' : 'Term') : p.period === 'week' ? 'Weekly' : 'Daily'}
                            </p>
                            <p className={`font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[10px] tracking-[-0.1px] text-center transition-colors ${
                              isActive ? 'text-[#6b7280]' : 'text-[#cbd5e0]'
                            }`}>
                              K{p.amount}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {/* Dropdowns Container - Unique Card Style */}
            {!isUniform && (
              <div className="relative overflow-hidden rounded-[14px] bg-white border-[1.5px] border-[#e5e7eb] shadow-sm">
                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-gradient-to-br from-[#95e36c]/5 to-transparent rounded-bl-[30px]" />
                
                <div className="relative p-[16px] space-y-[14px]">
                  {/* Term/Semester Dropdown */}
                  <PremiumDropdown
                    label={isUniversity ? "Academic Semester" : "Academic Term"}
                    value={term}
                    options={isUniversity ? SEMESTER_OPTIONS : TERM_OPTIONS}
                    onChange={onTermChange}
                  />
                  
                  {/* Divider */}
                  {isTransport && onRouteChange && (
                    <div className="relative h-[1px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent" />
                    </div>
                  )}
                  
                  {/* Route Dropdown (only for transport services) */}
                  {isTransport && onRouteChange && (
                    <PremiumDropdown
                      label="Bus Route"
                      value={route || busRoutes[0]}
                      options={busRoutes}
                      onChange={onRouteChange}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Service Category Group
 * Groups services by category with a header
 */
function ServiceCategoryGroup({ 
  category, 
  services, 
  selectedIds, 
  onToggle,
  serviceTerms,
  onTermChange,
  serviceRoutes,
  onRouteChange,
  servicePaymentPeriods,
  onPaymentPeriodChange,
  serviceUniformItems,
  onUniformItemsChange,
  schoolName,
  isUniversity
}: { 
  category: string; 
  services: SchoolService[]; 
  selectedIds: Set<string>; 
  onToggle: (id: string) => void;
  serviceTerms: Record<string, string>;
  onTermChange: (id: string, term: string) => void;
  serviceRoutes: Record<string, string>;
  onRouteChange: (id: string, route: string) => void;
  servicePaymentPeriods: Record<string, string>;
  onPaymentPeriodChange: (id: string, period: string) => void;
  serviceUniformItems: Record<string, string[]>;
  onUniformItemsChange: (id: string, items: string[]) => void;
  schoolName: string;
  isUniversity?: boolean;
}) {
  if (services.length === 0) return null;

  const categoryLabels: Record<string, string> = {
    tuition: "Tuition Fees",
    meals: isUniversity ? "Cafeteria & Dining" : "Meals & Catering",
    transport: isUniversity ? "Campus Shuttle" : "Transportation",
    activities: "Activities & Programs",
    supplies: "Supplies & Materials",
    uniform: "School Uniform",
    accommodation: isUniversity ? "Student Housing" : "Boarding & Accommodation",
    other: "Other Services"
  };

  const categoryIcons: Record<string, string> = {
    meals: "🍽️",
    transport: "🚌",
    activities: "⚽",
    supplies: "📚",
    uniform: "👔",
    accommodation: "🏠",
    other: "✨"
  };

  return (
    <div className="w-full mb-[16px]">
      {/* Unique Category Header */}
      <div className="px-[24px] pt-[20px] pb-[12px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center justify-center w-[32px] h-[32px] bg-gradient-to-br from-[#f5f7f9] to-[#e5e7eb] rounded-[10px] border border-white shadow-sm">
            <span className="text-[16px]">{categoryIcons[category] || "📋"}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[14px] text-[#003630] tracking-[-0.2px]">
              {categoryLabels[category] || category}
            </h3>
            <div className="flex items-center gap-[6px] mt-[2px]">
              <div className="w-[20px] h-[2px] bg-gradient-to-r from-[#95e36c] to-transparent rounded-full" />
              <p className="font-['Inter:Regular',sans-serif] text-[10px] text-[#9ca3af] tracking-[0.5px] uppercase">
                {services.length} {services.length === 1 ? 'option' : 'options'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Grid */}
      <div className="px-[20px] space-y-[10px]">
        {services.map(service => (
          <ServiceCheckbox
            key={service.id}
            service={service}
            isSelected={selectedIds.has(service.id)}
            onToggle={() => onToggle(service.id)}
            term={serviceTerms[service.id] || (isUniversity ? "Semester 1" : "Term 1")}
            onTermChange={(term) => onTermChange(service.id, term)}
            route={serviceRoutes[service.id]}
            onRouteChange={(route) => onRouteChange(service.id, route)}
            paymentPeriod={servicePaymentPeriods[service.id]}
            onPaymentPeriodChange={(period) => onPaymentPeriodChange(service.id, period)}
            uniformItems={serviceUniformItems[service.id]}
            onUniformItemsChange={(items) => onUniformItemsChange(service.id, items)}
            schoolName={schoolName}
            isUniversity={isUniversity}
          />
        ))}
      </div>
    </div>
  );
}

export default function AddOtherServicesPopup({ onClose, onDone, schoolName }: AddOtherServicesPopupProps) {
  // Determine if this is a university or school
  const institutionType = getInstitutionType(schoolName);
  const isUniversity = institutionType === 'university';
  
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const [serviceTerms, setServiceTerms] = useState<Record<string, string>>({});
  const [serviceRoutes, setServiceRoutes] = useState<Record<string, string>>({});
  const [servicePaymentPeriods, setServicePaymentPeriods] = useState<Record<string, string>>({});
  const [serviceUniformItems, setServiceUniformItems] = useState<Record<string, string[]>>({});
  
  // Get all services and filter out tuition (handled by Add School Fees/Add Tuition)
  const allServices = getSchoolServices(schoolName).filter(service => service.category !== 'tuition');
  
  // Group services by category
  const servicesByCategory = allServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, SchoolService[]>);

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
        // Initialize with default term if not set
        if (!serviceTerms[serviceId]) {
          setServiceTerms(prev => ({ ...prev, [serviceId]: "Term 1" }));
        }
        // Initialize with default route for transport services
        const service = allServices.find(s => s.id === serviceId);
        if (service?.category === 'transport' && !serviceRoutes[serviceId]) {
          const routes = BUS_ROUTES[schoolName] || [];
          if (routes.length > 0) {
            setServiceRoutes(prev => ({ ...prev, [serviceId]: routes[0] }));
          }
        }
        // Initialize payment period for services with payment periods
        if (service?.paymentPeriods && !servicePaymentPeriods[serviceId]) {
          setServicePaymentPeriods(prev => ({ ...prev, [serviceId]: 'term' }));
        }
        // Initialize uniform items with complete set
        if (service?.category === 'uniform' && service.subItems && !serviceUniformItems[serviceId]) {
          setServiceUniformItems(prev => ({ ...prev, [serviceId]: ['uniform-complete'] }));
        }
      }
      return newSet;
    });
  };

  const handleTermChange = (serviceId: string, term: string) => {
    setServiceTerms(prev => ({ ...prev, [serviceId]: term }));
  };

  const handleRouteChange = (serviceId: string, route: string) => {
    setServiceRoutes(prev => ({ ...prev, [serviceId]: route }));
  };

  const handlePaymentPeriodChange = (serviceId: string, period: string) => {
    setServicePaymentPeriods(prev => ({ ...prev, [serviceId]: period }));
  };

  const handleUniformItemsChange = (serviceId: string, items: string[]) => {
    setServiceUniformItems(prev => ({ ...prev, [serviceId]: items }));
  };

  const handleDone = () => {
    const selectedServices = allServices
      .filter(service => selectedServiceIds.has(service.id))
      .map(service => {
        let amount = service.amount;
        const paymentPeriod = servicePaymentPeriods[service.id];
        const route = serviceRoutes[service.id];
        const uniformItems = serviceUniformItems[service.id];
        
        // Calculate amount based on selections
        if (service.category === 'uniform' && uniformItems && uniformItems.length > 0) {
          amount = service.subItems
            ?.filter(item => uniformItems.includes(item.id))
            .reduce((sum, item) => sum + item.amount, 0) || service.amount;
        } else if (paymentPeriod && service.paymentPeriods) {
          const period = service.paymentPeriods.find(p => p.period === paymentPeriod);
          if (period) {
            amount = period.amount;
            // If transport with route pricing, adjust the period amount based on route
            if (service.category === 'transport' && route && service.routePricing) {
              const baseRoutePrice = service.routePricing[route] || service.amount;
              const basePeriodPrice = service.amount;
              const ratio = baseRoutePrice / basePeriodPrice;
              amount = Math.round(period.amount * ratio);
            }
          }
        } else if (service.category === 'transport' && route && service.routePricing) {
          amount = service.routePricing[route] || service.amount;
        }
        
        return {
          id: service.id,
          name: service.name,
          amount,
          category: service.category,
          term: serviceTerms[service.id] || "Term 1",
          ...(service.category === 'transport' && { route }),
          ...(paymentPeriod && { paymentPeriod }),
          ...(uniformItems && uniformItems.length > 0 && { uniformItems })
        };
      });
    
    onDone(selectedServices);
  };

  const selectedCount = selectedServiceIds.size;
  
  // Calculate total amount considering all selections
  const totalAmount = allServices
    .filter(service => selectedServiceIds.has(service.id))
    .reduce((sum, service) => {
      let amount = service.amount;
      const paymentPeriod = servicePaymentPeriods[service.id];
      const route = serviceRoutes[service.id];
      const uniformItems = serviceUniformItems[service.id];
      
      if (service.category === 'uniform' && uniformItems && uniformItems.length > 0) {
        amount = service.subItems
          ?.filter(item => uniformItems.includes(item.id))
          .reduce((itemSum, item) => itemSum + item.amount, 0) || service.amount;
      } else if (paymentPeriod && service.paymentPeriods) {
        const period = service.paymentPeriods.find(p => p.period === paymentPeriod);
        if (period) {
          amount = period.amount;
          // If transport with route pricing, adjust the period amount based on route
          if (service.category === 'transport' && route && service.routePricing) {
            const baseRoutePrice = service.routePricing[route] || service.amount;
            const basePeriodPrice = service.amount;
            const ratio = baseRoutePrice / basePeriodPrice;
            amount = Math.round(period.amount * ratio);
          }
        }
      } else if (service.category === 'transport' && route && service.routePricing) {
        amount = service.routePricing[route] || service.amount;
      }
      
      return sum + amount;
    }, 0);

  return (
    <>
      {/* Unique Backdrop with Layered Blur */}
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/30" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
      </motion.div>
      
      {/* Bottom Sheet Popup */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[480px]"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ 
          type: "spring",
          damping: 32,
          stiffness: 380,
          mass: 0.8
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[6px]">
          <div className="w-[36px] h-[5px] bg-white/90 rounded-full shadow-sm" />
        </div>

        <div className="bg-white/98 backdrop-blur-[24px] rounded-t-[32px] shadow-[0px_-8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[85vh]">
          {/* Decorative Top Border */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#95e36c]/60 to-transparent" />
          
          {/* Header with Unique Design */}
          <div className="relative px-[24px] pt-[24px] pb-[20px] border-b border-[#f0f1f3]">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-br from-[#95e36c]/5 to-transparent rounded-bl-[60px] pointer-events-none" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-[10px] mb-[8px]">
                  <div className="w-[3px] h-[24px] bg-gradient-to-b from-[#95e36c] to-[#7dd054] rounded-full" />
                  <h2 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[26px] text-[#003630] tracking-[-0.6px] leading-[1.1]">
                    Services
                  </h2>
                </div>
                <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.1px] leading-[1.4] ml-[13px]">
                  Customize and add services to your payment
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#f5f7f9]/70 backdrop-blur-sm border border-[#e5e7eb]/60 hover:bg-[#e5e7eb]/90 active:scale-90 transition-all touch-manipulation shadow-sm ml-[12px]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            
            {/* Selection Counter Badge */}
            {selectedCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 25
                }}
                className="mt-[16px] inline-flex items-center gap-[8px] px-[14px] py-[8px] bg-gradient-to-r from-[#e0f7d4] to-[#d0f0c0] rounded-[12px] border border-[#95e36c]/30"
              >
                <div className="w-[6px] h-[6px] bg-[#95e36c] rounded-full animate-pulse" />
                <span className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[12px] text-[#003630] tracking-[-0.1px]">
                  {selectedCount} selected
                </span>
              </motion.div>
            )}
          </div>

          {/* Services List - Scrollable with Custom Scrollbar */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e5e7eb] scrollbar-track-transparent hover:scrollbar-thumb-[#d1d5db]">
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <ServiceCategoryGroup
                key={category}
                category={category}
                services={services}
                selectedIds={selectedServiceIds}
                onToggle={toggleService}
                serviceTerms={serviceTerms}
                onTermChange={handleTermChange}
                serviceRoutes={serviceRoutes}
                onRouteChange={handleRouteChange}
                servicePaymentPeriods={servicePaymentPeriods}
                onPaymentPeriodChange={handlePaymentPeriodChange}
                serviceUniformItems={serviceUniformItems}
                onUniformItemsChange={handleUniformItemsChange}
                schoolName={schoolName}
                isUniversity={isUniversity}
              />
            ))}
            
            {allServices.length === 0 && (
              <div className="py-[60px] px-[32px] text-center">
                <div className="relative inline-block mb-[20px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#95e36c]/20 to-[#7dd054]/10 blur-xl rounded-full" />
                  <div className="relative w-[72px] h-[72px] bg-gradient-to-br from-[#f5f7f9] to-[#e5e7eb] rounded-[20px] flex items-center justify-center border-[1.5px] border-white shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="absolute inset-[8px] bg-white rounded-[14px]" />
                    <svg className="relative z-10" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M16 10V16M16 22H16.01M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" stroke="#95e36c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[17px] text-[#003630] mb-[8px] tracking-[-0.3px]">
                  No Services Available
                </h3>
                <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#6b7280] leading-[20px] max-w-[280px] mx-auto tracking-[-0.1px]">
                  There are currently no additional services available for this school.
                </p>
              </div>
            )}
          </div>

          {/* Premium Footer with Floating Summary */}
          <div className="relative border-t border-[#f0f1f3] px-[24px] pt-[20px] pb-[28px] bg-gradient-to-t from-white via-[#fafbfc]/50 to-transparent">
            {/* Floating Summary Card */}
            {selectedCount > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className="mb-[16px] relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#95e36c]/5 to-[#7dd054]/5 rounded-[16px] blur-lg" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-[16px] p-[20px] border-[1.5px] border-[#e5e7eb] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-[#9ca3af] tracking-[1px] uppercase mb-[6px]">
                        Total Amount
                      </p>
                      <div className="flex items-baseline gap-[6px]">
                        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[28px] text-[#003630] tracking-[-0.8px] leading-[1]">
                          {totalAmount.toLocaleString()}
                        </p>
                        <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[14px] text-[#6b7280] tracking-[-0.2px]">
                          ZMW
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center justify-center w-[48px] h-[48px] bg-gradient-to-br from-[#95e36c] to-[#7dd054] rounded-[14px] shadow-[0px_4px_12px_rgba(149,227,108,0.3)]">
                        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[20px] text-white leading-[1]">
                          {selectedCount}
                        </p>
                      </div>
                      <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[10px] text-[#9ca3af] mt-[6px] tracking-[0.3px]">
                        SERVICES
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Premium Action Button */}
            <button 
              onClick={handleDone}
              disabled={selectedCount === 0}
              className="relative w-full h-[56px] rounded-[16px] transition-all touch-manipulation disabled:cursor-not-allowed group overflow-hidden"
            >
              {/* Button Background */}
              <div className={`absolute inset-0 transition-all duration-300 ${
                selectedCount === 0
                  ? 'bg-[#f5f7f9]'
                  : 'bg-[#003630] group-hover:bg-[#004d45]'
              }`} />
              
              {/* Shine Effect */}
              {selectedCount > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
              
              {/* Shadow */}
              {selectedCount > 0 && (
                <div className="absolute inset-0 shadow-[0px_6px_20px_rgba(0,54,48,0.25)] group-active:shadow-[0px_2px_8px_rgba(0,54,48,0.2)] transition-shadow" />
              )}
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center justify-center gap-[10px] h-full group-active:scale-[0.97] transition-transform">
                <span className={`font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] tracking-[-0.2px] transition-colors ${
                  selectedCount === 0 ? 'text-[#9ca3af]' : 'text-white'
                }`}>
                  {selectedCount > 0 ? `Add to Payment` : 'Select Services to Continue'}
                </span>
                {selectedCount > 0 && (
                  <motion.svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 18 18" 
                    fill="none"
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </div>
            </button>
          </div>

          {/* Bottom Safe Area */}
          <div className="h-[env(safe-area-inset-bottom,20px)] bg-white/98" />
        </div>
      </motion.div>
    </>
  );
}
