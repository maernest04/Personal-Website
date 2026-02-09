'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/lib/constants';

interface WinCelebrationProps {
  show: boolean;
  level: string;
}

function FlyingTile({ delay }: { delay: number }) {
  const startX = Math.random() * 100;
  const startY = 100 + Math.random() * 20;

  return (
    <motion.div
      className="absolute rounded-t-sm rounded-b-sm"
      style={{
        width: 30,
        height: 40,
        background: COLORS.tileIvory,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        left: `${startX}%`,
      }}
      initial={{ y: `${startY}vh`, rotate: 0, opacity: 0 }}
      animate={{
        y: [
          `${startY}vh`,
          `${30 + Math.random() * 30}vh`,
          `-10vh`,
        ],
        rotate: [0, 180 + Math.random() * 360, 720],
        opacity: [0, 1, 0],
        x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: 2 + Math.random(),
        delay: delay,
        ease: 'easeOut',
      }}
    />
  );
}

export default function WinCelebration({ show, level }: WinCelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const tiles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 0.08,
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Flying tiles */}
          {tiles.map((tile) => (
            <FlyingTile key={tile.id} delay={tile.delay} />
          ))}

          {/* Center message */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          >
            <div
              className="px-8 py-6 rounded-2xl"
              style={{
                background: 'rgba(10, 26, 15, 0.95)',
                border: `2px solid ${COLORS.redDragon}`,
                boxShadow: `0 0 40px rgba(198, 40, 40, 0.3), 0 0 80px rgba(198, 40, 40, 0.1)`,
              }}
            >
              <p className="cn-text text-4xl font-bold" style={{ color: '#FFD54F' }}>
                食糊！
              </p>
              <p className="text-lg font-medium mt-2" style={{ color: COLORS.textPrimary }}>
                {level}
              </p>
              <p className="text-sm mt-2" style={{ color: COLORS.textSecondary }}>
                You&apos;ve explored my full portfolio
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
