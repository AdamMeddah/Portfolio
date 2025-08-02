export default function LaunchScreen({ setCurrentTab }) {
  return (
    <>
      <h1 id="launch-title"> Who's Watching?</h1>

      <div id="profile-row">
        <div className="profile">
          <img className="profile-img" src="images/bluishavatar.png" alt="" />
          <span className="profile-text">Recruiter</span>
        </div>
        <div className="profile">
          <img className="profile-img" src="images/greenavatar.jpg" alt="" />
          <span className="profile-text">Developer</span>
        </div>
        <div className="profile">
          <img className="profile-img" src="images/redavatar.jpg" alt="" />
          <span className="profile-text">Writer</span>
        </div>
      </div>
    </>
  );
}
