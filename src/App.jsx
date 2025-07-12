import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { useState, useEffect } from "react";
import "./App.css";
import pageData from "./data/pageData";
import TextContent from "./components/TextContent";

function App() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    console.log(`offset: ${offset}`);
  }, [offset]);
  const content = pageData.map((page) => {
    if (page.leftContent) {
      const leftContent = page.leftContent;
      return (
        <TextContent
          key={page.id}
          className={`page-text page-${page.id}`} //two different classes applied
          hasGrid={page.hasGrid} //undefined case handled in component
          textColor={leftContent.textColor}
          title={leftContent.title}
          content={leftContent.mainContent}
        />
      );
    }
  });

  return (
    <>
      <div id="canvas-container">
        <Canvas
          shadows
          orthographic
          camera={{ zoom: 60, position: [0, -2, 120] }}
        >
          <ScrollControls
            pages={3}
            damping={0.1}
            distance={4}
            // onScroll={(e) => {
            //   setOffset(e.scrollTop * 3);
            //   console.log(offset);
            // }}
          >
            <Scene onOffsetChange={setOffset} />
          </ScrollControls>
        </Canvas>
      </div>

      <div>
        <h1>Hi!</h1>
      </div>

      {content}
    </>
  );
}

export default App;
