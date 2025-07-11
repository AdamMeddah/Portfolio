import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import "./App.css";

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas
          shadows
          orthographic
          camera={{ zoom: 60, position: [0, -2, 120] }}
        >
          <ScrollControls pages={3} damping={0.1} distance={4}>
            <Scene />
          </ScrollControls>
        </Canvas>
      </div>
    </>
  );
}

export default App;
