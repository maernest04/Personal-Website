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
  title: 'Software Engineer',
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
  },

  skills: {
    languages: ['Go', 'Python', 'C++', 'C', 'SQL', 'C#', 'Java', 'Dart', 'Verilog', 'x86 Assembly'],
    frameworks: ['FastAPI', 'React', 'PyTorch', 'LangGraph', 'LangChain', 'Flutter', 'Yjs (CRDTs)'],
    tools: ['Kubernetes', 'Docker', 'Helm', 'AWS (EC2)', 'ClearML', 'Prometheus', 'Kafka', 'Linux'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis', 'ChromaDB', 'Firebase'],
  },

  experience: [
    {
      wind: '東',
      windEn: 'East',
      company: 'KLA',
      role: 'Software Engineer Intern',
      dates: 'May 2026 – Aug. 2026',
      location: 'Ann Arbor, MI',
      bullets: [
        'Accelerated physics-ML training via PyTorch DDP + ClearML on Kubernetes, scaling 3.9× throughput on 4 GPUs (98% efficiency).',
        'Engineered a Kubernetes AI agent (kagent + MCP + Prometheus) with 12 custom tools for health scans, alert triage, and reports.',
        'Built a React/FastAPI dashboard with PostgreSQL and Prometheus for K8s clusters, ClearML experiments, and VMware.',
        'Standardized a LangGraph template and Kubernetes deployment workflows, reducing a project cycle from weeks to days.',
      ],
    },
    {
      wind: '南',
      windEn: 'South',
      company: 'KLA',
      role: 'Software Engineer Intern',
      dates: 'May 2025 – Aug. 2025',
      location: 'Ann Arbor, MI',
      bullets: [
        'Built a troubleshooting agent using LangGraph, FastAPI, and Gemma 3 / GPT-4o to assist field engineers.',
        'Reduced machinery downtime by 80% by automating parsing of complex system logs and enabling natural language queries.',
        'Engineered a RAG pipeline with ChromaDB to accelerate historical log retrieval from hours to sub-second results.',
        'Deployed and configured an AWS EC2 (Linux) environment, optimizing for sub-second retrieval and 99.9% uptime.',
      ],
    },
    {
      wind: '西',
      windEn: 'West',
      company: 'SJSU College of Engineering',
      role: 'Software Engineer Intern',
      dates: 'Jan. 2026 – May 2026',
      location: 'San Jose, CA',
      bullets: [
        'Architected a Go/Gin event service processing registrations and waitlists for 1k+ concurrent users via a MongoDB backend.',
        'Mitigated data races during 10k+ write/sec spikes by implementing Redis concurrency locks and optimized caching strategies.',
        'Orchestrated a Kafka event-driven pipeline to decouple API requests from registration processing, ensuring strong scalability.',
      ],
    },
    {
      wind: '北',
      windEn: 'North',
      company: 'Spartan Racing: Formula SAE',
      role: 'Software Engineer Intern',
      dates: 'Jan. 2026 – May 2026',
      location: 'San Jose, CA',
      bullets: [
        'Expanded a C-based Hardware in Loop injection system for testing using CAN protocols for real-time VCU validation.',
        'Developed a Python HIL test suite utilizing state machines to manage complex CAN communication sessions.',
        'Synchronized automated telemetry validation to ensure data consistency during high-speed testing cycles.',
        'Verified Launch Control accuracy by hand-calculating torque outputs against parameterized test cases.',
      ],
    },
  ],

  projects: [
    {
      name: 'Agent Faultline',
      tech: 'Rust, Python, MCP, PostgreSQL, Docker, OpenTelemetry',
      bullets: [
        'Built Rust/Python MCP benchmarks across 2 PostgreSQL environments with 5 deterministic tool-fault types for agent recovery',
        'Engineered a Rust proxy and scoring pipeline; validated 10K idempotency and deployment attempts for error detection',
        'Added scoped stdio/HTTP MCP support; validated safe timeout recovery with a filesystem server under fault injection',
      ],
    },
    {
      name: 'PatchBench',
      tech: 'Python, pytest, Docker, YAML',
      bullets: [
        'Built an executable benchmark to measure whether AI code reviewers detect regressions that pass visible tests',
        'Designed an 18-task Python corpus with 36 correct and regression patches, test isolation, and Docker-based replay',
        'Implemented a CLI reviewer harness for structured findings and deterministic detection, false-positive, and inconclusive scoring',
      ],
    },
    {
      name: 'Collab Code',
      tech: 'TypeScript, VS Code Extension API, Liveblocks, Yjs',
      bullets: [
        'Built a real-time collaborative IDE extension using Yjs CRDTs and Liveblocks for multi-user editing and room sessions',
        'Implemented synchronized cursors, selections, and presence indicators with document binding and local-origin filtering',
        'Created account-less shared-key onboarding and automated VSIX packaging for seamless cross-editor distribution',
      ],
    },
    {
      name: 'SJSU Safeline',
      tech: 'Nemotron, FastAPI, React / Vite, LangChain, SQLite',
      bullets: [
        'Built an agentic AI assistant using NVIDIA Nemotron and FastAPI to automate crisis triaging and personalized resource routing',
        'Architected a reasoning pipeline with LangChain function-calling for urgency assessment and real-time resource retrieval',
        'Implemented a multi-stage workflow to provide 24/7 student support through generating personalized outreach scripts',
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
