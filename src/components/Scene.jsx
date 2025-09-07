import { useRef, useEffect, useState } from "react";
import { Environment, ScrollControls, Scroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TVStaticScreen } from "./TVStaticScreen.jsx";

// Component Imports
import About from "./tabs/About.jsx";
import Blog from "./tabs/Blog.jsx";
import Projects from "./tabs/Projects.jsx";
import LaunchScreen from "./tabs/LaunchScreen.jsx";
import MainScreen from "./tabs/MainScreen.jsx";
import Contact from "./tabs/Contact.jsx";
import Skills from "./tabs/Skills.jsx";

import BlogDetail from "./tabs/BlogDetail.jsx";
export default function Scene({ onOffsetChange }) {
  // const scroll = useScroll();
  // const offset = scroll.offset * scroll.pages; //to go from 0 to 6
  const { camera } = useThree();
  const [isLoading, setIsLoading] = useState(false);
  const [allowInteraction, setAllowInteraction] = useState(true);
  const [TVFocus, setTVFocus] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [arrowClicked, setArrowclicked] = useState(false);
  const [targetRotationY, setTargetRotationY] = useState(camera.rotation.y);
  const [showTVContent, setShowTVContent] = useState(false); //handles the actual opacity transition
  const [shouldRenderTVContent, setShouldRenderTVContent] = useState(false); //handles the conditional rendering
  const [currentTab, setCurrentTab] = useState("profiles");
  const [user, setUser] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const htmlRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 800); // scroll to middle
  }, []);

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");

    if (currentTab === "main") {
      // re-enable scroll
      canvasContainer.style.overflow = "auto";
      canvasContainer.style.height = "210vh"; // matches content needed in mainscreen
    } else {
      // disable scroll
      canvasContainer.style.overflow = "hidden";
      canvasContainer.style.height = "100vh";
    }
  }, [currentTab]);

  useEffect(() => {
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
  });

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
      <directionalLight
        position={[4.33, 10, -2]} // place it above and slightly in front of the TV
        intensity={2} // brighten it enough
        castShadow={false}
      />

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
              backgroundColor: "transparent",
            }}
          >
            {currentTab === "profiles" && (
              <div className="launch-wrapper">
                <LaunchScreen setCurrentTab={setCurrentTab} setUser={setUser} />
              </div>
            )}

            {currentTab === "main" && (
              <MainScreen user={user} setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "Contact Me" && (
              <Contact user={user} setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "Projects" && (
              <Projects user={user} setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "Blog" && !activePost && (
              <Blog
                user={user}
                setCurrentTab={setCurrentTab}
                setActivePost={setActivePost}
              />
            )}

            {currentTab === "Blog" && activePost && (
              <BlogDetail
                user={user}
                post={activePost}
                setCurrentTab={setCurrentTab}
                clearActivePost={() => setActivePost(null)}
              />
            )}

            {currentTab === "Skills" && (
              <Skills user={user} setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "About" && (
              <About user={user} setCurrentTab={setCurrentTab} />
            )}
          </Html>
        )}
      </mesh>
    </>
  );
}
