import { ChevronDown } from "lucide-react";
import { detectNetwork, getNetworkInfo } from "../utils/networkDetection";

interface ExpandedMobileMoneyProps {
  mobileNumber: string;
  onMobileNumberChange: (value: string) => void;
  onCollapse: () => void;
}

export default function ExpandedMobileMoney({ 
  mobileNumber, 
  onMobileNumberChange, 
  onCollapse 
}: ExpandedMobileMoneyProps) {
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onMobileNumberChange(formatted);
  };

  // Detect network from current mobile number
  const networkInfo = getNetworkInfo(mobileNumber);
  const hasNetwork = networkInfo.name !== null;

  return (
    <div className="bg-white border-[1.5px] border-[#003630] rounded-[16px] p-[16px] w-full shadow-[0px_8px_24px_rgba(0,54,48,0.12)]">
      <button
        onClick={onCollapse}
        className="w-full flex items-center justify-between mb-[16px] touch-manipulation group"
      >
        <div className="flex items-center gap-[10px]">
          <div className="size-[20px] flex items-center justify-center">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 22">
              <path d="M13.25 1.75H4.25C2.59315 1.75 1.25 3.09315 1.25 4.75V17.25C1.25 18.9069 2.59315 20.25 4.25 20.25H13.25C14.9069 20.25 16.25 18.9069 16.25 17.25V4.75C16.25 3.09315 14.9069 1.75 13.25 1.75Z" stroke="#003630" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M10.75 4.25H6.75" stroke="#003630" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[16px] text-[#003630] tracking-[-0.3px]">
            Mobile Money
          </p>
        </div>
        <ChevronDown className="w-5 h-5 text-[#003630] transform rotate-180 group-hover:translate-y-[-2px] transition-transform" strokeWidth={2.5} />
      </button>
      
      <div className="flex flex-col gap-[10px]">
        <label className="font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.2px]">
          Mobile Number
        </label>
        <div className="relative">
          <div className="flex items-center gap-[12px] bg-[#f9fafb] border-[1.5px] border-[#e5e7eb] rounded-[14px] p-[14px] focus-within:border-[#003630] focus-within:bg-white transition-all shadow-sm">
            <select
              className="appearance-none bg-transparent border-none outline-none font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[15px] text-[#003630] pr-[20px] cursor-pointer touch-manipulation tracking-[-0.2px]"
              defaultValue="+260"
            >
              <option value="+260">+260</option>
              <option value="+254">+254</option>
              <option value="+255">+255</option>
              <option value="+256">+256</option>
            </select>
            <div className="h-[24px] w-[1.5px] bg-[#e5e7eb]" />
            <input
              type="tel"
              value={mobileNumber}
              onChange={handleInputChange}
              placeholder="977-123-456"
              maxLength={11}
              className="flex-1 bg-transparent border-none outline-none font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[15px] text-[#003630] placeholder:text-[#9ca3af] tracking-[-0.2px] touch-manipulation"
            />
          </div>
        </div>
        
        {/* Network Detection Badge */}
        {hasNetwork && (
          <div className="flex items-center gap-[10px] mt-[8px]">
            <div 
              className="px-[14px] py-[7px] rounded-[10px] flex items-center gap-[7px] shadow-sm"
              style={{ 
                backgroundColor: `${networkInfo.color}12`,
                border: `1.5px solid ${networkInfo.color}35`
              }}
            >
              <div 
                className="w-[8px] h-[8px] rounded-full shadow-sm"
                style={{ backgroundColor: networkInfo.color }}
              />
              <span 
                className="font-['IBM_Plex_Sans:Bold',sans-serif] text-[12px] tracking-[-0.2px]"
                style={{ color: networkInfo.color }}
              >
                {networkInfo.name}
              </span>
            </div>
            <span className="font-['IBM_Plex_Sans:Medium',sans-serif] text-[11px] text-[#9ca3af] tracking-[-0.15px]">
              Network detected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}