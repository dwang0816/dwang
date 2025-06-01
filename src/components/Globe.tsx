import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { Mesh } from 'three';
import { useSpring, animated } from '@react-spring/three';

export function Globe() {
  const meshRef = useRef<Mesh>(null!);
  const wireframeRef = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  const { scale, rotationSpeed, wireframeOpacity } = useSpring({
    scale: hovered ? 1.1 : 1,
    rotationSpeed: hovered ? 0.01 : 0.002,
    wireframeOpacity: hovered ? 0.3 : 0.15,
    config: {
      tension: 300,
      friction: 30,
    }
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed.get();
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += rotationSpeed.get();
      wireframeRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <animated.group
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <Sphere args={[1, 12, 12]}>
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.2}
            roughness={0.5}
            transparent
            opacity={0.95}
          />
        </Sphere>
      </mesh>

      {/* Simple wireframe overlay */}
      <animated.mesh ref={wireframeRef}>
        <Sphere args={[1.005, 12, 12]}>
          <meshBasicMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={wireframeOpacity.get()}
          />
        </Sphere>
      </animated.mesh>
    </animated.group>
  );
} 