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
  names: string[];
  pauseRotation: boolean;
  onSelect: (index: number) => void;
  onFocus: (clock: THREE.Clock) => void;
};

const GalaxyScene = ({ positions, sizes, names, colors, pauseRotation, onSelect, onFocus }: GalaxySceneProps) => {
  const pointsRef = useRef<THREE.Points>(null); // 대화 상대 별들
  const backgroundRef = useRef<THREE.Points>(null); // 배경 별들
  const labelRefs = useRef<Array<THREE.Object3D | null>>([]); // 이름 텍스트 객체들

  const backgroundParticleCount = 1000; // 배경 별들의 개수

  // 배경 별들의 3D 위치를 무작위로 생성하는 부분
  const backgroundPositions = useMemo(() => {
    const pos = new Float32Array(backgroundParticleCount * 3);

    for (let i = 0; i < backgroundParticleCount; i++) {
      const radius = Math.random() * 5 + 10; // 중심에서의 거리 (5~15 사이 랜덤)
      const angle = Math.random() * Math.PI * 2; // 원형 회전 각도 (0~2π)
      const spiral = radius * 0.4; // 은하수 회전 효과용 스파이럴 오프셋

      const x = Math.cos(angle + spiral) * radius; // X 좌표
      const y = (Math.random() - 0.5) * 6; // Y 좌표는 위아래로 퍼지게 (±3)
      const z = Math.sin(angle + spiral) * radius; // Z 좌표

      pos.set([x, y, z], i * 3); // 각 별의 위치를 pos 배열에 저장
    }

    return pos;
  }, []);

  // 매 프레임마다 별 회전 및 라벨 위치 업데이트, 배경 애니메이션 처리
  useFrame(({ clock }) => {
    rotateMainStars();
    updateLabels();
    animateBackground(clock);
    onFocus(clock); // 부드러운 카메라 포커싱 요청
  });

  // 주요 별 회전
  function rotateMainStars() {
    if (!pauseRotation && pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    } // 회전 중지 요청이 없을 때만 회전

    if (backgroundRef.current) {
      backgroundRef.current.rotation.y += 0.0005; // 배경 별은 느리게 회전
    }
  }

  // 각 라벨을 회전된 별 위치에 맞게 재배치
  function updateLabels() {
    if (!pointsRef.current) return;
    for (let i = 0; i < names.length; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const v = new THREE.Vector3(x, y, z);
      v.applyEuler(pointsRef.current.rotation); // 별의 회전값을 적용하여 위치 계산

      const label = labelRefs.current[i];
      if (label) {
        label.position.set(v.x, v.y + 0.3, v.z); // 텍스트는 별 위에 살짝 띄우기
      }
    }
  }

  // 배경 별 회전 + 반짝임 애니메이션
  function animateBackground(clock: THREE.Clock) {
    if (backgroundRef.current) {
      backgroundRef.current.rotation.y += 0.0005;

      const time = clock.getElapsedTime();
      const material = backgroundRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.7 + 0.3 * Math.sin(time * 1.0); // 시간에 따라 투명도 변화
    }
  }

  // 클릭한 별의 index를 외부로 전달
  function handleClick(event: ThreeEvent<PointerEvent>) {
    if (typeof event.index === "number") {
      onSelect(event.index);
    }
  }

  // 별 텍스처를 생성하는 유틸 함수로, 외부 입력을 통해 크기 및 색상을 지정 가능
  function createSpriteTexture({
    size = 128,
    fillStyle = "white",
  }: {
    size?: number;
    fillStyle?: string;
  }): THREE.Texture {
    const canvas = document.createElement("canvas"); // 캔버스 생성
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d")!; // 2D 컨텍스트 가져오기
    const center = size / 2; // 캔버스 중앙 좌표

    // 배경 원 그리기
    context.beginPath();
    context.arc(center, center, size * 0.4, 0, Math.PI * 2, true);
    context.fillStyle = fillStyle;
    context.fill();

    // 별의 중심을 기준으로 반짝이는 효과를 주기 위해 원을 그리기
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

    return texture;
  }

  const texture = useMemo(() => createSpriteTexture({}), []);

  // 이름 라벨 생성 (텍스트는 별 위에 표시됨)
  const nameLabels = names.map((name, i) => (
    <Text
      key={i}
      ref={(el) => (labelRefs.current[i] = el)}
      fontSize={0.2}
      color="skyblue"
      anchorX="center"
      anchorY="bottom"
    >
      {name}
    </Text>
  ));

  return (
    <>
      {nameLabels}
      {/* 대화 상대 별 파티클 */}
      <points ref={pointsRef} onPointerDown={handleClick}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          size={0.7} // 대화 상대 별 더 크게
          vertexColors
          transparent
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 배경 별 파티클 */}
      <points ref={backgroundRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[backgroundPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          size={0.05}
          transparent
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={1}
        />
      </points>
    </>
  );
};

export default GalaxyScene;
