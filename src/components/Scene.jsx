import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Scene({ scrollY }) {
  const frontCoverRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (!frontCoverRef.current) return;

    const maxScroll = window.innerHeight * 5;
    const scrollFraction = Math.min(scrollY / maxScroll, 1);
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      <mesh ref={frontCoverRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 0.2]} />
        <meshStandardMaterial color="#c2a46f" />
      </mesh>
    </>
  );
}
