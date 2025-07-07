import { useRef, useEffect, useState } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Page, DoublePage } from "./Pages";

export default function Scene() {
  const scroll = useScroll();
  const offset = scroll.offset;

  const pageData = [
    {
      id: 1,
      dimensions: [4, 6, 0.2],
      start: 0,
      end: 0.4,
      color: "#c2a46f",
      position: [0, 2, -10],
    },

    {
      id: 2,
      dimensions: [4, 6, 0.2],
      start: 0.45,
      end: 0.6,
      color: "#ffffff",
      position: [0, 2, -10.2],
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
    const newTransformations = pageData.map((page) => {
      let progress = 0;
      if (offset >= page.start && offset <= page.end) {
        progress = (offset - page.start) / (page.end - page.start); //linear normalization
      }
      if (offset > page.end) {
        progress = 1; //to keep it flipped
      }

      const rotationY = (progress * Math.PI) / 2;

      const scale = 1 + 0.2 * progress;

      return {
        rotation: [0, rotationY, 0],
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
      />
    );
  });
  return (
    <>
      <OrbitControls enableZoom={false} enableRotate={false} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />

      {pages}
    </>
  );
}
