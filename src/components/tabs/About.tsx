export default function About() {
  return (
    <>
      <div className="tab-wrapper about-wrapper">
        <section className="about-1">
          <div className="about-text">
            <img src="images/aboutlogo.webp" className="about-title" />

            <p className="about-lead">
              I&apos;m a Computer Science student at McMaster University who
              enjoys building software that feels both thoughtful and useful.
            </p>

            <p className="about-paragraph">
              My favorite projects sit at the intersection of engineering and
              creativity, whether that means full-stack apps, AI-powered tools,
              or immersive web experiences like this portfolio.
            </p>

            <p className="about-paragraph">
              Outside of coding, I spend time writing, exploring new AI tools,
              training at the gym, and getting better at public speaking. I care
              a lot about learning quickly, improving deliberately, and making
              work that people actually remember.
            </p>

            <div className="about-callout">
              <span className="about-improve">
                I&apos;m always trying to improve.
              </span>
            </div>
          </div>
        </section>

        <section className="currently-working">
          <div className="about-2">
            <div className="about-2-text">
              <p className="about-kicker">Currently Building</p>
              <h1 className="working-title">MusiWrite</h1>

              <p className="working-paragraph">
                MusiWrite is an AI-powered playlist maker designed for writers.
                The goal is to help people find the right sound, mood, and pace
                for the scene they&apos;re trying to write.
              </p>
            </div>

            <img src="images/musiwrite.webp" alt="MusiWrite project preview" />
          </div>
        </section>
      </div>
    </>
  );
}
