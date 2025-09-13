//main scene component - responsible for dynamically rendering all the Html sections as well as handling camera & environment lighting

//3d related imports (3js, r3f, drei, etc)
import { Environment, ScrollControls, Scroll } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Text3D, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

//react imports
import { useRef, useEffect, useState } from "react";

// component imports
import About from "./tabs/About.jsx";
import Blog from "./tabs/Blog.jsx";
import Projects from "./tabs/Projects.jsx";
import LaunchScreen from "./tabs/LaunchScreen.jsx";
import MainScreen from "./tabs/MainScreen.jsx";
import Contact from "./tabs/Contact.jsx";
import Skills from "./tabs/Skills.jsx";
import BlogDetail from "./tabs/BlogDetail.jsx";
import { TVStaticScreen } from "./TVStaticScreen.jsx";

export default function Scene({}) {
  const { camera } = useThree();
  const [isLoading, setIsLoading] = useState(false);
  const [allowInteraction, setAllowInteraction] = useState(true);
  const [TVFocus, setTVFocus] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [arrowClicked, setArrowclicked] = useState(false);
  const [targetRotationY, setTargetRotationY] = useState(camera.rotation.y);
  const [showTVContent, setShowTVContent] = useState(false); // handles opacity transition
  const [shouldRenderTVContent, setShouldRenderTVContent] = useState(false); // handles conditional rendering
  const [currentTab, setCurrentTab] = useState("profiles");
  const [user, setUser] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const htmlRef = useRef();
  const lastFrame = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 700); // scroll to middle
  }, []);

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");

    if (currentTab === "main") {
      // re-enable scroll
      canvasContainer.style.overflow = "auto";
      canvasContainer.style.height = "210vh"; // matches mainscreen content
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
      }, 500); // wait for transition
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

    const TVPos = new THREE.Vector3(4.33, 5.5, -5); // tv position
    const defaultCamPos = new THREE.Vector3(0, 5, 5); // default camera position
    const zoomTarget = new THREE.Vector3(TVPos.x, TVPos.y, TVPos.z + 0.5);

    if (zoomIn) {
      // move camera close to tv
      camera.position.lerp(zoomTarget, 0.1);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 30, 0.1);
      camera.lookAt(TVPos);
    } else {
      if (!arrowClicked) {
        // move camera back but still look at tv
        camera.position.lerp(defaultCamPos, 0.1);
        camera.fov = THREE.MathUtils.lerp(camera.fov, 80, 0.1);
        camera.lookAt(TVPos);
      }
    }

    camera.updateProjectionMatrix();
  });

  return (
    <>
      <color attach="background" args={["black"]} />

      {/* environment setup */}
      <Environment
        files="/hdris/fireplace.exr"
        background
        resolution={512}
        backgroundRotation={[0, 2.2, 0]}
        backgroundIntensity={0.4} // optional intensity factor
      />

      {/* lighting setup */}
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[4.33, 10, -2]} // above and slightly in front of tv
        intensity={2} // brighten enough
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

      {/* tv static screen */}
      <TVStaticScreen
        handleTVFocus={setTVFocus}
        TVFocus={TVFocus}
        zoomIn={zoomIn}
        handleZoomIn={setZoomIn}
        allowInteraction={allowInteraction}
      />

      {/* invisible mesh to hold html content */}
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
            {/* conditional rendering of tabs */}
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
