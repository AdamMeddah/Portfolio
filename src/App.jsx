import { useState, useEffect, useRef } from "react";
import Scene from "./components/Scene";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload, useProgress } from "@react-three/drei";

import "./App.css";
import { staticAssets } from "./assets/staticAssets";

// All static assets organized by type

// Hook to preload all assets (images, videos, fonts, HDRIs)
function usePreloadAssets(assets) {
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

    function handleLoad() {
      completed++;
      setLoaded(completed);
      if (completed === allAssets.length) {
        setReady(true);
      }
    }

    allAssets.forEach((src) => {
      if (src.endsWith(".mp4")) {
        // Video files
        const video = document.createElement("video");
        video.src = src;
        video.preload = "auto";
        video.muted = true;
        video.oncanplaythrough = handleLoad;
        video.onerror = handleLoad;
      } else if (src.endsWith(".hdr")) {
        // HDR environment files - preload as images
        const img = new Image();
        img.src = src;
        img.onload = handleLoad;
        img.onerror = handleLoad;
      } else if (src.endsWith(".json") || src.endsWith(".otf")) {
        // Font files - fetch them to preload
        fetch(src)
          .then((response) => {
            if (response.ok) handleLoad();
            else handleLoad(); // Still count as loaded even if error
          })
          .catch(handleLoad);
      } else {
        // Image files
        const img = new Image();
        img.src = src;
        img.onload = handleLoad;
        img.onerror = handleLoad;
      }
    });
  }, [assets]);

  return {
    ready,
    loaded,
    total,
    progress: total ? (loaded / total) * 100 : 100,
  };
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const lastProgress = useRef(0);

  // drei useProgress (3D assets)
  const { progress: threeProgress, active } = useProgress();

  // custom static asset preload
  const { ready: staticReady, progress: staticProgress } =
    usePreloadAssets(staticAssets);

  // Calculate actual combined progress (weighted average)
  const actualProgress = Math.min(100, (threeProgress + staticProgress) / 2);
  const allReady = !active && staticReady;

  useEffect(() => {
    // Update progress based on actual loading, not simulation
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
      {/* show loading screen until everything is loaded */}
      {isLoading && (
        <div className="initial-loader">
          <div className="loader-content">
            <div className="loader-spinner"></div>
            <p>Loading portfolio... {Math.round(loadingProgress)}%</p>
            <div className="progress-bar">
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

      {/* hidden until loading done */}
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
            <Scene />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
