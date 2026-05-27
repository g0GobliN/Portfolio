import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Environment } from "@react-three/drei";
import { useRef } from "react";
import type * as THREE from "three";

function KnotMesh() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }, delta) => {
    ref.current.rotation.x += delta * 0.15;
    ref.current.rotation.y += delta * 0.2;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.15;
  });

  return (
    <mesh ref={ref} scale={1.6}>
      <torusKnotGeometry args={[1, 0.32, 220, 32]} />
      <MeshDistortMaterial
        color="#ff8a3d"
        emissive="#ff5a1f"
        emissiveIntensity={0.4}
        roughness={0.15}
        metalness={0.85}
        distort={0.35}
        speed={1.4}
      />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#0a0a12"]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffb070" />
      <pointLight position={[-4, -2, -2]} intensity={2} color="#28dcff" />
      <Float speed={1.2} floatIntensity={1} rotationIntensity={0.6}>
        <KnotMesh />
      </Float>
      <Sparkles count={70} scale={8} size={2} speed={0.4} color="#ffd9a8" />
      <Environment preset="city" />
    </Canvas>
  );
}
