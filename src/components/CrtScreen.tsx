export type CrtPhase = "off" | "boot" | "on" | "shutdown";

type CrtScreenProps = {
  phase: CrtPhase;
};

/*
  The set turning on and off. Real CRTs never printed "powering on" - what they
  actually showed was the input label in a corner OSD box while the tube warmed,
  and on the way out the picture collapsing to a line and then a dot as the
  deflection coils lost power. Both are reproduced here.
*/
export default function CrtScreen({ phase }: CrtScreenProps) {
  if (phase === "off" || phase === "on") return null;

  if (phase === "shutdown") {
    return (
      <div className="crt crt--shutdown" aria-hidden="true">
        <div className="crt-veil" />
        <div className="crt-collapse" />
      </div>
    );
  }

  return (
    <div className="crt crt--boot" role="status" aria-label="Display powering on">
      <div className="crt-veil" />
      <div className="crt-scanlines" aria-hidden="true" />

      {/* the input badge a set drops in the corner while it finds a signal */}
      <div className="crt-osd">AV&#8209;1</div>

      <div className="crt-boot-centre">
        <span className="crt-bar" aria-hidden="true" />
        <p className="crt-boot-text">
          Powering on<span className="crt-caret" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
