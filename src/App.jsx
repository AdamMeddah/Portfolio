import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import "./App.css";

function App() {
  return (
    <div id="canvas-container">
      <Canvas orthographic camera={{ zoom: 60, position: [0, -10, 120] }}>
        <ScrollControls pages={3} damping={0.1}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export default App;
