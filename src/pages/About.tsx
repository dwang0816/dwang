import './About.css';

const skills = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'Python',
  'Ruby on Rails',
  'PostgreSQL',
  'Supabase',
  'Stripe',
  'AWS',
  'Azure Data Factory',
  'ServiceNow',
  'Datadog',
  'WordPress',
  'UI and UX',
];

const certs = [
  { title: 'ServiceNow Certified System Administrator', issuer: 'ServiceNow' },
  { title: 'Certified Scrum Master', issuer: 'Scrum Alliance' },
];

export default function About() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>About</h1>
      </div>

      <div className="about-grid">
        <section className="panel">
          <div className="panel-head">
            <h2>Dennis Wang</h2>
            <span className="kicker">software engineer</span>
          </div>
          <div className="about-body prose">
            <p>
              I’m a software engineer in New York City. I like small, fast, readable web apps, and
              I spend most of my time building them for clients: small businesses, nonprofits and
              town governments, many of them back in Indiana.
            </p>
            <p>
              Outside work I build tools around the things I actually do: tracking mahjong games,
              watching trading-card prices, keeping a family tree. Lately that means leaning hard on
              AI-assisted development to get from idea to working thing in an evening instead of a
              month.
            </p>
            <p>
              I write occasionally about creativity and about staying sharp in an age where software
              does more of the thinking.{' '}
              <a
                href="https://www.notion.so/Creating-Without-a-Cause-What-The-Beginner-s-Guide-Teaches-Us-About-Escaping-Creative-Paralysis-214d1d71cfeb8024adc0c4e293cd8ad8"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creating Without a Cause
              </a>{' '}
              is the one to start with.
            </p>
            <p>
              Reach me at <a href="mailto:dwang0816@gmail.com">dwang0816@gmail.com</a> or on{' '}
              <a href="https://www.linkedin.com/in/denniswang4/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              .
            </p>
          </div>
        </section>

        <div className="about-side">
          <section className="panel">
            <div className="panel-head">
              <h2>Works with</h2>
            </div>
            <ul className="about-skills">
              {skills.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Certifications</h2>
            </div>
            <ul className="about-certs">
              {certs.map((c) => (
                <li key={c.title}>
                  <span>{c.title}</span>
                  <span className="mono about-cert-issuer">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
