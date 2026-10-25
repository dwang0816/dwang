import { Link } from 'react-router-dom';
import { byCategory, categories, categoryOrder, featured, projects } from '../data/projects';
import { articles, formatDate } from '../data/writing';
import ProjectTable from '../components/ProjectTable';
import './Home.css';

const recentWriting = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

export default function Home() {
  return (
    <div className="page home">
      <section className="home-hero panel">
        <div className="home-hero-text">
          <span className="kicker">Dennis Wang · software engineer · Indiana</span>
          <h1>
            I build websites and web apps for clients, and tools for myself around mahjong,
            trading cards and writing.
          </h1>
          <p>
            Full-stack: React and Next.js on the front, Postgres or Supabase behind, Stripe when
            money changes hands. Certified Scrum Master and ServiceNow administrator before that.
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

      <section className="panel home-section">
        <div className="panel-head">
          <h2>Lately</h2>
          <span className="kicker">most recent work</span>
          <Link to="/projects" className="panel-more">
            All projects
          </Link>
        </div>
        <ProjectTable items={featured()} showGroup />
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
