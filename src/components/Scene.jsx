import { useRef, useEffect, useState } from "react";
import { Environment, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Html } from "@react-three/drei";
import { Page } from "./Pages";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import pageData from "../data/pageData.js";
import _ from "lodash";
import { TVStaticScreen } from "./TVStaticScreen.jsx";

export default function Scene({ onOffsetChange }) {
  const scroll = useScroll();
  const offset = scroll.offset * scroll.pages; //to go from 0 to 6
  const { camera } = useThree();
  const [TVFocus, setTVFocus] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);

  const [transformations, setTransformations] = useState(
    pageData.map(() => ({
      //mapping in order to match however many pageData elements
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    }))
  );

  const throttledCallback = useRef(
    _.throttle((offset) => {
      onOffsetChange(offset);
    }, 100)
  );

  useFrame(() => {
    const TVPos = new THREE.Vector3(4.33, 5.5, -5); //changed the y pos slightly from the actual mesh
    const defaultCamPos = new THREE.Vector3(0, 5, 5); // same Y as TV, so aligned vertically

    if (zoomIn) {
      // Move camera close to TV
      camera.position.lerp(
        new THREE.Vector3(TVPos.x, TVPos.y, TVPos.z + 0.5),
        0.1
      );
      camera.fov = THREE.MathUtils.lerp(camera.fov, 30, 0.1);
      camera.lookAt(TVPos);
    } else {
      // move camera back but still look at TV pos (not origin)
      camera.position.lerp(defaultCamPos, 0.1);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 80, 0.1);
      camera.lookAt(TVPos); // keep looking at TV pos
    }

    camera.updateProjectionMatrix();
    // textRotate.current += 0.03;
    // const targetZ = offset > 0.1 ? 0.1 : 10;
    // camera.position.z = Three.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    // const newTransformations = pageData.map((page) => {
    //   let progress = 0;
    //   let scale = 1;
    //   if (offset >= page.start && offset <= page.end) {
    //     progress = (offset - page.start) / (page.end - page.start); //linear normalization
    //   }
    //   if (offset > page.end) {
    //     progress = 1; //to keep it flipped
    //     if (page.cappedProgress && progress > page.cappedProgress) {
    //       progress = page.cappedProgress != null ? page.cappedProgress : 1;
    //     }
    //   }
    //   const rotationY = progress * Math.PI;
    //   return {
    //     rotation: [0, -rotationY, 0],
    //     scale: [scale, scale, scale],
    //   };
    // });
    // setTransformations(newTransformations);
    // throttledCallback.current(offset);
  });

  //   const pages = pageData.map((page, i) => {
  //     //remember don't use i for key
  //     return (
  //       <Page
  //         key={page.id}
  //         position={page.position}
  //         color={page.color}
  //         dimensions={page.dimensions}
  //         rotation={transformations[i]?.rotation} //chained comparison, makes sure transformations[i] actually exists, otherwise returning undefined
  //         scale={transformations[i]?.scale}
  //         text={page.text}
  //       />
  //     );
  //   });

  return (
    <>
      <Environment
        files="/hdris/fireplace.hdr"
        background
        resolution={512}
        backgroundRotation={[0, 2.2, 0]}
        backgroundIntensity={1.2} // optional intensity factor (default: 1, only works with three 0.163 and up)
      />

      <ambientLight intensity={2} />
      <directionalLight
        position={[5, 5, 5]}
        // castShadow
        intensity={1}
        // shadow-mapSize-width={1024}
        // shadow-mapSize-height={1024}
      />
      <TVStaticScreen
        handleTVFocus={setTVFocus}
        TVFocus={TVFocus}
        zoomIn={zoomIn}
        handleZoomIn={setZoomIn}
      />
      {/* {pages} */}
    </>
  );
}
