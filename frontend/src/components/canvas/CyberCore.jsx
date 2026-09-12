import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Animated Torus Knot - cyber core
function Core({ color = "#8ff5ff" }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.2}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 800 }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8ff5ff" sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

function GridHelper() {
  return <gridHelper args={[20, 20, "#1a3a4a", "#0f1f2a"]} position={[0, -2, 0]} />;
}

export default function CyberCore({ className = "w-full h-[400px] md:h-[500px]" }) {
  return (
    <div className={`${className} relative`}>
      <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#8ff5ff" />
        <pointLight position={[-5, -2, -5]} intensity={0.8} color="#d674ff" />
        <Core />
        <Particles />
        <GridHelper />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
        <Environment preset="city" />
      </Canvas>
      {/* overlay scanline */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-10" />
    </div>
  );
}
