import { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-rwvnsqykxb";
import { getSchoolServices } from "../data/schoolData";
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
  "International Maarif School": ["Route A - Embassy Area", "Route B - Kabulonga", "Route C - Roma", "Route D - Woodlands", "Route E - Mass Media"]
};

const TERM_OPTIONS = ["Term 1", "Term 2", "Term 3"];

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
      <label className="block font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#003630] tracking-[-0.11px] mb-[8px]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[44px] px-[14px] pr-[40px] bg-white border-2 border-[#e5e7eb] rounded-[10px] font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[13px] text-[#003630] appearance-none cursor-pointer hover:border-[#95e36c] focus:border-[#95e36c] focus:outline-none focus:ring-0 transition-all touch-manipulation shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
    <div className="space-y-[12px]">
      <label className="block font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[12px] text-[#003630] tracking-[-0.12px]">
        Choose Uniform Items
      </label>
      
      {/* Complete Set Option - Featured */}
      {completeSet && (
        <button
          onClick={() => toggleItem(completeSet.id)}
          className={`w-full px-[16px] py-[14px] rounded-[10px] transition-all touch-manipulation border-2 ${
            selectedItems.includes(completeSet.id)
              ? 'bg-[#95e36c] border-[#95e36c] shadow-[0px_2px_8px_rgba(149,227,108,0.3)]'
              : 'bg-white border-[#e5e7eb] hover:border-[#95e36c]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all ${
                selectedItems.includes(completeSet.id)
                  ? 'bg-[#003630] border-[#003630]'
                  : 'bg-white border-[#cbd2e0]'
              }`}>
                {selectedItems.includes(completeSet.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <p className={`font-['IBM_Plex_Sans_Devanagari:${selectedItems.includes(completeSet.id) ? 'Bold' : 'SemiBold'}',sans-serif] text-[13px] text-[#003630] tracking-[-0.13px]`}>
                  {completeSet.name}
                </p>
                <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[10px] text-[#6b7280] tracking-[-0.10px] mt-[2px]">
                  All items included
                </p>
              </div>
            </div>
            <p className={`font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[14px] text-[#003630] tracking-[-0.14px]`}>
              ZMW {completeSet.amount}
            </p>
          </div>
        </button>
      )}
      
      {/* Divider */}
      <div className="flex items-center gap-[12px]">
        <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
        <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[10px] text-[#6b7280] uppercase tracking-[0.8px]">
          Or Select Individual Items
        </p>
        <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
      </div>
      
      {/* Individual Items - Cleaner Grid */}
      <div className="grid grid-cols-2 gap-[8px] max-h-[240px] overflow-y-auto">
        {individualItems.map(item => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`px-[12px] py-[12px] rounded-[8px] transition-all touch-manipulation border ${
              selectedItems.includes(item.id)
                ? 'bg-[#e0f7d4] border-[#95e36c]'
                : 'bg-white border-[#e5e7eb] hover:border-[#cbd2e0]'
            }`}
          >
            <div className="flex items-start gap-[8px]">
              <div className={`mt-[2px] w-[16px] h-[16px] rounded-[4px] border-2 flex-shrink-0 transition-all ${
                selectedItems.includes(item.id)
                  ? 'bg-[#95e36c] border-[#95e36c]'
                  : 'bg-white border-[#cbd2e0]'
              }`}>
                {selectedItems.includes(item.id) && (
                  <svg className="w-full h-full" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke="#003630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`font-['IBM_Plex_Sans_Devanagari:${selectedItems.includes(item.id) ? 'SemiBold' : 'Regular'}',sans-serif] text-[11px] text-[#003630] tracking-[-0.11px] leading-tight`}>
                  {item.name}
                </p>
                <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[10px] text-[#6b7280] tracking-[-0.10px] mt-[4px]">
                  K{item.amount}
                </p>
              </div>
            </div>
          </button>
        ))}
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
  schoolName
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
        className={`w-full text-left px-[20px] py-[16px] transition-all touch-manipulation rounded-[10px] flex items-start gap-[16px] ${
          isSelected 
            ? 'bg-[#f0fce8] hover:bg-[#e8fad8]' 
            : 'hover:bg-[#f9fafb]'
        }`}
      >
        {/* Custom Checkbox */}
        <div className={`mt-[4px] flex-shrink-0 w-[22px] h-[22px] rounded-[6px] border-2 transition-all ${
          isSelected 
            ? 'bg-[#95e36c] border-[#95e36c]' 
            : 'bg-white border-[#cbd2e0]'
        }`}>
          {isSelected && (
            <svg className="w-full h-full" viewBox="0 0 22 22" fill="none">
              <path 
                d="M5 11L9.5 15.5L17 7" 
                stroke="#003630" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        
        {/* Service Details */}
        <div className="flex-1 min-w-0">
          <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[14px] text-[#003630] tracking-[-0.14px] mb-[4px]">
            {service.name}
          </p>
          <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.12px] mb-[8px] leading-relaxed">
            {service.description}
          </p>
          <div className="flex items-center gap-[10px] flex-wrap">
            <div className="bg-white px-[12px] py-[6px] rounded-[8px] border border-[#e5e7eb]">
              <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[14px] text-[#003630] tracking-[-0.14px]">
                ZMW {displayAmount.toLocaleString()}
              </p>
            </div>
            <span className="px-[10px] py-[4px] bg-[#e0f7d4] rounded-[6px] text-[10px] font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[#003630] uppercase tracking-[0.5px]">
              {service.category}
            </span>
          </div>
        </div>
      </button>

      {/* Options (shown when selected) */}
      {isSelected && (
        <div className="px-[20px] pb-[20px] pt-[12px] space-y-[16px]" onClick={(e) => e.stopPropagation()}>
          {/* Uniform Items Selector */}
          {isUniform && service.subItems && onUniformItemsChange && (
            <UniformSelector
              subItems={service.subItems}
              selectedItems={uniformItems || []}
              onItemsChange={onUniformItemsChange}
            />
          )}
          
          {/* Payment Period Selector for meals and transport */}
          {!isUniform && hasPaymentPeriods && onPaymentPeriodChange && (
            <div className="w-full">
              <label className="block font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#003630] tracking-[-0.11px] mb-[10px]">
                How would you like to pay?
              </label>
              <div className="grid grid-cols-3 gap-[8px]">
                {service.paymentPeriods?.map((p) => (
                  <button
                    key={p.period}
                    onClick={() => onPaymentPeriodChange(p.period)}
                    className={`px-[12px] py-[10px] rounded-[8px] transition-all touch-manipulation border-2 ${
                      (paymentPeriod || 'term') === p.period
                        ? 'bg-[#95e36c] border-[#95e36c] shadow-[0px_2px_6px_rgba(149,227,108,0.3)]'
                        : 'bg-white border-[#e5e7eb] hover:border-[#cbd2e0]'
                    }`}
                  >
                    <p className={`font-['IBM_Plex_Sans_Devanagari:${(paymentPeriod || 'term') === p.period ? 'Bold' : 'Medium'}',sans-serif] text-[11px] text-[#003630] tracking-[-0.11px] text-center leading-tight`}>
                      {p.period === 'term' ? 'Term' : p.period === 'week' ? 'Weekly' : 'Daily'}
                    </p>
                    <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[10px] text-[#6b7280] tracking-[-0.10px] text-center mt-[4px]">
                      K{p.amount}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular dropdowns layout */}
          {!isUniform && (
            <div className="space-y-[12px] bg-[#fafbfc] p-[16px] rounded-[10px] border border-[#f0f1f3]">
              {/* Term Dropdown */}
              <PremiumDropdown
                label="Select Term"
                value={term}
                options={TERM_OPTIONS}
                onChange={onTermChange}
              />
              
              {/* Route Dropdown (only for transport services) */}
              {isTransport && onRouteChange && (
                <>
                  <div className="h-[1px] bg-[#e5e7eb]" />
                  <PremiumDropdown
                    label="Select Route"
                    value={route || busRoutes[0]}
                    options={busRoutes}
                    onChange={onRouteChange}
                  />
                </>
              )}
            </div>
          )}
        </div>
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
  schoolName
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
}) {
  if (services.length === 0) return null;

  const categoryLabels: Record<string, string> = {
    tuition: "Tuition Fees",
    meals: "Meals & Catering",
    transport: "Transportation",
    activities: "Activities & Programs",
    supplies: "Supplies & Materials",
    uniform: "School Uniform",
    accommodation: "Boarding & Accommodation",
    other: "Other Services"
  };

  return (
    <div className="w-full mb-[8px]">
      <div className="px-[20px] py-[12px] bg-gradient-to-r from-[#f9fafb] to-[#f5f7f9]">
        <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[12px] text-[#003630] tracking-[0.3px]">
          {categoryLabels[category] || category}
        </p>
      </div>
      <div className="py-[8px] space-y-[4px]">
        {services.map(service => (
          <ServiceCheckbox
            key={service.id}
            service={service}
            isSelected={selectedIds.has(service.id)}
            onToggle={() => onToggle(service.id)}
            term={serviceTerms[service.id] || "Term 1"}
            onTermChange={(term) => onTermChange(service.id, term)}
            route={serviceRoutes[service.id]}
            onRouteChange={(route) => onRouteChange(service.id, route)}
            paymentPeriod={servicePaymentPeriods[service.id]}
            onPaymentPeriodChange={(period) => onPaymentPeriodChange(service.id, period)}
            uniformItems={serviceUniformItems[service.id]}
            onUniformItemsChange={(items) => onUniformItemsChange(service.id, items)}
            schoolName={schoolName}
          />
        ))}
      </div>
    </div>
  );
}

export default function AddOtherServicesPopup({ onClose, onDone, schoolName }: AddOtherServicesPopupProps) {
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const [serviceTerms, setServiceTerms] = useState<Record<string, string>>({});
  const [serviceRoutes, setServiceRoutes] = useState<Record<string, string>>({});
  const [servicePaymentPeriods, setServicePaymentPeriods] = useState<Record<string, string>>({});
  const [serviceUniformItems, setServiceUniformItems] = useState<Record<string, string[]>>({});
  
  // Get all services and filter out tuition (handled by Add School Fees)
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-[16px]">
        <motion.div
          className="bg-white rounded-[16px] shadow-[0px_20px_60px_rgba(0,54,48,0.25)] pointer-events-auto w-full max-w-[480px] max-h-[80vh] flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="px-[24px] py-[20px] border-b border-[#e5e7eb] bg-gradient-to-b from-white to-[#fafbfc]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[18px] text-[#003630] tracking-[-0.18px] mb-[4px]">
                  Add Services
                </p>
                <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.12px] leading-relaxed max-w-[340px]">
                  Select services and customize payment options
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-[36px] h-[36px] rounded-full hover:bg-[#f3f4f6] transition-all flex items-center justify-center touch-manipulation active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Services List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
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
              />
            ))}
            
            {allServices.length === 0 && (
              <div className="py-[60px] px-[24px] text-center">
                <div className="w-[60px] h-[60px] bg-[#f5f7f9] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 8V14M14 20H14.01M26 14C26 20.6274 20.6274 26 14 26C7.37258 26 2 20.6274 2 14C2 7.37258 7.37258 2 14 2C20.6274 2 26 7.37258 26 14Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[14px] text-[#003630] mb-[8px]">
                  No Services Available
                </p>
                <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[12px] text-[#6b7280] leading-relaxed max-w-[280px] mx-auto">
                  There are currently no additional services available for this school.
                </p>
              </div>
            )}
          </div>

          {/* Footer with Summary and Done Button */}
          <div className="border-t border-[#e5e7eb] px-[24px] py-[20px] bg-gradient-to-t from-white to-[#fafbfc]">
            {selectedCount > 0 && (
              <div className="mb-[16px] bg-white rounded-[10px] p-[16px] border border-[#e5e7eb] shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-[#6b7280] tracking-[0.3px] uppercase mb-[4px]">
                      Selected
                    </p>
                    <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[13px] text-[#003630] tracking-[-0.13px]">
                      {selectedCount} service{selectedCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[11px] text-[#6b7280] tracking-[0.3px] uppercase mb-[4px]">
                      Total
                    </p>
                    <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[16px] text-[#003630] tracking-[-0.16px]">
                      ZMW {totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleDone}
              disabled={selectedCount === 0}
              className="bg-[#95e36c] w-full h-[52px] rounded-[12px] transition-all touch-manipulation active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0px_4px_0px_0px_rgba(149,227,108,0.3)] active:shadow-[0px_1px_0px_0px_rgba(149,227,108,0.3)] active:translate-y-[3px] disabled:active:translate-y-0"
            >
              <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] text-[#003630] tracking-[-0.15px]">
                {selectedCount > 0 ? `Add ${selectedCount} Service${selectedCount !== 1 ? 's' : ''}` : 'Select Services to Continue'}
              </p>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
