import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";

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

  // set video source based on TVFocus
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = TVFocus ? "/videos/black_fixed.mp4" : "/videos/static.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true; // prevent fullscreen popup on mobile
    video.play();
  }, [TVFocus]);

  // update video texture each frame
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
          {/* display click me text when not zoomed in */}
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
