import { useState, useEffect, useRef } from "react";
import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload, useProgress } from "@react-three/drei";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const progressInterval = useRef(null);

  useEffect(() => {
    // Start a progress indicator for better UX during long loads
    let progress = 0;
    progressInterval.current = setInterval(() => {
      progress += 1;
      // Don't go beyond 90% until actual loading completes
      if (progress < 90) {
        setLoadingProgress(progress);
      }
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  return (
    <>
      {/* Show loading screen until everything is loaded */}
      {isLoading && (
        <div className="initial-loader">
          <div className="loader-content">
            <div className="loader-spinner"></div>
            <p>Loading portfolio... {loadingProgress}%</p>
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

      {/* Main app content - hidden until loading completes */}
      <div
        id="canvas-container"
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.5s ease-in",
          pointerEvents: showContent ? "all" : "none",
        }}
      >
        <Canvas shadows camera={{ fov: 80, position: [0, 1, 10] }}>
          <Suspense fallback={null}>
            <Scene />
            <Preload all />
            <AssetLoader
              onLoaded={() => {
                if (progressInterval.current) {
                  clearInterval(progressInterval.current);
                }
                setLoadingProgress(100);
                setTimeout(() => {
                  setIsLoading(false);
                  setTimeout(() => setShowContent(true), 100);
                }, 500);
              }}
              onProgress={(progress) => {
                setLoadingProgress(Math.max(loadingProgress, progress));
              }}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

// Custom loader component that monitors three.js asset loading
function AssetLoader({ onLoaded, onProgress }) {
  const { progress, active } = useProgress();

  useEffect(() => {
    onProgress(progress);

    if (progress === 100 && !active) {
      onLoaded();
    }
  }, [progress, active, onLoaded, onProgress]);

  return null;
}

export default App;
