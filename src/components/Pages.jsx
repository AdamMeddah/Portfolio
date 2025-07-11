import { useRef, useEffect, useState } from "react";
import { Html, Text3D, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import * as THREE from "three";

export function Page({
  position,
  color,
  dimensions,
  rotation,
  scale,
  hasGrid,
  text,
  className,
  image,
}) {
  const [width, height, depth] = dimensions;

  return (
    // Group rotates around center but contains a mesh offset to the right

    <group position={position} rotation={rotation} scale={scale}>
      {/* Shift mesh so that it rotates from the right edge like an actual book. width/2 since it'll move the units on the right of the rectangle*/}
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={dimensions} />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          //   polygonOffset
          //   polygonOffsetFactor={1}
          //   polygonOffsetUnits={1}
        />
      </mesh>

      {
        <Html
          position={[width / 2 + position[0], position[1], position[2]]}
          center
          style={{
            pointerEvents: "none",
            width: `${width * 100}px`,
            height: `${height * 100}px`,
          }}
        >
          <div style={{ color: "red" }}>{text}</div>
        </Html>
      }
    </group>
  );
}
