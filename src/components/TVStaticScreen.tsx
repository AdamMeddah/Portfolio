import { useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import * as THREE from "three";

type TVStaticScreenProps = {
  TVFocus: boolean;
  handleTVFocus: Dispatch<SetStateAction<boolean>>;
  zoomIn: boolean;
  handleZoomIn: Dispatch<SetStateAction<boolean>>;
  allowInteraction: boolean;
};

export function TVStaticScreen({
  TVFocus,
  handleTVFocus,
  zoomIn,
  handleZoomIn,
  allowInteraction,
}: TVStaticScreenProps) {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const videoRef = useRef(document.createElement("video"));

  const isVideoReady = () => videoRef.current?.readyState >= 2;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = TVFocus ? "/videos/black_ios.mp4" : "/videos/static_ios.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    return () => {
      video.pause();
      video.src = "";
    };
  }, [TVFocus]);

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
