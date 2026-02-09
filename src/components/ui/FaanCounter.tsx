'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FAAN_THRESHOLDS } from '@/lib/constants';
import { getFaanLevel, hasWon } from '@/lib/faan';

interface FaanCounterProps {
  faan: number;
}

export default function FaanCounter({ faan }: FaanCounterProps) {
  const won = hasWon(faan);
  const level = getFaanLevel(faan);

  return (
    <motion.div
      className="fixed top-4 right-4 z-40"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div
        className={`px-4 py-2.5 rounded-xl ${won ? 'pulse-glow' : ''}`}
        style={{
          background: 'rgba(10, 26, 15, 0.9)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${won ? COLORS.redDragon : 'rgba(27, 122, 74, 0.3)'}`,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Faan number */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={faan}
                className="cn-text text-2xl font-bold block leading-none"
                style={{ color: won ? '#FFD54F' : COLORS.textPrimary }}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {faan}
              </motion.span>
            </AnimatePresence>
            <span
              className="cn-text text-xs"
              style={{ color: COLORS.textSecondary }}
            >
              番
            </span>
          </div>

          {/* Divider */}
          <div
            className="w-px h-8"
            style={{ background: 'rgba(245, 240, 225, 0.15)' }}
          />

          {/* Status */}
          <div className="text-right">
            <p
              className="text-xs font-medium"
              style={{ color: COLORS.textSecondary }}
            >
              {won ? (
                <span style={{ color: '#FFD54F' }}>{level}</span>
              ) : (
                <>
                  Need {FAAN_THRESHOLDS.minimum - faan > 0 ? FAAN_THRESHOLDS.minimum - faan : 0} more
                </>
              )}
            </p>

            {/* Progress bar */}
            <div
              className="mt-1 rounded-full overflow-hidden"
              style={{
                width: 80,
                height: 3,
                background: 'rgba(245,240,225,0.1)',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: won
                    ? 'linear-gradient(90deg, #FFD54F, #FF8F00)'
                    : COLORS.redDragon,
                }}
                animate={{ width: `${Math.min((faan / FAAN_THRESHOLDS.max) * 100, 100)}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
