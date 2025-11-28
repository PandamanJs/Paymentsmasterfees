import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ChevronRight } from "lucide-react";

interface School {
  id: number;
  name: string;
  logo: string | null;
}

interface SearchPageProps {
  onProceed: () => void;
  selectedSchool: string | null;
  onSchoolSelect: (school: string) => void;
}

export default function SearchPage({ onProceed, selectedSchool, onSchoolSelect }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // School data - matching the schools from App.tsx
  const schools: School[] = [
    { 
      id: 1, 
      name: "Twalumbu Educational Center",
      logo: null,
    },
    { 
      id: 2, 
      name: "Chimilute Trust Academy",
      logo: null, // Logo will be passed from App.tsx if needed
    },
    { 
      id: 3, 
      name: "Julani School",
      logo: null,
    },
    { 
      id: 4, 
      name: "Crested Crane Academy",
      logo: null,
    },
    { 
      id: 5, 
      name: "International Maarif School",
      logo: null,
    },
  ];

  // Filter schools based on search query
  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) return schools;
    
    const query = searchQuery.toLowerCase();
    return schools.filter(school => 
      school.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSchoolSelect = (schoolName: string) => {
    onSchoolSelect(schoolName);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleProceed = () => {
    if (selectedSchool) {
      onProceed();
    }
  };

  // Get initials for schools without logos
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-[#003630] mb-2">Select Your School</h1>
          <p className="text-[#003630]/60">
            Choose your school to continue with payment
          </p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          <div
            className={`
              relative bg-white rounded-2xl overflow-hidden
              transition-all duration-300
              ${isSearchFocused 
                ? 'ring-2 ring-[#95e36c] shadow-lg shadow-[#95e36c]/10' 
                : 'ring-1 ring-[#003630]/10 shadow-md'
              }
            `}
            style={{
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center px-4 py-4">
              <Search 
                className={`
                  flex-shrink-0 transition-colors duration-300
                  ${isSearchFocused ? 'text-[#95e36c]' : 'text-[#003630]/40'}
                `} 
                size={20} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search schools..."
                className="
                  flex-1 px-3 bg-transparent outline-none
                  text-[#003630] placeholder:text-[#003630]/40
                "
                style={{
                  fontSize: '16px', // Prevent iOS zoom on focus
                }}
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={handleClearSearch}
                  className="
                    flex-shrink-0 p-1 rounded-full
                    bg-[#003630]/5 hover:bg-[#003630]/10
                    active:scale-95
                    transition-all duration-200
                  "
                  style={{
                    minWidth: '28px',
                    minHeight: '28px',
                  }}
                >
                  <X size={16} className="text-[#003630]/60" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Schools List */}
      <div className="flex-1 overflow-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {filteredSchools.length > 0 ? (
            <motion.div
              key="schools-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredSchools.map((school, index) => {
                const isSelected = selectedSchool === school.name;
                
                return (
                  <motion.button
                    key={school.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleSchoolSelect(school.name)}
                    className={`
                      w-full rounded-2xl p-4 
                      transition-all duration-300
                      ${isSelected
                        ? 'bg-[#95e36c] shadow-lg shadow-[#95e36c]/20 ring-2 ring-[#95e36c]'
                        : 'bg-white shadow-md ring-1 ring-[#003630]/10 hover:shadow-lg active:scale-[0.98]'
                      }
                    `}
                    style={{
                      minHeight: '80px',
                      touchAction: 'manipulation',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* School Logo/Initials */}
                      <div
                        className={`
                          flex-shrink-0 rounded-xl flex items-center justify-center
                          transition-all duration-300
                          ${isSelected
                            ? 'bg-white text-[#95e36c]'
                            : 'bg-[#003630] text-white'
                          }
                        `}
                        style={{
                          width: '56px',
                          height: '56px',
                        }}
                      >
                        {school.logo ? (
                          <img 
                            src={school.logo} 
                            alt={school.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <span className="font-semibold">
                            {getInitials(school.name)}
                          </span>
                        )}
                      </div>

                      {/* School Name */}
                      <div className="flex-1 text-left">
                        <h3
                          className={`
                            transition-colors duration-300
                            ${isSelected ? 'text-[#003630]' : 'text-[#003630]'}
                          `}
                        >
                          {school.name}
                        </h3>
                        {isSelected && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-[#003630]/70 text-sm mt-1"
                          >
                            Selected
                          </motion.p>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="
                              w-6 h-6 rounded-full bg-white
                              flex items-center justify-center
                            "
                          >
                            <svg
                              width="14"
                              height="11"
                              viewBox="0 0 14 11"
                              fill="none"
                            >
                              <path
                                d="M1 5.5L5 9.5L13 1.5"
                                stroke="#95e36c"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                        ) : (
                          <ChevronRight 
                            size={20} 
                            className="text-[#003630]/40"
                          />
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="
                flex flex-col items-center justify-center
                py-16 px-6 text-center
              "
            >
              <div
                className="
                  w-20 h-20 rounded-full bg-[#003630]/5
                  flex items-center justify-center mb-4
                "
              >
                <Search size={32} className="text-[#003630]/40" />
              </div>
              <h3 className="text-[#003630] mb-2">No schools found</h3>
              <p className="text-[#003630]/60 max-w-xs">
                Try adjusting your search to find your school
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue Button - Fixed at bottom */}
      <AnimatePresence>
        {selectedSchool && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="
              fixed bottom-0 left-0 right-0
              px-6 pb-6 pt-4
              bg-gradient-to-t from-white via-white to-transparent
            "
            style={{
              backdropFilter: 'blur(8px)',
            }}
          >
            <button
              onClick={handleProceed}
              className="
                w-full py-4 rounded-2xl
                bg-[#003630] text-white
                shadow-lg shadow-[#003630]/20
                active:scale-[0.98]
                transition-all duration-200
              "
              style={{
                minHeight: '56px',
                touchAction: 'manipulation',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                Continue with {selectedSchool.split(" ")[0]}
                <ChevronRight size={20} />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
