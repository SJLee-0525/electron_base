import "@renderer/App.css";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Galaxy from "@pages/galaxy/Galaxy";

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <ambientLight />
      <Galaxy />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
