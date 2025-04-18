import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useGetConversations } from "@hooks/useGetConservations";
import useConversationsStore from "@stores/conservationsStore";

import GalaxyScene from "@pages/galaxy/GalaxyScene";
import InfoPanel from "@pages/galaxy/InfoPanel";

const Galaxy = () => {
  useGetConversations("1");
  const { conversations } = useConversationsStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(conversations.length * 3);
    for (let i = 0; i < conversations.length; i++) {
      const radius = Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      const spiral = radius * 0.3;
      const x = Math.cos(angle + spiral) * radius;
      const y = (Math.random() - 0.5) * 2;
      const z = Math.sin(angle + spiral) * radius;
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, [conversations]);

  const sizes = useMemo(() => {
    return new Float32Array(
      conversations.map((c, i) => {
        const baseSize = Math.min(c.totalEmails * 0.02 + 0.03, 0.15);
        return i === selectedIndex ? baseSize * 2 : baseSize;
      })
    );
  }, [conversations, selectedIndex]);

  const colors = useMemo(() => {
    return new Float32Array(
      conversations.flatMap((c) => {
        const t = Math.min(c.totalEmails / 10, 1); // 0~1 정규화
        const r = 1 - t;
        const g = 0.2;
        const b = t;
        return [r, g, b];
      })
    );
  }, [conversations]);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ flex: selectedIndex !== null ? 2 : 1, transition: "flex 0.3s ease" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight />
          <GalaxyScene
            positions={positions}
            sizes={sizes}
            onSelect={setSelectedIndex}
            names={conversations.map((c) => c.contactName)}
            colors={colors}
          />
          <OrbitControls />
        </Canvas>
      </div>
      {selectedIndex !== null && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <InfoPanel conversation={conversations[selectedIndex]} />
        </div>
      )}
    </div>
  );
};

export default Galaxy;
