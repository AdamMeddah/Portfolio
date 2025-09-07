import { Html, useProgress } from "@react-three/drei";

export default function CustomLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",

          height: "100vh",
          backgroundColor: "black",
          color: "white",
          fontSize: "1.5rem",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "10px",
            background: "#333",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "limegreen",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <p style={{ marginTop: "1rem" }}>{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}
