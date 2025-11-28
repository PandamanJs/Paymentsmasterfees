/**
 * Comprehensive School Data Module
 * 
 * This module contains all data for the Master-Fees payment system:
 * - Parent/Guardian information
 * - Student records linked to parents and schools
 * - School-specific services and fees
 * - Authentication mapping
 * 
 * Architecture:
 * Each of the 5 schools has unique:
 * - Parents with different phone numbers
 * - Students enrolled in that specific school
 * - Available services/fees for payment
 */

/**
 * Student Interface
 * Represents an individual student enrolled in a school
 */
export interface Student {
  name: string;      // Full name of the student
  id: string;        // Unique student ID (e.g., TEC001, CTA001)
  grade: string;     // Class/grade (e.g., Grade 3B, Form 1)
  balances: number;  // Number of outstanding invoices
  schoolName: string; // School the student attends
}

/**
 * Parent/Guardian Interface
 * Represents a parent or guardian with associated students
 */
export interface ParentData {
  name: string;       // Full name of parent/guardian
  phone: string;      // Contact phone number (9 digits)
  students: Student[]; // Array of children enrolled in schools
  primarySchool: string; // Primary school affiliation
}

/**
 * Service/Fee Interface
 * Represents a payable service or fee type
 */
export interface SchoolService {
  id: string;          // Unique service identifier
  name: string;        // Service name
  description: string; // Detailed description
  amount: number;      // Cost in ZMW (Zambian Kwacha)
  category: 'tuition' | 'meals' | 'transport' | 'activities' | 'supplies' | 'accommodation' | 'uniform' | 'other';
  paymentPeriods?: Array<{
    period: 'term' | 'week' | 'day' | 'year';
    amount: number;
    label: string;
  }>;
  routePricing?: Record<string, number>; // For transport services with different route prices
  subItems?: Array<{
    id: string;
    name: string;
    amount: number;
  }>; // For services like uniform with individual parts
}

/**
 * School Configuration Interface
 * Complete data structure for each school
 */
export interface SchoolData {
  name: string;
  code: string;        // School code prefix for student IDs
  type: 'school' | 'university'; // Institution type
  services: SchoolService[];
  parents: ParentData[];
}

/**
 * Complete School Database
 * Contains all data for 5 schools in the system
 */
export const SCHOOL_DATABASE: Record<string, SchoolData> = {
  /**
   * TWALUMBU EDUCATIONAL CENTER
   * Rural community school in Eastern Province
   */
  "Twalumbu Educational Center": {
    name: "Twalumbu Educational Center",
    code: "TEC",
    type: "school",
    services: [
      {
        id: "TEC-S001",
        name: "Tuition Fees - Term 1",
        description: "Full term tuition for primary grades",
        amount: 1200,
        category: "tuition"
      },
      {
        id: "TEC-S002",
        name: "Canteen (Lunch)",
        description: "Daily lunch program",
        amount: 300,
        category: "meals",
        paymentPeriods: [
          { period: 'term', amount: 300, label: 'Per Term (ZMW 300)' },
          { period: 'week', amount: 80, label: 'Per Week (ZMW 80)' },
          { period: 'day', amount: 20, label: 'Per Day (ZMW 20)' }
        ]
      },
      {
        id: "TEC-S003",
        name: "Textbooks & Materials",
        description: "Required textbooks and learning materials",
        amount: 250,
        category: "supplies"
      },
      {
        id: "TEC-S004",
        name: "Sports Uniform",
        description: "PE kit and sports day uniform",
        amount: 180,
        category: "supplies"
      },
      {
        id: "TEC-S005",
        name: "School Bus",
        description: "Transport subscription",
        amount: 400,
        category: "transport",
        paymentPeriods: [
          { period: 'term', amount: 400, label: 'Per Term (ZMW 400)' },
          { period: 'week', amount: 120, label: 'Per Week (ZMW 120)' },
          { period: 'day', amount: 30, label: 'Per Day (ZMW 30)' }
        ],
        routePricing: {
          "Route A - Central": 400,
          "Route B - East": 450,
          "Route C - West": 500
        }
      },
      {
        id: "TEC-S006",
        name: "Term 1 Fees",
        description: "First term miscellaneous fees",
        amount: 150,
        category: "other"
      },
      {
        id: "TEC-S007",
        name: "Term 2 Fees",
        description: "Second term miscellaneous fees",
        amount: 150,
        category: "other"
      },
      {
        id: "TEC-S008",
        name: "Term 3 Fees",
        description: "Third term miscellaneous fees",
        amount: 150,
        category: "other"
      },
      {
        id: "TEC-S009",
        name: "School Uniform",
        description: "Complete school uniform set or individual items",
        amount: 600,
        category: "uniform",
        subItems: [
          { id: "uniform-complete", name: "Complete Set", amount: 600 },
          { id: "uniform-shirt", name: "Shirt/Blouse", amount: 80 },
          { id: "uniform-trousers", name: "Trousers/Skirt", amount: 120 },
          { id: "uniform-shoes", name: "School Shoes", amount: 150 },
          { id: "uniform-socks", name: "Socks (3 pairs)", amount: 40 },
          { id: "uniform-tie", name: "School Tie", amount: 30 },
          { id: "uniform-sweater", name: "Sweater/Cardigan", amount: 100 },
          { id: "uniform-pe", name: "PE Kit", amount: 80 }
        ]
      },
      {
        id: "TEC-S010",
        name: "Boarding Accommodation",
        description: "Full boarding accommodation per term",
        amount: 1500,
        category: "accommodation"
      }
    ],
    parents: [
      {
        name: "Mr Stephen Kapambwe",
        phone: "977123456",
        primarySchool: "Twalumbu Educational Center",
        students: [
          {
            name: "Talitha Kapambwe",
            id: "TEC001",
            grade: "Grade 3B",
            balances: 0,
            schoolName: "Twalumbu Educational Center"
          },
          {
            name: "Isaiah Kapambwe",
            id: "TEC002",
            grade: "Grade 4A",
            balances: 1,
            schoolName: "Twalumbu Educational Center"
          }
        ]
      },
      {
        name: "Mrs Grace Phiri",
        phone: "955234567",
        primarySchool: "Twalumbu Educational Center",
        students: [
          {
            name: "Emmanuel Phiri",
            id: "TEC003",
            grade: "Grade 5B",
            balances: 2,
            schoolName: "Twalumbu Educational Center"
          }
        ]
      }
    ]
  },

  /**
   * CHIMILUTE TRUST ACADEMY
   * Christian-based secondary school in Lusaka
   */
  "Chimilute Trust Academy": {
    name: "Chimilute Trust Academy",
    code: "CTA",
    type: "school",
    services: [
      {
        id: "CTA-S001",
        name: "Tuition Fees - Term 1",
        description: "Secondary school tuition fees",
        amount: 2500,
        category: "tuition"
      },
      {
        id: "CTA-S002",
        name: "Canteen (Lunch)",
        description: "Daily nutritious meals for students",
        amount: 450,
        category: "meals",
        paymentPeriods: [
          { period: 'term', amount: 450, label: 'Per Term (ZMW 450)' },
          { period: 'week', amount: 120, label: 'Per Week (ZMW 120)' },
          { period: 'day', amount: 25, label: 'Per Day (ZMW 25)' }
        ]
      },
      {
        id: "CTA-S003",
        name: "Boarding Accommodation",
        description: "Full boarding accommodation per term",
        amount: 1800,
        category: "accommodation"
      },
      {
        id: "CTA-S004",
        name: "Laboratory Fees",
        description: "Science lab materials and equipment",
        amount: 450,
        category: "supplies"
      },
      {
        id: "CTA-S005",
        name: "Library Subscription",
        description: "Annual library access and book lending",
        amount: 200,
        category: "supplies"
      },
      {
        id: "CTA-S006",
        name: "Music & Arts Program",
        description: "Extracurricular music and arts classes",
        amount: 350,
        category: "activities"
      },
      {
        id: "CTA-S007",
        name: "School Bus",
        description: "Daily transport to and from school",
        amount: 500,
        category: "transport",
        paymentPeriods: [
          { period: 'term', amount: 500, label: 'Per Term (ZMW 500)' },
          { period: 'week', amount: 140, label: 'Per Week (ZMW 140)' },
          { period: 'day', amount: 35, label: 'Per Day (ZMW 35)' }
        ],
        routePricing: {
          "Route 1 - Kabulonga": 500,
          "Route 2 - Roma": 550,
          "Route 3 - Woodlands": 600,
          "Route 4 - Chelston": 650
        }
      },
      {
        id: "CTA-S008",
        name: "Term 1 Fees",
        description: "First term miscellaneous fees",
        amount: 200,
        category: "other"
      },
      {
        id: "CTA-S009",
        name: "Term 2 Fees",
        description: "Second term miscellaneous fees",
        amount: 200,
        category: "other"
      },
      {
        id: "CTA-S010",
        name: "Term 3 Fees",
        description: "Third term miscellaneous fees",
        amount: 200,
        category: "other"
      },
      {
        id: "CTA-S011",
        name: "School Uniform",
        description: "Complete school uniform set or individual items",
        amount: 750,
        category: "uniform",
        subItems: [
          { id: "uniform-complete", name: "Complete Set", amount: 750 },
          { id: "uniform-shirt", name: "Shirt/Blouse (White)", amount: 90 },
          { id: "uniform-trousers", name: "Trousers/Skirt (Navy)", amount: 140 },
          { id: "uniform-shoes", name: "Black School Shoes", amount: 180 },
          { id: "uniform-socks", name: "Socks (3 pairs)", amount: 50 },
          { id: "uniform-tie", name: "School Tie", amount: 40 },
          { id: "uniform-blazer", name: "School Blazer", amount: 200 },
          { id: "uniform-pe", name: "PE Kit", amount: 100 }
        ]
      }
    ],
    parents: [
      {
        name: "Mrs Alice Mwamba",
        phone: "966987654",
        primarySchool: "Chimilute Trust Academy",
        students: [
          {
            name: "John Mwansa",
            id: "CTA001",
            grade: "Form 2",
            balances: 0,
            schoolName: "Chimilute Trust Academy"
          },
          {
            name: "Sarah Banda",
            id: "CTA002",
            grade: "Form 3",
            balances: 2,
            schoolName: "Chimilute Trust Academy"
          }
        ]
      },
      {
        name: "Dr Patrick Chilufya",
        phone: "977456789",
        primarySchool: "Chimilute Trust Academy",
        students: [
          {
            name: "Michael Chilufya",
            id: "CTA003",
            grade: "Form 1",
            balances: 1,
            schoolName: "Chimilute Trust Academy"
          },
          {
            name: "Grace Chilufya",
            id: "CTA004",
            grade: "Form 4",
            balances: 0,
            schoolName: "Chimilute Trust Academy"
          }
        ]
      }
    ]
  },

  /**
   * JULANI SCHOOL
   * Premium preparatory school in Kitwe
   */
  "Julani School": {
    name: "Julani School",
    code: "JUL",
    type: "school",
    services: [
      {
        id: "JUL-S001",
        name: "Tuition Fees - Term 1",
        description: "Premium preparatory education",
        amount: 3500,
        category: "tuition"
      },
      {
        id: "JUL-S002",
        name: "Canteen (Lunch)",
        description: "Gourmet daily lunch program",
        amount: 500,
        category: "meals",
        paymentPeriods: [
          { period: 'term', amount: 500, label: 'Per Term (ZMW 500)' },
          { period: 'week', amount: 140, label: 'Per Week (ZMW 140)' },
          { period: 'day', amount: 30, label: 'Per Day (ZMW 30)' }
        ]
      },
      {
        id: "JUL-S003",
        name: "Swimming Lessons",
        description: "Professional swimming instruction",
        amount: 600,
        category: "activities"
      },
      {
        id: "JUL-S004",
        name: "Computer Lab Access",
        description: "ICT lessons and computer time",
        amount: 500,
        category: "supplies"
      },
      {
        id: "JUL-S005",
        name: "Field Trip Package",
        description: "Educational excursions and trips",
        amount: 750,
        category: "activities"
      },
      {
        id: "JUL-S006",
        name: "School Uniform",
        description: "Complete uniform with tie and blazer or individual items",
        amount: 850,
        category: "uniform",
        subItems: [
          { id: "uniform-complete", name: "Complete Set (Tie & Blazer)", amount: 850 },
          { id: "uniform-shirt", name: "White Shirt/Blouse", amount: 100 },
          { id: "uniform-trousers", name: "Grey Trousers/Skirt", amount: 150 },
          { id: "uniform-shoes", name: "Black Leather Shoes", amount: 200 },
          { id: "uniform-socks", name: "Grey Socks (3 pairs)", amount: 60 },
          { id: "uniform-tie", name: "School Tie", amount: 50 },
          { id: "uniform-blazer", name: "School Blazer", amount: 250 },
          { id: "uniform-pe", name: "PE Kit", amount: 120 }
        ]
      },
      {
        id: "JUL-S007",
        name: "School Bus",
        description: "Premium transport to and from school",
        amount: 550,
        category: "transport",
        paymentPeriods: [
          { period: 'term', amount: 550, label: 'Per Term (ZMW 550)' },
          { period: 'week', amount: 150, label: 'Per Week (ZMW 150)' },
          { period: 'day', amount: 35, label: 'Per Day (ZMW 35)' }
        ],
        routePricing: {
          "Route A - Town Center": 550,
          "Route B - Parklands": 600,
          "Route C - Riverside": 650
        }
      },
      {
        id: "JUL-S008",
        name: "Term 1 Fees",
        description: "First term miscellaneous fees",
        amount: 250,
        category: "other"
      },
      {
        id: "JUL-S009",
        name: "Term 2 Fees",
        description: "Second term miscellaneous fees",
        amount: 250,
        category: "other"
      },
      {
        id: "JUL-S010",
        name: "Term 3 Fees",
        description: "Third term miscellaneous fees",
        amount: 250,
        category: "other"
      },
      {
        id: "JUL-S011",
        name: "Boarding Accommodation",
        description: "Premium boarding accommodation per term",
        amount: 2500,
        category: "accommodation"
      }
    ],
    parents: [
      {
        name: "Mr James Mutale",
        phone: "965111222",
        primarySchool: "Julani School",
        students: [
          {
            name: "Natasha Mutale",
            id: "JUL001",
            grade: "Grade 2",
            balances: 1,
            schoolName: "Julani School"
          }
        ]
      },
      {
        name: "Mrs Rebecca Banda",
        phone: "977333444",
        primarySchool: "Julani School",
        students: [
          {
            name: "Daniel Banda",
            id: "JUL002",
            grade: "Grade 4",
            balances: 0,
            schoolName: "Julani School"
          },
          {
            name: "Rachel Banda",
            id: "JUL003",
            grade: "Grade 1",
            balances: 2,
            schoolName: "Julani School"
          }
        ]
      }
    ]
  },

  /**
   * CRESTED CRANE ACADEMY
   * International curriculum school in Ndola
   */
  "Crested Crane Academy": {
    name: "Crested Crane Academy",
    code: "CCA",
    type: "school",
    services: [
      {
        id: "CCA-S001",
        name: "Tuition Fees - Term 1",
        description: "International Cambridge curriculum",
        amount: 4200,
        category: "tuition"
      },
      {
        id: "CCA-S002",
        name: "Canteen (Lunch)",
        description: "Gourmet lunch and snacks program",
        amount: 550,
        category: "meals",
        paymentPeriods: [
          { period: 'term', amount: 550, label: 'Per Term (ZMW 550)' },
          { period: 'week', amount: 150, label: 'Per Week (ZMW 150)' },
          { period: 'day', amount: 35, label: 'Per Day (ZMW 35)' }
        ]
      },
      {
        id: "CCA-S003",
        name: "IGCSE Exam Fees",
        description: "Cambridge examination registration",
        amount: 1200,
        category: "other"
      },
      {
        id: "CCA-S004",
        name: "Drama & Theatre Club",
        description: "Weekly drama and performance arts",
        amount: 400,
        category: "activities"
      },
      {
        id: "CCA-S005",
        name: "Language Tutoring",
        description: "French and Mandarin language classes",
        amount: 650,
        category: "activities"
      },
      {
        id: "CCA-S006",
        name: "School Bus",
        description: "Premium transport service",
        amount: 600,
        category: "transport",
        paymentPeriods: [
          { period: 'term', amount: 600, label: 'Per Term (ZMW 600)' },
          { period: 'week', amount: 165, label: 'Per Week (ZMW 165)' },
          { period: 'day', amount: 40, label: 'Per Day (ZMW 40)' }
        ],
        routePricing: {
          "Route 1 - CBD": 600,
          "Route 2 - Northrise": 650,
          "Route 3 - Kansenshi": 700,
          "Route 4 - Masala": 750
        }
      },
      {
        id: "CCA-S007",
        name: "Term 1 Fees",
        description: "First term miscellaneous fees",
        amount: 300,
        category: "other"
      },
      {
        id: "CCA-S008",
        name: "Term 2 Fees",
        description: "Second term miscellaneous fees",
        amount: 300,
        category: "other"
      },
      {
        id: "CCA-S009",
        name: "Term 3 Fees",
        description: "Third term miscellaneous fees",
        amount: 300,
        category: "other"
      },
      {
        id: "CCA-S010",
        name: "School Uniform",
        description: "Cambridge international uniform or individual items",
        amount: 950,
        category: "uniform",
        subItems: [
          { id: "uniform-complete", name: "Complete Set", amount: 950 },
          { id: "uniform-shirt", name: "White Shirt/Blouse", amount: 110 },
          { id: "uniform-trousers", name: "Navy Trousers/Skirt", amount: 170 },
          { id: "uniform-shoes", name: "Black Leather Shoes", amount: 220 },
          { id: "uniform-socks", name: "Navy Socks (3 pairs)", amount: 70 },
          { id: "uniform-tie", name: "School Tie", amount: 60 },
          { id: "uniform-blazer", name: "Embroidered Blazer", amount: 280 },
          { id: "uniform-pe", name: "PE Kit", amount: 130 }
        ]
      },
      {
        id: "CCA-S011",
        name: "Boarding Accommodation",
        description: "International standard boarding per term",
        amount: 3000,
        category: "accommodation"
      }
    ],
    parents: [
      {
        name: "Mr David Mwansa",
        phone: "966555666",
        primarySchool: "Crested Crane Academy",
        students: [
          {
            name: "Sophie Mwansa",
            id: "CCA001",
            grade: "Year 7",
            balances: 1,
            schoolName: "Crested Crane Academy"
          },
          {
            name: "Oliver Mwansa",
            id: "CCA002",
            grade: "Year 9",
            balances: 0,
            schoolName: "Crested Crane Academy"
          }
        ]
      },
      {
        name: "Mrs Catherine Lungu",
        phone: "955777888",
        primarySchool: "Crested Crane Academy",
        students: [
          {
            name: "Isabella Lungu",
            id: "CCA003",
            grade: "Year 5",
            balances: 3,
            schoolName: "Crested Crane Academy"
          }
        ]
      }
    ]
  },

  /**
   * INTERNATIONAL MAARIF SCHOOL
   * Turkish international school in Lusaka
   */
  "International Maarif School": {
    name: "International Maarif School",
    code: "IMS",
    type: "school",
    services: [
      {
        id: "IMS-S001",
        name: "Tuition Fees - Term 1",
        description: "International Baccalaureate program",
        amount: 5000,
        category: "tuition"
      },
      {
        id: "IMS-S002",
        name: "Canteen (Lunch)",
        description: "International cuisine lunch program",
        amount: 650,
        category: "meals",
        paymentPeriods: [
          { period: 'term', amount: 650, label: 'Per Term (ZMW 650)' },
          { period: 'week', amount: 180, label: 'Per Week (ZMW 180)' },
          { period: 'day', amount: 40, label: 'Per Day (ZMW 40)' }
        ]
      },
      {
        id: "IMS-S003",
        name: "Turkish Language Course",
        description: "Optional Turkish language instruction",
        amount: 800,
        category: "activities"
      },
      {
        id: "IMS-S004",
        name: "Robotics & STEM Lab",
        description: "Advanced robotics and coding classes",
        amount: 950,
        category: "activities"
      },
      {
        id: "IMS-S005",
        name: "International Sports",
        description: "Football, basketball, and tennis",
        amount: 700,
        category: "activities"
      },
      {
        id: "IMS-S006",
        name: "Cultural Exchange Program",
        description: "International student exchange fees",
        amount: 1500,
        category: "other"
      },
      {
        id: "IMS-S007",
        name: "School Bus",
        description: "Premium transport with AC",
        amount: 700,
        category: "transport",
        paymentPeriods: [
          { period: 'term', amount: 700, label: 'Per Term (ZMW 700)' },
          { period: 'week', amount: 190, label: 'Per Week (ZMW 190)' },
          { period: 'day', amount: 45, label: 'Per Day (ZMW 45)' }
        ],
        routePricing: {
          "Route A - Embassy Area": 700,
          "Route B - Kabulonga": 750,
          "Route C - Roma": 800,
          "Route D - Woodlands": 850,
          "Route E - Mass Media": 900
        }
      },
      {
        id: "IMS-S008",
        name: "Term 1 Fees",
        description: "First term miscellaneous fees",
        amount: 350,
        category: "other"
      },
      {
        id: "IMS-S009",
        name: "Term 2 Fees",
        description: "Second term miscellaneous fees",
        amount: 350,
        category: "other"
      },
      {
        id: "IMS-S010",
        name: "Term 3 Fees",
        description: "Third term miscellaneous fees",
        amount: 350,
        category: "other"
      },
      {
        id: "IMS-S011",
        name: "School Uniform",
        description: "International school uniform or individual items",
        amount: 1200,
        category: "uniform",
        subItems: [
          { id: "uniform-complete", name: "Complete Set (Premium)", amount: 1200 },
          { id: "uniform-shirt", name: "White Oxford Shirt/Blouse", amount: 130 },
          { id: "uniform-trousers", name: "Charcoal Trousers/Skirt", amount: 200 },
          { id: "uniform-shoes", name: "Black Leather Shoes", amount: 250 },
          { id: "uniform-socks", name: "Charcoal Socks (3 pairs)", amount: 80 },
          { id: "uniform-tie", name: "School Tie (Silk)", amount: 70 },
          { id: "uniform-blazer", name: "Embroidered Blazer", amount: 350 },
          { id: "uniform-pe", name: "PE Kit (Adidas)", amount: 150 }
        ]
      },
      {
        id: "IMS-S012",
        name: "Boarding Accommodation",
        description: "Premium international boarding per term",
        amount: 4000,
        category: "accommodation"
      }
    ],
    parents: [
      {
        name: "Mr Ahmed Hassan",
        phone: "977888999",
        primarySchool: "International Maarif School",
        students: [
          {
            name: "Amira Hassan",
            id: "IMS001",
            grade: "Grade 8",
            balances: 0,
            schoolName: "International Maarif School"
          },
          {
            name: "Yusuf Hassan",
            id: "IMS002",
            grade: "Grade 10",
            balances: 1,
            schoolName: "International Maarif School"
          }
        ]
      },
      {
        name: "Mrs Jennifer Sakala",
        phone: "966222333",
        primarySchool: "International Maarif School",
        students: [
          {
            name: "Mwila Sakala",
            id: "IMS003",
            grade: "Grade 6",
            balances: 2,
            schoolName: "International Maarif School"
          }
        ]
      }
    ]
  },

  /**
   * AFRICAN CHRISTIAN UNIVERSITY (ACU)
   * Private Christian university in Lusaka
   */
  "African Christian University": {
    name: "African Christian University",
    code: "ACU",
    type: "university",
    services: [
      {
        id: "ACU-S001",
        name: "Tuition Fees - Semester 1",
        description: "Full semester tuition for undergraduate programs",
        amount: 8500,
        category: "tuition"
      },
      {
        id: "ACU-S002",
        name: "Tuition Fees - Semester 2",
        description: "Full semester tuition for undergraduate programs",
        amount: 8500,
        category: "tuition"
      },
      {
        id: "ACU-S003",
        name: "Cafeteria Meal Plan",
        description: "Campus cafeteria meal plan",
        amount: 1200,
        category: "meals",
        paymentPeriods: [
          { period: "term", amount: 1200, label: "Full Semester" },
          { period: "week", amount: 120, label: "Per Week" },
          { period: "day", amount: 25, label: "Per Day" }
        ]
      },
      {
        id: "ACU-S004",
        name: "Campus Shuttle Service",
        description: "Daily campus shuttle service",
        amount: 600,
        category: "transport",
        routePricing: {
          "City Center - Main Campus": 600,
          "Chelston - Main Campus": 500,
          "Kabulonga - Main Campus": 550,
          "Meanwood - Main Campus": 650,
          "Rhodes Park - Main Campus": 700
        }
      },
      {
        id: "ACU-S005",
        name: "Student Accommodation",
        description: "On-campus student housing",
        amount: 2500,
        category: "accommodation",
        paymentPeriods: [
          { period: "term", amount: 2500, label: "Per Semester" },
          { period: "year", amount: 4800, label: "Academic Year (Discounted)" }
        ]
      },
      {
        id: "ACU-S006",
        name: "Library & Resource Fee",
        description: "Access to library resources and online databases",
        amount: 400,
        category: "other"
      },
      {
        id: "ACU-S007",
        name: "Student Union Fee",
        description: "Student activities and union membership",
        amount: 250,
        category: "activities"
      },
      {
        id: "ACU-S008",
        name: "Laboratory Fees",
        description: "Science and computer lab usage fees",
        amount: 800,
        category: "supplies"
      },
      {
        id: "ACU-S009",
        name: "Sports & Recreation",
        description: "Access to gym and sports facilities",
        amount: 300,
        category: "activities",
        paymentPeriods: [
          { period: "term", amount: 300, label: "Per Semester" },
          { period: "year", amount: 550, label: "Full Year (Discounted)" }
        ]
      },
      {
        id: "ACU-S010",
        name: "Health Services",
        description: "Campus health clinic and insurance",
        amount: 500,
        category: "other"
      }
    ],
    parents: [
      {
        name: "Dr Michael Zulu",
        phone: "955111000",
        primarySchool: "African Christian University",
        students: [
          {
            name: "Thandiwe Zulu",
            id: "ACU001",
            grade: "Year 2 - Business Administration",
            balances: 1,
            schoolName: "African Christian University"
          }
        ]
      },
      {
        name: "Mrs Patricia Musonda",
        phone: "966222111",
        primarySchool: "African Christian University",
        students: [
          {
            name: "Emmanuel Musonda",
            id: "ACU002",
            grade: "Year 3 - Computer Science",
            balances: 2,
            schoolName: "African Christian University"
          },
          {
            name: "Ruth Musonda",
            id: "ACU003",
            grade: "Year 1 - Education",
            balances: 1,
            schoolName: "African Christian University"
          }
        ]
      }
    ]
  }
};

/**
 * Phone to Parent Authentication Map
 * Maps phone numbers to parent names for login validation
 * Used in SchoolDetailsPage for authentication
 */
export const PHONE_USER_MAP: Record<string, string> = {
  // Twalumbu Educational Center
  "977123456": "Mr Stephen Kapambwe",
  "955234567": "Mrs Grace Phiri",
  
  // Chimilute Trust Academy
  "966987654": "Mrs Alice Mwamba",
  "977456789": "Dr Patrick Chilufya",
  
  // Julani School
  "965111222": "Mr James Mutale",
  "977333444": "Mrs Rebecca Banda",
  
  // Crested Crane Academy
  "966555666": "Mr David Mwansa",
  "955777888": "Mrs Catherine Lungu",
  
  // International Maarif School
  "977888999": "Mr Ahmed Hassan",
  "966222333": "Mrs Jennifer Sakala",
  
  // African Christian University
  "955111000": "Dr Michael Zulu",
  "966222111": "Mrs Patricia Musonda",
};

/**
 * Phone to School Mapping
 * Determines which school a parent is affiliated with
 */
export const PHONE_SCHOOL_MAP: Record<string, string> = {
  // Twalumbu Educational Center
  "977123456": "Twalumbu Educational Center",
  "955234567": "Twalumbu Educational Center",
  
  // Chimilute Trust Academy
  "966987654": "Chimilute Trust Academy",
  "977456789": "Chimilute Trust Academy",
  
  // Julani School
  "965111222": "Julani School",
  "977333444": "Julani School",
  
  // Crested Crane Academy
  "966555666": "Crested Crane Academy",
  "955777888": "Crested Crane Academy",
  
  // International Maarif School
  "977888999": "International Maarif School",
  "966222333": "International Maarif School",
  
  // African Christian University
  "955111000": "African Christian University",
  "966222111": "African Christian University",
};

/**
 * Get students by phone number
 * Retrieves all students associated with a parent's phone
 * 
 * @param phone - Phone number (with or without formatting)
 * @returns Array of Student objects
 */
export function getStudentsByPhone(phone: string): Student[] {
  const cleaned = phone.replace(/\D/g, "");
  
  // Search through all schools to find the parent
  for (const schoolData of Object.values(SCHOOL_DATABASE)) {
    const parent = schoolData.parents.find(p => p.phone === cleaned);
    if (parent) {
      return parent.students;
    }
  }
  
  return [];
}

/**
 * Get parent name by phone number
 * 
 * @param phone - Phone number (with or without formatting)
 * @returns Parent's full name or empty string
 */
export function getParentNameByPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return PHONE_USER_MAP[cleaned] || "";
}

/**
 * Get school services by school name
 * Retrieves all available services/fees for a specific school
 * 
 * @param schoolName - Name of the school
 * @returns Array of SchoolService objects
 */
export function getSchoolServices(schoolName: string): SchoolService[] {
  const schoolData = SCHOOL_DATABASE[schoolName];
  return schoolData?.services || [];
}

/**
 * Get school by phone number
 * Determines which school a parent is affiliated with
 * 
 * @param phone - Phone number (with or without formatting)
 * @returns School name or empty string
 */
export function getSchoolByPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return PHONE_SCHOOL_MAP[cleaned] || "";
}

/**
 * Get parent data by phone
 * Retrieves complete parent information including students
 * 
 * @param phone - Phone number (with or without formatting)
 * @returns ParentData object or null
 */
export function getParentDataByPhone(phone: string): ParentData | null {
  const cleaned = phone.replace(/\D/g, "");
  
  for (const schoolData of Object.values(SCHOOL_DATABASE)) {
    const parent = schoolData.parents.find(p => p.phone === cleaned);
    if (parent) {
      return parent;
    }
  }
  
  return null;
}

/**
 * Get institution type by school name
 * Determines if institution is a school or university
 * 
 * @param schoolName - Name of the institution
 * @returns 'school' | 'university' or undefined if not found
 */
export function getInstitutionType(schoolName: string): 'school' | 'university' | undefined {
  const schoolData = SCHOOL_DATABASE[schoolName];
  return schoolData?.type;
}

/**
 * Validate phone number exists in system
 * Checks if a phone number is registered
 * 
 * @param phone - Phone number (with or without formatting)
 * @returns true if phone exists, false otherwise
 */
export function isPhoneRegistered(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned in PHONE_USER_MAP;
}