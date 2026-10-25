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
        <div className="prose">
          <p>
            I’m Dennis Wang, a software engineer in northern Indiana. I like small, fast,
            readable web apps, and I spend most of my time building them for local businesses,
            nonprofits and town governments through Split Road Media.
          </p>
          <p>
            Outside work I build tools around the things I actually do: tracking mahjong
            games, watching trading-card prices, keeping a family tree. Lately that means
            leaning hard on AI-assisted development to get from idea to working thing in an
            evening instead of a month.
          </p>
          <p>
            I write occasionally about creativity and about staying sharp in an age where
            software does more of the thinking.{' '}
            <a
              href="https://www.notion.so/Creating-Without-a-Cause-What-The-Beginner-s-Guide-Teaches-Us-About-Escaping-Creative-Paralysis-214d1d71cfeb8024adc0c4e293cd8ad8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creating Without a Cause
            </a>{' '}
            is the one to start with.
          </p>

          <h2>Contact</h2>
          <p>
            <a href="mailto:dwang0816@gmail.com">dwang0816@gmail.com</a>, or{' '}
            <a href="https://www.linkedin.com/in/denniswang4/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            .
          </p>
        </div>

        <aside className="about-side">
          <h2>Works with</h2>
          <ul className="about-skills">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <h2>Certifications</h2>
          <ul className="about-certs">
            {certs.map((c) => (
              <li key={c.title}>
                <span>{c.title}</span>
                <span className="about-cert-issuer">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
