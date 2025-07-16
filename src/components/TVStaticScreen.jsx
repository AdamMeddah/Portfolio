import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useThree } from "@react-three/fiber";

export function TVStaticScreen({
  TVFocus,
  handleTVFocus,
  zoomIn,
  handleZoomIn,
}) {
  const meshRef = useRef();
  const videoRef = useRef(document.createElement("video"));
  const { camera } = useThree();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (TVFocus) {
      video.src = "/videos/white.mp4";
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
          handleTVFocus(!TVFocus);

          if (zoomIn) {
            handleZoomIn(!zoomIn);
          } else {
            //only want delay when entering, not when exiting.
            setTimeout(() => handleZoomIn(!zoomIn), 200);
          }
        }}
      >
        <planeGeometry args={[2.3, 1.8]} />
        <meshBasicMaterial color="white">
          <videoTexture attach="map" args={[videoRef.current]} />
        </meshBasicMaterial>
      </mesh>
    </>
  );
}
