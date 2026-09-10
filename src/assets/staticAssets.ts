import type { StaticAssets } from "../types";

/*
  The loading screen used to wait on every asset in the project - roughly 2.5MB
  - before showing anything, even though the first thing on screen is only a
  dark room with a TV in it. These are the assets that first frame actually
  needs, and they are the only ones that gate the reveal.
*/
export const criticalAssets: StaticAssets = {
  /* the room itself */
  hdris: ["/hdris/fireplace.exr"],
  /* the static playing on the TV before it is clicked */
  videos: ["/videos/static_ios.mp4"],
  /* the typeface the "click me" 3D text is extruded from */
  fonts: ["/fonts/Inter_Bold.json"],
};

/*
  Everything else. Warmed in the background once the room is on screen, so it is
  in cache by the time the viewer clicks through to it, but never blocking.
*/
export const deferredAssets: StaticAssets = {
  images: [
    "/images/about.webp",
    "/images/aboutlogo.webp",
    "/images/amLogo.webp",
    "/images/aws.webp",
    "/images/blog.webp",
    "/images/bluishavatar.webp",
    "/images/contact.webp",
    "/images/flask.webp",
    "/images/fullLogo.webp",
    "/images/greenavatar.webp",
    "/images/musiwrite.webp",
    "/images/ollama.webp",
    "/images/portfolio.webp",
    "/images/projects.webp",
    "/images/pvault.webp",
    "/images/python.webp",
    "/images/react.svg",
    "/images/redavatar.webp",
    "/images/skills.webp",
    "/images/tailwind.webp",
    "/images/ThreeJS.webp",
  ],
  videos: ["/videos/black_ios.mp4", "/videos/noted_ios.mp4"],
  /* net_sans_med is already hinted from index.html, so it is not repeated */
  fonts: ["/fonts/net_sans_bold.otf", "/fonts/net_sans_light.otf"],
};
