import { Canvas } from "@react-three/fiber";
import { Preload, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import Scene from "./components/Scene";
import { staticAssets } from "./assets/staticAssets";
import Navbar from "./components/Navbar";
import MainScreen from "./components/tabs/MainScreen";
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

function App() {
  const [user, setUser] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabName>("profiles");

  const lastProgress = useRef(0);

  const { progress: threeProgress, active } = useProgress();
  const { ready: staticReady, progress: staticProgress } =
    usePreloadAssets(staticAssets);

  const actualProgress = Math.min(100, (threeProgress + staticProgress) / 2);
  const allReady = !active && staticReady;

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
            {loadingProgress > 30 && (
              <p className="loading-tip">
                Tip: This portfolio works best on faster connections
              </p>
            )}
          </div>
        </div>
      )}

      {currentTab !== "profiles" && (
        <Navbar
          user={user}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          sectionClass="navbar"
        />
      )}
      {currentTab === "main" && user && (
        <MainScreen user={user} setCurrentTab={setCurrentTab} />
      )}

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
              setCurrentTab={setCurrentTab}
              setUser={setUser}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
