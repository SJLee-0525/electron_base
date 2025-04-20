import { useMemo, useState, useRef, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useGetConversations } from "@hooks/useGetConservations";
import useConversationsStore from "@stores/conservationsStore";

import GalaxyScene from "@pages/galaxy/GalaxyScene";
import InfoPanel from "@pages/galaxy/InfoPanel";
import * as THREE from "three";

const Galaxy = () => {
  useGetConversations("1"); // 유저 ID: 대화 목록을 불러옴

  const { conversations } = useConversationsStore();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // 선택된 별 인덱스
  const [isTransitioning, setIsTransitioning] = useState(false); // 포커싱 중 여부

  const controlsRef = useRef<ThreeOrbitControls | null>(null); // OrbitControls 제어용 참조
  const transitionRef = useRef<{ start: number; from: THREE.Vector3; to: THREE.Vector3 } | null>(null);

  // 별 위치 설정 (0번 index는 나, 중심에 위치)
  const positions = useMemo(() => {
    const pos = new Float32Array((conversations.length + 1) * 3);
    pos.set([0, 0, 0], 0); // 내 별은 (0, 0, 0)에 위치

    for (let i = 0; i < conversations.length; i++) {
      const radius = Math.random() * 4 + 1; // 일정 범위 내 무작위 반지름
      const angle = Math.random() * Math.PI * 2; // 360도 회전 내 무작위 각도
      const spiral = radius * 0.3; // 소용돌이 느낌의 왜곡 값

      const x = Math.cos(angle + spiral) * radius;
      const y = (Math.random() - 0.5) * 2;
      const z = Math.sin(angle + spiral) * radius;

      pos.set([x, y, z], (i + 1) * 3); // 나 이후의 별들 위치 세팅
    }

    return pos;
  }, [conversations]);

  // 별 크기 설정 (내 별은 고정 크기, 선택된 별은 두 배 크기)
  const sizes = useMemo(() => {
    const all = new Float32Array(conversations.length + 1);
    all[0] = 0.3;

    conversations.forEach((c, i) => {
      const baseSize = Math.min(c.totalEmails * 0.02 + 0.03, 0.15); // 이메일 수 기반 크기
      all[i + 1] = i + 1 === selectedIndex ? baseSize * 2 : baseSize; // 선택되었으면 확대
    });

    return all;
  }, [conversations, selectedIndex]);

  // 별 색상 설정 (내 별은 노란색, 나머지는 이메일 수에 따라 빨~파 그라데이션)
  const colors = useMemo(() => {
    const myColor = [0.8, 1, 0]; // 노란색 (R, G, B)

    const rest = conversations.flatMap((c) => {
      const t = Math.min(c.totalEmails / 10, 1);
      const r = 1 - t;
      const g = 0.2;
      const b = t;

      return [r, g, b];
    });

    return new Float32Array([...myColor, ...rest]);
  }, [conversations]);

  // 별 선택 시 부드러운 포커싱 트리거 (Canvas 내부에서 처리해야 하므로 GalaxyScene으로 위임)
  const onFocusRequest = (clock: THREE.Clock) => {
    if (transitionRef.current && controlsRef.current) {
      const { start, from, to } = transitionRef.current;
      const elapsed = clock.getElapsedTime() * 1000; // ms
      const duration = 500; // transition에 걸리는 시간 (ms)
      const t = Math.min((elapsed - start) / duration, 1);

      controlsRef.current.target.lerpVectors(from, to, t);
      controlsRef.current.update();

      if (t >= 1) {
        transitionRef.current = null;
        setIsTransitioning(false);
      }
    }
  };

  // 별 선택 시 포커스 정보 설정
  useEffect(() => {
    if (selectedIndex === null || !controlsRef.current) return;
    const targetIndex = selectedIndex * 3;
    const to = new THREE.Vector3(positions[targetIndex], positions[targetIndex + 1], positions[targetIndex + 2]);
    const from = controlsRef.current.target.clone();
    transitionRef.current = { start: performance.now(), from, to };

    controlsRef.current.enableDamping = true; // 부드러운 포커싱을 위한 댐핑 활성화
    setIsTransitioning(true); // 포커싱 중 상태로 설정
  }, [selectedIndex, positions]);

  return (
    <div
      className="flex h-screen w-screen transition-all duration-500 ease-in-out bg-space-gradient"
      style={{
        background: "radial-gradient(ellipse at center, #0a0a1f 0%, #000000 100%)",
      }}
    >
      {/* Canvas 영역 */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          selectedIndex !== null && selectedIndex > 0 ? "w-[40vw]" : "w-[100vw]"
        }`}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight />
          <GalaxyScene
            positions={positions}
            sizes={sizes}
            names={["Me", ...conversations.map((c) => c.contactName)]}
            colors={colors}
            pauseRotation={isTransitioning} // 회전 일시정지를 위한 prop 전달
            onSelect={setSelectedIndex}
            onFocus={onFocusRequest} // 포커스 로직을 내부에서 실행
          />
          <OrbitControls ref={controlsRef} target={[0, 0, 0]} />
        </Canvas>
      </div>

      {/* InfoPanel 영역 */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          selectedIndex !== null && selectedIndex > 0
            ? "w-[60vw] opacity-100 translate-w-0"
            : "w-0 opacity-0 translate-y-full pointer-events-none"
        }`}
      >
        {selectedIndex !== null && selectedIndex > 0 && <InfoPanel conversation={conversations[selectedIndex - 1]} />}
      </div>
    </div>
  );
};

export default Galaxy;
