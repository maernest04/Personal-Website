'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/lib/constants';

interface LoadingScreenProps {
  onComplete: () => void;
}

// Deterministic pseudo-random based on seed — same output on server and client
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Pre-computed tile data using deterministic seeds
const TILE_DATA = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  delay: i * 0.1,
  x: (seededRandom(i * 3 + 1) - 0.5) * 400,
  y: (seededRandom(i * 3 + 2) - 0.5) * 300,
  initialRotate: seededRandom(i * 7 + 3) * 360,
  midX: (seededRandom(i * 5 + 4) - 0.5) * 200,
  midY: (seededRandom(i * 5 + 5) - 0.5) * 200,
  animRotateStart: seededRandom(i * 11 + 6) * 360,
  animRotateMid: seededRandom(i * 11 + 7) * 180,
}));

// Animated tile shape for the loading screen
function LoadingTile({
  delay,
  x,
  y,
  initialRotate,
  midX,
  midY,
  animRotateStart,
  animRotateMid,
}: {
  delay: number;
  x: number;
  y: number;
  initialRotate: number;
  midX: number;
  midY: number;
  animRotateStart: number;
  animRotateMid: number;
}) {
  return (
    <motion.div
      className="absolute rounded-t-md rounded-b-sm"
      style={{
        width: 40,
        height: 54,
        background: COLORS.tileBack,
        border: `1px solid ${COLORS.tileBackLight}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
      initial={{ x, y, rotate: initialRotate, opacity: 0, scale: 0 }}
      animate={{
        x: [x, x + midX, 0],
        y: [y, y + midY, 0],
        rotate: [animRotateStart, animRotateMid, 0],
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
      }}
      transition={{
        duration: 2,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: COLORS.bg }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background tiles animation */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {TILE_DATA.map((tile) => (
              <LoadingTile
                key={tile.id}
                delay={tile.delay}
                x={tile.x}
                y={tile.y}
                initialRotate={tile.initialRotate}
                midX={tile.midX}
                midY={tile.midY}
                animRotateStart={tile.animRotateStart}
                animRotateMid={tile.animRotateMid}
              />
            ))}
          </div>

          {/* Center content */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1
                className="text-5xl md:text-7xl font-bold tracking-tight"
                style={{ color: COLORS.textPrimary }}
              >
                Ernest Ma
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <p className="text-lg mt-4" style={{ color: COLORS.textSecondary }}>
                Computer Engineer
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <p className="text-sm mt-8 cn-text" style={{ color: 'rgba(245,240,225,0.4)' }}>
                洗牌中 — Shuffling tiles...
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="mt-6 mx-auto rounded-full overflow-hidden"
              style={{
                width: 200,
                height: 3,
                background: 'rgba(245,240,225,0.1)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: COLORS.redDragon }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.2, duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
