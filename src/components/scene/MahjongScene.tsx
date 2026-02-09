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
    const targetZ = 8 + mouseRef.current.y * 0.8;
    camera.position.x += (targetX - camera.position.x) * 0.015;
    camera.position.z += (targetZ - camera.position.z) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Table Surface (Green Felt + Wood Border) ───
function TableSurface() {
  return (
    <group>
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
    <Html center position={[0, 1.2, -1.0]} style={{ pointerEvents: 'none' }}>
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

      {/* Lighting — bright, warm, well-lit table */}
      <ambientLight intensity={0.6} />
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
      {/* Warm overhead fill */}
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#fff8e7" />
      {/* Corner fills — warm white to avoid green tint */}
      <pointLight position={[-5, 5, -5]} intensity={0.2} color="#fffaed" />
      <pointLight position={[5, 5, -5]} intensity={0.2} color="#fffaed" />
      {/* Front fill (camera side) */}
      <pointLight position={[0, 5, 6]} intensity={0.25} color="#fff8e7" />
      {/* Subtle under-light to illuminate wall faces */}
      <pointLight position={[0, 2, 0]} intensity={0.15} color="#fffaed" />

      {/* Fog — subtle, pushed far back */}
      <fog attach="fog" args={['#1e3d30', 16, 35]} />

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
        camera={{ position: [0, 10, 8], fov: 50, near: 0.1, far: 60 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1e3d30');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.3;
        }}
      >
        <Scene onSelectTile={onSelectTile} />
      </Canvas>
    </div>
  );
}
