import { useEffect } from "react";
import { ScrollControls, Scroll } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function Scene({ scrollPos }) {
  return (
    <>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={scrollPos > 50 ? [4, 6, 0.2] : [5, 5, 0.2]} />
        <meshStandardMaterial color="#c2a46f" />
      </mesh>
    </>
  );
}
