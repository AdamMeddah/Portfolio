import { Environment, Html } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import About from "./tabs/About";
import Blog from "./tabs/Blog";
import LaunchScreen from "./tabs/LaunchScreen";
import Contact from "./tabs/Contact";
import Skills from "./tabs/Skills";
import BlogDetail from "./tabs/BlogDetail";
import { TVStaticScreen } from "./TVStaticScreen";
import { ProjectPosters } from "./ProjectPosters";
import {
  WALL_ORIGIN,
  WALL_RIGHT,
  posterPlacement,
  posterWorldPosition,
} from "../scene/posterWall";
import type { MutableRefObject } from "react";
import type { LookState } from "./LookControls";
import type { BlogPost, SetCurrentTab, SetUser, TabName } from "../types";

type SceneProps = {
  currentTab: TabName;
  setCurrentTab: SetCurrentTab;
  setUser: SetUser;
  /* true once the loader has handed over, so the opening move isn't wasted */
  revealed: boolean;
  look: MutableRefObject<LookState>;
  /* lives in App so the chrome outside the canvas can react to it too */
  tvOpen: boolean;
  openTV: () => void;
  focusedProject: string | null;
  setFocusedProject: (id: string | null) => void;
};

const TV_POSITION = new THREE.Vector3(4.33, 5.5, -5);

/*
  The camera never translates while the room is on screen, and that is load
  bearing rather than laziness. The room is an environment map painted at
  infinity while the TV screen is a real plane a few units away, so any camera
  movement parallaxes the screen off the painted set it is meant to sit in.
  Pure rotation shifts near and far by exactly the same amount, so the picture
  stays welded to the bezel. The opening move is therefore a lens move - the
  field of view narrows while the aim swings onto the TV.
*/
const CAMERA_ANCHOR = new THREE.Vector3(0, 5, 5);

/* the establishing shot starts wide, aimed away from the set */
const INTRO_AIM_OFFSET = new THREE.Vector3(-6.5, -1.6, 0);
const INTRO_FOV_FROM = 104;
const INTRO_FOV_TO = 80;
const INTRO_SECONDS = 4;

/* how far the edge controls may swing the aim once the opening move settles */
const DRIFT_TARGET = 3.4;
/* seconds to sweep from centre to a full turn */
const PAN_SPEED = 0.85;

const ZOOM_FOV = 30;

/* the poster wall: framed whole, then tightened onto a single sheet */
const WALL_FOV = 34;
/* the panel eats the right of the frame, so only this much is clear for art */
const CLEAR_WIDTH = 0.62;
/* how far along the wall the edge controls may slide the framing */
const WALL_PAN = 2.4;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Scene({
  currentTab,
  setCurrentTab,
  setUser,
  revealed,
  look,
  tvOpen,
  openTV,
  focusedProject,
  setFocusedProject,
}: SceneProps) {
  const [showTVContent, setShowTVContent] = useState(false);
  /* true when the panel is coming back after a turn away from the wall */
  const [warmUp, setWarmUp] = useState(false);
  const [shouldRenderTVContent, setShouldRenderTVContent] = useState(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const htmlRef = useRef<HTMLDivElement>(null);

  const introRef = useRef(0);
  /* eased follower for the raw pan value, so turns start and stop softly */
  const drift = useRef(0);

  /* scratch vectors so the frame loop never allocates */
  const scratch = useMemo(
    () => ({
      position: new THREE.Vector3(),
      target: new THREE.Vector3(),
      offset: new THREE.Vector3(),
    }),
    []
  );

  const stillCamera = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    window.scrollTo(0, 800);
  }, []);

  /* Projects leaves the TV behind and turns the camera on the poster wall */
  const onWall = tvOpen && currentTab === "Projects";
  /* the wall is part of the room, so the sheets answer to a click out there too */
  const postersLive = !tvOpen || onWall;

  /*
    Leaving the wall used to cut straight to a black TV while the camera was
    still turning. Hold the content back until the camera has actually arrived,
    then bring it up like a set warming through, so the swing is the transition.
  */
  const leftWall = useRef(false);
  useEffect(() => {
    if (onWall) leftWall.current = true;
  }, [onWall]);

  useEffect(() => {
    if (tvOpen && !onWall) {
      const swinging = leftWall.current;
      leftWall.current = false;
      setWarmUp(swinging);

      const mountTimer = window.setTimeout(
        () => setShouldRenderTVContent(true),
        swinging ? 620 : 0
      );
      const showTimer = window.setTimeout(
        () => setShowTVContent(true),
        swinging ? 700 : 200
      );
      return () => {
        window.clearTimeout(mountTimer);
        window.clearTimeout(showTimer);
      };
    }

    setShowTVContent(false);
    const hideTimer = window.setTimeout(() => {
      setShouldRenderTVContent(false);
    }, 500);
    return () => window.clearTimeout(hideTimer);
  }, [tvOpen, onWall]);

  useFrame((state, delta) => {
    const camera = state.camera;
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    /* exponential smoothing, so the feel doesn't change with frame rate */
    const settle = 1 - Math.exp(-6 * delta);

    if (focusedProject || onWall) {
      /*
        rotation and focal length only. translating toward a poster would slide
        it across a wall that is painted at infinity and cannot move with it.
      */
      camera.position.lerp(CAMERA_ANCHOR, settle);

      if (focusedProject) {
        /*
          A single focal length cannot suit both a square sheet and a 3:1
          banner, so derive one that fits whichever poster was picked - into the
          clear part of the frame, not the part the panel covers.
        */
        const placed = posterPlacement(focusedProject);
        const centre = posterWorldPosition(focusedProject);
        const distance = camera.position.distanceTo(centre);
        const width = placed?.width ?? 3;
        const height = placed?.height ?? 3;

        const forHeight = 2 * Math.atan((height * 0.62) / distance);
        const forWidth =
          2 *
          Math.atan(
            (width * 0.56) / (distance * camera.aspect * CLEAR_WIDTH)
          );
        const wanted = THREE.MathUtils.clamp(
          THREE.MathUtils.radToDeg(Math.max(forHeight, forWidth)),
          14,
          50
        );

        /* slide the aim so the sheet sits in the clear half of the frame */
        const visibleWidth =
          2 *
          distance *
          camera.aspect *
          Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        scratch.target
          .copy(centre)
          .addScaledVector(WALL_RIGHT, visibleWidth * 0.16);

        camera.fov = THREE.MathUtils.lerp(camera.fov, wanted, settle);
      } else {
        if (!stillCamera) {
          look.current.pan = THREE.MathUtils.clamp(
            look.current.pan + look.current.input * PAN_SPEED * delta,
            -1,
            1
          );
        }
        drift.current += (look.current.pan - drift.current) * settle;

        scratch.target
          .copy(WALL_ORIGIN)
          .addScaledVector(WALL_RIGHT, drift.current * WALL_PAN);
        camera.fov = THREE.MathUtils.lerp(camera.fov, WALL_FOV, settle);
      }

      camera.lookAt(scratch.target);
      camera.updateProjectionMatrix();
      return;
    }

    if (tvOpen) {
      scratch.position.set(TV_POSITION.x, TV_POSITION.y, TV_POSITION.z + 0.5);
      camera.position.lerp(scratch.position, settle);
      camera.fov = THREE.MathUtils.lerp(camera.fov, ZOOM_FOV, settle);
      camera.lookAt(TV_POSITION);
      camera.updateProjectionMatrix();
      return;
    }

    /* the opening move only runs once the loader has stepped aside */
    if (revealed && introRef.current < 1) {
      introRef.current = Math.min(
        1,
        introRef.current + delta / (stillCamera ? 0.4 : INTRO_SECONDS)
      );
    }
    const intro = easeOutCubic(introRef.current);

    if (!stillCamera) {
      look.current.pan = THREE.MathUtils.clamp(
        look.current.pan + look.current.input * PAN_SPEED * delta,
        -1,
        1
      );
    }
    drift.current += (look.current.pan - drift.current) * settle;

    camera.position.lerp(CAMERA_ANCHOR, settle);
    camera.fov = THREE.MathUtils.lerp(
      camera.fov,
      THREE.MathUtils.lerp(INTRO_FOV_FROM, INTRO_FOV_TO, intro),
      settle
    );

    /* the opening aim slides in, then the pointer takes over the same offset */
    scratch.offset
      .copy(INTRO_AIM_OFFSET)
      .multiplyScalar(1 - intro)
      .add(
        scratch.position.set(drift.current * DRIFT_TARGET * intro, 0, 0)
      );
    scratch.target.copy(TV_POSITION).add(scratch.offset);
    camera.lookAt(scratch.target);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <color attach="background" args={["black"]} />

      <Environment
        files="/hdris/fireplace.exr"
        background
        resolution={1024}
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

      {/*
        Bloom is what actually sells the screen as a light source: it bleeds the
        bright pixels of the panel and the fire out into the surrounding frame,
        which no amount of painted-on glow can fake. The vignette pulls the
        corners down so the room feels lit from inside it, and a trace of grain
        stops the large flat wall from banding.
      */}
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <Bloom
          intensity={0.75}
          luminanceThreshold={0.58}
          luminanceSmoothing={0.28}
          radius={0.62}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.62} eskil={false} />
        <Noise
          opacity={0.035}
          premultiply
          blendFunction={BlendFunction.OVERLAY}
        />
      </EffectComposer>

      <ProjectPosters
        active={postersLive}
        focusedId={focusedProject}
        onSelect={setFocusedProject}
      />

      <TVStaticScreen open={tvOpen} onOpen={openTV} />

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
              className={`tv-tab-shell${warmUp ? " tv-tab-shell--warm" : ""}`}
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
