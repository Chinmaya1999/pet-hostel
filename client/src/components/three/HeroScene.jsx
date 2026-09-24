import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Lightformer, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Photoreal CC-BY-4.0 models and Mixkit sounds — full credits in /public/models/CREDITS.txt
export const STAGE_BG = '#FFE9D6';
const FLOOR_Y = -1.3;

/** The hostel's residents. `size` = longest side in world units; `rot` = yaw so each faces the camera nicely;
 *  `seat` = fraction of the model's height to sink below `pos` (for pets whose lowest point isn't their feet). */
export const PETS = [
  {
    id: 'dog', name: 'Bruno', breed: 'Labrador', url: '/models/labrador.glb', sound: '/sounds/dog-bark.mp3',
    bubble: 'Woof woof! 🐶', size: 2.9, pos: [-0.15, FLOOR_Y, -0.55], rot: -0.55, hop: 0.4, track: true,
  },
  {
    id: 'cat', name: 'Mochi', breed: 'Tabby cat', url: '/models/cat.glb', sound: '/sounds/cat-meow.mp3',
    bubble: 'Meow~ 🐱', size: 1.55, pos: [0.95, FLOOR_Y, 1.05], rot: -0.35, hop: 0.12, breathe: true,
  },
  {
    id: 'bunny', name: 'Pepper', breed: 'Bunny', url: '/models/bunny.glb', sound: '/sounds/bunny-squeak.mp3',
    bubble: 'Squeak! 🐰', size: 1.0, pos: [-1.3, FLOOR_Y, 1.0], rot: 1.97, hop: 0.35, breathe: true,
  },
  {
    id: 'parrot', name: 'Kiwi', breed: 'Macaw', url: '/models/parrot.glb', sound: '/sounds/bird-chirp.mp3',
    bubble: 'Chirp chirp! 🦜', size: 1.0, pos: [1.3, 0.55, -1.2], rot: -0.9, hop: 0.18, sway: true,
    seat: 0.545, // feet are ~55% up the model (the long tail hangs below them) — sink so they grip the perch
  },
];

function useSound(url) {
  const audio = useMemo(() => {
    const a = new Audio(url);
    a.preload = 'auto';
    a.volume = 0.7;
    return a;
  }, [url]);
  return useCallback(() => {
    audio.currentTime = 0;
    audio.play().catch(() => {}); // browsers allow audio after a user gesture — a click is one
  }, [audio]);
}

function Pet({ pet, muted, onReady }) {
  const outer = useRef();
  const inner = useRef();
  const hop = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [bubble, setBubble] = useState(0);
  const { scene, animations } = useGLTF(pet.url);
  const { actions, names } = useAnimations(animations, inner);
  const play = useSound(pet.sound);

  // Fit the model to `pet.size` and sit it on the floor.
  const { scale, offset, height } = useMemo(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = pet.size / Math.max(size.x, size.y, size.z);
    const sink = (pet.seat || 0) * size.y * s;
    return { scale: s, offset: [-center.x * s, -box.min.y * s - sink, -center.z * s], height: size.y * s - sink };
  }, [scene, pet.size, pet.seat]);

  useEffect(() => {
    const action = actions[names[0]];
    action?.reset().fadeIn(0.4).play();
    onReady?.(pet.id);
  }, [actions, names, onReady, pet.id]);

  useEffect(() => {
    const action = actions[names[0]];
    if (action) action.timeScale = hovered ? 1.5 : 1;
  }, [hovered, actions, names]);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(0), 1600);
    return () => clearTimeout(t);
  }, [bubble]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const g = outer.current;
    const [x, y] = pet.pos;

    // Turn a little toward the cursor (the dog most of all).
    const follow = pet.track ? 0.55 : 0.2;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pet.rot + state.pointer.x * follow, 0.05);

    // Idle life for models without a baked animation.
    const s = hovered ? 1.05 : 1;
    const breath = pet.breathe ? 1 + Math.sin(t * 2.2 + x) * 0.018 : 1;
    inner.current.scale.set(scale * s, scale * s * breath, scale * s);
    if (pet.sway) g.rotation.z = Math.sin(t * 1.6) * 0.05;

    // Hop on click.
    if (hop.current > 0) {
      hop.current = Math.max(0, hop.current - dt * 1.8);
      g.position.y = y + Math.sin((1 - hop.current) * Math.PI) * pet.hop;
    } else {
      g.position.y = THREE.MathUtils.lerp(g.position.y, y, 0.2);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (hop.current === 0) hop.current = 1;
    setBubble((n) => n + 1);
    if (!muted) play();
  };

  return (
    <group
      ref={outer}
      position={pet.pos}
      rotation={[0, pet.rot, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
    >
      <group ref={inner} position={offset} scale={scale}>
        <primitive object={scene} />
      </group>

      {(hovered || bubble > 0) && (
        <Html position={[0, height + 0.25, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          {bubble > 0 ? (
            <div key={bubble} className="animate-[float_1.4s_ease-out] rounded-2xl bg-white px-4 py-2 font-display text-lg font-bold whitespace-nowrap text-ink shadow-soft">
              {pet.bubble}
            </div>
          ) : (
            <div className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold whitespace-nowrap text-cream shadow-soft">
              {pet.name} · {pet.breed} 🔊
            </div>
          )}
        </Html>
      )}
    </group>
  );
}

/** Wooden perch for the parrot; `position` is the top of the bar. */
function Perch({ position }) {
  const top = position[1];
  const pole = top - FLOOR_Y;
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh position={[0, FLOOR_Y + pole / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.055, pole, 16]} />
        <meshStandardMaterial color="#8B5A3C" roughness={0.8} />
      </mesh>
      <mesh position={[0, top, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.8, 16]} />
        <meshStandardMaterial color="#8B5A3C" roughness={0.8} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 0.03, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.06, 32]} />
        <meshStandardMaterial color="#6E4530" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Round cushion bed under the dog. */
function DogBed({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.1, 48]} />
        <meshStandardMaterial color="#F4C7A6" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <torusGeometry args={[1.1, 0.13, 20, 64]} />
        <meshStandardMaterial color="#E8906B" roughness={1} />
      </mesh>
    </group>
  );
}

function TennisBall(props) {
  return (
    <group {...props}>
      <mesh>
        <sphereGeometry args={[0.13, 40, 40]} />
        <meshPhysicalMaterial color="#D4E83A" roughness={1} sheen={1} sheenRoughness={0.8} sheenColor="#F4FF9A" />
      </mesh>
      <mesh rotation={[0.5, 0.3, 0.2]}>
        <torusGeometry args={[0.131, 0.007, 10, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Full-screen gradient backdrop drawn by a shader: warm sun disc, slow dashed ring and a soft floor.
 * No textures (no Safari speckle) and fully opaque (the canvas never composites or flashes).
 */
function Backdrop() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uAspect: { value: 1 }, uTime: { value: 0 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }',
        fragmentShader: `
          varying vec2 vUv; uniform float uAspect; uniform float uTime;
          vec3 hex(float r, float g, float b){ return vec3(r, g, b) / 255.0; }
          void main(){
            vec3 bg = hex(255., 233., 214.);
            vec2 p = (vUv - vec2(0.5, 0.6)) * vec2(uAspect, 1.0);
            float d = length(p);
            vec3 col = mix(hex(255., 181., 71.), hex(255., 138., 92.), smoothstep(0.0, 0.26, d));
            col = mix(col, bg, smoothstep(0.24, 0.5, d));
            float ring = smoothstep(0.004, 0.0, abs(d - 0.36));
            float ang = atan(p.y, p.x) + uTime * 0.15;
            ring *= step(0.35, fract(ang * 6.0 / 6.2832));
            col = mix(col, vec3(1.0), ring * 0.7);
            float floorMask = smoothstep(0.36, 0.22, vUv.y);
            col = mix(col, hex(248., 214., 190.), floorMask * 0.75);
            gl_FragColor = vec4(col, 1.0);
          }`,
        depthWrite: false,
        depthTest: false,
      }),
    []
  );
  useFrame(({ size, clock }) => {
    material.uniforms.uAspect.value = size.width / size.height;
    material.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-1000} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

/** Soft blob shadows under each pet. */
function GroundShadows() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(80,40,20,0.5)');
    g.addColorStop(0.55, 'rgba(80,40,20,0.18)');
    g.addColorStop(1, 'rgba(80,40,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return PETS.map(({ id, pos, size }) => (
    <mesh key={id} rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], FLOOR_Y + 0.005, id === 'parrot' ? pos[2] : pos[2]]} scale={[size * 0.9, size * 0.5, 1]}>
      <circleGeometry args={[0.5, 40]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  ));
}

function Rig() {
  useFrame((state) => {
    const aspect = state.size.width / state.size.height;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, Math.max(5.9, 6.1 / aspect), 0.1);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.3, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.9 + state.pointer.y * 0.15, 0.04);
    state.camera.lookAt(0, -0.45, 0);
  });
  return null;
}

/** Studio light built from light-formers — nothing to download, so no loading flash. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 4, 1]} color="#FFF4E6" />
      <Lightformer form="rect" intensity={1.6} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#FFD9C2" />
      <Lightformer form="rect" intensity={1.2} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#D9E6FF" />
    </Environment>
  );
}

function Scene({ muted, onReady }) {
  const parrot = PETS.find((p) => p.id === 'parrot');
  return (
    <>
      <Backdrop />
      <Studio />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 6, 4]} intensity={1.5} />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#FFB08A" />

      <DogBed position={[-0.15, FLOOR_Y, -0.55]} />
      <Perch position={parrot.pos} />
      <TennisBall position={[0.05, FLOOR_Y + 0.13, 1.35]} />
      <GroundShadows />

      {PETS.map((pet) => (
        <Pet key={pet.id} pet={pet} muted={muted} onReady={onReady} />
      ))}
      <Rig />
    </>
  );
}

export default function HeroScene({ muted = false }) {
  const [loaded, setLoaded] = useState(() => new Set());
  const ready = loaded.size === PETS.length;
  const handleReady = useCallback((id) => setLoaded((s) => (s.has(id) ? s : new Set(s).add(id))), []);

  return (
    <div className="h-full w-full transition-opacity duration-700" style={{ opacity: ready ? 1 : 0, background: STAGE_BG }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 6.4], fov: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        onCreated={({ gl }) => gl.setClearColor(STAGE_BG, 1)}
        style={{ background: STAGE_BG }}
      >
        <Suspense fallback={null}>
          <Scene muted={muted} onReady={handleReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

PETS.forEach((p) => useGLTF.preload(p.url));
