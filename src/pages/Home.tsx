import { Link } from 'react-router-dom';
import { featured, projects } from '../data/projects';
import { articles, formatDate } from '../data/writing';
import './Home.css';

const recentWriting = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
const clientCount = projects.filter((p) => p.category === 'client').length;

export default function Home() {
  return (
    <div className="page home">
      <section className="home-intro">
        <h1>
          I build websites and web apps. Most of them for small businesses and towns across
          northern Indiana; the rest for myself, usually about mahjong, trading cards or writing.
        </h1>
        <p>
          Full-stack engineer at Split Road Media. Certified Scrum Master and ServiceNow
          administrator before that. {clientCount} client sites shipped so far, and counting.
        </p>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>Lately</h2>
          <Link to="/projects">All projects</Link>
        </div>
        <ul className="home-list">
          {featured().map((p) => (
            <li key={p.name}>
              <a href={p.url ?? p.code} target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
              <span>{p.blurb}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>Writing</h2>
          <Link to="/writing">All writing</Link>
        </div>
        <ul className="home-list">
          {recentWriting.map((a) => (
            <li key={a.url}>
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                {a.title}
              </a>
              <span>
                {formatDate(a.date)}, {a.readTime} on {a.where}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
