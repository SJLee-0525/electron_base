import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

const Galaxy = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 5000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      const spiral = radius * 0.3;

      const x = Math.cos(angle + spiral) * radius;
      const y = (Math.random() - 0.5) * 2;
      const z = Math.sin(angle + spiral) * radius;

      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.03} sizeAttenuation />
    </points>
  );
};

export default Galaxy;
