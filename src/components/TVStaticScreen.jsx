import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import * as THREE from "three";

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

  // helper to check if video is ready
  const isVideoReady = () => videoRef.current?.readyState >= 2;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // set source
    video.src = TVFocus ? "/videos/black.mp4" : "/videos/static.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    // attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // autoplay blocked, can handle fallback if needed
      });
    }

    return () => {
      video.pause();
      video.src = "";
    };
  }, [TVFocus]);

  // update texture in useFrame, but only if video is ready
  useFrame(() => {
    const video = videoRef.current;
    if (!meshRef.current || !video || !isVideoReady()) return;

    const material = meshRef.current.material;
    if (material.map) {
      material.map.needsUpdate = true;
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
            position={[4.45, 5.35, -5]}
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
