// ─── Faan (番) Scoring System ───
// Tracks exploration progress as HK mahjong scoring points

import { FAAN_THRESHOLDS } from './constants';

export interface FaanState {
  total: number;
  visitedSections: string[];
  visitedProjects: string[];
  easterEggs: string[];
}

export function createInitialFaanState(): FaanState {
  return {
    total: 0,
    visitedSections: [],
    visitedProjects: [],
    easterEggs: [],
  };
}

export function addVisitedSection(state: FaanState, sectionId: string): FaanState {
  if (state.visitedSections.includes(sectionId)) return state;
  return {
    ...state,
    visitedSections: [...state.visitedSections, sectionId],
    total: state.total + 2, // +2 faan per section to keep scoring balanced
  };
}

export function addVisitedProject(state: FaanState, projectName: string): FaanState {
  if (state.visitedProjects.includes(projectName)) return state;
  return {
    ...state,
    visitedProjects: [...state.visitedProjects, projectName],
    total: state.total + 1,
  };
}

export function addEasterEgg(state: FaanState, eggId: string): FaanState {
  if (state.easterEggs.includes(eggId)) return state;
  return {
    ...state,
    easterEggs: [...state.easterEggs, eggId],
    total: state.total + 2,
  };
}

export function getFaanLevel(total: number): string {
  if (total >= FAAN_THRESHOLDS.max) return '十三么 Thirteen Orphans!';
  if (total >= FAAN_THRESHOLDS.full) return '滿糊 Full Hand!';
  if (total >= FAAN_THRESHOLDS.minimum) return '食糊 You Win!';
  return `${total} 番`;
}

export function hasWon(total: number): boolean {
  return total >= FAAN_THRESHOLDS.minimum;
}
