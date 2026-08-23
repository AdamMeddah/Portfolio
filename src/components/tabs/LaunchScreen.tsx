import { useEffect, useState } from "react";
import type { SetCurrentTab, SetUser, UserRole } from "../../types";

type LaunchScreenProps = {
  setCurrentTab: SetCurrentTab;
  setUser: SetUser;
};

const profiles: { role: UserRole; label: string; avatar: string }[] = [
  { role: "recruiter", label: "Recruiter", avatar: "images/bluishavatar.webp" },
  { role: "writer", label: "Writer", avatar: "images/redavatar.webp" },
  { role: "developer", label: "Developer", avatar: "images/greenavatar.webp" },
];

/* must stay in step with the ident-mark keyframes in App.css */
const IDENT_MS = 2200;

/*
  Drop an audio file in public/audio and point this at it to play a sting
  alongside the ident. Left off by default: the Netflix "ta-dum" is a registered
  sound mark, so it can't ship here - this needs an original or licensed clip.
*/
const IDENT_SOUND: string | null = null;

/* the ident is an app-launch flourish, so it plays once per page load */
let identPlayed = false;

export default function LaunchScreen({
  setCurrentTab,
  setUser,
}: LaunchScreenProps) {
  const [showIdent, setShowIdent] = useState(
    () =>
      !identPlayed &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!showIdent) return;

    if (IDENT_SOUND) {
      const sting = new Audio(IDENT_SOUND);
      sting.volume = 0.5;
      sting.play().catch(() => {});
    }

    const timer = window.setTimeout(() => {
      identPlayed = true;
      setShowIdent(false);
    }, IDENT_MS);

    return () => window.clearTimeout(timer);
  }, [showIdent]);

  if (showIdent) {
    return (
      <div className="ident" role="presentation">
        <div className="ident-mark">
          <img src="images/amLogo.webp" alt="" />
          <span className="ident-shine" />
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 id="launch-title">Who's Watching?</h1>

      <div id="profile-row">
        {profiles.map(({ role, label, avatar }) => (
          <button
            key={role}
            type="button"
            className="profile"
            onClick={() => {
              setUser(role);
              setCurrentTab("main");
            }}
          >
            <img className="profile-img" src={avatar} alt="" />
            <span className="profile-text">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
