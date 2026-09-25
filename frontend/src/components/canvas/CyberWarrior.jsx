import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, PerspectiveCamera, OrbitControls, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { rand01 } from "../../utils/deterministic";

/**
 * CYBER_REIGN WARRIOR — Gaming 3D Model
 * Optimized for 60fps smooth play on mid devices
 * Procedural warrior built from primitives (no heavy GLTF)
 * Gritty, dark, neon katana with energy emissive
 */

function WarriorModel({ onAttack, onMove }) {
  const groupRef = useRef();
  const katanaRef = useRef();
  const visorRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [attacking, setAttacking] = useState(false);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const pos = useRef({ x: 0, z: 0 });
  useCursor(hovered);

  const triggerAttack = useCallback(() => {
    if (attacking) return;
    setAttacking(true);
    onAttack?.();
    if (katanaRef.current) {
      const startRot = katanaRef.current.rotation.x;
      katanaRef.current.rotation.x = -0.9;
      setTimeout(() => {
        if (katanaRef.current) katanaRef.current.rotation.x = startRot;
        setAttacking(false);
      }, 220);
    } else {
      setTimeout(() => setAttacking(false), 220);
    }
  }, [attacking, onAttack]);

  // Keyboard controls — WASD to move warrior (playable)
  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", " "].includes(k)) {
        e.preventDefault();
        if (k === " ") {
          triggerAttack();
        } else {
          keys.current[k] = true;
        }
      }
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(k)) keys.current[k] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [triggerAttack]);

  // Track mouse for parallax (cursor-follow) + keyboard movement
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    // Keyboard movement — 1.8 units/sec
    const speed = 1.9 * delta;
    if (keys.current.w) pos.current.z -= speed;
    if (keys.current.s) pos.current.z += speed;
    if (keys.current.a) pos.current.x -= speed;
    if (keys.current.d) pos.current.x += speed;
    // clamp to arena ring (radius ~1.35)
    const dist = Math.hypot(pos.current.x, pos.current.z);
    if (dist > 1.35) {
      const ang = Math.atan2(pos.current.z, pos.current.x);
      pos.current.x = Math.cos(ang) * 1.35;
      pos.current.z = Math.sin(ang) * 1.35;
    }
    if (pos.current.x !== 0 || pos.current.z !== 0) onMove?.(pos.current);

    // Mouse influence — smooth lerp + keyboard pos
    const targetRotY = state.pointer.x * 0.38;
    const targetRotX = state.pointer.y * -0.14;
    if (groupRef.current) {
      const baseY = Math.sin(t * 0.22) * 0.09;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseY + targetRotY, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
      groupRef.current.position.y = Math.sin(t * 0.9) * 0.05;
      // Lerp to keyboard position + subtle mouse offset
      const targetX = pos.current.x + state.pointer.x * 0.12;
      const targetZ = pos.current.z + state.pointer.y * 0.06;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.09);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.09);
    }
    if (katanaRef.current && !attacking) {
      katanaRef.current.rotation.z = Math.sin(t * 1.1) * 0.04 + state.pointer.x * 0.06;
    }
    if (visorRef.current) {
      const pulse = 0.58 + Math.sin(t * 2.2) * 0.2 + (hovered ? 0.2 : 0);
      visorRef.current.material.emissiveIntensity = pulse;
      visorRef.current.material.color.set(hovered ? "#ff3b30" : "#00eefc");
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.25, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={triggerAttack}
    >
      {/* Base neon ring — arena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
        <ringGeometry args={[1.15, 1.28, 64]} />
        <meshStandardMaterial color="#8ff5ff" emissive="#00eefc" emissiveIntensity={1.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, 0]}>
        <ringGeometry args={[1.45, 1.48, 64]} />
        <meshStandardMaterial color="#d674ff" emissive="#9800d0" emissiveIntensity={0.55} side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>

      {/* Legs */}
      <group position={[0, -0.75, 0]}>
        {[-0.22, 0.22].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 0.18, 0]}>
              <capsuleGeometry args={[0.11, 0.42, 8, 16]} />
              <meshStandardMaterial color="#0f1115" roughness={0.55} metalness={0.65} />
            </mesh>
            {/* Knee pad */}
            <mesh position={[0, 0.08, 0.09]}>
              <boxGeometry args={[0.16, 0.14, 0.08]} />
              <meshStandardMaterial color="#1a1f2b" emissive="#8ff5ff" emissiveIntensity={0.18} metalness={0.8} roughness={0.35} />
            </mesh>
            {/* Shin guard */}
            <mesh position={[0, -0.18, 0.04]}>
              <boxGeometry args={[0.13, 0.38, 0.07]} />
              <meshStandardMaterial color="#0e0e0e" metalness={0.7} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Torso */}
      <mesh position={[0, -0.02, 0]}>
        <capsuleGeometry args={[0.28, 0.52, 8, 16]} />
        <meshStandardMaterial color="#0f1115" roughness={0.42} metalness={0.75} />
      </mesh>
      {/* Chest armor */}
      <mesh position={[0, 0.12, 0.16]}>
        <boxGeometry args={[0.48, 0.36, 0.14]} />
        <meshStandardMaterial color="#151921" emissive="#8ff5ff" emissiveIntensity={0.12} metalness={0.82} roughness={0.28} />
      </mesh>
      {/* Chest neon stripe */}
      <mesh position={[0, 0.12, 0.24]}>
        <boxGeometry args={[0.04, 0.26, 0.02]} />
        <meshStandardMaterial color="#8ff5ff" emissive="#00eefc" emissiveIntensity={2.1} />
      </mesh>
      {/* Shoulder pauldrons */}
      {[-0.36, 0.36].map((x) => (
        <group key={x} position={[x, 0.18, 0]}>
          <mesh>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#1a1f2b" metalness={0.78} roughness={0.3} emissive="#d674ff" emissiveIntensity={0.09} />
          </mesh>
          <mesh position={[x > 0 ? 0.06 : -0.06, 0, 0]}>
            <boxGeometry args={[0.04, 0.12, 0.04]} />
            <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      {/* Arms */}
      {[-0.52, 0.52].map((x) => (
        <group key={x} position={[x, -0.06, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <capsuleGeometry args={[0.08, 0.34, 6, 12]} />
            <meshStandardMaterial color="#0f1115" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.07, 0.24, 6, 12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.5} />
          </mesh>
          {/* Glove */}
          <mesh position={[0, -0.34, 0]}>
            <sphereGeometry args={[0.095, 12, 12]} />
            <meshStandardMaterial color="#1a1f2b" emissive={x > 0 ? "#ff3b30" : "#8ff5ff"} emissiveIntensity={0.45} metalness={0.75} />
          </mesh>
        </group>
      ))}

      {/* Head */}
      <group position={[0, 0.52, 0]}>
        <mesh>
          <sphereGeometry args={[0.21, 24, 24]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.35} metalness={0.72} />
        </mesh>
        {/* Visor — pulsing */}
        <mesh ref={visorRef} position={[0, 0.02, 0.14]} rotation={[0.04, 0, 0]}>
          <boxGeometry args={[0.32, 0.09, 0.05]} />
          <meshStandardMaterial color="#8ff5ff" emissive="#00eefc" emissiveIntensity={0.95} metalness={0.4} roughness={0.2} />
        </mesh>
        {/* Top crest */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.16]} />
          <meshStandardMaterial color="#8ff5ff" emissive="#8ff5ff" emissiveIntensity={0.9} />
        </mesh>
        {/* Side vents */}
        {[-0.12, 0.12].map((z) => (
          <mesh key={z} position={[0.18, 0, z * 0.5]}>
            <boxGeometry args={[0.04, 0.06, 0.02]} />
            <meshStandardMaterial color="#d674ff" emissive="#d674ff" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>

      {/* Katana — right hand, neon edge */}
      <group ref={katanaRef} position={[0.64, -0.08, 0.12]} rotation={[0, 0, -0.28]}>
        {/* Handle */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.025, 0.028, 0.36, 10]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>
        {/* Guard */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.14, 0.03, 0.04]} />
          <meshStandardMaterial color="#1a1f2b" metalness={0.85} />
        </mesh>
        {/* Blade */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.03, 0.78, 0.008]} />
          <meshStandardMaterial color="#e8f5ff" emissive="#8ff5ff" emissiveIntensity={1.35} metalness={0.95} roughness={0.12} />
        </mesh>
        {/* Energy edge */}
        <mesh position={[0.012, 0.42, 0.012]}>
          <boxGeometry args={[0.008, 0.76, 0.005]} />
          <meshStandardMaterial color="#8ff5ff" emissive="#8ff5ff" emissiveIntensity={1.1} />
        </mesh>
        {/* Tip glow */}
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#8ff5ff" emissive="#8ff5ff" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Left forearm blade */}
      <group position={[-0.62, -0.12, 0.08]} rotation={[0, 0, 0.32]}>
        <mesh>
          <boxGeometry args={[0.02, 0.38, 0.01]} />
          <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#050508" roughness={0.95} metalness={0.08} />
      </mesh>
      <gridHelper args={[14, 14, "#1a3a4a", "#0b1218"]} position={[0, -1.14, 0]} />
    </>
  );
}

function Particles({ count = 420 }) {
  const pointsRef = useRef();
  // Seeded volume distribution — pure function of index, stable across re-renders.
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // volume around warrior, denser near base
      const r = rand01(i * 5) * 2.4 + 0.6;
      const theta = rand01(i * 5 + 1) * Math.PI * 2;
      const y = (rand01(i * 5 + 2) - 0.35) * 2.8;
      pos[i * 3] = Math.cos(theta) * r * (rand01(i * 5 + 3) * 0.6 + 0.4);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r * (rand01(i * 5 + 4) * 0.6 + 0.4);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.06;
    // gentle vertical drift
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = 0.42 + Math.sin(t * 0.7) * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#8ff5ff" sizeAttenuation transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function Rig() {
  // Keep for future idle subtle effects — OrbitControls now handles camera
  // This ensures cursor orbit is smooth without fighting controls
  return null;
}

function AdvancedDrones() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.35;
    ref.current.position.y = Math.sin(t * 0.7) * 0.12 - 0.55;
  });
  return (
    <group ref={ref} position={[0, -0.55, 0]}>
      {[0, 120, 240].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * 1.65;
        const z = Math.sin(rad) * 1.65;
        return (
          <group key={deg} position={[x, 0.25 + Math.sin(deg) * 0.08, z]}>
            <mesh>
              <octahedronGeometry args={[0.09, 0]} />
              <meshStandardMaterial color="#8ff5ff" emissive="#00eefc" emissiveIntensity={1.2} wireframe />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function CyberWarrior({ className = "w-full h-[520px] md:h-[620px]", autoRotate = true, enableZoom = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [slashCount, setSlashCount] = useState(0);

  return (
    <div className={`${className} relative select-none cursor-grab active:cursor-grabbing`}>
      <Canvas
        shadows
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
        camera={{ position: [0.9, 1.05, 3.45], fov: 34 }}
        frameloop="always"
        performance={{ min: 0.55 }}
        onPointerMissed={() => setIsDragging(false)}
      >
        {/* Lights — optimized */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
        <pointLight position={[-3, 1.2, -1]} intensity={1} color="#d674ff" distance={7} />
        <pointLight position={[2, 2, 2]} intensity={0.75} color="#8ff5ff" distance={6} />
        <spotLight position={[0, 4, 1.2]} angle={0.45} penumbra={0.6} intensity={1.15} color="#8ff5ff" castShadow />

        <Float speed={0.85} rotationIntensity={0.08} floatIntensity={0.18} floatingRange={[-0.03, 0.03]}>
          <WarriorModel onAttack={() => setSlashCount((s) => s + 1)} />
        </Float>

        <Particles count={420} />
        <AdvancedDrones />
        <Ground />
        <ContactShadows position={[0, -1.14, 0]} opacity={0.55} scale={10} blur={2.6} far={3.4} color="#040608" />
        <Environment preset="city" environmentIntensity={0.24} />
        <Rig />

        {/* CURSOR CONTROLS — fixed: enableZoom false so page scroll works */}
        <OrbitControls
          enableDamping
          dampingFactor={0.065}
          rotateSpeed={0.62}
          zoomSpeed={0.9}
          minDistance={2.2}
          maxDistance={5.2}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 1.95}
          enablePan={false}
          enableZoom={enableZoom}
          autoRotate={autoRotate && !isDragging}
          autoRotateSpeed={0.45}
          target={[0, -0.22, 0]}
          onStart={() => setIsDragging(true)}
          onEnd={() => setIsDragging(false)}
        />
      </Canvas>

      {/* Cursor hint — dynamic */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <span className={`px-2 py-1 text-[10px] font-black tracking-widest border backdrop-blur flex items-center gap-1 ${isDragging ? "bg-primary text-black border-primary" : "bg-black/70 text-primary border-primary/20"}`}>
          <span className="material-symbols-outlined text-xs">{isDragging ? "open_with" : "pan_tool"}</span>
          {isDragging ? "DRAGGING" : "DRAG TO ORBIT"}
        </span>
        <span className="hidden md:inline-flex px-2 py-1 bg-black/70 backdrop-blur border border-white/10 text-[10px] font-headline tracking-widest text-slate-400 items-center gap-1">
          <span className="material-symbols-outlined text-xs">mouse</span> SCROLL TO ZOOM • CLICK WARRIOR TO SLASH {slashCount > 0 && `• ${slashCount} SLASHES`}
        </span>
      </div>

      {/* Overlays — gaming badge */}
      <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none">
        <span className="px-2 py-1 bg-primary text-black text-[10px] font-black tracking-widest border border-white/10">CYBER</span>
        <span className="px-2 py-1 bg-black/70 backdrop-blur border border-white/10 text-[10px] font-headline tracking-widest text-slate-400">NEURAL • TACTICAL • COMPETITIVE</span>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
        <div className="hidden md:flex items-center gap-2 bg-black/68 backdrop-blur-xl border border-white/10 px-3 py-2">
          <span className={`w-2 h-2 rounded-full ${isDragging ? "bg-primary animate-ping" : "bg-green-500 animate-pulse"}`} />
          <span className="text-[10px] font-headline tracking-widest text-slate-400">
            {isDragging ? "CURSOR ACTIVE • ORBITING" : "60 FPS • ORBIT CONTROLS • DAMPING 0.065"}
          </span>
        </div>
        <div className="bg-primary/10 backdrop-blur-xl border border-primary/20 px-3 py-2">
          <p className="text-[10px] font-headline tracking-widest text-primary">CYBER_REIGN_WARRIOR • NEURAL PROTOCOL</p>
          <p className="text-[10px] text-slate-400">Cursor-follow • Click slash • 3 drones • 420 particles • OrbitControls</p>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none scanlines opacity-[0.06]" />
      {/* Subtle vignette to focus cursor */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
  );
}
