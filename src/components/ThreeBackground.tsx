import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Environment, Float } from '@react-three/drei';

function AnimatedShape() {
  const meshRef = useRef<Mesh>(null!);
  
  useFrame((state) => {
    // Subtle rotation
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.6} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusGeometry args={[1.5, 0.35, 16, 50]} />
        <meshStandardMaterial
          color="#232323"
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      opacity: 0.7,
      pointerEvents: 'none'
    }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.3} />
        
        {/* Main directional light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Accent lights */}
        <pointLight position={[-5, -5, -5]} intensity={0.2} />
        <pointLight position={[5, -5, 5]} intensity={0.2} />

        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* Our animated shape */}
        <AnimatedShape />
      </Canvas>
    </div>
  );
} 