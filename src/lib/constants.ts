// ── Mahjong Portfolio Constants ──

// ─── Colors ───
export const COLORS = {
  tableGreen: '#1B5E20',
  tableFelt: '#1a4a2e',
  tableFeltLight: '#2E7D32',
  tileIvory: '#F5F0E1',
  tileIvoryDark: '#E8DFD0',
  tileBack: '#0D4A2E',
  tileBackLight: '#1B7A4A',
  redDragon: '#C62828',
  greenDragon: '#2E7D32',
  bambooBlue: '#1565C0',
  darkWood: '#3E2723',
  darkWoodLight: '#5D4037',
  offWhite: '#FAFAF5',
  textPrimary: '#F5F0E1',
  textSecondary: '#BDB5A4',
  bg: '#1e3d30',
} as const;

// ─── Tile Dimensions (Three.js units) ───
export const TILE = {
  width: 0.38,
  height: 0.50,
  depth: 0.24,
  gap: 0.025,
  wallOffset: 3.1,
  stacksPerWall: 17,
} as const;

// ─── Suits ───
export type SuitType = 'character' | 'dot' | 'bamboo' | 'wind' | 'dragon' | 'flower';

export interface SectionDef {
  id: string;
  name: string;
  nameCn: string;
  suit: SuitType;
  tileLabel: string;
  tileLabelCn: string;
  color: string;
  description: string;
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'about',
    name: 'About',
    nameCn: '萬子',
    suit: 'character',
    tileLabel: '一萬',
    tileLabelCn: '萬',
    color: COLORS.redDragon,
    description: 'Get to know me',
  },
  {
    id: 'skills',
    name: 'Skills',
    nameCn: '索子',
    suit: 'bamboo',
    tileLabel: '索',
    tileLabelCn: '索',
    color: COLORS.greenDragon,
    description: 'Technical toolkit',
  },
  {
    id: 'projects',
    name: 'Projects',
    nameCn: '筒子',
    suit: 'dot',
    tileLabel: '筒',
    tileLabelCn: '筒',
    color: COLORS.bambooBlue,
    description: 'What I\'ve built',
  },
  {
    id: 'experience',
    name: 'Experience',
    nameCn: '風牌',
    suit: 'wind',
    tileLabel: '風',
    tileLabelCn: '風',
    color: '#D4A574',
    description: 'My journey so far',
  },
  {
    id: 'contact',
    name: 'Contact',
    nameCn: '花牌',
    suit: 'flower',
    tileLabel: '花',
    tileLabelCn: '花',
    color: '#E65100',
    description: 'Let\'s connect',
  },
  {
    id: 'education',
    name: 'Education',
    nameCn: '三元牌',
    suit: 'dragon',
    tileLabel: '中',
    tileLabelCn: '中',
    color: COLORS.redDragon,
    description: 'Where I\'ve grown',
  },
];

export function getSectionById(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}

// ─── Resume Data ───
export const RESUME = {
  name: 'Ernest Ma',
  title: 'Computer Engineer',
  phone: '510-565-6134',
  email: 'maernest04@gmail.com',
  linkedin: 'linkedin.com/in/ernest-ma',
  github: 'github.com/maernest04',

  about: `I'm a Computer Engineering student at San Jose State University who loves to work hands on. Whether that's building everyday software projects to hardware focused work, everything interests me as long as I can learn it through projects.`,

  education: {
    school: 'San Jose State University',
    degree: 'Bachelor of Science in Computer Engineering',
    dates: 'Aug. 2024 – Dec. 2026',
    location: 'San Jose, CA',
    gpa: '3.95',
    coursework: [
      'Data Structures & Algorithms',
      'RTOS Embedded Systems',
      'Microprocessor Design',
      'Operating Systems',
      'Database Systems',
      'Mobile Software Engineering',
      'Computer Networks',
      'Digital Design',
    ],
  },

  skills: {
    languages: ['C++', 'Python', 'SQL', 'Verilog', 'Dart', 'x86 Assembly', 'C', 'C#', 'Java'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'Flutter', 'LangGraph', 'Chainlit'],
    tools: ['Git', 'Firebase', 'Azure', 'Vivado', 'Quartus', 'ModelSim', 'Linux', 'LogicWorks', 'LTspice'],
    databases: ['Firebase Firestore', 'ChromaDB', 'SQLite3'],
  },

  experience: [
    {
      wind: '東',
      windEn: 'East',
      company: 'KLA',
      role: 'Software Engineer Intern',
      dates: 'May 2025 – Aug. 2025',
      location: 'Ann Arbor, MI',
      bullets: [
        'Developed a Python-based LLM chatbot for Broadband Plasma (BBP) log analysis, reducing troubleshooting by 80% (hours to minutes)',
        'Built the interactive agent leveraging Chainlit, FastAPI, and LangGraph with Gemma 3 + GPT-4o for custom tool workflows',
        'Integrated ChromaDB and SQLite3 for Retrieval-Augmented Generation with semantic search across historical logs',
        'Deployed on Linux and AWS VMs for reliable cloud performance',
      ],
    },
    {
      wind: '南',
      windEn: 'South',
      company: 'KLA',
      role: 'Student Ambassador',
      dates: 'Jan. 2026 – Present',
      location: 'San Jose, CA',
      bullets: [
        'Represent KLA at campus recruiting events, info sessions, and career fairs',
        'Coordinate with recruiters and engineers to organize workshops, tech talks, and networking events',
      ],
    },
    {
      wind: '西',
      windEn: 'West',
      company: 'Magikid Robotics Lab',
      role: 'Robotics Instructor',
      dates: 'March 2024 – Present',
      location: 'Fremont, CA',
      bullets: [
        'Taught students to build VEX Robots and utilize Scratch code in projects',
        'Coached numerous teams for state and national level competitions',
      ],
    },
    {
      wind: '北',
      windEn: 'North',
      company: 'Mach Martial Arts',
      role: 'Taekwondo Instructor',
      dates: 'March 2018 – Jan. 2025',
      location: 'Fremont, CA',
      bullets: [
        'Taught taekwondo classes for young children and teens, teaching physical and mental skills',
        'Ran engaging class activities such as warm up exercises, class challenges and end-of-class games',
      ],
    },
  ],

  projects: [
    {
      name: 'Gift Match',
      tech: 'Flutter (Dart), Firebase, NoSQL',
      bullets: [
        'Full-stack Flutter gift-discovery app with Firebase Auth, Firestore real-time sync, and Tinder-style swipe UI',
        'Personalized ML-style recommendation pipeline using swipe-event embeddings and category narrowing',
        'Cross-platform deployment on web, Android, and iOS with secure backend rules',
      ],
    },
    {
      name: 'SJ-Bay',
      tech: 'React, Node.js / Express, Firebase, NoSQL',
      bullets: [
        'Full-stack e-commerce marketplace with responsive UI and comprehensive product search/filtering',
        'Secure authentication integrating Firebase Auth restricted to verified SJSU.edu emails',
        'Backend API with Cloud Firestore for real-time NoSQL storage and Multer for image handling',
      ],
    },
    {
      name: 'AI PC Builder Chatbot',
      tech: 'Python, OpenAI API, React',
      bullets: [
        'LangGraph-powered chatbot with FastAPI + SQLite3 backend for persistent sessions and builds',
        'Modern React frontend (Vite + TypeScript + Tailwind) with multi-session chat',
        'Build summary/export and clickable part links for easy PC component shopping',
      ],
    },
  ],

  contact: [
    { type: 'email', label: 'Email', value: 'maernest04@gmail.com', href: 'mailto:maernest04@gmail.com', dragon: '中', dragonColor: COLORS.redDragon },
    { type: 'linkedin', label: 'LinkedIn', value: 'ernest-ma', href: 'https://linkedin.com/in/ernest-ma', dragon: '發', dragonColor: COLORS.greenDragon },
    { type: 'github', label: 'GitHub', value: 'maernest04', href: 'https://github.com/maernest04', dragon: '白', dragonColor: COLORS.bambooBlue },
  ],
} as const;

// ─── Faan Thresholds ───
export const FAAN_THRESHOLDS = {
  minimum: 3,   // HK minimum to win
  full: 8,      // Full hand celebration
  max: 13,      // Thirteen Orphans
} as const;
