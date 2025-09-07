import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import CustomLoader from "./components/CustomLoader";

import "./App.css";

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas shadows camera={{ fov: 80, position: [0, 1, 10] }}>
          {/* Suspense ensures loading fallback works */}
          <Suspense fallback={<CustomLoader />}>
            <Scene />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* This shows a default fullscreen progress bar while assets load */}
      <Loader />
    </>
  );
}

export default App;
