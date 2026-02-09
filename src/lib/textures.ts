import * as THREE from 'three';
import { COLORS } from './constants';

const TEXTURE_W = 256;
const TEXTURE_H = 340;
const FONT_CN = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "STSong", serif';

// ─── Cache ───
const textureCache = new Map<string, THREE.CanvasTexture>();

function getOrCreate(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (textureCache.has(key)) return textureCache.get(key)!;
  const tex = factory();
  textureCache.set(key, tex);
  return tex;
}

function createCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

// 3D tile base uses a darker ivory so tiles don't wash out against the green felt
const TILE_3D_IVORY = '#B5A88E';
const TILE_3D_IVORY_DARK = '#9E9278';

function ivoryBase(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = TILE_3D_IVORY;
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);
  // subtle border
  ctx.strokeStyle = TILE_3D_IVORY_DARK;
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, TEXTURE_W - 16, TEXTURE_H - 16);
}

// ─── Tile Back Texture (green lattice) ───
export function createBackTexture(): THREE.CanvasTexture {
  return getOrCreate('back', () => {
    const [canvas, ctx] = createCanvas();

    // Base green
    ctx.fillStyle = COLORS.tileBack;
    ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);

    // Border
    ctx.strokeStyle = COLORS.tileBackLight;
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, TEXTURE_W - 20, TEXTURE_H - 20);

    // Diamond lattice pattern
    ctx.strokeStyle = COLORS.tileBackLight;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    const spacing = 20;
    for (let i = -TEXTURE_H; i < TEXTURE_W + TEXTURE_H; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + TEXTURE_H, TEXTURE_H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - TEXTURE_H, TEXTURE_H);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Center circle ornament
    ctx.fillStyle = COLORS.tileBackLight;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(TEXTURE_W / 2, TEXTURE_H / 2, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Character Tile (萬子) ───
export function createCharacterTexture(number: string): THREE.CanvasTexture {
  return getOrCreate(`char-${number}`, () => {
    const [canvas, ctx] = createCanvas();
    ivoryBase(ctx);

    // Number in dark blue
    ctx.fillStyle = '#0A3070';
    ctx.font = `bold 140px ${FONT_CN}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, TEXTURE_W / 2, TEXTURE_H * 0.35);

    // 萬 character in dark red
    ctx.fillStyle = '#7B0000';
    ctx.font = `bold 100px ${FONT_CN}`;
    ctx.fillText('萬', TEXTURE_W / 2, TEXTURE_H * 0.7);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Dot Tile (筒子) ───
// Draws the ornate concentric-circle + petal pattern for 1-dot,
// standard dot layout for higher counts
function drawOrnateDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // Outer ring (blue)
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#0D47A1';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner ring (green)
  ctx.beginPath();
  ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
  ctx.strokeStyle = '#1B5E20';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 8 petals radiating from center
  for (let deg = 0; deg < 360; deg += 45) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.58, r * 0.16, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#8B0000';
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Center filled circle (blue)
  ctx.beginPath();
  ctx.arc(x, y, r * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = '#0D47A1';
  ctx.fill();

  // Center dot (ivory)
  ctx.beginPath();
  ctx.arc(x, y, r * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = TILE_3D_IVORY;
  ctx.fill();
}

export function createDotTexture(count: number): THREE.CanvasTexture {
  return getOrCreate(`dot-${count}`, () => {
    const [canvas, ctx] = createCanvas();
    ivoryBase(ctx);

    const cx = TEXTURE_W / 2;
    const cy = TEXTURE_H / 2;

    if (count === 1) {
      // Ornate single dot (matches classic view design)
      drawOrnateDot(ctx, cx, cy, 70);
    } else {
      const r = 45;
      const positions: [number, number][] = [];
      if (count >= 2) { positions.push([cx, cy - 60], [cx, cy + 60]); }
      if (count >= 3) { positions.push([cx, cy]); }
      if (count >= 4) { positions.length = 0; positions.push([cx - 50, cy - 60], [cx + 50, cy - 60], [cx - 50, cy + 60], [cx + 50, cy + 60]); }
      if (count >= 5) { positions.push([cx, cy]); }

      positions.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#0D47A1';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#7E7560';
        ctx.fill();
      });
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Bamboo Tile (索子) ───
export function createBambooTexture(count: number): THREE.CanvasTexture {
  return getOrCreate(`bamboo-${count}`, () => {
    const [canvas, ctx] = createCanvas();
    ivoryBase(ctx);

    const cx = TEXTURE_W / 2;
    const startY = TEXTURE_H * 0.15;
    const stickH = TEXTURE_H * 0.7;
    const stickW = 24;
    const gap = 40;

    const startX = cx - ((count - 1) * gap) / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + i * gap;
      // Bamboo stick (darker green)
      ctx.fillStyle = '#1B5E20';
      ctx.fillRect(x - stickW / 2, startY, stickW, stickH);
      // Nodes
      for (let j = 0; j < 3; j++) {
        const ny = startY + stickH * (0.2 + j * 0.3);
        ctx.fillStyle = '#0D3B12';
        ctx.fillRect(x - stickW / 2 - 5, ny - 5, stickW + 10, 10);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Wind Tile (風牌) ───
export function createWindTexture(character: string): THREE.CanvasTexture {
  return getOrCreate(`wind-${character}`, () => {
    const [canvas, ctx] = createCanvas();
    ivoryBase(ctx);

    ctx.fillStyle = '#000000';
    ctx.font = `bold 160px ${FONT_CN}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, TEXTURE_W / 2, TEXTURE_H / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Dragon Tile (三元牌) ───
export function createDragonTexture(character: string, color: string): THREE.CanvasTexture {
  return getOrCreate(`dragon-${character}`, () => {
    const [canvas, ctx] = createCanvas();
    ivoryBase(ctx);

    if (character === '白') {
      // White dragon: empty tile with blue border
      ctx.strokeStyle = COLORS.bambooBlue;
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 50, TEXTURE_W - 80, TEXTURE_H - 100);
    } else {
      ctx.fillStyle = color;
      ctx.font = `bold 180px ${FONT_CN}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character, TEXTURE_W / 2, TEXTURE_H / 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Flower Tile (花牌) ───
export function createFlowerTexture(): THREE.CanvasTexture {
  return getOrCreate('flower', () => {
    const [canvas, ctx] = createCanvas();
    ivoryBase(ctx);

    // Flower character
    ctx.fillStyle = '#E65100';
    ctx.font = `bold 110px ${FONT_CN}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('花', TEXTURE_W / 2, TEXTURE_H * 0.45);

    // Small decorative text
    ctx.fillStyle = '#BF360C';
    ctx.font = `32px ${FONT_CN}`;
    ctx.fillText('春', TEXTURE_W / 2, TEXTURE_H * 0.78);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Large Single-Character Tile (used for center face-up tiles) ───
export function createLargeCharTexture(character: string, color: string): THREE.CanvasTexture {
  return getOrCreate(`large-${character}`, () => {
    const [canvas, ctx] = createCanvas();
    ivoryBase(ctx);

    ctx.fillStyle = color;
    ctx.font = `bold 160px ${FONT_CN}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, TEXTURE_W / 2, TEXTURE_H / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Get face texture for a section ───
export function getFaceTexture(sectionId: string): THREE.CanvasTexture {
  switch (sectionId) {
    case 'about': return createCharacterTexture('一');      // 1 number (一萬)
    case 'skills': return createBambooTexture(1);           // 1 bamboo (一索)
    case 'projects': return createDotTexture(1);            // 1 dot (一筒)
    case 'experience': return createWindTexture('東');       // east wind
    case 'contact': return createDragonTexture('中', '#7B0000');   // red dragon (darker)
    case 'education': return createDragonTexture('發', '#1A4D1A'); // green dragon (darker)
    default: return createBackTexture();
  }
}

// ─── Dice Face Texture ───
export function createDiceFaceTexture(dots: number): THREE.CanvasTexture {
  return getOrCreate(`dice-${dots}`, () => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Warm tan face (matches 3D tile ivory)
    ctx.fillStyle = TILE_3D_IVORY;
    ctx.fillRect(0, 0, size, size);

    // Subtle border
    ctx.strokeStyle = TILE_3D_IVORY_DARK;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, size - 8, size - 8);

    // Dot positions for standard die faces
    const c = size / 2;
    const o = size * 0.28; // offset from center
    const r = size * 0.09; // dot radius
    ctx.fillStyle = '#000000';

    const dotPositions: Record<number, [number, number][]> = {
      1: [[c, c]],
      2: [[c - o, c + o], [c + o, c - o]],
      3: [[c - o, c + o], [c, c], [c + o, c - o]],
      4: [[c - o, c - o], [c + o, c - o], [c - o, c + o], [c + o, c + o]],
      5: [[c - o, c - o], [c + o, c - o], [c, c], [c - o, c + o], [c + o, c + o]],
      6: [[c - o, c - o], [c + o, c - o], [c - o, c], [c + o, c], [c - o, c + o], [c + o, c + o]],
    };

    (dotPositions[dots] || []).forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Wind Indicator Plate Texture (square, all 4 winds) ───
export function createWindIndicatorTexture(): THREE.CanvasTexture {
  return getOrCreate('wind-indicator', () => {
    const S = 512; // square canvas
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Deep red background
    ctx.fillStyle = '#8B1A1A';
    ctx.fillRect(0, 0, S, S);

    // Inner lighter red area
    const inset = 28;
    ctx.fillStyle = '#A52020';
    ctx.fillRect(inset, inset, S - inset * 2, S - inset * 2);

    // Gold outer border
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, S - 12, S - 12);

    // Gold inner border
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 3;
    ctx.strokeRect(inset + 4, inset + 4, S - (inset + 4) * 2, S - (inset + 4) * 2);

    // Decorative corner dots
    const cornerR = 8;
    ctx.fillStyle = '#DAA520';
    [inset + 16, S - inset - 16].forEach(cx => {
      [inset + 16, S - inset - 16].forEach(cy => {
        ctx.beginPath();
        ctx.arc(cx, cy, cornerR, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Center ivory square (where the wind marker sits)
    const cSize = 120;
    const cX = (S - cSize) / 2;
    const cY = (S - cSize) / 2;
    ctx.fillStyle = TILE_3D_IVORY;
    ctx.fillRect(cX, cY, cSize, cSize);
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.strokeRect(cX, cY, cSize, cSize);

    // Center character 莊 (dealer marker)
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `bold 60px ${FONT_CN}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('莊', S / 2, S / 2);

    // Wind characters at the 4 cardinal positions
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold 68px ${FONT_CN}`;

    // 東 (East) - bottom (facing the camera/player)
    ctx.fillText('東', S / 2, S - inset - 52);
    // 南 (South) - right
    ctx.save();
    ctx.translate(S - inset - 52, S / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('南', 0, 0);
    ctx.restore();
    // 西 (West) - top
    ctx.save();
    ctx.translate(S / 2, inset + 52);
    ctx.rotate(Math.PI);
    ctx.fillText('西', 0, 0);
    ctx.restore();
    // 北 (North) - left
    ctx.save();
    ctx.translate(inset + 52, S / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('北', 0, 0);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

// ─── Side texture (ivory edges) ───
export function createSideTexture(): THREE.CanvasTexture {
  return getOrCreate('side', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = TILE_3D_IVORY_DARK;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}
