import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { WALL_ORIGIN, WALL_YAW, posterLayout } from "../scene/posterWall";
import type { Placed } from "../scene/posterWall";

/* one soft shadow blob, shared by every poster */
function makeShadowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.filter = "blur(7px)";
    ctx.fillStyle = "#000";
    ctx.fillRect(size * 0.07, size * 0.07, size * 0.86, size * 0.86);
  }
  return new THREE.CanvasTexture(canvas);
}

const shadowTexture = makeShadowTexture();

type PosterProps = {
  placed: Placed;
  active: boolean;
  focused: boolean;
  interactive: boolean;
  onSelect: (id: string) => void;
};

function Poster({
  placed,
  active,
  focused,
  interactive,
  onSelect,
}: PosterProps) {
  const { project, x, y, width, height, tilt } = placed;
  const texture = useTexture(project.image);
  const group = useRef<THREE.Group>(null);
  const paper = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>>(null);
  const [hovered, setHovered] = useState(false);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  const lifted = interactive && (hovered || focused);

  /* the wall can be left while a poster is hovered, so never strand the cursor */
  useEffect(() => {
    if (interactive) return;
    setHovered(false);
    document.body.style.cursor = "";
  }, [interactive]);

  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  useFrame((_, delta) => {
    if (!group.current || !paper.current) return;
    const k = 1 - Math.exp(-8 * delta);

    /* lean off the wall a touch rather than scaling, which would look pasted on */
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      lifted ? 0.075 : 0,
      k
    );

    const target = focused ? 1.05 : lifted ? 0.9 : active ? 0.72 : 0.32;
    const material = paper.current.material;
    material.emissiveIntensity = THREE.MathUtils.lerp(
      material.emissiveIntensity,
      target,
      k
    );
  });

  const tapeWidth = Math.min(0.2, width * 0.16);

  return (
    <group ref={group} position={[x, y, 0]} rotation={[0, 0, tilt]}>
      {/* soft contact shadow, offset the way the room light falls */}
      <mesh position={[0.035, -0.045, -0.014]}>
        <planeGeometry args={[width * 1.07, height * 1.09]} />
        <meshBasicMaterial
          map={shadowTexture}
          transparent
          opacity={0.6}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={paper}
        onPointerOver={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          document.body.style.cursor = "";
          onSelect(project.id);
        }}
      >
        <planeGeometry args={[width, height]} />
        {/*
          emissive carries the artwork so a poster stays readable in a room lit
          only by a fire and a CRT, while roughness keeps it matte like paper
        */}
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.3}
          roughness={0.92}
          metalness={0}
          toneMapped
        />
      </mesh>

      {/* strips of tape at the top corners */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (width / 2 - tapeWidth * 0.35), height / 2 - 0.01, 0.006]}
          rotation={[0, 0, side * 0.5]}
        >
          <planeGeometry args={[tapeWidth, tapeWidth * 0.42]} />
          <meshStandardMaterial
            color="#e8e2d2"
            transparent
            opacity={0.34}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function PosterLight({ active }: { active: boolean }) {
  const light = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (!light.current) return;
    const k = 1 - Math.exp(-4 * delta);
    light.current.intensity = THREE.MathUtils.lerp(
      light.current.intensity,
      active ? 78 : 0,
      k
    );
  });

  return (
    <pointLight
      ref={light}
      position={[0, 2.4, 5.2]}
      intensity={0}
      distance={22}
      decay={1.3}
      color="#ffd9a8"
    />
  );
}

type ProjectPostersProps = {
  /* the wall is on screen, so posters brighten and accept clicks */
  active: boolean;
  focusedId: string | null;
  onSelect: (id: string) => void;
};

export function ProjectPosters({
  active,
  focusedId,
  onSelect,
}: ProjectPostersProps) {
  return (
    <group position={WALL_ORIGIN} rotation={[0, WALL_YAW, 0]}>
      {/*
        Unlike the painted room, the posters are real geometry, so a real light
        does reach them. This is the picture light that comes up when the wall
        becomes the subject.
      */}
      <PosterLight active={active} />

      {posterLayout.map((placed) => (
        <Poster
          key={placed.project.id}
          placed={placed}
          active={active}
          focused={focusedId === placed.project.id}
          interactive={active}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

