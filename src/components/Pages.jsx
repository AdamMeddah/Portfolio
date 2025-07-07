import { useRef, useEffect, useState } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function Page({ position, color, dimensions, rotation, scale }) {
  //   const boxRef = useRef();
  //   const [isHovered, setIsHovered] = useState(false);

  //   useFrame(() => {
  //     if (start < offset && offset < end) {
  //       boxRef.current.rotation.y = offset * 2;
  //     }
  //   });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function DoublePage() {
  return <h1>Boom</h1>;
}
