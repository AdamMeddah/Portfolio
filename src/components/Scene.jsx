import { useRef, useEffect, useState } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
import { Page, DoublePage } from "./Pages";
import { useThree } from "@react-three/fiber";
import * as Three from "three";

export default function Scene() {
  const scroll = useScroll();
  const offset = scroll.offset * scroll.pages; //to go from 0 to 6
  const { camera } = useThree();
  const textRotate = useRef(0);
  const pageData = [
    {
      id: 1,
      dimensions: [4, 6, 0.2],
      start: 0,
      end: 0.4,
      color: "#c2a46f",
      position: [0, 0, -10],
      text: "",
      hasGrid: false,
    },

    {
      id: 2,
      dimensions: [4, 6, 0.2],
      start: 0.5,
      end: 0.9,
      color: "#ffffff",
      position: [0, 0, -10.001],
      cappedProgress: 0.99, //so it doesn't clip back into the first one
      text: "Hi! I'm Adam Meddah.",
      hasGrid: false,
    },

    {
      id: 3,
      dimensions: [4, 6, 0.2],
      start: 1,
      end: 1.5,
      color: "#ffffff",
      position: [0, 0, -10.002],
      text: "Projects",
      hasGrid: true,
    },
    {
      id: 4,
      dimensions: [4, 6, 0.2],
      start: 1.6,
      end: 2.0,
      color: "#ffffff",
      position: [0, 0, -10.003],
      text: "Other work",
      hasGrid: false,
    },
    {
      id: 5,
      dimensions: [4, 6, 0.2],
      start: 2.1,
      end: 2.5,
      color: "#ffffff",
      position: [0, -0, -10.004],
      text: "Boom",
      hasGrid: false,
    },

    {
      id: 6,
      dimensions: [4, 6, 0.2],
      start: 2.6,
      end: 3.0,
      color: "#ffffff",
      position: [0, 0, -10.005],
      text: "Love",
      hasGrid: false,
    },
  ];

  const [transformations, setTransformations] = useState(
    pageData.map(() => ({
      //mapping in order to match however many pageData elements
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    }))
  );

  useFrame(() => {
    textRotate.current += 0.03;

    const targetZoom = offset > 0.1 ? 130 : 60;
    camera.zoom = Three.MathUtils.lerp(camera.zoom, targetZoom, 0.1);
    camera.updateProjectionMatrix();

    const newTransformations = pageData.map((page) => {
      let progress = 0;
      let scale = 1;
      if (offset >= page.start && offset <= page.end) {
        progress = (offset - page.start) / (page.end - page.start); //linear normalization
      }
      if (offset > page.end) {
        progress = 1; //to keep it flipped
        if (page.cappedProgress && progress > page.cappedProgress) {
          progress = page.cappedProgress != null ? page.cappedProgress : 1;
        }
      }

      const rotationY = progress * Math.PI;

      return {
        rotation: [0, -rotationY, 0],
        scale: [scale, scale, scale],
      };
    });

    setTransformations(newTransformations);
  });

  const pages = pageData.map((page, i) => {
    //remember don't use i for key
    return (
      <Page
        key={page.id}
        position={page.position}
        color={page.color}
        dimensions={page.dimensions}
        rotation={transformations[i]?.rotation} //chained comparison, makes sure transformations[i] actually exists, otherwise returning undefined
        scale={transformations[i]?.scale}
        text={page.text}
        className={`page-text page-${page.id}`} //two different classes applied
      />
    );
  });

  return (
    <>
      <OrbitControls enableZoom={false} enableRotate={false} />
      <ambientLight intensity={1} />
      <directionalLight
        position={[5, 5, 5]}
        castShadow
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <mesh
        receiveShadow
        castShadow
        position={[0, 5, 0]}
        rotation={[textRotate.current, textRotate.current, textRotate.current]}
      >
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.5}
          height={0.2}
          color="#ffffff"
          //   shadow-mapSize-width={1024}
          //   shadow-mapSize-height={1024}
        >
          Hello World
          <meshStandardMaterial color="white" />
        </Text3D>
      </mesh>

      {pages}
    </>
  );
}
