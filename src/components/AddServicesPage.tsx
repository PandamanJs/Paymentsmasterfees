import { motion } from "motion/react";
import { useState } from "react";
import { getStudentsByPhone, getInstitutionType } from "../data/students";
import svgPaths from "../imports/svg-4boykq1z8d";
import dropdownSvgPaths from "../imports/svg-g5tpckf1cs";
import checkSvgPaths from "../imports/svg-ntb0im3s1u";
import xIconSvgPaths from "../imports/svg-zhcira9im7";
import AddOtherServicesPopup from "./AddOtherServicesPopup";
import { haptics } from "../utils/haptics";

interface Student {
  name: string;
  id: string;
  grade: string;
  balances: number;
}

interface AddServicesPageProps {
  selectedStudentIds: string[];
  userPhone: string;
  schoolName: string;
  onBack: () => void;
  onNext: () => void;
  onCheckout?: (services: Array<Service & { studentName: string }>) => void;
}

interface Service {
  id: string;
  description: string;
  amount: number;
  invoiceNo: string;
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

function ChildPill({ name, id, isActive, onClick }: { name: string; id: string; isActive: boolean; onClick: () => void }) {
  return (
    <div className="content-stretch flex gap-[15px] items-start relative shrink-0 w-[105px]">
      <button
        onClick={onClick}
        className="basis-0 grow min-h-px min-w-px relative rounded-[10px] shrink-0 cursor-pointer touch-manipulation active:opacity-80 transition-opacity"
      >
        <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[10px] relative w-full">
            <div className={`font-['IBM_Plex_Sans_Devanagari:${isActive ? 'Bold' : 'Light'}',sans-serif] ${isActive ? 'font-bold' : 'font-light'} leading-[15px] not-italic relative shrink-0 text-[#003630] text-[10px] text-nowrap tracking-[-0.1px] whitespace-pre`}>
              <p className="mb-0">{name}</p>
              <p>{id}</p>
            </div>
          </div>
        </div>
      </button>
      {isActive && <div className="absolute bg-[#95e36c] h-[3px] left-1/2 translate-x-[-50%] top-[43px] w-[87px]" />}
    </div>
  );
}

function StudentInfo({ student, serviceTotal }: { student: Student; serviceTotal: number }) {
  return (
    <div className="box-border content-stretch flex items-start pr-[2px] relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-col items-start mr-[-2px] relative shrink-0 flex-1">
        <div className="content-stretch flex gap-[53px] items-end relative shrink-0 w-full">
          <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[15px] text-black">
            {student.name} - {student.id}
          </p>
        </div>
        <div className="content-stretch flex items-end justify-between relative shrink-0">
          <p className="font-['IBM_Plex_Sans_Devanagari:Light',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#2d3c48] text-[10px]">
            {student.grade} - Twalumbu Education Centre
          </p>
        </div>
      </div>
      <div className="box-border content-stretch flex gap-[51px] items-center justify-end mr-[-2px] relative shrink-0 w-[80px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[15px] text-black">
          ZMW {serviceTotal}
        </p>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="overflow-clip size-[14px]" data-name="icon-check">
      <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-[20.83%]" data-name="Shape">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(149, 227, 108, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 8">
            <path clipRule="evenodd" d={checkSvgPaths.pe001b80} fill="var(--fill-0, #95E36C)" fillRule="evenodd" id="Shape" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function XIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="size-[14px] cursor-pointer touch-manipulation active:opacity-60 transition-opacity"
      data-name="icon-x"
      aria-label="Remove service"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="icon-x">
          <path d={xIconSvgPaths.p1edcdf00} fill="var(--fill-0, #FF0000)" id="Shape" />
        </g>
      </svg>
    </button>
  );
}

function ServiceTable({ services, onRemoveItem }: { services: Service[]; onRemoveItem: (id: string) => void }) {
  const hasServices = services.length > 0;

  return (
    <div className="card card-interactive content-stretch flex flex-col flex-1 items-start overflow-clip relative shrink-0 w-full animate-scale-in" style={{ animationDelay: '100ms' }}>
      {/* Header */}
      <div className="box-border content-stretch flex h-[32px] items-center pb-0 pt-[12px] px-[12px] relative shrink-0 w-full bg-gradient-to-b from-[#fafafa] to-white">
        <div className="box-border content-stretch flex gap-[10px] h-full items-center pb-[2px] pt-[4px] px-[6px] relative shrink-0 flex-1">
          <div className="flex flex-col font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#7a929e] text-[8px] text-nowrap tracking-[-0.08px]">
            <p className="leading-[24px] whitespace-pre">Service Description</p>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[108px]">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="box-border content-stretch flex gap-[10px] h-full items-center justify-center px-[10px] py-[4px] relative w-[108px]">
              <div className="flex flex-col font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#7a929e] text-[8px] tracking-[-0.08px] w-[54px]">
                <p className="leading-[24px]">Amount (ZMW)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider w-full"></div>

      {/* Services or Empty State */}
      {!hasServices ? (
        <div className="flex-1 flex items-center justify-center w-full py-8">
          <p className="font-['Inter:Light',sans-serif] font-light leading-[15px] not-italic text-[#a7aaa7] text-[10px] text-center tracking-[-0.1px] px-4">
            Select a Pupil to View Payment History
          </p>
        </div>
      ) : (
        <div className="flex-1 w-full">
          {services.map((service, index) => (
            <motion.div 
              key={service.id} 
              className="box-border content-stretch flex min-h-[40px] items-center pl-[5px] pr-[56px] py-[6px] w-full relative group hover:bg-gradient-to-r hover:from-[rgba(149,227,108,0.03)] hover:to-transparent transition-all duration-200"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2, ease: "easeOut" }}
            >
              <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[4px] relative shrink-0 flex-1 min-w-0">
                <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative flex-1 min-w-0">
                  <div className="flex flex-col font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] justify-center relative w-full text-[12px] text-black">
                    <p className="leading-[1.4] truncate">{service.description.replace(/\s*\(Per term\)/i, '')}</p>
                  </div>
                  <div className="flex flex-col font-['Inter:Light',sans-serif] font-light justify-center relative text-[#003049] text-[8px] tracking-[-0.08px] mt-[2px]">
                    <p className="leading-[12px]">Invoice No. {service.invoiceNo}</p>
                  </div>
                </div>
              </div>
              <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[10px] py-[4px] relative shrink-0 w-[100px]">
                <div className="flex flex-col font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                  <p className="leading-[1.4] whitespace-pre">K{service.amount.toLocaleString()}</p>
                </div>
              </div>
              <div 
                className="absolute right-0 top-0 h-full px-[12px] flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ minWidth: '44px' }}
              >
                <XIcon onClick={() => onRemoveItem(service.id)} />
              </div>
              {index < services.length - 1 && (
                <div className="absolute bottom-0 left-[10px] right-[10px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.06)] to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownIcon() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={dropdownSvgPaths.p131c6b00} fill="var(--fill-0, #2D3648)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

const YEAR_OPTIONS = ["2023", "2024", "2025", "2026"];

const TERM_OPTIONS = ["Term 1", "Term 2", "Term 3"];
const SEMESTER_OPTIONS = ["Semester 1", "Semester 2"];

/**
 * Get school-specific grade pricing
 * Different schools have different tuition structures
 */
function getSchoolGradePricing(schoolName: string) {
  const pricingBySchool: Record<string, Array<{ label: string; value: string; price: number }>> = {
    "Twalumbu Educational Center": [
      { label: "Grade 1 - K800 (Per term)", value: "grade-1", price: 800 },
      { label: "Grade 2 - K900 (Per term)", value: "grade-2", price: 900 },
      { label: "Grade 3 - K1,000 (Per term)", value: "grade-3", price: 1000 },
      { label: "Grade 4 - K1,100 (Per term)", value: "grade-4", price: 1100 },
      { label: "Grade 5 - K1,200 (Per term)", value: "grade-5", price: 1200 },
      { label: "Grade 6 - K1,300 (Per term)", value: "grade-6", price: 1300 },
      { label: "Grade 7 - K1,400 (Per term)", value: "grade-7", price: 1400 },
    ],
    "Chimilute Trust Academy": [
      { label: "Form 1 - K2,200 (Per term)", value: "form-1", price: 2200 },
      { label: "Form 2 - K2,400 (Per term)", value: "form-2", price: 2400 },
      { label: "Form 3 - K2,600 (Per term)", value: "form-3", price: 2600 },
      { label: "Form 4 - K2,800 (Per term)", value: "form-4", price: 2800 },
      { label: "Form 5 - K3,000 (Per term)", value: "form-5", price: 3000 },
    ],
    "Julani School": [
      { label: "Grade 1 - K2,800 (Per term)", value: "grade-1", price: 2800 },
      { label: "Grade 2 - K3,000 (Per term)", value: "grade-2", price: 3000 },
      { label: "Grade 3 - K3,200 (Per term)", value: "grade-3", price: 3200 },
      { label: "Grade 4 - K3,500 (Per term)", value: "grade-4", price: 3500 },
      { label: "Grade 5 - K3,800 (Per term)", value: "grade-5", price: 3800 },
      { label: "Grade 6 - K4,000 (Per term)", value: "grade-6", price: 4000 },
    ],
    "Crested Crane Academy": [
      { label: "Year 5 - K3,800 (Per term)", value: "year-5", price: 3800 },
      { label: "Year 6 - K4,000 (Per term)", value: "year-6", price: 4000 },
      { label: "Year 7 - K4,200 (Per term)", value: "year-7", price: 4200 },
      { label: "Year 8 - K4,500 (Per term)", value: "year-8", price: 4500 },
      { label: "Year 9 - K4,800 (Per term)", value: "year-9", price: 4800 },
      { label: "Year 10 - K5,000 (Per term)", value: "year-10", price: 5000 },
      { label: "Year 11 - K5,500 (Per term)", value: "year-11", price: 5500 },
    ],
    "International Maarif School": [
      { label: "Grade 6 - K4,500 (Per term)", value: "grade-6", price: 4500 },
      { label: "Grade 7 - K4,800 (Per term)", value: "grade-7", price: 4800 },
      { label: "Grade 8 - K5,000 (Per term)", value: "grade-8", price: 5000 },
      { label: "Grade 9 - K5,500 (Per term)", value: "grade-9", price: 5500 },
      { label: "Grade 10 - K6,000 (Per term)", value: "grade-10", price: 6000 },
      { label: "Grade 11 - K6,500 (Per term)", value: "grade-11", price: 6500 },
      { label: "Grade 12 - K7,000 (Per term)", value: "grade-12", price: 7000 },
    ],
    "African Christian University": [
      { label: "Year 1 - Business Administration - K8,500 (Per semester)", value: "year-1-business", price: 8500 },
      { label: "Year 1 - Computer Science - K8,500 (Per semester)", value: "year-1-cs", price: 8500 },
      { label: "Year 1 - Education - K8,500 (Per semester)", value: "year-1-education", price: 8500 },
      { label: "Year 2 - Business Administration - K8,500 (Per semester)", value: "year-2-business", price: 8500 },
      { label: "Year 2 - Computer Science - K8,500 (Per semester)", value: "year-2-cs", price: 8500 },
      { label: "Year 2 - Education - K8,500 (Per semester)", value: "year-2-education", price: 8500 },
      { label: "Year 3 - Business Administration - K8,500 (Per semester)", value: "year-3-business", price: 8500 },
      { label: "Year 3 - Computer Science - K8,500 (Per semester)", value: "year-3-cs", price: 8500 },
      { label: "Year 3 - Education - K8,500 (Per semester)", value: "year-3-education", price: 8500 },
      { label: "Year 4 - Business Administration - K8,500 (Per semester)", value: "year-4-business", price: 8500 },
      { label: "Year 4 - Computer Science - K8,500 (Per semester)", value: "year-4-cs", price: 8500 },
      { label: "Year 4 - Education - K8,500 (Per semester)", value: "year-4-education", price: 8500 },
    ],
  };

  return pricingBySchool[schoolName] || pricingBySchool["Twalumbu Educational Center"];
}

function AddSchoolFeesForm({ onDone, schoolName }: { onDone: (grade: string, year: string, term: string, price: number) => void; schoolName: string }) {
  const institutionType = getInstitutionType(schoolName);
  const isUniversity = institutionType === 'university';
  
  const GRADE_OPTIONS = getSchoolGradePricing(schoolName);
  const [selectedGrade, setSelectedGrade] = useState(GRADE_OPTIONS[2].value);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedTerm, setSelectedTerm] = useState(isUniversity ? "Semester 1" : "Term 1");
  const [paymentPeriod, setPaymentPeriod] = useState<"term" | "year">("term");

  const PAYMENT_PERIOD_OPTIONS = isUniversity ? [
    { label: "Per Semester", value: "term" },
    { label: "Full Year (2 Semesters)", value: "year" }
  ] : [
    { label: "Per Term", value: "term" },
    { label: "Full Year (3 Terms)", value: "year" }
  ];

  const handleDone = () => {
    const gradeOption = GRADE_OPTIONS.find(opt => opt.value === selectedGrade);
    if (gradeOption) {
      // Multiply by 2 for universities (semesters) or 3 for schools (terms) if paying for full year
      const multiplier = isUniversity ? 2 : 3;
      const finalPrice = paymentPeriod === "year" ? gradeOption.price * multiplier : gradeOption.price;
      const termLabel = paymentPeriod === "year" ? "Full Year" : selectedTerm;
      onDone(gradeOption.label, selectedYear, termLabel, finalPrice);
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" />
      
      {/* Centered Form */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-[16px]">
        <motion.div
          className="bg-white rounded-[16px] shadow-[0px_20px_60px_rgba(0,54,48,0.25)] pointer-events-auto w-full max-w-[360px]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="p-[20px]">
            {/* Header */}
            <div className="mb-[28px]">
              <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[18px] text-[#003630] tracking-[-0.18px] mb-[6px]">
                {isUniversity ? 'Add Tuition' : 'Add School Fees'}
              </p>
              <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] text-[12px] text-[#6b7280] tracking-[-0.12px] leading-relaxed">
                {isUniversity ? 'Select program and payment options' : 'Select grade and payment options'}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-[20px]">
              <AppleDropdown
                label={isUniversity ? "Program/Year" : "Grade/Form"}
                options={GRADE_OPTIONS}
                value={selectedGrade}
                onChange={setSelectedGrade}
              />
              
              <div className="h-[1px] bg-[#e5e7eb]" />
              
              <AppleDropdown
                label="Academic Year"
                options={YEAR_OPTIONS.map(y => ({ label: y, value: y }))}
                value={selectedYear}
                onChange={setSelectedYear}
              />
              
              <div className="h-[1px] bg-[#e5e7eb]" />
              
              <div>
                <label className="block font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#6b7280] tracking-[1px] uppercase mb-[12px] pl-[4px]">
                  Payment Period
                </label>
                <div className="relative bg-[#f5f7f9]/80 backdrop-blur-sm rounded-[14px] p-[4px] border-[1.5px] border-[#e5e7eb]/50">
                  <div className="grid grid-cols-2 gap-[4px] relative">
                    {PAYMENT_PERIOD_OPTIONS.map((option) => {
                      const isActive = paymentPeriod === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setPaymentPeriod(option.value as "term" | "year")}
                          className="relative z-10 py-[14px] rounded-[10px] transition-all touch-manipulation active:scale-95"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="paymentPeriodSelector"
                              className="absolute inset-0 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_1px_2px_rgba(0,0,0,0.04)]"
                              transition={{ 
                                type: "spring", 
                                stiffness: 500, 
                                damping: 30 
                              }}
                            />
                          )}
                          <p className={`relative z-10 font-['IBM_Plex_Sans_Devanagari:${isActive ? 'Bold' : 'Medium'}',sans-serif] text-[13px] tracking-[-0.2px] text-center transition-colors ${
                            isActive ? 'text-[#003630]' : 'text-[#9ca3af]'
                          }`}>
                            {option.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {paymentPeriod === "term" && (
                <>
                  <div className="h-[1px] bg-[#e5e7eb]" />
                  <AppleDropdown
                    label={isUniversity ? "Select Semester" : "Select Term"}
                    options={(isUniversity ? SEMESTER_OPTIONS : TERM_OPTIONS).map(t => ({ label: t, value: t }))}
                    value={selectedTerm}
                    onChange={setSelectedTerm}
                  />
                </>
              )}
            </div>

            {/* Premium Action Button */}
            <button 
              onClick={handleDone}
              className="relative mt-[28px] w-full h-[56px] rounded-[16px] transition-all touch-manipulation overflow-hidden group"
            >
              {/* Button Background */}
              <div className="absolute inset-0 bg-[#003630] group-hover:bg-[#004d45] transition-colors" />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              {/* Shadow */}
              <div className="absolute inset-0 shadow-[0px_6px_20px_rgba(0,54,48,0.25)] group-active:shadow-[0px_2px_8px_rgba(0,54,48,0.2)] transition-shadow" />
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center gap-[10px] h-full group-active:scale-[0.97] transition-transform">
                <span className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] text-white tracking-[-0.2px]">
                  Add Tuition Fee
                </span>
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
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/**
 * Apple-style Dropdown Component
 * Premium dropdown with smooth animations
 */
function AppleDropdown({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string; 
  options: { label: string; value: string }[]; 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="w-full">
      {/* Label */}
      <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[11px] text-[#6b7280] tracking-[1px] uppercase mb-[10px] pl-[4px]">
        {label}
      </p>
      
      {/* Dropdown Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-[48px] bg-[#f9fafb] hover:bg-white rounded-[12px] px-[16px] pr-[44px] flex items-center justify-between transition-all touch-manipulation border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm"
        >
          <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] text-[14px] text-[#003630] tracking-[-0.2px]">
            {selectedOption?.label || "Select..."}
          </p>
        </button>
        
        {/* Custom Arrow Icon */}
        <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-calc(50%-1px)]">
          <div className="w-[20px] h-[20px] bg-white rounded-[6px] border border-[#e5e7eb] flex items-center justify-center shadow-sm">
            <motion.svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </div>
        </div>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute z-50 w-full mt-[8px] bg-white/95 backdrop-blur-[20px] rounded-[14px] shadow-[0px_8px_32px_rgba(0,0,0,0.12)] overflow-hidden border-[1.5px] border-[#e5e7eb]"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="max-h-[240px] overflow-y-auto p-[4px]">
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className="w-full group touch-manipulation active:scale-[0.98] transition-transform mb-[2px]"
                  >
                    <div className={`w-full text-left px-[14px] py-[12px] rounded-[10px] transition-all relative ${
                      option.value === value 
                        ? 'bg-gradient-to-r from-[#e0f7d4] to-[#d0f0c0] border-[1.5px] border-[#95e36c]/30' 
                        : 'hover:bg-[#f5f7f9] border-[1.5px] border-transparent'
                    }`}>
                      {option.value === value && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[#95e36c] rounded-r-full" />
                      )}
                      <div className="flex items-center justify-between">
                        <p className={`font-['IBM_Plex_Sans_Devanagari:${option.value === value ? 'SemiBold' : 'Regular'}',sans-serif] text-[14px] tracking-[-0.2px] ${
                          option.value === value ? 'text-[#003630] ml-[8px]' : 'text-[#1d1d1f]'
                        }`}>
                          {option.label}
                        </p>
                        {option.value === value && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8L6 11L13 4" stroke="#95e36c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to build service description with all metadata
 */
function buildServiceDescription(service: { 
  name: string; 
  term: string; 
  route?: string;
  paymentPeriod?: string;
  uniformItems?: string[];
}): string {
  let description = service.name;
  
  if (service.term) {
    description += ` - ${service.term}`;
  }
  
  if (service.paymentPeriod) {
    const periodLabels: Record<string, string> = {
      'term': 'Per Term',
      'week': 'Per Week',
      'day': 'Per Day',
      'year': 'Full Year'
    };
    description += ` (${periodLabels[service.paymentPeriod] || service.paymentPeriod})`;
  }
  
  if (service.route) {
    description += ` - ${service.route}`;
  }
  
  if (service.uniformItems && service.uniformItems.length > 0) {
    if (service.uniformItems.includes('uniform-complete')) {
      description += ' (Complete Set)';
    } else {
      description += ` (${service.uniformItems.length} item${service.uniformItems.length > 1 ? 's' : ''})`;
    }
  }
  
  return description;
}

export default function AddServicesPage({ selectedStudentIds, userPhone, schoolName, onBack, onNext, onCheckout }: AddServicesPageProps) {
  const allStudents = getStudentsByPhone(userPhone);
  const selectedStudents = allStudents.filter(s => selectedStudentIds.includes(s.id));
  
  // Determine if this is a university or school
  const institutionType = getInstitutionType(schoolName);
  const isUniversity = institutionType === 'university';
  
  const [activeStudentId, setActiveStudentId] = useState<string>(selectedStudents[0]?.id || "");
  const activeStudent = selectedStudents.find(s => s.id === activeStudentId);
  const [showAddFeesForm, setShowAddFeesForm] = useState(false);
  const [showOtherServicesPopup, setShowOtherServicesPopup] = useState(false);
  const [studentServices, setStudentServices] = useState<Record<string, Service[]>>({});

  // Get services for the active student
  const activeStudentServices = studentServices[activeStudentId] || [];
  
  // Calculate total across all selected students
  const totalAmount = Object.entries(studentServices).reduce((sum, [studentId, services]) => {
    if (selectedStudentIds.includes(studentId)) {
      return sum + services.reduce((serviceSum, service) => serviceSum + service.amount, 0);
    }
    return sum;
  }, 0);

  const handleAddSchoolFees = () => {
    setShowAddFeesForm(true);
  };

  const handleDone = (grade: string, year: string, term: string, price: number) => {
    setShowAddFeesForm(false);
    const newService: Service = {
      id: `service-${Date.now()}`,
      description: `${grade} - ${term} ${year}`,
      amount: price,
      invoiceNo: "202"
    };
    setStudentServices(prev => ({
      ...prev,
      [activeStudentId]: [...(prev[activeStudentId] || []), newService]
    }));
  };

  const handleAddOtherServices = () => {
    setShowOtherServicesPopup(true);
  };

  const handleOtherServicesDone = (services: Array<{ 
    id: string; 
    name: string; 
    amount: number; 
    category: string; 
    term: string; 
    route?: string;
    paymentPeriod?: string;
    uniformItems?: string[];
  }>) => {
    setShowOtherServicesPopup(false);
    
    if (services.length === 0) return;
    
    // Get existing services for the active student
    const existingServices = studentServices[activeStudentId] || [];
    
    // Convert the school services to the Service format, filtering out duplicates
    const newServices: Service[] = services
      .filter(service => {
        // Create a signature for this service based on all key attributes
        const newSignature = `${service.name}-${service.term}${service.route ? `-${service.route}` : ''}${service.paymentPeriod ? `-${service.paymentPeriod}` : ''}${service.uniformItems ? `-${service.uniformItems.join(',')}` : ''}`;
        
        // Check if a service with this signature already exists
        const isDuplicate = existingServices.some(existing => {
          // Extract the signature from the existing service description
          return existing.description === buildServiceDescription(service);
        });
        
        return !isDuplicate;
      })
      .map((service, index) => {
        // Generate a unique ID
        const uniqueId = `${service.id}-${service.term.replace(/\s+/g, '-')}-${service.route ? service.route.replace(/\s+/g, '-') : 'no-route'}-${Date.now()}-${index}`;
        
        return {
          id: uniqueId,
          description: buildServiceDescription(service),
          amount: service.amount,
          invoiceNo: "202"
        };
      });
    
    // Only add if there are new services (not all duplicates)
    if (newServices.length > 0) {
      setStudentServices(prev => ({
        ...prev,
        [activeStudentId]: [...(prev[activeStudentId] || []), ...newServices]
      }));
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setStudentServices(prev => ({
      ...prev,
      [activeStudentId]: (prev[activeStudentId] || []).filter(s => s.id !== serviceId)
    }));
  };

  // Check if any services have been added
  const hasServices = Object.values(studentServices).some(services => services.length > 0);

  const handleNextOrCheckout = () => {
    if (totalAmount > 0 && onCheckout) {
      // Flatten all services with student names
      const allServicesWithStudents = Object.entries(studentServices).flatMap(([studentId, services]) => {
        const student = selectedStudents.find(s => s.id === studentId);
        return services.map(service => ({
          ...service,
          studentName: student?.name || studentId
        }));
      });
      onCheckout(allServicesWithStudents);
    } else {
      onNext();
    }
  };

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-screen mx-auto shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col">
        <Header onBack={onBack} />
        
        <div className="flex-1 flex flex-col px-[24px] pt-[12px] pb-[8px] overflow-hidden">
          <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] leading-[24px] not-italic text-[18px] text-black tracking-[-0.18px]">
            Add Services to pay for
          </p>
          <p className="font-['IBM_Plex_Sans_Devanagari:Regular',sans-serif] leading-[1.5] not-italic text-[#a7aaa7] text-[12px] tracking-[-0.12px] mt-[2px]">
            Select the services that you would like to pay for and proceed to checkout to make payment.
          </p>

          {/* Main Card - Premium */}
          <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center overflow-clip px-[14px] py-[8px] rounded-[16px] mt-[12px] shadow-[0px_2px_16px_rgba(0,0,0,0.06)] border-[1.5px] border-[#e5e7eb] flex-1 min-h-0">
            {/* Child Pills */}
            <div className="content-stretch flex gap-[25px] items-center relative shrink-0 w-full overflow-x-auto">
              {selectedStudents.slice(0, 2).map(student => (
                <ChildPill
                  key={student.id}
                  name={student.name}
                  id={student.id}
                  isActive={activeStudentId === student.id}
                  onClick={() => setActiveStudentId(student.id)}
                />
              ))}
            </div>

            {/* Student Info */}
            {activeStudent && (
              <StudentInfo 
                student={activeStudent} 
                serviceTotal={activeStudentServices.reduce((sum, s) => sum + s.amount, 0)} 
              />
            )}

            {/* Conditional Content */}
            {showAddFeesForm ? (
              <AddSchoolFeesForm onDone={handleDone} schoolName={schoolName} />
            ) : (
              <>
                {/* Service Table */}
                {!showOtherServicesPopup && (
                  <ServiceTable services={activeStudentServices} onRemoveItem={handleRemoveService} />
                )}

                {/* Add Buttons - Premium Style */}
                {!showOtherServicesPopup && (
                  <div className="w-full space-y-[12px] mt-[4px]">
                    {/* Primary Action Button */}
                    <button 
                      onClick={handleAddSchoolFees}
                      className="relative w-full h-[54px] rounded-[16px] transition-all touch-manipulation overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-[#003630] group-hover:bg-[#004d45] transition-colors" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="absolute inset-0 shadow-[0px_6px_20px_rgba(0,54,48,0.25)] group-active:shadow-[0px_2px_8px_rgba(0,54,48,0.2)] transition-shadow" />
                      <div className="relative z-10 flex items-center justify-center gap-[8px] h-full group-active:scale-[0.97] transition-transform">
                        <span className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] text-white tracking-[-0.2px]">
                          {isUniversity ? 'Add Tuition' : 'Add School Fees'}
                        </span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3.5V12.5M3.5 8H12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </button>
                    
                    {/* Secondary Action Button */}
                    <button 
                      onClick={() => {
                        haptics.buttonPress();
                        handleAddOtherServices();
                      }}
                      className="w-full h-[48px] bg-white border-[1.5px] border-[#e5e7eb] hover:border-[#d1d5db] rounded-[14px] transition-all touch-manipulation active:scale-[0.98] flex items-center justify-center shadow-sm group"
                    >
                      <span className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[14px] text-[#003630] tracking-[-0.2px] group-hover:text-[#004d45] transition-colors">
                        Add Other Services
                      </span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-[8px]">
                        <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer - Premium Card */}
        <div className="bg-white rounded-[14px] mx-auto mb-[16px] w-[322px] shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border-[1.5px] border-[#e5e7eb] shrink-0">
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip p-[16px] relative rounded-[inherit] w-full">
            <div className="content-stretch flex flex-col items-start not-italic relative shrink-0 text-[#003630] w-[101px]">
              <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] h-[19px] leading-[24px] relative shrink-0 text-[17px] tracking-[-0.17px] w-full">
                ZMW {totalAmount}
              </p>
              <p className="font-['IBM_Plex_Sans_Devanagari:Medium',sans-serif] h-[10px] leading-[12px] relative shrink-0 text-[8px] tracking-[-0.08px] w-full">
                Grand total
              </p>
            </div>
            <button 
              onClick={() => {
                if (hasServices) {
                  haptics.buttonPress();
                  handleNextOrCheckout();
                }
              }}
              disabled={!hasServices}
              className={`basis-0 grow h-[46px] min-h-px min-w-px relative rounded-[10px] shrink-0 overflow-hidden group ${
                hasServices 
                  ? 'touch-manipulation cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Background */}
              <div className={`absolute inset-0 transition-colors ${
                hasServices ? 'bg-[#003630] group-hover:bg-[#004d45]' : 'bg-[#003630]'
              }`} />
              
              {/* Shine Effect */}
              {hasServices && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
              
              {/* Content */}
              <div className={`relative z-10 flex items-center justify-center gap-[8px] h-full ${
                hasServices ? 'group-active:scale-[0.97] transition-transform' : ''
              }`}>
                <p className="font-['IBM_Plex_Sans_Devanagari:Bold',sans-serif] text-[15px] text-white tracking-[-0.2px]">
                  {totalAmount > 0 ? "Checkout" : "Next"}
                </p>
                {totalAmount > 0 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.5 11.5L10 8L5.5 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Add Other Services Popup */}
        {showOtherServicesPopup && (
          <AddOtherServicesPopup
            schoolName={schoolName}
            onClose={() => setShowOtherServicesPopup(false)}
            onDone={handleOtherServicesDone}
          />
        )}
      </div>
    </div>
  );
}