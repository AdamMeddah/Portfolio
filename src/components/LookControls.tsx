import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";

export type LookState = {
  /* -1..1, how far the view is turned from centre */
  pan: number;
  /* -1, 0 or 1: which way the viewer is currently asking to turn */
  input: number;
};

type LookControlsProps = {
  look: MutableRefObject<LookState>;
};

/*
  Continuously tracking the pointer made the room feel like it was sliding out
  from under the cursor. These are deliberate: hover (or hold, on a touch
  screen) an edge to turn that way, and the view stays where it is left.
*/
export default function LookControls({ look }: LookControlsProps) {
  const [active, setActive] = useState(0);

  const push = (direction: number) => {
    look.current.input = direction;
    setActive(direction);
  };

  const release = () => {
    look.current.input = 0;
    setActive(0);
  };

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") push(-1);
      if (e.key === "ArrowRight") push(1);
    }
    function up(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") release();
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* a turn left in progress should stop if the component goes away */
  useEffect(() => () => {
    look.current.input = 0;
  }, [look]);

  return (
    <>
      {([-1, 1] as const).map((direction) => (
        <button
          key={direction}
          type="button"
          className={`look-edge look-edge--${
            direction < 0 ? "left" : "right"
          }${active === direction ? " is-active" : ""}`}
          aria-label={direction < 0 ? "Look left" : "Look right"}
          onPointerEnter={() => push(direction)}
          onPointerLeave={release}
          onPointerDown={() => push(direction)}
          onPointerUp={release}
          onPointerCancel={release}
          onBlur={release}
          onFocus={() => push(direction)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={direction < 0 ? "M15 4 L7 12 L15 20" : "M9 4 L17 12 L9 20"} />
          </svg>
        </button>
      ))}
    </>
  );
}
