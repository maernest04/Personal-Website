'use client';

// ─── Sound Manager ───
// Procedural audio using Web Audio API for mahjong tile sounds

let audioCtx: AudioContext | null = null;
let initialized = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

// Generate a procedural click sound using Web Audio API
function playProceduralClick() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
}

function playProceduralSlam() {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

function playProceduralShuffle() {
  const ctx = getAudioContext();
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(400 + Math.random() * 600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    }, i * 60);
  }
}

function playProceduralWin() {
  const ctx = getAudioContext();
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }, i * 150);
  });
}

export const SoundManager = {
  init() {
    if (initialized) return;
    initialized = true;
    // Pre-warm audio context on user interaction
    if (typeof window !== 'undefined') {
      const warmUp = () => {
        getAudioContext();
        window.removeEventListener('click', warmUp);
        window.removeEventListener('keydown', warmUp);
      };
      window.addEventListener('click', warmUp);
      window.addEventListener('keydown', warmUp);
    }
  },

  playClick() {
    try { playProceduralClick(); } catch { /* silent */ }
  },

  playSlam() {
    try { playProceduralSlam(); } catch { /* silent */ }
  },

  playShuffle() {
    try { playProceduralShuffle(); } catch { /* silent */ }
  },

  playWin() {
    try { playProceduralWin(); } catch { /* silent */ }
  },
};
