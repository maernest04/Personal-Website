'use client';

import { motion } from 'framer-motion';
import TileCard from '@/components/ui/TileCard';
import { RESUME, COLORS } from '@/lib/constants';

export default function AboutSection() {
  const highlights = [
    {
      label: '東',
      labelColor: COLORS.redDragon,
      accentColor: COLORS.redDragon,
      title: 'Focus',
      value: 'Software Engineering, Embedded and Low-Level Programming',
    },
    {
      label: '南',
      labelColor: COLORS.greenDragon,
      accentColor: COLORS.greenDragon,
      title: 'Current Work',
      value: 'Building fun software & hardware projects',
    },
    {
      label: '西',
      labelColor: COLORS.bambooBlue,
      accentColor: COLORS.bambooBlue,
      title: 'Core Skills',
      value: 'Python, C / C++, Verilog, SQL',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bio */}
      <motion.p
        className="text-base md:text-lg leading-relaxed"
        style={{ color: COLORS.textPrimary }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {RESUME.about}
      </motion.p>

      {/* 3 highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {highlights.map((h, i) => (
          <TileCard key={h.title} delay={0.15 + i * 0.08} accentColor={h.accentColor}>
            <div className="flex items-start gap-3">
              <span
                className="cn-text text-2xl font-bold shrink-0"
                style={{ color: h.labelColor }}
              >
                {h.label}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8D6E63' }}>
                  {h.title}
                </p>
                <p className="text-sm md:text-base font-semibold mt-1" style={{ color: '#3E2723' }}>
                  {h.value}
                </p>
              </div>
            </div>
          </TileCard>
        ))}
      </div>

      {/* Philosophy */}
      <motion.div
        className="mt-6 p-4 rounded-xl"
        style={{
          background: 'rgba(245, 240, 225, 0.05)',
          border: '1px solid rgba(245, 240, 225, 0.1)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm italic" style={{ color: COLORS.textSecondary }}>
          &ldquo;In mahjong, every draw is an opportunity. In engineering, every problem is a chance to build something better.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
