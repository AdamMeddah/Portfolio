// App.jsx
import { useState, useEffect } from "react";
import Scene from "./components/Scene.jsx";
import { Canvas } from "@react-three/fiber";

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 10] }}>
          <ambientLight />
          <Scene scrollY={scrollY} />
        </Canvas>
      </div>

      {/* Scroll space */}
      <div style={{ height: "500vh" }} />
    </>
  );
}
