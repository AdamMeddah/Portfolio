import * as THREE from "three";
import { projects } from "../data/projectData";
import type { ProjectEntry } from "../data/projectData";

/*
  The room is an environment map, so there is no real wall to hang anything on.
  These numbers place a flat group where the painted wall to the right of the TV
  appears to be: pushed out along the screen-right axis and yawed to match the
  wall's slant. Because the camera only ever rotates, the group stays welded to
  the painted wall exactly the way the TV picture stays inside its bezel.
*/
export const WALL_ORIGIN = new THREE.Vector3(20.2, 6.75, -2.6);
export const WALL_YAW = -1;

/* the wall's own left-to-right axis in world space, for aiming the camera */
export const WALL_RIGHT = new THREE.Vector3(
  Math.cos(WALL_YAW),
  0,
  -Math.sin(WALL_YAW)
).normalize();

const ROW_HEIGHT = 3.2;
const GAP = 0.4;
/* anything squatter than this is treated as a banner and gets its own row */
const BANNER_ASPECT = 1.8;

export type Placed = {
  project: ProjectEntry;
  /* position in the source list, so the sticky notes read 1, 2, 3 */
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  tilt: number;
};

/*
  Square-ish artwork sits side by side at a shared height; anything much wider
  than it is tall would dwarf them in the same row, so it spans a row of its own
  underneath. The whole block is then centred on the wall origin.
*/
function layout(entries: ProjectEntry[]): Placed[] {
  const tall = entries.filter((p) => p.aspect < BANNER_ASPECT);
  const wide = entries.filter((p) => p.aspect >= BANNER_ASPECT);

  const indexOf = (project: ProjectEntry) => entries.indexOf(project);

  const tallSized = tall.map((project) => ({
    project,
    width: ROW_HEIGHT * project.aspect,
    height: ROW_HEIGHT,
  }));

  const topWidth =
    tallSized.reduce((sum, p) => sum + p.width, 0) +
    GAP * Math.max(0, tallSized.length - 1);

  const wideSized = wide.map((project) => ({
    project,
    width: topWidth,
    height: topWidth / project.aspect,
  }));

  const totalHeight =
    (tallSized.length ? ROW_HEIGHT : 0) +
    wideSized.reduce((sum, p) => sum + p.height + GAP, 0);

  const placed: Placed[] = [];
  let cursorY = totalHeight / 2;

  if (tallSized.length) {
    let cursorX = -topWidth / 2;
    cursorY -= ROW_HEIGHT / 2;
    tallSized.forEach(({ project, width, height }, i) => {
      placed.push({
        project,
        index: indexOf(project),
        x: cursorX + width / 2,
        y: cursorY,
        width,
        height,
        /* a degree or two each way, so they read as taped up by hand */
        tilt: (i % 2 === 0 ? 1 : -1) * 0.012,
      });
      cursorX += width + GAP;
    });
    cursorY -= ROW_HEIGHT / 2;
  }

  wideSized.forEach(({ project, width, height }, i) => {
    cursorY -= GAP + height / 2;
    placed.push({
      project,
      index: indexOf(project),
      x: 0,
      y: cursorY,
      width,
      height,
      tilt: (i % 2 === 0 ? -1 : 1) * 0.008,
    });
    cursorY -= height / 2;
  });

  return placed;
}

export const posterLayout = layout(projects);

/* overall extents of the block, so the camera can frame it on any aspect */
export const WALL_BOUNDS = (() => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of posterLayout) {
    minX = Math.min(minX, p.x - p.width / 2);
    maxX = Math.max(maxX, p.x + p.width / 2);
    minY = Math.min(minY, p.y - p.height / 2);
    maxY = Math.max(maxY, p.y + p.height / 2);
  }
  return { width: maxX - minX, height: maxY - minY };
})();

export function posterPlacement(id: string) {
  return posterLayout.find((p) => p.project.id === id) ?? null;
}

/* world-space centre of a poster, so the camera knows where to aim */
export function posterWorldPosition(id: string) {
  const placed = posterLayout.find((p) => p.project.id === id);
  if (!placed) return WALL_ORIGIN.clone();
  return new THREE.Vector3(placed.x, placed.y, 0)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), WALL_YAW)
    .add(WALL_ORIGIN);
}
