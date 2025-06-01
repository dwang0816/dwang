import { Canvas } from '@react-three/fiber';
import { Environment, SpotLight } from '@react-three/drei';
import { Globe } from './Globe';

export default function GlobeContainer() {
  return (
    <div style={{
      position: 'relative',
      width: '120px',
      height: '120px',
      margin: '20px auto',
      cursor: 'pointer',
    }}>
      {/* Expansion container that prevents cutoff */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        pointerEvents: 'none',
      }}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true }}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
          }}
        >
          {/* Ambient light for base illumination */}
          <ambientLight intensity={0.4} />
          
          {/* Main front light */}
          <SpotLight
            position={[0, 0, 5]}
            angle={0.6}
            penumbra={0.4}
            intensity={1.0}
            color="#ffffff"
            castShadow
          />

          {/* Environment for reflections */}
          <Environment preset="night" />
          
          {/* The globe */}
          <Globe />
        </Canvas>
      </div>
    </div>
  );
} 