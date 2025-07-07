import { useState, useEffect } from "react";

import Scene from "./components/Scene.jsx";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="canvas-container">
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 100] }}>
        <ambientLight />
        <Scene scrollPos={scrollPosition} />
      </Canvas>
    </div>
  );
}

export default App;
