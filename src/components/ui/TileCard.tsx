'use client';

import { motion } from 'framer-motion';
import { COLORS } from '@/lib/constants';

interface TileCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  accentColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function TileCard({
  children,
  className = '',
  delay = 0,
  accentColor,
  onClick,
  hoverable = false,
}: TileCardProps) {
  return (
    <motion.div
      className={`tile-card p-4 md:p-5 ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      style={{
        color: '#3E2723',
        borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={hoverable ? { y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
