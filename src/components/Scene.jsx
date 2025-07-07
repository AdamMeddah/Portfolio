import { useRef, useEffect, useState } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Scene(props) {
  const scroll = useScroll();
  const boxRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    const y = scroll.offset; // between 0 and 1
    boxRef.current.rotation.y = y * Math.PI; // example animation
  });

  return (
    <>
      <OrbitControls enableZoom={false} enableRotate={false} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
      <mesh
        ref={boxRef}
        position={[0, 2, -10]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <boxGeometry args={[4, 6, 0.2]} />
        <meshStandardMaterial color="#c2a46f" />
      </mesh>
    </>
  );
}
