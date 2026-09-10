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
const SPILL_MAX_OPACITY = 0.34;

/* the video is downscaled to this before averaging - 12 pixels is plenty */
const SAMPLE_W = 4;
const SAMPLE_H = 3;
const SAMPLE_EVERY = 3;

const HAS_VIDEO_FRAME_CALLBACK =
  typeof HTMLVideoElement !== "undefined" &&
  "requestVideoFrameCallback" in HTMLVideoElement.prototype;

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
    ctx.filter = "blur(30px)";
    ctx.fillStyle = "#fff";
    /* inset so the blur has room to fall off inside the texture */
    ctx.fillRect(size * 0.3, size * 0.33, size * 0.4, size * 0.34);

    /* a second tighter pass keeps a brighter core near the panel */
    ctx.filter = "blur(13px)";
    ctx.globalAlpha = 0.65;
    ctx.fillRect(size * 0.35, size * 0.38, size * 0.3, size * 0.24);

    /*
      Force the alpha to zero at the border. Any residue left there draws the
      plane's own rectangle, which desktop bloom mostly buried but a phone
      renders plainly.
    */
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "destination-in";
    const falloff = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.1,
      size / 2,
      size / 2,
      size * 0.5
    );
    falloff.addColorStop(0, "rgba(255,255,255,1)");
    falloff.addColorStop(0.7, "rgba(255,255,255,0.85)");
    falloff.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = falloff;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = "source-over";
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

  /* state for the video-texture check below */
  const nudgeByHand = useRef(!HAS_VIDEO_FRAME_CALLBACK);
  const lastVersion = useRef(-1);
  const lastClock = useRef(-1);
  const starvedFrames = useRef(0);

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

    /*
      three's VideoTexture flags itself from requestVideoFrameCallback, once per
      decoded frame. Setting the flag by hand here re-uploaded the picture at
      display rate instead: the black plate is 1228x990, about 5MB an upload, so
      a 25fps clip on a 60Hz screen was moving twice the bytes it had frames for
      and four times on a 120Hz one.

      Trusting the callback outright is a bet on every browser this runs in, and
      losing it means a frozen screen, so it is checked rather than assumed. If
      the video clock keeps advancing while the texture's version sits still,
      nothing is driving the upload and the manual nudge comes back for good.
    */
    const texture = meshRef.current.material.map;
    if (texture) {
      if (nudgeByHand.current) {
        texture.needsUpdate = true;
      } else {
        const clockMoved = video.currentTime !== lastClock.current;
        lastClock.current = video.currentTime;
        starvedFrames.current =
          clockMoved && texture.version === lastVersion.current
            ? starvedFrames.current + 1
            : 0;
        /* a 10fps clip on a 120Hz panel repeats 12 frames; 60 is clear of that */
        if (starvedFrames.current > 60) nudgeByHand.current = true;
        lastVersion.current = texture.version;
      }
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
