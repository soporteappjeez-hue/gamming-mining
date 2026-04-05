import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Text, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { getComponentById } from '../../data/components';

// --- COMPONENTE 3D: Servidor/Minero ---
function ServerRack({ position, status, componentName, hashrate }: {
  position: [number, number, number];
  status: 'optimal' | 'hot' | 'critical';
  componentName: string;
  hashrate: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ledRef = useRef<THREE.Mesh>(null);

  const statusColor = useMemo(() => {
    switch (status) {
      case 'optimal': return '#4ade80';
      case 'hot': return '#f59e0b';
      case 'critical': return '#ef4444';
    }
  }, [status]);

  const statusEmissive = useMemo(() => {
    switch (status) {
      case 'optimal': return '#22c55e';
      case 'hot': return '#d97706';
      case 'critical': return '#dc2626';
    }
  }, [status]);

  // Animación de pulso del LED
  useFrame((state) => {
    if (ledRef.current) {
      const material = ledRef.current.material as THREE.MeshStandardMaterial;
      const pulse = status === 'critical'
        ? Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5
        : Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      material.emissiveIntensity = pulse * 3;
    }
  });

  return (
    <group position={position}>
      {/* Cuerpo principal del servidor */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2, 1]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Panel frontal con detalles */}
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[1.1, 1.8, 0.05]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Slots de GPU/ASIC en el frente */}
      {[0, 0.3, 0.6].map((yOffset, i) => (
        <mesh key={i} position={[0, yOffset - 0.3, 0.55]}>
          <boxGeometry args={[0.9, 0.15, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* LED principal de estado */}
      <mesh ref={ledRef} position={[0.4, 0.75, 0.55]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial
          emissive={statusEmissive}
          emissiveIntensity={2}
          color={statusColor}
        />
      </mesh>

      {/* LEDs secundarios (línea) */}
      <mesh position={[0, 0.75, 0.55]}>
        <boxGeometry args={[0.6, 0.03, 0.03]} />
        <meshStandardMaterial emissive={statusEmissive} emissiveIntensity={1} color={statusColor} />
      </mesh>

      {/* Tubos de refrigeración en la parte superior */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cableado (cables simples) */}
      <mesh position={[-0.5, -0.8, 0.3]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[0.5, -0.8, 0.3]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
    </group>
  );
}

// --- Rack que contiene los servidores ---
function MiningRack({ position, rackIndex, ownedComponents }: {
  position: [number, number, number];
  rackIndex: number;
  ownedComponents: { instanceId: string; componentId: string; isOverheating: boolean }[];
}) {
  const { averageTemperature } = useGameStore();

  // Componentes en este rack (8 slots max)
  const rackComponents = ownedComponents.slice(rackIndex * 8, (rackIndex + 1) * 8);

  return (
    <group position={position}>
      {/* Estructura del rack */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 5, 2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} transparent opacity={0.8} />
      </mesh>

      {/* Marco del rack */}
      <mesh position={[1.4, 0, 0]}>
        <boxGeometry args={[0.1, 5, 2]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1.4, 0, 0]}>
        <boxGeometry args={[0.1, 5, 2]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Label del rack */}
      <Html position={[-1.5, 2.3, 1]} rotation={[0, 0, 0]}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '4px 8px',
          borderRadius: '4px',
          color: '#4ade80',
          fontSize: '12px',
          fontFamily: 'monospace',
          border: '1px solid #334155'
        }}>
          RACK {rackIndex + 1}
        </div>
      </Html>

      {/* Servidores en el rack */}
      {rackComponents.map((comp, slotIndex) => {
        const component = getComponentById(comp.componentId);
        if (!component) return null;

        const temp = averageTemperature;
        let status: 'optimal' | 'hot' | 'critical' = 'optimal';
        if (temp > 90 || comp.isOverheating) status = 'critical';
        else if (temp > 70) status = 'hot';

        return (
          <ServerRack
            key={comp.instanceId}
            position={[0, 1.8 - slotIndex * 0.6, 0]}
            status={status}
            componentName={component.name}
            hashrate={component.hashrate}
          />
        );
      })}
    </group>
  );
}

// --- Suelo metálico con grid ---
function Floor() {
  return (
    <group>
      {/* Suelo principal */}
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Grid overlay */}
      <gridHelper
        args={[30, 30, '#1e3a5f', '#1e3a5f']}
        position={[0, -2.59, 0]}
      />

      {/* Círculo de luz bajo los racks */}
      <mesh position={[0, -2.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          color="#4ade80"
          emissive="#22c55e"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// --- Partículas de vapor/calor ---
function HeatParticles({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.01;
        if (positions[i * 3 + 1] > 6) {
          positions[i * 3 + 1] = -2;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// --- Iluminación de la escena ---
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Luz de acento cyan */}
      <pointLight position={[-5, 3, 0]} color="#06b6d4" intensity={2} distance={10} />
      {/* Luz de acento verde */}
      <pointLight position={[5, 3, 0]} color="#4ade80" intensity={2} distance={10} />
      {/* Luz de acento azul */}
      <pointLight position={[0, 5, 5]} color="#3b82f6" intensity={1} distance={15} />
    </>
  );
}

// --- Componente principal del Canvas 3D ---
export function MiningVisualization3D() {
  const { ownedComponents, averageTemperature, totalHashrate } = useGameStore();

  // Calcular racks activos (max 3 racks visibles)
  const activeRacks = Math.min(3, Math.max(1, Math.ceil(ownedComponents.length / 8)));

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden relative">
      {/* Gradiente de fondo */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: averageTemperature > 80
            ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.1) 0%, transparent 70%)'
            : averageTemperature > 60
            ? 'radial-gradient(circle at center, rgba(245, 158, 11, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(34, 197, 94, 0.05) 0%, transparent 70%)'
        }}
      />

      <Canvas shadows>
        {/* Cámara isométrica */}
        <OrthographicCamera
          makeDefault
          position={[15, 15, 15]}
          zoom={50}
          near={-100}
          far={100}
        />
        <OrbitControls
          enableZoom={true}
          enableRotate={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 4}
        />

        <Lighting />
        <Floor />

        {/* Racks de minería */}
        {Array.from({ length: activeRacks }).map((_, i) => (
          <MiningRack
            key={i}
            position={[(i - 1) * 4, 0, 0]}
            rackIndex={i}
            ownedComponents={ownedComponents}
          />
        ))}

        {/* Partículas de calor */}
        <HeatParticles count={30} />

        {/* Post-processing (bloom para el glow neón) */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={0.8}
          />
        </EffectComposer>
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-cyber-panel/90 backdrop-blur-sm rounded-lg p-4 border border-cyber-border z-20">
        <h3 className="text-lg font-bold text-cyber-accent flex items-center gap-2">
          🖥️ Sala de Minado 3D
        </h3>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-gray-400">Equipos: <span className="text-white">{ownedComponents.length}</span></p>
          <p className="text-gray-400">Hashrate: <span className="text-cyber-accent">{totalHashrate.toFixed(0)} H/s</span></p>
          <p className="text-gray-400">
            Temp: <span className={averageTemperature > 80 ? 'text-cyber-danger' : averageTemperature > 60 ? 'text-cyber-warning' : 'text-cyber-accent'}>
              {averageTemperature.toFixed(0)}°C
            </span>
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="absolute bottom-4 right-4 bg-cyber-panel/90 backdrop-blur-sm rounded-lg p-3 border border-cyber-border z-20">
        <p className="text-xs text-gray-400">🖱️ Arrastra para rotar | Scroll para zoom</p>
      </div>
    </div>
  );
}
