'use client';

import { motion } from 'framer-motion';
import TileCard from '@/components/ui/TileCard';
import { RESUME, COLORS } from '@/lib/constants';

interface SkillGroupProps {
  title: string;
  titleCn: string;
  skills: readonly string[];
  color: string;
  delay: number;
}

function SkillGroup({ title, titleCn, skills, color, delay }: SkillGroupProps) {
  return (
    <TileCard delay={delay}>
      <div className="flex items-center gap-2 mb-3">
        <span className="cn-text text-lg font-bold" style={{ color }}>
          {titleCn}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#5D4037' }}>
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span
            key={skill}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${color}12`,
              color: '#3E2723',
              border: `1px solid ${color}30`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.05 * i }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </TileCard>
  );
}

export default function SkillsSection() {
  return (
    <div className="space-y-4">
      {/* Visual: dots representing skill count */}
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-sm" style={{ color: COLORS.textSecondary }}>
          {RESUME.skills.languages.length + RESUME.skills.frameworks.length + RESUME.skills.tools.length + RESUME.skills.databases.length} technologies in the hand
        </span>
      </motion.div>

      <div className="grid gap-4">
        <SkillGroup
          title="Languages"
          titleCn="一"
          skills={RESUME.skills.languages}
          color={COLORS.bambooBlue}
          delay={0.1}
        />
        <SkillGroup
          title="Tools & Platforms"
          titleCn="二"
          skills={RESUME.skills.tools}
          color="#6A1B9A"
          delay={0.2}
        />
        <SkillGroup
          title="Frameworks & Libraries"
          titleCn="三"
          skills={RESUME.skills.frameworks}
          color={COLORS.greenDragon}
          delay={0.3}
        />
        <SkillGroup
          title="Databases"
          titleCn="四"
          skills={RESUME.skills.databases}
          color={COLORS.redDragon}
          delay={0.4}
        />
      </div>
    </div>
  );
}
