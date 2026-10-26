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
    stack: ['HTML', 'JSON', 'scheduled scan'],
    what: 'One page that answers one question: where can I actually get trading-card product this week? Official drops, Pokémon Center and Premium Bandai windows, big-box restocks, game-store finds, conventions and card shows, rescanned twice a day and published as plain JSON so the page costs nothing to run.',
    why: 'I collect One Piece and Pokémon, and I was tired of piecing this together from Discord, X and store apps every week. It is also the first thing I built that runs without me: a scheduled scan writes the data, a push redeploys the page, and I read it like everyone else.',
  },
  {
    name: 'TCG Forecast',
    url: 'https://tcg-forecast.vercel.app',
    code: 'https://github.com/dwang0816/tcg-forecast',
    stack: ['Next.js', 'Postgres', 'Drizzle'],
    what: 'Price tracker for Pokémon, One Piece and Riftbound. It ingests TCGplayer market prices every day, ranks the biggest risers and fallers, and scores each move by how much to trust it: do sellers agree on the price, is a swing that size normal for the card, and is a stale price just catching up.',
    why: 'Card prices move on hype, and the raw percentage lies more often than it tells the truth. I wanted a number I could defend. Working out that score taught me more about presenting data honestly than any client site has: every figure on a tile has to earn its place and explain itself.',
  },
];

export default function Home() {
  const alsoRecent = featured().filter((p) => !latest.some((l) => l.name === p.name));

  return (
    <div className="page home">
      <section className="home-hero panel">
        <div className="home-hero-text">
          <span className="kicker">Dennis Wang · software engineer · Indiana</span>
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

      <div className="home-row">
        <span className="kicker">Latest</span>
        <span className="home-row-note">Two tools for the hobby that eats most of my weekends.</span>
      </div>
      <div className="home-features">
        {latest.map((f) => (
          <article
            key={f.name}
            className="panel home-feature"
            style={{ '--panel-accent': 'var(--c-personal)' } as React.CSSProperties}
          >
            <div className="panel-head">
              <h2>
                <a href={f.url} target="_blank" rel="noopener noreferrer">
                  {f.name}
                </a>
              </h2>
              <span className="tag tag-personal">Personal</span>
            </div>
            <div className="home-feature-body">
              <p className="home-feature-what">{f.what}</p>
              <p className="kicker home-feature-kicker">Why it matters to me</p>
              <p className="home-feature-why">{f.why}</p>
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
            </div>
          </article>
        ))}
      </div>

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
              <em>The Beginner’s Guide</em> is a short game about someone who makes things with no
              audience in mind. I wrote an essay about what it says about creative paralysis, and
              built the smallest thing I could to go with it: a canvas, one colour, one brush size,
              Clear and Save. That is the whole app.
            </p>
            <p>
              The simplicity is the point. There is no account, no feed, nothing to optimise, so the
              engineering brain has nothing to do except notice the itch to add something, and sit
              with it. Draw, or don’t.
            </p>
            <div className="home-feature-foot">
              <span className="home-feature-links">
                <a
                  href="https://www.notion.so/Creating-Without-a-Cause-What-The-Beginner-s-Guide-Teaches-Us-About-Escaping-Creative-Paralysis-214d1d71cfeb8024adc0c4e293cd8ad8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ptable-link"
                >
                  Read the essay
                </a>
                <a
                  href="https://the-beginners-guide.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ptable-link"
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
