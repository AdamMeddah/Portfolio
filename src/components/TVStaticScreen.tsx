import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import * as THREE from "three";

type TVStaticScreenProps = {
  /* the viewer has switched the set on, so it plays black and stops inviting clicks */
  open: boolean;
  onOpen: () => void;
};

const TV_POSITION: [number, number, number] = [4.33, 5.5, -5];

/* the room is a skybox, so its brightness is the only thing the screen can push */
const ROOM_BASE_INTENSITY = 0.4;
const ROOM_FLICKER = 0.22;

/* the spill plane sits behind the screen, so only its halo shows */
const SPILL_MAX_OPACITY = 0.45;

/* the video is downscaled to this before averaging - 12 pixels is plenty */
const SAMPLE_W = 4;
const SAMPLE_H = 3;
const SAMPLE_EVERY = 3;

/*
  A heavily blurred rectangle rather than a radial gradient. Light thrown from a
  screen pools in the screen's own shape; a circle reads as a spotlight and was
  the giveaway that this was a decal rather than light.
*/
function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.filter = "blur(34px)";
    ctx.fillStyle = "#fff";
    /* inset so the blur has room to fall off inside the texture */
    ctx.fillRect(size * 0.24, size * 0.28, size * 0.52, size * 0.44);

    /* a second tighter pass keeps a brighter core near the panel */
    ctx.filter = "blur(14px)";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(size * 0.3, size * 0.34, size * 0.4, size * 0.32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function TVStaticScreen({ open, onOpen }: TVStaticScreenProps) {
  const meshRef =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const videoRef = useRef(document.createElement("video"));
  const spillRef =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);

  const { scene } = useThree();
  const glowTexture = useMemo(makeGlowTexture, []);

  /* scratch objects, reused every frame so the loop allocates nothing */
  const sampler = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE_W;
    canvas.height = SAMPLE_H;
    return {
      ctx: canvas.getContext("2d", { willReadFrequently: true }),
      colour: new THREE.Color(),
    };
  }, []);
  const frameCount = useRef(0);
  const luminance = useRef(0);

  const isVideoReady = () => videoRef.current?.readyState >= 2;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = open ? "/videos/black_ios.mp4" : "/videos/static_ios.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    return () => {
      video.pause();
      video.src = "";
    };
  }, [open]);

  /* the skybox brightness is shared state, so hand it back on unmount */
  useEffect(() => {
    return () => {
      scene.backgroundIntensity = ROOM_BASE_INTENSITY;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const video = videoRef.current;
    if (!meshRef.current || !video || !isVideoReady()) return;

    const material = meshRef.current.material;
    if (material.map) {
      material.map.needsUpdate = true;
    }

    const spill = spillRef.current;
    const { ctx, colour } = sampler;
    if (!spill || !ctx) return;

    /* average the frame down to one colour, a few times a second */
    if (frameCount.current++ % SAMPLE_EVERY === 0) {
      ctx.drawImage(video, 0, 0, SAMPLE_W, SAMPLE_H);
      const { data } = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);

      let r = 0;
      let g = 0;
      let b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      const pixels = data.length / 4;
      colour.setRGB(r / pixels / 255, g / pixels / 255, b / pixels / 255);
      luminance.current = 0.2126 * colour.r + 0.7152 * colour.g + 0.0722 * colour.b;
    }

    /* ease toward the sample so the room flickers instead of strobing */
    const k = 1 - Math.exp(-9 * delta);
    spill.material.color.lerp(colour, k);
    spill.material.opacity = THREE.MathUtils.lerp(
      spill.material.opacity,
      luminance.current * SPILL_MAX_OPACITY,
      k
    );
    scene.backgroundIntensity = THREE.MathUtils.lerp(
      scene.backgroundIntensity,
      ROOM_BASE_INTENSITY + luminance.current * ROOM_FLICKER,
      k
    );
  });

  return (
    <>
      {/* screen spill, behind the panel so only the halo around it reads */}
      <mesh ref={spillRef} position={[4.33, 5.5, -5.05]}>
        <planeGeometry args={[7.4, 5.6]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={meshRef}
        position={TV_POSITION}
        onClick={() => {
          if (open) return;
          onOpen();
        }}
      >
        <planeGeometry args={[2.3, 1.8]} />
        <meshBasicMaterial color="white">
          <videoTexture attach="map" args={[videoRef.current]} />
        </meshBasicMaterial>
      </mesh>

      {!open && (
        <>
          <Text3D
            font="fonts/Inter_Bold.json"
            size={0.3}
            position={[3.4, 5.35, -5]}
            rotation={[0, -0.2, 0]}
          >
            click
            <meshStandardMaterial color="black" />
          </Text3D>

          <Text3D
            font="fonts/Inter_Bold.json"
            size={0.3}
            position={[4.45, 5.35, -5]}
            rotation={[0, -0.2, 0]}
          >
            me
            <meshStandardMaterial color="black" />
          </Text3D>
        </>
      )}
    </>
  );
}
