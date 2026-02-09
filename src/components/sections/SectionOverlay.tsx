'use client';

import { motion } from 'framer-motion';
import { getSectionById, COLORS } from '@/lib/constants';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ExperienceSection from './ExperienceSection';
import ContactSection from './ContactSection';
import EducationSection from './EducationSection';

interface SectionOverlayProps {
  sectionId: string;
  onClose: () => void;
  onVisitProject?: (name: string) => void;
}

function SectionContent({ sectionId, onVisitProject }: { sectionId: string; onVisitProject?: (name: string) => void }) {
  switch (sectionId) {
    case 'about': return <AboutSection />;
    case 'skills': return <SkillsSection />;
    case 'projects': return <ProjectsSection onVisitProject={onVisitProject} />;
    case 'experience': return <ExperienceSection />;
    case 'contact': return <ContactSection />;
    case 'education': return <EducationSection />;
    default: return null;
  }
}

export default function SectionOverlay({ sectionId, onClose, onVisitProject }: SectionOverlayProps) {
  const section = getSectionById(sectionId);
  if (!section) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 section-overlay flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(10, 26, 15, 0.85)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 74, 46, 0.95), rgba(10, 26, 15, 0.98))',
          border: '1px solid rgba(27, 122, 74, 0.3)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
        }}
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 md:px-8 py-5 border-b flex items-center justify-between"
          style={{
            background: 'rgba(10, 26, 15, 0.95)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(27, 122, 74, 0.2)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Suit icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center cn-text text-xl font-bold"
              style={{
                background: `${section.color}20`,
                color: section.color,
                border: `1px solid ${section.color}40`,
              }}
            >
              {section.tileLabelCn}
            </div>
            <h2
              className="text-xl md:text-2xl font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              {section.name}
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{
              background: 'rgba(245, 240, 225, 0.05)',
              color: COLORS.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(245, 240, 225, 0.1)';
              e.currentTarget.style.color = COLORS.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(245, 240, 225, 0.05)';
              e.currentTarget.style.color = COLORS.textSecondary;
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <SectionContent sectionId={sectionId} onVisitProject={onVisitProject} />
        </div>

        {/* Footer */}
        <div
          className="px-6 md:px-8 py-4 border-t text-center"
          style={{ borderColor: 'rgba(27, 122, 74, 0.15)' }}
        >
          <button
            onClick={onClose}
            className="text-sm cursor-pointer transition-colors"
            style={{ color: COLORS.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textSecondary)}
          >
            <span className="cn-text">回</span> Return to Table
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
