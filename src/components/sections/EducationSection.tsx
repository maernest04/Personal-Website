'use client';

import { motion } from 'framer-motion';
import TileCard from '@/components/ui/TileCard';
import { RESUME, COLORS } from '@/lib/constants';

export default function EducationSection() {
  return (
    <div className="space-y-6">
      {/* Main education card */}
      <TileCard delay={0.1} accentColor={COLORS.redDragon}>
        <div className="flex-1">
          <h3 className="text-lg font-bold" style={{ color: '#3E2723' }}>
            {RESUME.education.school}
          </h3>
          <p className="text-sm font-medium" style={{ color: '#5D4037' }}>
            {RESUME.education.degree}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-xs" style={{ color: '#8D6E63' }}>
              {RESUME.education.dates}
            </span>
            <span className="text-xs" style={{ color: '#8D6E63' }}>
              {RESUME.education.location}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(46, 125, 50, 0.1)',
                color: COLORS.greenDragon,
              }}
            >
              GPA: {RESUME.education.gpa}
            </span>
          </div>
        </div>
      </TileCard>

      {/* Coursework */}
      <div>
        <motion.h3
          className="text-sm font-medium uppercase tracking-wider mb-3"
          style={{ color: COLORS.textSecondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Relevant Coursework
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RESUME.education.coursework.map((course, i) => (
            <TileCard key={course} delay={0.25 + i * 0.04}>
              <p className="text-sm font-medium" style={{ color: '#3E2723' }}>
                {course}
              </p>
            </TileCard>
          ))}
        </div>
      </div>
    </div>
  );
}
