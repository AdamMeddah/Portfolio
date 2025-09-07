import { useRef, useEffect } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { Text3D } from "@react-three/drei";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

export function TVStaticScreen({
  TVFocus,
  handleTVFocus,
  zoomIn,
  handleZoomIn,
  allowInteraction,
}) {
  const meshRef = useRef();
  const videoRef = useRef(document.createElement("video"));
  const { camera } = useThree();
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (TVFocus) {
      video.src = "/videos/black.mp4";
    } else {
      video.src = "/videos/static.mp4";
    }
    video.loop = true;
    video.muted = true;
    video.playsInline = true; // stop fullscreen popup on mobile
    video.play();
  }, [TVFocus]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.map.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        position={[4.33, 5.5, -5]}
        onClick={() => {
          if (!allowInteraction || zoomIn) return;

          handleTVFocus(true);

          handleZoomIn(true);
        }}
      >
        <planeGeometry args={[2.3, 1.8]} />
        <meshBasicMaterial color="white">
          <videoTexture attach="map" args={[videoRef.current]} />
        </meshBasicMaterial>
      </mesh>

      {!zoomIn && (
        <>
          <Text3D
            font="fonts/Inter_Bold.json"
            size={0.3}
            position={[3.4, 5.35, -5]}
            rotation={[0, -0.2, 0]}
          >
            click
            <meshStandardMaterial color="black" />
          </Text3D>

          <Text3D
            font="fonts/Inter_Bold.json"
            size={0.3}
            position={[4.45, 5.35, -5]} // adjust X to create space
            rotation={[0, -0.2, 0]}
          >
            me
            <meshStandardMaterial color="black" />
          </Text3D>
        </>
      )}
    </>
  );
}
