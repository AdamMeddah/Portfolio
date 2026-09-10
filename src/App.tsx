import { Canvas } from "@react-three/fiber";
import { Preload, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import Scene from "./components/Scene";
import { criticalAssets, deferredAssets } from "./assets/staticAssets";
import Navbar from "./components/Navbar";
import MainScreen from "./components/tabs/MainScreen";
import LookControls from "./components/LookControls";
import CrtScreen from "./components/CrtScreen";
import type { CrtPhase } from "./components/CrtScreen";
import type { LookState } from "./components/LookControls";
import ProjectPanel from "./components/ProjectPanel";
import { projects } from "./data/projectData";
import type { StaticAssets, TabName, UserRole } from "./types";
import "./App.css";

function usePreloadAssets(assets: StaticAssets) {
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const allAssets = [
      ...(assets.images || []),
      ...(assets.videos || []),
      ...(assets.fonts || []),
      ...(assets.hdris || []),
    ];

    setTotal(allAssets.length);

    if (allAssets.length === 0) {
      setReady(true);
      return;
    }

    let completed = 0;
    let cancelled = false;

    function handleLoad() {
      if (cancelled) return;

      completed++;
      setLoaded(completed);
      if (completed === allAssets.length) {
        setReady(true);
      }
    }

    function handleImageLoad(src: string) {
      const img = new Image();
      img.onload = () => {
        if (img.decode) {
          img.decode().then(handleLoad).catch(handleLoad);
        } else {
          handleLoad();
        }
      };
      img.onerror = handleLoad;
      img.src = src;
    }

    allAssets.forEach((src) => {
      if (src.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.onloadeddata = handleLoad;
        video.onerror = handleLoad;
        video.src = src;
        video.load();
      } else if (src.endsWith(".hdr") || src.endsWith(".exr")) {
        fetch(src).then(handleLoad).catch(handleLoad);
      } else if (src.endsWith(".json") || src.endsWith(".otf")) {
        fetch(src)
          .then((response) => {
            if (response.ok) handleLoad();
            else handleLoad();
          })
          .catch(handleLoad);
      } else {
        handleImageLoad(src);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [assets]);

  return {
    ready,
    loaded,
    total,
    progress: total ? (loaded / total) * 100 : 100,
  };
}

/* beats of the power cycle, in milliseconds */
const FIRST_SWING_MS = 820;
const SWING_MS = 240;
const BOOT_MS = 780;
const SHUTDOWN_MS = 460;
/* must cover the crt-warm keyframes in App.css */
const WARM_MS = 1200;

/*
  Kick off the rest of the downloads without reporting on them. Deliberately
  fire-and-forget: nothing here is allowed to hold up the first frame, it only
  needs to land before the viewer clicks through to whatever uses it.
*/
function warmAssets(assets: StaticAssets) {
  const queue = [
    ...(assets.images || []),
    ...(assets.videos || []),
    ...(assets.fonts || []),
    ...(assets.hdris || []),
  ];

  for (const src of queue) {
    if (src.endsWith(".mp4")) {
      /* metadata only - enough to have the connection and headers cached */
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.src = src;
    } else if (/\.(webp|png|jpe?g|svg)$/.test(src)) {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
    } else {
      /* low priority so these never contend with the critical path */
      void fetch(src, { priority: "low" }).catch(() => {});
    }
  }
}

function App() {
  const [user, setUser] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabName>("profiles");
  const [tvOpen, setTvOpen] = useState(false);
  const [focusedProject, setFocusedProject] = useState<string | null>(null);
  const [crt, setCrt] = useState<CrtPhase>("off");

  /*
    The TV's own power cycle, kept here because both the panels inside the set
    and the home screen outside it have to obey the same sequence. The display
    is lit whenever the set is open on something other than the poster wall.
  */
  const displayLit = tvOpen && currentTab !== "Projects";
  const timers = useRef<number[]>([]);
  /* the very first zoom into the set gets a longer beat than a turn back */
  const bootedOnce = useRef(false);
  /* only a genuine power-on plays the full warm-through */
  const [warm, setWarm] = useState(false);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  /*
    The set's power cycle. Change detection comes from the dependency rather
    than a "previous value" ref, because StrictMode's double invoke leaves such
    a ref already up to date on the second pass and the sequence never runs.
  */
  useEffect(() => {
    if (!displayLit) {
      setCrt("off");
      setWarm(false);
      return;
    }

    const swing = bootedOnce.current ? SWING_MS : FIRST_SWING_MS;
    bootedOnce.current = true;

    setCrt("off");
    setWarm(false);
    timers.current.push(
      window.setTimeout(() => setCrt("boot"), swing),
      window.setTimeout(() => {
        setCrt("on");
        setWarm(true);
      }, swing + BOOT_MS),
      window.setTimeout(() => setWarm(false), swing + BOOT_MS + WARM_MS)
    );

    return clearTimers;
  }, [displayLit]);

  /*
    Anything that darkens the set runs the collapse first and only then commits
    the navigation, so the picture is never yanked out from under the viewer.
  */
  const powerDownThen = (action: () => void) => {
    if (!displayLit) {
      action();
      return;
    }
    clearTimers();
    setCrt("shutdown");
    timers.current.push(window.setTimeout(action, SHUTDOWN_MS));
  };

  const requestTab = (tab: TabName) => {
    if (tab === "Projects" && displayLit) {
      powerDownThen(() => setCurrentTab(tab));
      return;
    }
    setCurrentTab(tab);
  };

  /* the wordmark switches the set off and puts you back in the room */
  const exitToRoom = () => {
    powerDownThen(() => {
      setTvOpen(false);
      setCurrentTab("profiles");
      setFocusedProject(null);
    });
  };

  /* a ref, not state: the turn updates every frame and must not re-render */
  const look = useRef<LookState>({ pan: 0, input: 0 });

  /* leaving Projects drops whatever poster was open */
  useEffect(() => {
    if (currentTab !== "Projects") setFocusedProject(null);
  }, [currentTab]);

  /* every view change starts from a centred camera */
  useEffect(() => {
    look.current.pan = 0;
    look.current.input = 0;
  }, [currentTab, tvOpen]);

  const lastProgress = useRef(0);

  const { progress: threeProgress, active } = useProgress();
  const { ready: staticReady, progress: staticProgress } =
    usePreloadAssets(criticalAssets);

  const actualProgress = Math.min(100, (threeProgress + staticProgress) / 2);
  const allReady = !active && staticReady;

  /* once the room is up, quietly pull the rest down in the background */
  useEffect(() => {
    if (!showContent) return;
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => warmAssets(deferredAssets), {
          timeout: 1200,
        })
      : window.setTimeout(() => warmAssets(deferredAssets), 300);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
    };
  }, [showContent]);

  useEffect(() => {
    if (actualProgress > lastProgress.current) {
      lastProgress.current = actualProgress;
      setLoadingProgress(actualProgress);
    }
  }, [actualProgress]);

  useEffect(() => {
    if (allReady) {
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowContent(true), 100);
      }, 500);
    }
  }, [allReady]);

  return (
    <>
      {isLoading && (
        <div className="initial-loader">
          <div className="loader-content">
            <p className="loader-status">
              Loading portfolio... {Math.round(loadingProgress)}%
            </p>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={Math.round(loadingProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {showContent &&
        !focusedProject &&
        (!tvOpen || currentTab === "Projects") && <LookControls look={look} />}

      {currentTab !== "profiles" && (
        <Navbar
          user={user}
          currentTab={currentTab}
          setCurrentTab={requestTab}
          onExit={exitToRoom}
          sectionClass="navbar"
        />
      )}
      {currentTab === "main" && user && (
        <MainScreen
          user={user}
          setCurrentTab={requestTab}
          warm={warm}
        />
      )}

      {tvOpen && currentTab === "Projects" && !focusedProject && (
        <p className="wall-hint">Select a poster</p>
      )}

      <ProjectPanel
        project={projects.find((p) => p.id === focusedProject) ?? null}
        onClose={() => setFocusedProject(null)}
      />

      <CrtScreen phase={crt} />

      <div
        id="canvas-container"
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.5s ease-in",
          pointerEvents: showContent ? "all" : "none",
        }}
      >
        <Canvas shadows camera={{ fov: 100, position: [0, 1, 10] }}>
          <Suspense fallback={null}>
            <Scene
              currentTab={currentTab}
              setCurrentTab={requestTab}
              setUser={setUser}
              revealed={showContent}
              look={look}
              tvOpen={tvOpen}
              openTV={() => setTvOpen(true)}
              displayLit={crt === "on"}
              warm={warm}
              focusedProject={focusedProject}
              setFocusedProject={setFocusedProject}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
