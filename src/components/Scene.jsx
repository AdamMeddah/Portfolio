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
import Arrow from "./Arrow.jsx";
import About from "./tabs/About.jsx";
import Blog from "./tabs/Blog.jsx";
import Experience from "./tabs/Experience.jsx";
import Projects from "./tabs/Projects.jsx";
import LaunchScreen from "./tabs/LaunchScreen.jsx";
import MainScreen from "./tabs/MainScreen.jsx";

export default function Scene({ onOffsetChange }) {
  // const scroll = useScroll();
  // const offset = scroll.offset * scroll.pages; //to go from 0 to 6
  const { camera } = useThree();
  const [isLoading, setIsLoading] = useState(true);
  const [allowInteraction, setAllowInteraction] = useState(false);
  const [TVFocus, setTVFocus] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [arrowClicked, setArrowclicked] = useState(false);
  const [targetRotationY, setTargetRotationY] = useState(camera.rotation.y);
  const [showTVContent, setShowTVContent] = useState(false); //handles the actual opacity transition
  const [shouldRenderTVContent, setShouldRenderTVContent] = useState(false); //handles the conditional rendering
  const [currentTab, setCurrentTab] = useState(null);
  const [user, setUser] = useState(null);
  const htmlRef = useRef();
  const tvMeshRef = useRef();

  const timerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAllowInteraction(true);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (zoomIn) {
      // when zooming in
      setShouldRenderTVContent(true);
      const showTimer = setTimeout(() => setShowTVContent(true), 200);
      return () => clearTimeout(showTimer);
    } else {
      // when zooming out
      setShowTVContent(false);
      const hideTimer = setTimeout(() => {
        setShouldRenderTVContent(false);
      }, 500); // wait for transition to be done
      return () => clearTimeout(hideTimer);
    }
  }, [zoomIn, isLoading]);

  //   const throttledCallback = useRef(
  //     _.throttle((offset) => {
  //       onOffsetChange(offset);
  //     }, 100)
  //   );

  function rotateCamera() {
    setTargetRotationY((prev) => prev - 2.5);
    setArrowclicked(true);
  }

  useFrame(() => {
    if (arrowClicked) {
      camera.rotation.y = THREE.MathUtils.lerp(
        camera.rotation.y,
        targetRotationY,
        0.03 // smaller = slower, bigger = faster
      );
    }

    const TVPos = new THREE.Vector3(4.33, 5.5, -5); //changed the y pos slightly from the actual mesh
    const defaultCamPos = new THREE.Vector3(0, 5, 5); // same Y as TV, so aligned vertically
    const zoomTarget = new THREE.Vector3(TVPos.x, TVPos.y, TVPos.z + 0.5);

    if (zoomIn) {
      // Move camera close to TV

      camera.position.lerp(zoomTarget, 0.1);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 30, 0.1);
      camera.lookAt(TVPos);

      const distance = camera.position.distanceTo(zoomTarget);
    } else {
      if (!arrowClicked) {
        // move camera back but still look at TV pos (not origin)
        camera.position.lerp(defaultCamPos, 0.1);
        camera.fov = THREE.MathUtils.lerp(camera.fov, 80, 0.1);
        camera.lookAt(TVPos); // keep looking at TV pos
      }
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

  //   const [transformations, setTransformations] = useState(
  //     pageData.map(() => ({
  //       //mapping in order to match however many pageData elements
  //       rotation: [0, 0, 0],
  //       scale: [1, 1, 1],
  //     }))
  //   );
  return (
    <>
      <Environment
        files="/hdris/fireplace.hdr"
        background
        resolution={512}
        backgroundRotation={[0, 2.2, 0]}
        backgroundIntensity={0.4} // optional intensity factor (default: 1, only works with three 0.163 and up)
      />

      <ambientLight intensity={1.5} />

      <spotLight
        position={[4, 5, -3]}
        angle={0.3}
        intensity={2}
        penumbra={1}
        castShadow
      />

      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <TVStaticScreen
        handleTVFocus={setTVFocus}
        TVFocus={TVFocus}
        zoomIn={zoomIn}
        handleZoomIn={setZoomIn}
        allowInteraction={allowInteraction}
      />

      <Arrow
        position={[4, 5.5, 3]}
        rotation={[4, 3.5, 1.8]}
        conePos={[0, 0.6, 0]}
        handler={rotateCamera}
      />

      <mesh position={[4.33, 5.5, -5]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />

        {shouldRenderTVContent && (
          <Html
            ref={htmlRef}
            distanceFactor={0.25}
            position={[0, 0, -0.01]}
            center
            zIndexRange={[100, 0]}
            style={{
              opacity: showTVContent ? 1 : 0,
              pointerEvents: showTVContent ? "auto" : "none",
            }}
          >
            {!currentTab && (
              <LaunchScreen setCurrentTab={setCurrentTab} setUser={setUser} />
            )}

            {currentTab && <MainScreen user={user} />}
          </Html>
        )}
      </mesh>
    </>
  );
}
