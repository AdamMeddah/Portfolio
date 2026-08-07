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

export default function LaunchScreen({
  setCurrentTab,
  setUser,
}: LaunchScreenProps) {
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
