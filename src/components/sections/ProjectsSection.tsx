'use client';

import { motion } from 'framer-motion';
import TileCard from '@/components/ui/TileCard';
import { RESUME, COLORS } from '@/lib/constants';

interface ProjectsSectionProps {
  onVisitProject?: (name: string) => void;
}

function ProjectCard({
  project,
  index,
  onVisit,
}: {
  project: (typeof RESUME.projects)[number];
  index: number;
  onVisit?: () => void;
}) {
  const bambooCount = index + 1;

  return (
    <TileCard
      delay={0.1 + index * 0.1}
      accentColor={COLORS.greenDragon}
      hoverable
      onClick={onVisit}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold" style={{ color: '#3E2723' }}>
            {project.name}
          </h3>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#8D6E63' }}>
            {project.tech}
          </p>
        </div>
        {/* Bamboo count indicator */}
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: bambooCount }, (_, i) => (
            <div
              key={i}
              className="w-1.5 h-6 rounded-full"
              style={{ background: COLORS.greenDragon }}
            />
          ))}
        </div>
      </div>

      {/* Bullets */}
      <ul className="space-y-2 mt-3">
        {project.bullets.map((bullet, i) => (
          <motion.li
            key={i}
            className="flex gap-2 text-sm"
            style={{ color: '#5D4037' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 + i * 0.05 }}
          >
            <span
              className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: COLORS.greenDragon }}
            />
            <span>{bullet}</span>
          </motion.li>
        ))}
      </ul>
    </TileCard>
  );
}

export default function ProjectsSection({ onVisitProject }: ProjectsSectionProps) {
  return (
    <div className="space-y-4">
      <motion.p
        className="text-sm mb-4"
        style={{ color: COLORS.textSecondary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Each project is a bamboo tile — representing growth through building.
      </motion.p>

      <div className="grid gap-4">
        {RESUME.projects.map((project, i) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={i}
            onVisit={() => onVisitProject?.(project.name)}
          />
        ))}
      </div>
    </div>
  );
}
