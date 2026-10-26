import { Link } from 'react-router-dom';
import { byCategory, categories, categoryOrder, featured, projects } from '../data/projects';
import { articles, formatDate } from '../data/writing';
import ProjectTable from '../components/ProjectTable';
import './Home.css';

const recentWriting = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

const latest = [
  {
    name: 'Chasing Grails',
    url: 'https://chasing-grails.vercel.app',
    code: 'https://github.com/dwang0816/chasing-grails',
    stack: ['HTML', 'JSON'],
    what: 'Where to find trading-card product this week: drops, restocks, drawings, conventions and card shows. Rescanned twice a day.',
  },
  {
    name: 'TCG Forecast',
    url: 'https://tcg-forecast.vercel.app',
    code: 'https://github.com/dwang0816/tcg-forecast',
    stack: ['Next.js', 'Postgres'],
    what: 'Daily price movers for Pokémon, One Piece and Riftbound cards, with a score for how much to trust each move.',
  },
];

export default function Home() {
  const alsoRecent = featured().filter((p) => !latest.some((l) => l.name === p.name));

  return (
    <div className="page home">
      <section className="home-hero panel">
        <div className="home-hero-text">
          <span className="kicker">Dennis Wang · software engineer · New York City</span>
          <h1>I build websites and tools.</h1>
          <p>
            Websites for clients: small businesses, nonprofits and towns. Tools for myself, around
            mahjong, trading cards and writing. React and Next.js on the front, Postgres or Supabase
            behind, Stripe when money changes hands.
          </p>
        </div>
        <ul className="home-stats" aria-label="Projects by group">
          {categoryOrder.map((key) => (
            <li key={key} style={{ '--tag': categories[key].color } as React.CSSProperties}>
              <Link to={`/projects#${key}`}>
                <span className="home-stat-n mono">{byCategory(key).length}</span>
                <span className="home-stat-label">{categories[key].title}</span>
              </Link>
            </li>
          ))}
          <li className="home-stat-total">
            <Link to="/projects">
              <span className="home-stat-n mono">{projects.length}</span>
              <span className="home-stat-label">All projects</span>
            </Link>
          </li>
        </ul>
      </section>

      <section
        className="panel home-latest"
        style={{ '--panel-accent': 'var(--c-personal)' } as React.CSSProperties}
      >
        <div className="panel-head">
          <h2>Latest</h2>
          <span className="kicker">trading cards</span>
        </div>
        <div className="home-latest-grid">
          {latest.map((f) => (
            <article key={f.name} className="home-latest-item">
              <h3>
                <a href={f.url} target="_blank" rel="noopener noreferrer">
                  {f.name}
                </a>
              </h3>
              <p>{f.what}</p>
              <div className="home-feature-foot">
                <span className="home-feature-stack">
                  {f.stack.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </span>
                <span className="home-feature-links">
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="ptable-link">
                    Site
                  </a>
                  <a href={f.code} target="_blank" rel="noopener noreferrer" className="ptable-link">
                    Source
                  </a>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="panel home-guide"
        style={{ '--panel-accent': 'var(--c-play)' } as React.CSSProperties}
      >
        <a
          href="https://the-beginners-guide.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="home-guide-shot"
        >
          <img
            src="/beginners-guide.webp"
            width={800}
            height={506}
            loading="lazy"
            decoding="async"
            alt="The Beginner's Guide canvas: a white drawing area with a colour swatch, a brush-size slider, and Clear and Save buttons."
          />
        </a>
        <div className="home-guide-text">
          <div className="panel-head home-guide-head">
            <h2>The Beginner’s Guide</h2>
            <span className="tag tag-play">Play</span>
            <span className="tag" style={{ '--tag': 'var(--c-template)' } as React.CSSProperties}>
              Essay
            </span>
          </div>
          <div className="home-guide-body">
            <p>
              <em>The Beginner’s Guide</em> is a game about a developer who builds strange little
              rooms for nobody. I wrote about why that is the way out of creative block: build
              without a point until the act itself becomes the meaning. The canvas is that idea
              with a brush. Nothing to finish, nobody to show.
            </p>
            <div className="home-feature-foot">
              <span className="home-feature-links">
                <a
                  href="https://www.notion.so/Creating-Without-a-Cause-What-The-Beginner-s-Guide-Teaches-Us-About-Escaping-Creative-Paralysis-214d1d71cfeb8024adc0c4e293cd8ad8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ptable-link"
                  style={{ '--link': 'var(--c-template)' } as React.CSSProperties}
                >
                  Read the essay
                </a>
                <a
                  href="https://the-beginners-guide.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ptable-link"
                  style={{ '--link': 'var(--c-play)' } as React.CSSProperties}
                >
                  Open the canvas
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel home-section">
        <div className="panel-head">
          <h2>Also recent</h2>
          <span className="kicker">client and personal</span>
          <Link to="/projects" className="panel-more">
            All projects
          </Link>
        </div>
        <ProjectTable items={alsoRecent} showGroup />
      </section>

      <section className="panel home-section">
        <div className="panel-head">
          <h2>Writing</h2>
          <span className="kicker">essays</span>
          <Link to="/writing" className="panel-more">
            All writing
          </Link>
        </div>
        <ul className="home-writing">
          {recentWriting.map((a) => (
            <li key={a.url}>
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                {a.title}
              </a>
              <span className="mono">
                {formatDate(a.date)} · {a.readTime} · {a.where}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
