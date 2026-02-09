'use client';

import { motion } from 'framer-motion';
import TileCard from '@/components/ui/TileCard';
import { RESUME, COLORS } from '@/lib/constants';

const windColors: Record<string, string> = {
  '東': '#C62828',
  '南': '#2E7D32',
  '西': '#1565C0',
  '北': '#6A1B9A',
};

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof RESUME.experience)[number];
  index: number;
}) {
  const color = windColors[exp.wind] || COLORS.redDragon;
  const isLast = index === RESUME.experience.length - 1;

  return (
    <div className="flex gap-4">
      {/* Wind tile indicator */}
      <div className="flex flex-col items-center">
        <motion.div
          className="w-12 h-14 rounded-t-md rounded-b-sm flex items-center justify-center shrink-0"
          style={{
            background: COLORS.tileIvory,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.1 }}
        >
          <span className="cn-text text-2xl font-bold" style={{ color }}>
            {exp.wind}
          </span>
        </motion.div>
        {/* Connecting line */}
        {!isLast && (
          <div className="w-px flex-1 min-h-[20px] mt-2" style={{ background: 'rgba(245,240,225,0.15)' }} />
        )}
      </div>

      {/* Content card */}
      <div className="flex-1 pb-6">
        <TileCard delay={0.15 + index * 0.1} accentColor={color}>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
                  {exp.windEn} Wind
                </span>
              </div>
              <h3 className="text-lg font-bold mt-1.5" style={{ color: '#3E2723' }}>
                {exp.company}
              </h3>
              <p className="text-sm font-medium" style={{ color: '#5D4037' }}>
                {exp.role}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: '#8D6E63' }}>{exp.dates}</p>
              <p className="text-xs" style={{ color: '#A1887F' }}>{exp.location}</p>
            </div>
          </div>

          <ul className="space-y-2 mt-3">
            {exp.bullets.map((bullet, i) => (
              <motion.li
                key={i}
                className="flex gap-2 text-sm"
                style={{ color: '#5D4037' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.1 + i * 0.05 }}
              >
                <span
                  className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: color }}
                />
                <span>{bullet}</span>
              </motion.li>
            ))}
          </ul>
        </TileCard>
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <div>
      <div className="space-y-0">
        {RESUME.experience.map((exp, i) => (
          <ExperienceCard key={exp.wind} exp={exp} index={i} />
        ))}
      </div>
    </div>
  );
}
