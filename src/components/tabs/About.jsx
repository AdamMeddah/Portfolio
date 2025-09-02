import Navbar from "../Navbar";

export default function About({ user, setCurrentTab }) {
  return (
    <>
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass={"project-navbar"}
      />

      <div className="about-1">
        <img src="" alt="" />
      </div>
    </>
  );
}
