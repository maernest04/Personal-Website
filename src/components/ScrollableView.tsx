'use client';

import { motion } from 'framer-motion';
import { RESUME, COLORS, SECTIONS, getSectionById } from '@/lib/constants';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ContactSection from '@/components/sections/ContactSection';
import EducationSection from '@/components/sections/EducationSection';

interface ScrollableViewProps {
  onVisitProject?: (name: string) => void;
}

// Section order for the scrollable layout
const SECTION_ORDER = ['about', 'experience', 'education', 'projects', 'skills', 'contact'];

// Small decorative mahjong tile wrapper for the hero divider
function TileIcon({ children, border }: { children: React.ReactNode; border: boolean }) {
  return (
    <div
      className="rounded-sm flex flex-col items-center justify-center"
      style={{
        width: 36,
        height: 50,
        background: COLORS.tileIvory,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        border: border ? `2px solid ${COLORS.bambooBlue}` : '1px solid #E8DFD0',
      }}
    >
      {children}
    </div>
  );
}

function SectionBlock({ sectionId, children, index }: { sectionId: string; children: React.ReactNode; index: number }) {
  const section = getSectionById(sectionId);
  if (!section) return null;

  return (
    <motion.section
      id={sectionId}
      className="scroll-mt-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center cn-text text-xl font-bold shrink-0"
          style={{
            background: `${section.color}20`,
            color: section.color,
            border: `1px solid ${section.color}40`,
          }}
        >
          {section.tileLabelCn}
        </div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
          {section.name}
        </h2>
      </div>

      {/* Section content card */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 74, 46, 0.6), rgba(10, 26, 15, 0.7))',
          border: '1px solid rgba(27, 122, 74, 0.2)',
        }}
      >
        {children}
      </div>
    </motion.section>
  );
}

export default function ScrollableView({ onVisitProject }: ScrollableViewProps) {
  const sectionComponents: Record<string, React.ReactNode> = {
    about: <AboutSection />,
    experience: <ExperienceSection />,
    skills: <SkillsSection />,
    projects: <ProjectsSection onVisitProject={onVisitProject} />,
    education: <EducationSection />,
    contact: <ContactSection />,
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      {/* Navigation bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-30 px-4 md:px-8"
        style={{
          background: 'rgba(10, 26, 15, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(27, 122, 74, 0.15)',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center h-14 gap-1 overflow-x-auto">
          <a
            href="#top"
            className="shrink-0 text-sm font-bold mr-4 transition-colors"
            style={{ color: COLORS.textPrimary }}
          >
            <span className="cn-text mr-1">麻</span>
            {RESUME.name}
          </a>
          <div className="hidden sm:flex items-center gap-1">
            {SECTION_ORDER.map((id) => {
              const s = getSectionById(id);
              if (!s) return null;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245, 240, 225, 0.08)';
                    e.currentTarget.style.color = COLORS.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = COLORS.textSecondary;
                  }}
                >
                  <span className="cn-text mr-1">{s.tileLabelCn}</span>
                  {s.name}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl md:text-6xl font-bold tracking-tight"
              style={{ color: COLORS.textPrimary }}
            >
              {RESUME.name}
            </h1>
            <p className="text-lg md:text-xl mt-3" style={{ color: COLORS.textSecondary }}>
              {RESUME.title}
            </p>

            {/* Quick links */}
            <div className="flex items-center justify-center gap-5 mt-8">
              <a
                href={`mailto:${RESUME.email}`}
                className="text-base md:text-lg px-6 py-3 rounded-xl transition-colors font-medium"
                style={{
                  background: `${COLORS.redDragon}20`,
                  color: COLORS.textPrimary,
                  border: `1px solid ${COLORS.redDragon}40`,
                }}
              >
                <span className="cn-text mr-1.5 text-xl">中</span> Email
              </a>
              <a
                href={`https://${RESUME.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg px-6 py-3 rounded-xl transition-colors font-medium"
                style={{
                  background: `${COLORS.greenDragon}20`,
                  color: COLORS.textPrimary,
                  border: `1px solid ${COLORS.greenDragon}40`,
                }}
              >
                <span className="cn-text mr-1.5 text-xl">發</span> LinkedIn
              </a>
              <a
                href={`https://${RESUME.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg px-6 py-3 rounded-xl transition-colors font-medium"
                style={{
                  background: `${COLORS.bambooBlue}20`,
                  color: COLORS.textPrimary,
                  border: `1px solid ${COLORS.bambooBlue}40`,
                }}
              >
                <span className="cn-text mr-1.5 text-xl">白</span> GitHub
              </a>
            </div>
          </motion.div>

          {/* Decorative tile divider — 10 tiles: 1 character, 1 dot, 1 bamboo, 4 winds, 3 dragons */}
          <motion.div
            className="flex items-center justify-center gap-2.5 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* 一萬 (1 Character) */}
            <TileIcon border={false}>
              <span className="cn-text font-bold" style={{ color: COLORS.bambooBlue, fontSize: 18, lineHeight: 1 }}>一</span>
              <span className="cn-text font-bold" style={{ color: COLORS.redDragon, fontSize: 14, lineHeight: 1, marginTop: 1 }}>萬</span>
            </TileIcon>

            {/* 一筒 (1 Dot) — ornate concentric circle */}
            <TileIcon border={false}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" fill="none" stroke={COLORS.bambooBlue} strokeWidth="1.5" />
                <circle cx="14" cy="14" r="9" fill="none" stroke={COLORS.greenDragon} strokeWidth="1" />
                {/* Petal pattern */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="14"
                    cy="6"
                    rx="2"
                    ry="4.5"
                    fill={COLORS.redDragon}
                    opacity={0.85}
                    transform={`rotate(${deg} 14 14)`}
                  />
                ))}
                <circle cx="14" cy="14" r="3.5" fill={COLORS.bambooBlue} />
                <circle cx="14" cy="14" r="1.5" fill={COLORS.tileIvory} />
              </svg>
            </TileIcon>

            {/* 一索 (1 Bamboo) — bird/sparrow */}
            <TileIcon border={false}>
              <svg width="24" height="34" viewBox="0 0 24 34">
                {/* Bird body */}
                <ellipse cx="12" cy="16" rx="6" ry="8" fill={COLORS.greenDragon} opacity={0.9} />
                {/* Head */}
                <circle cx="12" cy="7" r="4" fill={COLORS.greenDragon} />
                {/* Eye */}
                <circle cx="13.5" cy="6.5" r="1" fill="white" />
                <circle cx="13.8" cy="6.5" r="0.5" fill="#1a1a1a" />
                {/* Beak */}
                <polygon points="16,7 19,6.5 16,6" fill={COLORS.redDragon} />
                {/* Wing detail */}
                <path d="M7,13 Q5,17 7,21 Q9,18 10,14 Z" fill="#1B5E20" opacity={0.7} />
                <path d="M17,13 Q19,17 17,21 Q15,18 14,14 Z" fill="#1B5E20" opacity={0.7} />
                {/* Tail feathers */}
                <path d="M10,24 Q8,30 6,33" stroke={COLORS.redDragon} strokeWidth="1.2" fill="none" />
                <path d="M12,24 Q12,30 12,33" stroke={COLORS.greenDragon} strokeWidth="1.2" fill="none" />
                <path d="M14,24 Q16,30 18,33" stroke={COLORS.bambooBlue} strokeWidth="1.2" fill="none" />
                {/* Chest detail */}
                <ellipse cx="12" cy="18" rx="3" ry="4" fill="#F5F0E1" opacity={0.3} />
              </svg>
            </TileIcon>

            {/* 4 Winds */}
            {['東', '南', '西', '北'].map((w) => (
              <TileIcon key={w} border={false}>
                <span className="cn-text font-bold" style={{ color: '#1a1a1a', fontSize: 18, lineHeight: 1 }}>{w}</span>
              </TileIcon>
            ))}

            {/* 3 Dragons */}
            <TileIcon border={false}>
              <span className="cn-text font-bold" style={{ color: COLORS.redDragon, fontSize: 20, lineHeight: 1 }}>中</span>
            </TileIcon>
            <TileIcon border={false}>
              <span className="cn-text font-bold" style={{ color: COLORS.greenDragon, fontSize: 20, lineHeight: 1 }}>發</span>
            </TileIcon>
            <TileIcon border={true}>
              <div style={{ width: 16, height: 20, border: `2px solid ${COLORS.bambooBlue}`, borderRadius: 2 }} />
            </TileIcon>
          </motion.div>
        </div>
      </header>

      {/* Sections */}
      <main className="px-4 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {SECTION_ORDER.map((id, i) => (
            <SectionBlock key={id} sectionId={id} index={i}>
              {sectionComponents[id]}
            </SectionBlock>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-4 md:px-8 py-8 text-center"
        style={{ borderTop: '1px solid rgba(27, 122, 74, 0.15)' }}
      >
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>
          Built with Next.js & a love for mahjong
        </p>
      </footer>
    </div>
  );
}
