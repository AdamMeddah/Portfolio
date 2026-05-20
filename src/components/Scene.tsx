import { Environment, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import About from "./tabs/About";
import Blog from "./tabs/Blog";
import Projects from "./tabs/Projects";
import LaunchScreen from "./tabs/LaunchScreen";
import Contact from "./tabs/Contact";
import Skills from "./tabs/Skills";
import BlogDetail from "./tabs/BlogDetail";
import { TVStaticScreen } from "./TVStaticScreen";
import type { BlogPost, SetCurrentTab, SetUser, TabName } from "../types";

type SceneProps = {
  currentTab: TabName;
  setCurrentTab: SetCurrentTab;
  setUser: SetUser;
};

export default function Scene({
  currentTab,
  setCurrentTab,
  setUser,
}: SceneProps) {
  const { camera } = useThree();
  const [allowInteraction] = useState(true);
  const [TVFocus, setTVFocus] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [showTVContent, setShowTVContent] = useState(false);
  const [shouldRenderTVContent, setShouldRenderTVContent] = useState(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const htmlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 800);
  }, []);

  useEffect(() => {
    if (zoomIn) {
      setShouldRenderTVContent(true);
      const showTimer = window.setTimeout(() => setShowTVContent(true), 200);
      return () => window.clearTimeout(showTimer);
    }

    setShowTVContent(false);
    const hideTimer = window.setTimeout(() => {
      setShouldRenderTVContent(false);
    }, 500);
    return () => window.clearTimeout(hideTimer);
  }, [zoomIn]);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const TVPos = new THREE.Vector3(4.33, 5.5, -5);
    const defaultCamPos = new THREE.Vector3(0, 5, 5);
    const zoomTarget = new THREE.Vector3(TVPos.x, TVPos.y, TVPos.z + 0.5);

    if (zoomIn) {
      camera.position.lerp(zoomTarget, 0.1);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 30, 0.1);
      camera.lookAt(TVPos);
    } else {
      camera.position.lerp(defaultCamPos, 0.1);
      camera.fov = THREE.MathUtils.lerp(camera.fov, 80, 0.1);
      camera.lookAt(TVPos);
    }

    camera.updateProjectionMatrix();
  });

  return (
    <>
      <color attach="background" args={["black"]} />

      <Environment
        files="/hdris/fireplace.exr"
        background
        resolution={512}
        backgroundRotation={[0, 2.2, 0]}
        backgroundIntensity={0.4}
      />

      <ambientLight intensity={1.5} />
      <directionalLight position={[4.33, 10, -2]} intensity={2} castShadow={false} />
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
            <div
              className="tv-tab-shell"
              key={activePost ? `${currentTab}-${activePost.id}` : currentTab}
            >
              {currentTab === "profiles" && (
                <div className="launch-wrapper">
                  <LaunchScreen
                    setCurrentTab={setCurrentTab}
                    setUser={setUser}
                  />
                </div>
              )}

              {currentTab === "Contact Me" && <Contact />}
              {currentTab === "Projects" && <Projects />}
              {currentTab === "Blog" && !activePost && (
                <Blog setActivePost={setActivePost} />
              )}
              {currentTab === "Blog" && activePost && (
                <BlogDetail
                  post={activePost}
                  clearActivePost={() => setActivePost(null)}
                />
              )}
              {currentTab === "Skills" && <Skills />}
              {currentTab === "About" && <About />}
            </div>
          </Html>
        )}
      </mesh>
    </>
  );
}
