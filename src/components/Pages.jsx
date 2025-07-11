import { useRef, useEffect, useState } from "react";
import { Text3D, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import * as THREE from "three";

export function Page({ position, color, dimensions, rotation, scale }) {
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
    </group>
  );
}

export function DoublePage() {
  return <h1>Boom</h1>;
}
