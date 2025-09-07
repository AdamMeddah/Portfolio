export default function LaunchScreen({ setCurrentTab, setUser }) {
  return (
    <>
      <h1 id="launch-title"> Who's Watching?</h1>

      <div id="profile-row">
        <div
          className="profile"
          onClick={() => {
            setUser("recruiter");
            setCurrentTab("main");
          }}
        >
          <img className="profile-img" src="images/bluishavatar.webp" alt="" />
          <span className="profile-text">Recruiter</span>
        </div>

        <div
          className="profile"
          onClick={() => {
            setUser("writer");
            setCurrentTab("main");
          }}
        >
          <img className="profile-img" src="images/redavatar.webp" alt="" />
          <span className="profile-text">Writer</span>
        </div>
        <div
          className="profile"
          onClick={() => {
            setUser("developer");
            setCurrentTab("main");
          }}
        >
          <img className="profile-img" src="images/greenavatar.webp" alt="" />
          <span className="profile-text">Developer</span>
        </div>
      </div>
    </>
  );
}
