import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/*
 * A cozy cut-away pet-hostel room built from primitives + procedural canvas textures
 * (no downloads): plank floor, papered walls with wainscoting, a sunny window, and a
 * named "suite" for each resident — dog bed & bowls, cat bed & cat tree, bunny pen, bird perch.
 */

export const FLOOR_Y = -1.3;
const BACK_Z = -2.1;
const SIDE_X = 2.75; // right-hand wall of the pets' corner
const LEFT_X = -16; // the room runs on far to the left, behind the hero text
const FRONT_Z = 9; // floor reaches past the camera
const WALL_TOP = 6;
const WAINSCOT_TOP = -0.35;

function canvasTexture(w, h, draw, { repeat, anisotropy = 8 } = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

// Tiny deterministic PRNG so textures look the same on every load.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function useFloorTexture() {
  return useMemo(
    () =>
      canvasTexture(1024, 1024, (ctx, w, h) => {
        const r = rng(7);
        const tones = ['#D9A36B', '#CF9760', '#E0AD77', '#C98F5A', '#D69E66'];
        const rows = 8;
        const rh = h / rows;
        for (let row = 0; row < rows; row++) {
          let x = -r() * 300;
          while (x < w) {
            const len = 260 + r() * 240;
            ctx.fillStyle = tones[Math.floor(r() * tones.length)];
            ctx.fillRect(x, row * rh, len, rh);
            ctx.globalAlpha = 0.12; // grain
            for (let g = 0; g < 9; g++) {
              ctx.strokeStyle = r() > 0.5 ? '#8A5A33' : '#F2C79A';
              ctx.lineWidth = 1 + r() * 1.5;
              const gy = row * rh + 6 + r() * (rh - 12);
              ctx.beginPath();
              ctx.moveTo(x, gy);
              ctx.bezierCurveTo(x + len * 0.3, gy + (r() - 0.5) * 8, x + len * 0.7, gy + (r() - 0.5) * 8, x + len, gy);
              ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgba(90,55,30,0.55)'; // seams
            ctx.fillRect(x, row * rh, 3, rh);
            x += len;
          }
          ctx.fillStyle = 'rgba(90,55,30,0.45)';
          ctx.fillRect(0, row * rh, w, 3);
        }
      }, { repeat: [1, 1] }),
    []
  );
}

function useWallpaper() {
  return useMemo(
    () =>
      canvasTexture(256, 256, (ctx, w, h) => {
        ctx.fillStyle = '#FFF1E4';
        ctx.fillRect(0, 0, w, h);
        const paw = (cx, cy, s, rot) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);
          ctx.scale(s, s);
          ctx.fillStyle = '#F8DCC4';
          ctx.beginPath();
          ctx.ellipse(0, 6, 9, 7.5, 0, 0, Math.PI * 2);
          [[-10, -4], [-4, -10], [4, -10], [10, -4]].forEach(([x, y]) => ctx.ellipse(x, y, 3.6, 4.6, 0, 0, Math.PI * 2));
          ctx.fill();
          ctx.restore();
        };
        paw(64, 64, 1, -0.3);
        paw(192, 192, 1, 0.35);
        ctx.fillStyle = '#F8DCC4';
        [[192, 60], [64, 190]].forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }, { repeat: [1, 1] }),
    []
  );
}

function useSkyTexture() {
  return useMemo(
    () =>
      canvasTexture(512, 512, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#7EC4F5');
        g.addColorStop(0.65, '#CDEBFF');
        g.addColorStop(1, '#FFF4DE');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        const sun = ctx.createRadialGradient(360, 150, 0, 360, 150, 120);
        sun.addColorStop(0, 'rgba(255,248,210,1)');
        sun.addColorStop(0.25, 'rgba(255,236,170,0.9)');
        sun.addColorStop(1, 'rgba(255,236,170,0)');
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        [[120, 120, 1], [250, 210, 0.7], [420, 280, 0.8]].forEach(([x, y, s]) => {
          [[0, 0, 34], [30, -12, 28], [58, 0, 30], [28, 8, 30]].forEach(([dx, dy, r]) => {
            ctx.beginPath();
            ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2);
            ctx.fill();
          });
        });
        // garden hedge + trees
        const r = rng(3);
        for (let i = 0; i < 9; i++) {
          ctx.fillStyle = ['#7CBF6B', '#5FA85A', '#8FCB7A'][i % 3];
          ctx.beginPath();
          ctx.arc(i * 64 + r() * 20, 420 + r() * 20, 70 + r() * 30, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#6DB35F';
        ctx.fillRect(0, 440, w, 80);
      }),
    []
  );
}

function useRugTexture() {
  return useMemo(
    () =>
      canvasTexture(512, 512, (ctx, w) => {
        const rings = ['#FF8A6B', '#FFF1E4', '#FFB547', '#FFF1E4', '#FF8A6B', '#F7D2BA', '#FFF1E4'];
        rings.forEach((c, i) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(w / 2, w / 2, w / 2 - i * 34, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = '#FF8A6B';
        for (let a = 0; a < 24; a++) {
          const ang = (a / 24) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(w / 2 + Math.cos(ang) * 200, w / 2 + Math.sin(ang) * 200, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }),
    []
  );
}

/** Painted name plaque for a suite. */
function Plaque({ title, subtitle, color = '#FF6B4A', width = 0.9, height = 0.32, ...props }) {
  const texture = useMemo(
    () =>
      canvasTexture(512, Math.round(512 * (height / width)), (ctx, w, h) => {
        const rad = 28;
        ctx.fillStyle = '#FFFBF5';
        ctx.beginPath();
        ctx.roundRect(4, 4, w - 8, h - 8, rad);
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fillStyle = '#1F1535';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `800 ${Math.round(h * 0.36)}px Fraunces, Georgia, serif`;
        ctx.fillText(title, w / 2, subtitle ? h * 0.42 : h / 2);
        if (subtitle) {
          ctx.fillStyle = color;
          ctx.font = `700 ${Math.round(h * 0.2)}px "Plus Jakarta Sans", system-ui, sans-serif`;
          ctx.fillText(subtitle.toUpperCase(), w / 2, h * 0.75);
        }
      }),
    [title, subtitle, color, width, height]
  );
  return (
    <group {...props}>
      <mesh position={[0, 0, -0.012]}>
        <boxGeometry args={[width + 0.04, height + 0.04, 0.02]} />
        <meshStandardMaterial color="#B77B52" roughness={0.7} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Texture tiled at a fixed real-world density, so paper and planks look the same on every surface. */
function useTiled(base, width, height, unitsPerTile) {
  return useMemo(() => {
    const t = base.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(width / unitsPerTile, height / unitsPerTile);
    t.needsUpdate = true;
    return t;
  }, [base, width, height, unitsPerTile]);
}

function Wall({ position, rotation, width, shade = 1 }) {
  const wallH = WALL_TOP - WAINSCOT_TOP;
  const wainH = WAINSCOT_TOP - FLOOR_Y;
  const paper = useTiled(useWallpaper(), width, wallH, 0.8);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, WAINSCOT_TOP + wallH / 2, 0]} receiveShadow>
        <planeGeometry args={[width, wallH]} />
        <meshStandardMaterial map={paper} color={new THREE.Color(shade, shade, shade)} roughness={1} />
      </mesh>
      <mesh position={[0, FLOOR_Y + wainH / 2, 0]} receiveShadow>
        <planeGeometry args={[width, wainH]} />
        <meshStandardMaterial color={new THREE.Color('#C9DFCF').multiplyScalar(shade)} roughness={0.9} />
      </mesh>
      {/* chair rail + skirting */}
      <mesh position={[0, WAINSCOT_TOP, 0.02]}>
        <boxGeometry args={[width, 0.06, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 0.07, 0.02]}>
        <boxGeometry args={[width, 0.14, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Walls() {
  const backW = SIDE_X - LEFT_X;
  const sideD = FRONT_Z - BACK_Z;
  return (
    <>
      <Wall position={[(SIDE_X + LEFT_X) / 2, 0, BACK_Z]} rotation={[0, 0, 0]} width={backW} />
      <Wall position={[SIDE_X, 0, BACK_Z + sideD / 2]} rotation={[0, -Math.PI / 2, 0]} width={sideD} shade={0.93} />
    </>
  );
}

function Floor() {
  const w = SIDE_X - LEFT_X;
  const d = FRONT_Z - BACK_Z;
  const planks = useTiled(useFloorTexture(), w, d, 1.7);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(SIDE_X + LEFT_X) / 2, FLOOR_Y, BACK_Z + d / 2]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={planks} color="#E6CDB2" roughness={0.6} />
    </mesh>
  );
}

function Window({ position }) {
  const sky = useSkyTexture();
  const W = 1.5;
  const H = 1.35;
  const frame = <meshStandardMaterial color="#FFFFFF" roughness={0.5} />;
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      {/* frame + mullions */}
      {[
        [0, H / 2, W + 0.1, 0.08],
        [0, -H / 2, W + 0.1, 0.08],
        [0, 0, 0.05, H],
        [W / 2, 0, 0.08, H],
        [-W / 2, 0, 0.08, H],
        [0, H * 0.1, W, 0.045],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.04]}>
          <boxGeometry args={[w, h, 0.07]} />
          {frame}
        </mesh>
      ))}
      {/* sill */}
      <mesh position={[0, -H / 2 - 0.06, 0.1]} castShadow>
        <boxGeometry args={[W + 0.3, 0.06, 0.24]} />
        {frame}
      </mesh>
      {/* little potted succulent on the sill */}
      <group position={[0.5, -H / 2 + 0.02, 0.12]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.07, 0.055, 0.12, 20]} />
          <meshStandardMaterial color="#FF8A6B" roughness={0.7} />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 4.8].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.04, 0.16, Math.sin(a) * 0.04]} rotation={[Math.sin(a) * 0.5, 0, Math.cos(a) * 0.5]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#6DB35F" roughness={0.7} />
          </mesh>
        ))}
      </group>
      {/* curtain rod + curtains */}
      <mesh position={[0, H / 2 + 0.2, 0.14]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, W + 0.9, 12]} />
        <meshStandardMaterial color="#B77B52" metalness={0.3} roughness={0.4} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (W / 2 + 0.22), -0.05, 0.14]}>
          {[-0.09, 0, 0.09].map((dx, i) => (
            <mesh key={i} position={[dx, 0, (i % 2) * 0.03]} castShadow>
              <capsuleGeometry args={[0.065, H + 0.2, 6, 12]} />
              <meshStandardMaterial color={i === 1 ? '#FF9A7D' : '#FF8A6B'} roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Warm window light pooled on the floor. */
function SunPatch({ position }) {
  const tex = useMemo(
    () =>
      canvasTexture(256, 256, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
        g.addColorStop(0, 'rgba(255,236,190,0.55)');
        g.addColorStop(1, 'rgba(255,236,190,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }),
    []
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0.35]} position={position} scale={[2.2, 1.4, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Rug({ position, radius = 1.5 }) {
  const tex = useRugTexture();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} scale={[1, 0.8, 1]} receiveShadow>
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial map={tex} roughness={1} />
    </mesh>
  );
}

function Bowl({ position, fill }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.12, 32, 1, true]} />
        <meshStandardMaterial color="#D6DDE4" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.015, 10, 40]} />
        <meshStandardMaterial color="#E9EEF2" metalness={0.8} roughness={0.2} />
      </mesh>
      {fill === 'water' ? (
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 32]} />
          <meshPhysicalMaterial color="#8FD3FF" roughness={0.05} transmission={0.2} clearcoat={1} />
        </mesh>
      ) : (
        Array.from({ length: 22 }).map((_, i) => {
          const a = i * 2.4;
          const rr = 0.04 + (i % 5) * 0.028;
          return (
            <mesh key={i} position={[Math.cos(a) * rr, 0.1 + (i % 3) * 0.012, Math.sin(a) * rr]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshStandardMaterial color="#9C5B2E" roughness={0.9} />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function DogSuite({ position }) {
  return (
    <group position={position}>
      {/* cushion bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[1.1, 48]} />
        <meshStandardMaterial color="#F4C7A6" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.1, 0.14, 20, 64]} />
        <meshStandardMaterial color="#E8906B" roughness={1} />
      </mesh>
      <Bowl position={[-1.35, 0, -0.55]} fill="kibble" />
      <Bowl position={[-1.35, 0, -0.05]} fill="water" />
      {/* chew bone */}
      <group position={[1.05, 0.08, 0.75]} rotation={[0, 0.7, Math.PI / 2]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.035, 0.28, 6, 12]} />
          <meshStandardMaterial color="#F6EBDD" roughness={0.5} />
        </mesh>
        {[[-0.03, 0.18], [0.03, 0.18], [-0.03, -0.18], [0.03, -0.18]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshStandardMaterial color="#F6EBDD" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CatSuite({ position }) {
  return (
    <group position={position}>
      {/* raised cushioned daybed */}
      <RoundedBox args={[1.75, 0.16, 1.15]} radius={0.07} smoothness={4} position={[0, 0.08, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#B9AEF7" roughness={1} />
      </RoundedBox>
      <RoundedBox args={[1.75, 0.3, 0.14]} radius={0.06} smoothness={4} position={[0, 0.2, -0.55]} castShadow>
        <meshStandardMaterial color="#9D8FF2" roughness={1} />
      </RoundedBox>
      <Plaque title="Mochi" subtitle="Nap nook · 02" color="#8B7CF6" width={0.62} height={0.22} position={[0, 0.09, 0.585]} rotation={[-0.15, 0, 0]} />
    </group>
  );
}

function CatTree({ position }) {
  const sisal = <meshStandardMaterial color="#D8B98A" roughness={1} />;
  const carpet = <meshStandardMaterial color="#F2E3D3" roughness={1} />;
  return (
    <group position={position}>
      <RoundedBox args={[0.9, 0.08, 0.7]} radius={0.03} position={[0, 0.04, 0]} castShadow receiveShadow>{carpet}</RoundedBox>
      <mesh position={[-0.22, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.45, 16]} />
        {sisal}
      </mesh>
      <mesh position={[0.25, 0.45, 0.1]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.85, 16]} />
        {sisal}
      </mesh>
      <RoundedBox args={[0.62, 0.06, 0.5]} radius={0.03} position={[0.15, 0.9, 0.05]} castShadow receiveShadow>{carpet}</RoundedBox>
      <RoundedBox args={[0.55, 0.06, 0.5]} radius={0.03} position={[-0.2, 1.5, 0]} castShadow receiveShadow>{carpet}</RoundedBox>
      {/* dangling toy */}
      <mesh position={[0.4, 0.72, 0.28]}>
        <cylinderGeometry args={[0.004, 0.004, 0.36, 4]} />
        <meshStandardMaterial color="#1F1535" />
      </mesh>
      <mesh position={[0.4, 0.52, 0.28]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#FF6B4A" roughness={0.9} />
      </mesh>
    </group>
  );
}

function BunnyPen({ position }) {
  const w = 1.35;
  const d = 1.1;
  const picket = (x, z, rotY) => (
    <group key={`${x.toFixed(3)}:${z.toFixed(3)}`} position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.03]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.035, 0.035, 0.03]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
    </group>
  );
  const pickets = [];
  for (let i = 0; i <= 10; i++) pickets.push(picket(-w / 2 + (i / 10) * w, -d / 2, 0));
  for (let i = 1; i <= 7; i++) {
    pickets.push(picket(-w / 2, -d / 2 + (i / 8) * d, Math.PI / 2));
    pickets.push(picket(w / 2, -d / 2 + (i / 8) * d, Math.PI / 2));
  }
  return (
    <group position={position}>
      {/* straw mat */}
      <RoundedBox args={[w, 0.03, d]} radius={0.012} position={[0, 0.015, 0]} receiveShadow>
        <meshStandardMaterial color="#EACB85" roughness={1} />
      </RoundedBox>
      {pickets}
      {/* rails */}
      {[0.12, 0.3].map((y) => (
        <group key={y}>
          <mesh position={[0, y, -d / 2 - 0.02]}>
            <boxGeometry args={[w, 0.03, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-w / 2 - 0.02, y, 0]}>
            <boxGeometry args={[0.02, 0.03, d]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[w / 2 + 0.02, y, 0]}>
            <boxGeometry args={[0.02, 0.03, d]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
      {/* hay pile */}
      <mesh position={[-0.38, 0.07, -0.28]} scale={[1.2, 0.45, 0.9]} castShadow>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial color="#E4C065" roughness={1} flatShading />
      </mesh>
      {/* carrot */}
      <group position={[0.42, 0.06, 0.3]} rotation={[Math.PI / 2, 0, 0.8]}>
        <mesh castShadow>
          <coneGeometry args={[0.05, 0.28, 12]} />
          <meshStandardMaterial color="#FF8A2B" roughness={0.7} />
        </mesh>
        {[-0.3, 0, 0.3].map((a) => (
          <mesh key={a} position={[0, -0.18, 0]} rotation={[0, 0, a]}>
            <coneGeometry args={[0.018, 0.12, 6]} />
            <meshStandardMaterial color="#5FA85A" />
          </mesh>
        ))}
      </group>
      {/* little signpost at the front corner so the bunny doesn't hide it */}
      <mesh position={[w / 2 - 0.05, 0.16, d / 2 + 0.05]} castShadow>
        <boxGeometry args={[0.03, 0.32, 0.03]} />
        <meshStandardMaterial color="#B77B52" roughness={0.7} />
      </mesh>
      <Plaque title="Pepper" subtitle="Burrow · 03" color="#3DD9B3" width={0.5} height={0.19} position={[w / 2 - 0.05, 0.36, d / 2 + 0.07]} rotation={[-0.1, -0.25, 0]} />
    </group>
  );
}

function BirdPerch({ top, position }) {
  const pole = top - FLOOR_Y;
  const wood = <meshStandardMaterial color="#8B5A3C" roughness={0.8} />;
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh position={[0, FLOOR_Y + pole / 2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.055, pole, 16]} />
        {wood}
      </mesh>
      <mesh position={[0, top, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.8, 16]} />
        {wood}
      </mesh>
      {/* seed cup */}
      <mesh position={[0.34, top + 0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.08, 16]} />
        <meshStandardMaterial color="#FFB547" roughness={0.6} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 0.03, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.06, 32]} />
        <meshStandardMaterial color="#6E4530" roughness={0.9} />
      </mesh>
      <Plaque title="Kiwi" subtitle="Perch · 04" color="#FFB547" width={0.5} height={0.19} position={[0, FLOOR_Y + 0.75, 0.06]} />
    </group>
  );
}

function Plant({ position, scale = 1 }) {
  const leaves = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 11 }, (_, i) => ({
      a: (i / 11) * Math.PI * 2 + r() * 0.4,
      tilt: 0.5 + r() * 0.5,
      len: 0.55 + r() * 0.35,
      shade: r() > 0.5 ? '#4E9A57' : '#5FB06A',
    }));
  }, []);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.18, 0.44, 24]} />
        <meshStandardMaterial color="#F2E3D3" roughness={0.8} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} position={[0, 0.42, 0]} rotation={[0, l.a, l.tilt]}>
          <mesh position={[0, l.len / 2, 0]} scale={[0.35, 1, 0.08]} castShadow>
            <sphereGeometry args={[l.len / 2, 12, 12]} />
            <meshStandardMaterial color={l.shade} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WallArt() {
  const heartFrame = useMemo(
    () =>
      canvasTexture(256, 320, (ctx, w, h) => {
        ctx.fillStyle = '#FFE3D3';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#FF6B4A';
        ctx.save();
        ctx.translate(w / 2, h / 2 + 10);
        ctx.scale(3.2, 3.2);
        ctx.beginPath();
        ctx.ellipse(0, 6, 9, 7.5, 0, 0, Math.PI * 2);
        [[-10, -4], [-4, -10], [4, -10], [10, -4]].forEach(([x, y]) => ctx.ellipse(x, y, 3.6, 4.6, 0, 0, Math.PI * 2));
        ctx.fill();
        ctx.restore();
      }),
    []
  );
  return (
    <group>
      {/* framed paw print */}
      <group position={[2.05, 0.55, BACK_Z + 0.02]}>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.62, 0.76, 0.04]} />
          <meshStandardMaterial color="#B77B52" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[0.5, 0.64]} />
          <meshStandardMaterial map={heartFrame} roughness={0.9} />
        </mesh>
      </group>
      {/* treat shelf */}
      <group position={[2.05, -0.15, BACK_Z + 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.05, 0.24]} />
          <meshStandardMaterial color="#B77B52" roughness={0.7} />
        </mesh>
        {[
          [-0.28, '#FFB547', 0.18],
          [0, '#3DD9B3', 0.24],
          [0.27, '#FF8A6B', 0.16],
        ].map(([x, c, hgt]) => (
          <group key={x} position={[x, 0.025 + hgt / 2, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.07, 0.07, hgt, 20]} />
              <meshPhysicalMaterial color="#FFFFFF" roughness={0.05} transmission={0.6} thickness={0.1} />
            </mesh>
            <mesh position={[0, hgt / 2 + 0.02, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.04, 20]} />
              <meshStandardMaterial color={c} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}


/** Reception side of the room — sits behind the hero text, so it stays simple and calm. */
function Lobby() {
  const wood = '#B77B52';
  return (
    <group>
      {/* front door */}
      <group position={[-4.3, 0, BACK_Z + 0.02]}>
        <mesh position={[0, FLOOR_Y + 1.25, 0]}>
          <boxGeometry args={[1.3, 2.5, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
        <mesh position={[0, FLOOR_Y + 1.2, 0.04]}>
          <boxGeometry args={[1.1, 2.35, 0.05]} />
          <meshStandardMaterial color="#FF8A6B" roughness={0.7} />
        </mesh>
        {[0.55, -0.35].map((y) => (
          <mesh key={y} position={[0, FLOOR_Y + 1.2 + y, 0.075]}>
            <boxGeometry args={[0.8, 0.7, 0.02]} />
            <meshStandardMaterial color="#FF9A7D" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0.42, FLOOR_Y + 1.15, 0.1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#F2B936" metalness={1} roughness={0.25} />
        </mesh>
      </group>
      <Plaque title="Reception" subtitle="Check-in 8am – 8pm" color="#FF6B4A" width={1.1} height={0.34} position={[-4.3, FLOOR_Y + 2.85, BACK_Z + 0.03]} />

      {/* leash hooks */}
      <group position={[-2.85, 0.6, BACK_Z + 0.03]}>
        <mesh>
          <boxGeometry args={[0.9, 0.1, 0.05]} />
          <meshStandardMaterial color={wood} roughness={0.7} />
        </mesh>
        {[
          [-0.3, '#FF6B4A'],
          [0, '#3DD9B3'],
          [0.3, '#8B7CF6'],
        ].map(([x, c]) => (
          <group key={x} position={[x, -0.05, 0.05]}>
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[0.035, 0.6, 0.012]} />
              <meshStandardMaterial color={c} roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.06, 0.015, 8, 20]} />
              <meshStandardMaterial color={c} roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* waiting bench */}
      <group position={[-6.4, FLOOR_Y, BACK_Z + 0.35]}>
        <RoundedBox args={[1.8, 0.12, 0.5]} radius={0.04} position={[0, 0.48, 0]} castShadow>
          <meshStandardMaterial color={wood} roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[1.7, 0.1, 0.44]} radius={0.05} position={[0, 0.59, 0]}>
          <meshStandardMaterial color="#FFB547" roughness={1} />
        </RoundedBox>
        {[-0.8, 0.8].map((x) => (
          <mesh key={x} position={[x, 0.22, 0]}>
            <boxGeometry args={[0.08, 0.44, 0.42]} />
            <meshStandardMaterial color={wood} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* second window + gallery frames */}
      <Window position={[-8.6, 0.75, BACK_Z + 0.01]} />
      {[
        [-6.9, 1.0, 0.55, 0.7],
        [-6.1, 1.15, 0.45, 0.45],
      ].map(([x, y, w, h]) => (
        <group key={x} position={[x, y, BACK_Z + 0.03]}>
          <mesh>
            <boxGeometry args={[w + 0.08, h + 0.08, 0.04]} />
            <meshStandardMaterial color={wood} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial color={x < -6.5 ? '#FFE3D3' : '#DDEFE4'} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <Plant position={[-10.6, FLOOR_Y, BACK_Z + 0.5]} scale={1.3} />
      <Plant position={[-5.2, FLOOR_Y, BACK_Z + 0.45]} scale={0.8} />
    </group>
  );
}

/** Everything except the pets themselves. `perch` = parrot position (top of bar). */
export default function HostelRoom({ dog, cat, bunny, perch }) {
  return (
    <group>
      <Floor />
      <Walls />
      <Window position={[-1.35, 0.75, BACK_Z + 0.01]} />
      <SunPatch position={[-0.9, FLOOR_Y + 0.004, -0.6]} />
      <Rug position={[dog[0] + 0.2, FLOOR_Y + 0.006, dog[2] + 0.75]} radius={1.75} />
      <Plaque title="Wuffelune" subtitle="Pet hostel · est. 2019" width={1.5} height={0.46} position={[0.55, 1.45, BACK_Z + 0.03]} />
      <Plaque title="Bruno" subtitle="Garden suite · 01" color="#FF6B4A" width={0.72} height={0.25} position={[dog[0] + 0.45, 0.1, BACK_Z + 0.03]} />
      <WallArt />
      <Lobby />

      <DogSuite position={[dog[0], FLOOR_Y, dog[2]]} />
      <CatSuite position={[cat[0], FLOOR_Y, cat[2]]} />
      <CatTree position={[SIDE_X - 0.6, FLOOR_Y, -0.35]} />
      <BunnyPen position={[bunny[0], FLOOR_Y, bunny[2] - 0.05]} />
      <BirdPerch top={perch[1]} position={perch} />
      <Plant position={[-SIDE_X + 0.45, FLOOR_Y, BACK_Z + 0.5]} scale={1.15} />
    </group>
  );
}
