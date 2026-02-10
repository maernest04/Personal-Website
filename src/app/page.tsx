'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

import WinCelebration from '@/components/ui/WinCelebration';
import SectionOverlay from '@/components/sections/SectionOverlay';
import ViewToggle from '@/components/ui/ViewToggle';
import ScrollableView from '@/components/ScrollableView';
import { SoundManager } from '@/lib/sounds';
import { getFaanLevel } from '@/lib/faan';
import {
  createInitialFaanState,
  addVisitedSection,
  addVisitedProject,
  addEasterEgg,
  FaanState,
} from '@/lib/faan';

// Dynamic imports — skip SSR for components using Three.js / Framer Motion animations
const MahjongScene = dynamic(() => import('@/components/scene/MahjongScene'), {
  ssr: false,
});
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), {
  ssr: false,
});

type Phase = 'loading' | 'table' | 'section';
type ViewMode = '3d' | 'classic';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [phase, setPhase] = useState<Phase>('loading');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [faanState, setFaanState] = useState<FaanState>(createInitialFaanState);
  const [showWin, setShowWin] = useState(false);

  // Initialize sound manager
  useEffect(() => {
    SoundManager.init();
  }, []);

  // ─── Easter Egg: "sik wu" keyboard shortcut ───
  useEffect(() => {
    let buffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.length > 10) buffer = buffer.slice(-10);

      if (buffer.includes('sikwu') || buffer.includes('sik wu')) {
        buffer = '';
        SoundManager.playWin();
        setFaanState((prev) => addEasterEgg(prev, 'sikwu'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setPhase('table');
    SoundManager.playShuffle();
  }, []);

  const handleSelectTile = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setPhase('section');
    setFaanState((prev) => addVisitedSection(prev, sectionId));
  }, []);

  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
    setPhase('table');
    SoundManager.playClick();
  }, []);

  const handleVisitProject = useCallback((name: string) => {
    setFaanState((prev) => addVisitedProject(prev, name));
  }, []);

  const handleToggleView = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === '3d' ? 'classic' : '3d';
      // When switching back to 3D, skip loading if already loaded
      if (next === '3d' && phase === 'loading') {
        setPhase('table');
      }
      return next;
    });
  }, [phase]);

  // Check for win: all 6 sections visited
  useEffect(() => {
    if (
      faanState.visitedSections.length === 6 &&
      !faanState.easterEggs.includes('thirteenOrphans')
    ) {
      setTimeout(() => {
        SoundManager.playWin();
        setShowWin(true);
        setFaanState((prev) => addEasterEgg(prev, 'thirteenOrphans'));
      }, 1000);
    }
  }, [faanState]);

  // Also trigger win on "sik wu" easter egg
  useEffect(() => {
    if (faanState.easterEggs.includes('sikwu') && !showWin) {
      setShowWin(true);
    }
  }, [faanState.easterEggs, showWin]);

  // ─── Classic scrollable view ───
  if (viewMode === 'classic') {
    return (
      <main className="min-h-screen" style={{ background: '#1e3d30' }}>
        <ViewToggle mode="classic" onToggle={handleToggleView} />
        <ScrollableView onVisitProject={handleVisitProject} />
      </main>
    );
  }

  // ─── 3D interactive view ───
  return (
    <main className="w-screen h-screen overflow-hidden" style={{ background: '#0f0c0a' }}>
      {/* View toggle — always accessible */}
      <ViewToggle mode="3d" onToggle={handleToggleView} />

      {/* Loading Screen */}
      <AnimatePresence>
        {phase === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* 3D Mahjong Table */}
      <AnimatePresence>
        {phase !== 'loading' && (
          <motion.div
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <MahjongScene
              onSelectTile={handleSelectTile}
              dimmed={phase === 'section'}
            />

            {/* Section Overlay */}
            <AnimatePresence>
              {activeSection && (
                <SectionOverlay
                  sectionId={activeSection}
                  onClose={handleCloseSection}
                  onVisitProject={handleVisitProject}
                />
              )}
            </AnimatePresence>

            {/* Win Celebration */}
            <WinCelebration
              show={showWin}
              level={getFaanLevel(faanState.total)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
