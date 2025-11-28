import { ChevronDown } from "lucide-react";

interface ExpandedCardPaymentProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onCollapse: () => void;
  cardNumberError?: string;
  expiryDateError?: string;
  cvvError?: string;
}

export default function ExpandedCardPayment({ 
  cardNumber,
  expiryDate,
  cvv,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  onCollapse,
  cardNumberError,
  expiryDateError,
  cvvError
}: ExpandedCardPaymentProps) {
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 6)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      onCardNumberChange(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, "").length <= 6) {
      onExpiryDateChange(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      onCvvChange(cleaned);
    }
  };

  return (
    <div className="bg-white border-[1.5px] border-[#003630] rounded-[16px] p-[16px] w-full shadow-[0px_8px_24px_rgba(0,54,48,0.12)]">
      <button
        onClick={onCollapse}
        className="w-full flex items-center justify-between mb-[16px] touch-manipulation group"
      >
        <div className="flex items-center gap-[10px]">
          <div className="size-[20px] flex items-center justify-center">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <path d="M17.5 5.83333H2.5C1.57952 5.83333 0.833333 6.57952 0.833333 7.5V15.8333C0.833333 16.7538 1.57952 17.5 2.5 17.5H17.5C18.4205 17.5 19.1667 16.7538 19.1667 15.8333V7.5C19.1667 6.57952 18.4205 5.83333 17.5 5.83333Z" stroke="#003630" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M0.833333 9.16667H19.1667" stroke="#003630" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="font-['IBM_Plex_Sans_Devanagari:SemiBold',sans-serif] text-[16px] text-[#003630] tracking-[-0.3px]">
            Card Payment
          </p>
        </div>
        <ChevronDown className="w-5 h-5 text-[#003630] transform rotate-180 group-hover:translate-y-[-2px] transition-transform" strokeWidth={2.5} />
      </button>
      
      <div className="flex flex-col gap-[14px]">
        {/* Card Number */}
        <div className="flex flex-col gap-[10px]">
          <label className="font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.2px]">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className={`bg-[#f9fafb] border-[1.5px] ${cardNumberError ? 'border-red-500 bg-red-50' : 'border-[#e5e7eb]'} rounded-[14px] p-[14px] font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[15px] text-[#003630] placeholder:text-[#9ca3af] tracking-[-0.2px] outline-none touch-manipulation focus:border-[#003630] focus:bg-white transition-all shadow-sm`}
          />
          {cardNumberError && (
            <p className="font-['IBM_Plex_Sans:Medium',sans-serif] text-[11px] text-red-500 tracking-[-0.15px]">
              {cardNumberError}
            </p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="flex gap-[12px] items-start">
          <div className="flex-1 flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.2px]">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/YYYY"
              className={`bg-[#f9fafb] border-[1.5px] ${expiryDateError ? 'border-red-500 bg-red-50' : 'border-[#e5e7eb]'} rounded-[14px] p-[14px] font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[15px] text-[#003630] placeholder:text-[#9ca3af] tracking-[-0.2px] outline-none touch-manipulation focus:border-[#003630] focus:bg-white transition-all shadow-sm`}
            />
            {expiryDateError && (
              <p className="font-['IBM_Plex_Sans:Medium',sans-serif] text-[11px] text-red-500 tracking-[-0.15px]">
                {expiryDateError}
              </p>
            )}
          </div>

          <div className="w-[90px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[13px] text-[#6b7280] tracking-[-0.2px]">
              CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="123"
              maxLength={3}
              className={`bg-[#f9fafb] border-[1.5px] ${cvvError ? 'border-red-500 bg-red-50' : 'border-[#e5e7eb]'} rounded-[14px] p-[14px] font-['IBM_Plex_Sans:SemiBold',sans-serif] text-[15px] text-[#003630] placeholder:text-[#9ca3af] tracking-[-0.2px] outline-none touch-manipulation focus:border-[#003630] focus:bg-white transition-all shadow-sm text-center`}
            />
            {cvvError && (
              <p className="font-['IBM_Plex_Sans:Medium',sans-serif] text-[11px] text-red-500 tracking-[-0.15px]">
                {cvvError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}