import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function useHtmlPositioner(meshRef, zoomIn, showTVContent) {
  const { camera, size } = useThree();
  const htmlRef = useRef();

  useEffect(() => {
    if (!zoomIn || !showTVContent || !meshRef.current || !htmlRef.current)
      return;

    const updateHtmlSize = () => {
      // calc distance from camera to TV
      const distance = camera.position.distanceTo(meshRef.current.position);

      // base size adjustment (experiment with this value)
      const baseSize = 0.5;
      const scaleFactor = baseSize / distance;

      // get current HTML element
      const htmlElement = htmlRef.current;

      // apply scaling
      htmlElement.style.transform = `scale(${scaleFactor})`;
      htmlElement.style.transformOrigin = "center center";

      // pos calculation
      const worldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPosition);
      const screenPosition = worldPosition.clone().project(camera);
      const x = (screenPosition.x * 0.5 + 0.5) * size.width;
      const y = -(screenPosition.y * 0.5 - 0.5) * size.height;

      htmlElement.style.position = "fixed";
      htmlElement.style.left = `${x - htmlElement.offsetWidth / 2}px`;
      htmlElement.style.top = `${y - htmlElement.offsetHeight / 2}px`;
    };

    const timeout = setTimeout(updateHtmlSize, 100);
    window.addEventListener("resize", updateHtmlSize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateHtmlSize);
    };
  }, [zoomIn, showTVContent, camera, size]);

  return htmlRef;
}
