'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TILE, SECTIONS, COLORS } from '@/lib/constants';
import {
  createBackTexture,
  getFaceTexture,
  createSideTexture,
  createDiceFaceTexture,
  createWindIndicatorTexture,
} from '@/lib/textures';
import { SoundManager } from '@/lib/sounds';

// ─── Types ───
interface MahjongSceneProps {
  onSelectTile: (sectionId: string) => void;
  dimmed: boolean;
}

// ─── Deterministic pseudo-random for scattered positions ───
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Pre-compute scattered positions for the 6 center tiles
// Each tile gets a unique position/rotation that looks casually tossed but stays centralized
const CENTER_TILE_LAYOUTS = SECTIONS.map((_, i) => {
  const angle = (i / 6) * Math.PI * 2 + seededRandom(i * 7 + 1) * 0.3; // spread around a rough circle
  const radius = 1.1 + seededRandom(i * 13 + 2) * 0.2; // 1.1 – 1.3 from center (clear of wind plate)
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius * 0.7; // squash z a bit since camera is angled
  const yRot = (seededRandom(i * 11 + 3) - 0.5) * 0.5; // slight random Y rotation (-0.25 to 0.25 rad)
  return {
    pos: [x, TILE.depth / 2 + 0.01, z] as [number, number, number], // flat on table
    yRot,
  };
});

// ─── Camera Rig with Mouse Parallax ───
function CameraRig() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    const targetX = mouseRef.current.x * 1.5;
    const targetZ = 9 + mouseRef.current.y * 0.8;
    camera.position.x += (targetX - camera.position.x) * 0.015;
    camera.position.z += (targetZ - camera.position.z) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Simple furniture helper: a box with position, size, color, and optional rotation ───
function Furniture({ pos, size, color, rot }: {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  rot?: [number, number, number];
}) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
}

// ─── Room Environment — furnished mahjong parlor ───
function RoomEnvironment() {
  const floorColor = '#3d3028';
  const wallColor = '#4a3a2e';
  const wallAccent = '#5a4838'; // wainscoting / lower wall
  const ceilingColor = '#2e2420';
  const woodDark = '#3E2723';
  const woodMed = '#5D4037';
  const cushion = '#8B1A1A';
  const cushionDark = '#6B1414';
  const metalDark = '#2a2a2a';

  // Floor is at y = -4 so table legs are clearly visible
  const F = -4;

  return (
    <group>
      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, F, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={floorColor} roughness={0.92} />
      </mesh>
      {/* Rug under table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, F + 0.01, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#1e2a22" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, F + 0.02, 0]}>
        <planeGeometry args={[14.5, 14.5]} />
        <meshStandardMaterial color="#253028" roughness={0.95} />
      </mesh>

      {/* ── Walls (extend down to floor) ── */}
      {/* Back wall */}
      <mesh position={[0, 5, -20]} receiveShadow>
        <planeGeometry args={[50, 22]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, F + 2, -19.99]}>
        <planeGeometry args={[50, 4]} />
        <meshStandardMaterial color={wallAccent} roughness={0.8} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-20, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[50, 22]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      <mesh position={[-19.99, F + 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[50, 4]} />
        <meshStandardMaterial color={wallAccent} roughness={0.8} />
      </mesh>
      {/* Right wall */}
      <mesh position={[20, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[50, 22]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
      <mesh position={[19.99, F + 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[50, 4]} />
        <meshStandardMaterial color={wallAccent} roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 14, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={ceilingColor} roughness={1} />
      </mesh>

      {/* ── Overhead lamp ── */}
      <mesh position={[0, 11, 0]}>
        <cylinderGeometry args={[0.6, 2.2, 1.0, 32, 1, true]} />
        <meshStandardMaterial color={metalDark} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 10.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 2.2, 32]} />
        <meshStandardMaterial color="#ffe4b5" emissive="#ffe4b5" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 12.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshStandardMaterial color={metalDark} roughness={0.9} />
      </mesh>

      {/* ── 4 Chairs around the table ── */}
      {/* Groups shifted down Y so seat is visibly below table (y=0).
          Floor = F (-4). Chairs are bigger to match table proportions. */}
      {[
        { p: [0, -1.5, 8] as [number, number, number], r: [0, Math.PI, 0] as [number, number, number] },
        { p: [0, -1.5, -8] as [number, number, number], r: [0, 0, 0] as [number, number, number] },
        { p: [-8, -1.5, 0] as [number, number, number], r: [0, Math.PI / 2, 0] as [number, number, number] },
        { p: [8, -1.5, 0] as [number, number, number], r: [0, -Math.PI / 2, 0] as [number, number, number] },
      ].map((chair, ci) => {
        // All Y coords are LOCAL to the group (which is at world y = -1.5)
        // So local y=0 = world y=-1.5, meaning seat at local 0 → world -1.5
        const floorLocal = F - (-1.5);  // floor in local coords = -4 - (-1.5) = -2.5
        const seatTop = 0;              // seat top at local 0 → world -1.5
        const seatH = 0.25;             // seat board thickness
        const cushH = 0.18;             // cushion
        const legSz = 0.25;             // thicker legs
        const W = 3.8;                  // wider seat
        const D = 3.4;                  // deeper seat
        const backTop = 3.5;            // tall backrest (world y = -1.5 + 3.5 = 2.0)
        const ix = W / 2 - 0.18;
        const iz = D / 2 - 0.18;

        const fH = (seatTop - seatH) - floorLocal;  // front leg height
        const fCY = floorLocal + fH / 2;
        const bH = backTop - floorLocal;              // back leg height
        const bCY = floorLocal + bH / 2;

        return (
          <group key={`chair-${ci}`} position={chair.p} rotation={chair.r}>
            {/* Front legs */}
            <Furniture pos={[-ix, fCY, iz]} size={[legSz, fH, legSz]} color={woodDark} />
            <Furniture pos={[ix, fCY, iz]} size={[legSz, fH, legSz]} color={woodDark} />
            {/* Back legs (tall, form backrest uprights) */}
            <Furniture pos={[-ix, bCY, -iz]} size={[legSz, bH, legSz]} color={woodDark} />
            <Furniture pos={[ix, bCY, -iz]} size={[legSz, bH, legSz]} color={woodDark} />

            {/* Stretchers near floor */}
            <Furniture pos={[-ix, floorLocal + 0.5, 0]} size={[0.14, 0.14, D - 0.3]} color={woodDark} />
            <Furniture pos={[ix, floorLocal + 0.5, 0]} size={[0.14, 0.14, D - 0.3]} color={woodDark} />
            <Furniture pos={[0, floorLocal + 0.5, iz]} size={[W - 0.3, 0.14, 0.14]} color={woodDark} />
            <Furniture pos={[0, floorLocal + 0.5, -iz]} size={[W - 0.3, 0.14, 0.14]} color={woodDark} />

            {/* Seat board */}
            <Furniture pos={[0, seatTop - seatH / 2, 0]} size={[W, seatH, D]} color={woodMed} />
            {/* Seat cushion */}
            <Furniture pos={[0, seatTop + cushH / 2, 0]} size={[W - 0.12, cushH, D - 0.12]} color={cushion} />

            {/* Backrest top rail */}
            <Furniture pos={[0, backTop - 0.12, -iz]} size={[W - 0.1, 0.24, legSz]} color={woodDark} />
            {/* Backrest mid rail */}
            <Furniture pos={[0, seatTop + 0.7, -iz]} size={[W - 0.1, 0.18, legSz]} color={woodDark} />
            {/* Backrest cushion */}
            <Furniture pos={[0, (seatTop + 0.7 + backTop - 0.12) / 2, -iz + 0.05]} size={[W - 0.35, (backTop - 0.12) - (seatTop + 0.7) - 0.18, 0.16]} color={cushionDark} />
          </group>
        );
      })}

      {/* ── Warm pool of light on floor under table ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, F + 0.03, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#2a1f0a" transparent opacity={0.15} roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Table Surface (Green Felt + Wood Border) ───
// Floor at y = -4. Table surface at y ≈ 0. Legs clearly visible.
function TableSurface() {
  const floor = -4;
  const tableUnderside = -0.15;
  const legH = tableUnderside - floor;     // ~3.85
  const legCY = floor + legH / 2;

  return (
    <group>
      {/* Table legs — tall, from floor to table underside */}
      {[
        [-5.6, legCY, -5.6],
        [5.6, legCY, -5.6],
        [-5.6, legCY, 5.6],
        [5.6, legCY, 5.6],
      ].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.5, legH, 0.5]} />
          <meshStandardMaterial color={COLORS.darkWood} roughness={0.7} />
        </mesh>
      ))}

      {/* Green felt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={COLORS.tableFelt} roughness={0.9} />
      </mesh>

      {/* Wood border - 4 sides */}
      {[
        { pos: [0, 0.1, -6.15] as [number, number, number], scale: [12.6, 0.25, 0.3] as [number, number, number] },
        { pos: [0, 0.1, 6.15] as [number, number, number], scale: [12.6, 0.25, 0.3] as [number, number, number] },
        { pos: [-6.15, 0.1, 0] as [number, number, number], scale: [0.3, 0.25, 12.6] as [number, number, number] },
        { pos: [6.15, 0.1, 0] as [number, number, number], scale: [0.3, 0.25, 12.6] as [number, number, number] },
      ].map((side, i) => (
        <mesh key={i} position={side.pos} castShadow receiveShadow>
          <boxGeometry args={side.scale} />
          <meshStandardMaterial color={COLORS.darkWood} roughness={0.7} />
        </mesh>
      ))}

      {/* Subtle table center gradient (lighter area) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial
          color={COLORS.tableFeltLight}
          transparent
          opacity={0.12}
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

// ─── Static Wall Tile (face-down, decorative) ───
function WallTile({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const backTexture = useMemo(() => createBackTexture(), []);
  const sideTexture = useMemo(() => createSideTexture(), []);

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),
  ], [backTexture, sideTexture]);

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow material={materials}>
      <boxGeometry args={[TILE.width, TILE.depth, TILE.height]} />
    </mesh>
  );
}

// ─── Generate Wall Positions (windmill/pinwheel pattern, traditional HK style) ───
// Each wall is shifted laterally to create the characteristic overlapping corners
// visible in the reference image: one wall's end extends clearly past the
// perpendicular wall, creating the angled square look.
function generateWallPositions() {
  const positions: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
  const stacks = TILE.stacksPerWall;
  const tileStep = TILE.width + TILE.gap;
  const wallHalf = ((stacks - 1) * tileStep) / 2;
  const offset = TILE.wallOffset;
  // Shift = full tile height so the overlap at each corner is clearly visible
  // (about 1 tile width of extension past the perpendicular wall)
  const shift = TILE.height * 1.5;

  // North wall (z = -offset, along x): shifted +x (right end extends past East wall)
  for (let i = 0; i < stacks; i++) {
    const x = -wallHalf + i * tileStep + shift;
    positions.push({ pos: [x, TILE.depth / 2, -offset], rot: [0, 0, 0] });
    positions.push({ pos: [x, TILE.depth * 1.5 + 0.005, -offset], rot: [0, 0, 0] });
  }
  // South wall (z = +offset, along x): shifted -x (left end extends past West wall)
  for (let i = 0; i < stacks; i++) {
    const x = -wallHalf + i * tileStep - shift;
    positions.push({ pos: [x, TILE.depth / 2, offset], rot: [0, 0, 0] });
    positions.push({ pos: [x, TILE.depth * 1.5 + 0.005, offset], rot: [0, 0, 0] });
  }
  // East wall (x = +offset, along z): shifted +z (bottom end extends past South wall)
  for (let i = 0; i < stacks; i++) {
    const z = -wallHalf + i * tileStep + shift;
    positions.push({ pos: [offset, TILE.depth / 2, z], rot: [0, Math.PI / 2, 0] });
    positions.push({ pos: [offset, TILE.depth * 1.5 + 0.005, z], rot: [0, Math.PI / 2, 0] });
  }
  // West wall (x = -offset, along z): shifted -z (top end extends past North wall)
  for (let i = 0; i < stacks; i++) {
    const z = -wallHalf + i * tileStep - shift;
    positions.push({ pos: [-offset, TILE.depth / 2, z], rot: [0, Math.PI / 2, 0] });
    positions.push({ pos: [-offset, TILE.depth * 1.5 + 0.005, z], rot: [0, Math.PI / 2, 0] });
  }

  return positions;
}

// ─── Decorative Walls (no gaps, pure decoration) ───
// Entire wall formation rotated 5° counter-clockwise for traditional angled look
const WALL_ROTATION_Y = (5 * Math.PI) / 180;

function DecorativeWalls() {
  const positions = useMemo(() => generateWallPositions(), []);

  return (
    <group rotation={[0, WALL_ROTATION_Y, 0]}>
      {positions.map((t, i) => (
        <WallTile key={i} position={t.pos} rotation={t.rot} />
      ))}
    </group>
  );
}

// ─── Dice (3 traditional HK mahjong dice, scattered near center) ───
const DICE_SIZE = 0.18;
const DICE_LAYOUTS = [
  { pos: [1.9, DICE_SIZE / 2 + 0.01, 1.5] as [number, number, number], rot: [0, 0.4, 0] as [number, number, number], topFace: 3 },
  { pos: [1.6, DICE_SIZE / 2 + 0.01, 1.85] as [number, number, number], rot: [0, 1.1, 0] as [number, number, number], topFace: 5 },
  { pos: [2.1, DICE_SIZE / 2 + 0.01, 1.75] as [number, number, number], rot: [0, 2.3, 0] as [number, number, number], topFace: 2 },
];

function Die({ position, rotation, topFace }: { position: [number, number, number]; rotation: [number, number, number]; topFace: number }) {
  // Standard die: opposite faces sum to 7
  const materials = useMemo(() => {
    const opposite = 7 - topFace;
    const remaining = [1, 2, 3, 4, 5, 6].filter(n => n !== topFace && n !== opposite);
    return [
      new THREE.MeshStandardMaterial({ map: createDiceFaceTexture(remaining[0]), roughness: 0.3 }), // +x
      new THREE.MeshStandardMaterial({ map: createDiceFaceTexture(remaining[1]), roughness: 0.3 }), // -x
      new THREE.MeshStandardMaterial({ map: createDiceFaceTexture(topFace), roughness: 0.3 }),       // +y (top)
      new THREE.MeshStandardMaterial({ map: createDiceFaceTexture(opposite), roughness: 0.3 }),      // -y (bottom)
      new THREE.MeshStandardMaterial({ map: createDiceFaceTexture(remaining[2]), roughness: 0.3 }), // +z
      new THREE.MeshStandardMaterial({ map: createDiceFaceTexture(remaining[3]), roughness: 0.3 }), // -z
    ];
  }, [topFace]);

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow material={materials}>
      <boxGeometry args={[DICE_SIZE, DICE_SIZE, DICE_SIZE]} />
    </mesh>
  );
}

function TableDice() {
  return (
    <group>
      {DICE_LAYOUTS.map((d, i) => (
        <Die key={i} position={d.pos} rotation={d.rot} topFace={d.topFace} />
      ))}
    </group>
  );
}

// ─── Wind Indicator Plate (square center marker with 東南西北) ───
const WIND_PLATE_SIZE = 1.2;
const WIND_PLATE_THICKNESS = 0.04;

function WindIndicator() {
  const windTexture = useMemo(() => createWindIndicatorTexture(), []);

  const sideMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#6B1414', roughness: 0.5 }),
    [],
  );
  const topMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: windTexture, roughness: 0.35 }),
    [windTexture],
  );
  const bottomMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#5D1010', roughness: 0.6 }),
    [],
  );

  const materials = useMemo(
    () => [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat],
    [sideMat, topMat, bottomMat],
  );

  return (
    <mesh
      position={[0, WIND_PLATE_THICKNESS / 2 + 0.005, 0]}
      castShadow
      receiveShadow
      material={materials}
    >
      <boxGeometry args={[WIND_PLATE_SIZE, WIND_PLATE_THICKNESS, WIND_PLATE_SIZE]} />
    </mesh>
  );
}

// ─── Center Tile (face-up, standing upright, clickable) ───
function CenterTile({
  sectionId,
  sectionIndex,
  basePosition,
  baseYRot,
  onSelect,
}: {
  sectionId: string;
  sectionIndex: number;
  basePosition: [number, number, number];
  baseYRot: number;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const faceTexture = useMemo(() => getFaceTexture(sectionId), [sectionId]);
  const backTexture = useMemo(() => createBackTexture(), []);
  const sideTexture = useMemo(() => createSideTexture(), []);

  // Tile lies flat on the table, face up:
  // Box geometry is [width, height, depth] = [TILE.width, TILE.depth, TILE.height]
  // The thin dimension (TILE.depth) is along Y so the tile lies flat.
  // Face texture goes on +y (top, facing upward toward camera).
  // Box faces: +x, -x, +y (face up), -y (back/bottom), +z, -z
  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),  // +x right
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),  // -x left
    new THREE.MeshStandardMaterial({ map: faceTexture, roughness: 0.3 }),  // +y top (face up)
    new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.3 }),  // -y bottom (back)
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),  // +z front
    new THREE.MeshStandardMaterial({ map: sideTexture, roughness: 0.4 }),  // -z back
  ], [faceTexture, backTexture, sideTexture]);

  const handleClick = useCallback(() => {
    SoundManager.playSlam();
    onSelect(sectionId);
  }, [sectionId, onSelect]);

  useFrame(() => {
    if (!meshRef.current) return;
    const time = Date.now() * 0.002;
    const bobAmount = hovered ? 0.06 : 0.015;
    const bobOffset = hovered ? 0.06 : 0;
    meshRef.current.position.y =
      basePosition[1] + Math.sin(time + sectionIndex * 1.1) * bobAmount + bobOffset;
  });

  const section = SECTIONS[sectionIndex];

  return (
    <group position={basePosition} rotation={[0, baseYRot, 0]}>
      <mesh
        ref={meshRef}
        material={materials}
        castShadow
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={handleClick}
      >
        {/* width, depth(thin), height — tile lies flat, face up */}
        <boxGeometry args={[TILE.width, TILE.depth, TILE.height]} />
      </mesh>

      {/* Hover tooltip */}
      {hovered && (
        <>
          <pointLight position={[0, 0.4, 0]} intensity={1} color="#ffaa44" distance={2} />
          <Html center position={[0, TILE.depth / 2 + 0.25, 0]} style={{ pointerEvents: 'none' }}>
            <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap font-medium shadow-lg">
              <span className="cn-text">{section.tileLabelCn}</span>
              {' '}
              {section.name}
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

// ─── Center Tiles Group (scattered in the middle) ───
function CenterTiles({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <group>
      {SECTIONS.map((section, i) => (
        <CenterTile
          key={section.id}
          sectionId={section.id}
          sectionIndex={i}
          basePosition={CENTER_TILE_LAYOUTS[i].pos}
          baseYRot={CENTER_TILE_LAYOUTS[i].yRot}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

// ─── Center Table Content (name/title, positioned above tiles) ───
function CenterContent() {
  return (
    <Html center position={[0, 2.2, -1.2]} style={{ pointerEvents: 'none' }}>
      <div className="text-center select-none" style={{ width: '320px', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight"
          style={{ color: '#ffffff' }}
        >
          Ernest Ma
        </h1>
        <p className="text-lg mt-2" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          Computer Engineer
        </p>
      </div>
    </Html>
  );
}

// ─── Main Scene ───
function Scene({ onSelectTile }: { onSelectTile: (id: string) => void }) {
  return (
    <>
      <CameraRig />

      {/* Lighting — brighter warm parlor */}
      <ambientLight intensity={0.7} color="#fff0e0" />
      <directionalLight
        position={[5, 14, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={40}
        shadow-camera-near={0.1}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      {/* Main overhead lamp — focused warm cone on the table */}
      <spotLight
        position={[0, 13, 0]}
        angle={0.8}
        penumbra={0.5}
        intensity={5.0}
        color="#ffe4b5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        target-position={[0, 0, 0]}
      />
      {/* Secondary overhead fill */}
      <pointLight position={[0, 10, 0]} intensity={1.2} color="#fff0d0" />
      {/* Corner fills — brighter */}
      <pointLight position={[-6, 6, -6]} intensity={0.5} color="#ffe4b5" />
      <pointLight position={[6, 6, -6]} intensity={0.5} color="#ffe4b5" />
      <pointLight position={[-6, 6, 6]} intensity={0.3} color="#ffe4b5" />
      <pointLight position={[6, 6, 6]} intensity={0.3} color="#ffe4b5" />
      {/* Front fill (camera side) */}
      <pointLight position={[0, 5, 8]} intensity={0.5} color="#ffe4b5" />
      {/* Under-light for tile readability */}
      <pointLight position={[0, 2, 0]} intensity={0.4} color="#fff0d0" />
      {/* Under-table light so legs and chairs are visible */}
      <pointLight position={[0, -2, 0]} intensity={0.4} color="#ffe8d0" />
      <pointLight position={[0, -2, 6]} intensity={0.3} color="#ffe8d0" />

      {/* Fog — pushed back */}
      <fog attach="fog" args={['#1e1814', 35, 60]} />

      {/* Room environment */}
      <RoomEnvironment />

      {/* Table */}
      <TableSurface />

      {/* Decorative walls (windmill pattern) */}
      <DecorativeWalls />

      {/* Dice */}
      <TableDice />

      {/* Wind indicator */}
      <WindIndicator />

      {/* Scattered center tiles */}
      <CenterTiles onSelect={onSelectTile} />

      {/* Name / title */}
      <CenterContent />
    </>
  );
}

// ─── Exported Canvas Wrapper ───
export default function MahjongScene({ onSelectTile, dimmed }: MahjongSceneProps) {
  return (
    <div
      className="fixed inset-0 transition-all duration-700"
      style={{
        opacity: dimmed ? 0.2 : 1,
        filter: dimmed ? 'blur(4px)' : 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 10, 6], fov: 50, near: 0.1, far: 65 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1e1814');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.8;
        }}
      >
        <Scene onSelectTile={onSelectTile} />
      </Canvas>
    </div>
  );
}
