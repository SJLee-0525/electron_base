import { useRef, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";

import * as THREE from "three";

// import vertexShader from "@pages/galaxy/shaders/vertexShader.glsl";
// import fragmentShader from "@pages/galaxy/shaders/fragmentShader.glsl";

type GalaxySceneProps = {
  positions: Float32Array;
  sizes: Float32Array;
  colors: Float32Array;
  onSelect: (index: number) => void;
  names: string[];
};

const GalaxyScene = ({ positions, sizes, onSelect, names, colors }: GalaxySceneProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  function handleClick(event: ThreeEvent<PointerEvent>) {
    if (typeof event.index === "number") {
      onSelect(event.index);
    }
  }

  function createSpriteTexture(): THREE.Texture {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d")!;
    const center = size / 2;

    context.beginPath();
    context.arc(center, center, size * 0.4, 0, Math.PI * 2, true);
    context.fillStyle = "white";
    context.fill();

    return new THREE.CanvasTexture(canvas);
  }

  const texture = useMemo(() => createSpriteTexture(), []);

  // 텍스트 위치 계산
  const nameLabels = names.map((name, i) => {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    return (
      <Text key={i} position={[x, y + 0.3, z]} fontSize={0.2} color="skyblue" anchorX="center" anchorY="bottom">
        {name}
      </Text>
    );
  });

  return (
    <>
      {nameLabels}
      <points ref={pointsRef} onClick={handleClick}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          size={0.3}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

export default GalaxyScene;
