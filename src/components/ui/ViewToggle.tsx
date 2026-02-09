'use client';

import { motion } from 'framer-motion';
import { COLORS } from '@/lib/constants';

interface ViewToggleProps {
  mode: '3d' | 'classic';
  onToggle: () => void;
}

export default function ViewToggle({ mode, onToggle }: ViewToggleProps) {
  return (
    <div className="fixed top-0 right-4 md:right-8 z-50 h-14 flex items-center">
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
        style={{
          background: 'rgba(10, 26, 15, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(27, 122, 74, 0.3)',
          color: COLORS.textSecondary,
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(27, 122, 74, 0.6)';
          e.currentTarget.style.color = COLORS.textPrimary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(27, 122, 74, 0.3)';
          e.currentTarget.style.color = COLORS.textSecondary;
        }}
      >
        {mode === '3d' ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
            <span className="text-xs font-medium">Classic View</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="text-xs font-medium">3D View</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
