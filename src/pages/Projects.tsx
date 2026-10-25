import { useDeferredValue, useMemo, useState } from 'react';
import { byCategory, categories, categoryOrder, projects, type Category, type Project } from '../data/projects';
import ProjectList from '../components/ProjectList';
import './Projects.css';

const total = projects.length;

function matches(p: Project, q: string): boolean {
  if (!q) return true;
  const hay = `${p.name} ${p.blurb} ${p.stack.join(' ')} ${p.year}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export default function Projects() {
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query.trim());

  const groups = useMemo(
    () =>
      categoryOrder.map((key) => ({
        key,
        ...categories[key],
        items: byCategory(key).filter((p) => matches(p, q)),
      })),
    [q],
  );
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Projects</h1>
        <p>
          {total} sites and apps, grouped by who they were for. Newest first within each group.
        </p>
      </div>

      <div className="projects-controls">
        <label className="projects-search">
          <span className="visually-hidden">Filter projects</span>
          <input
            type="search"
            placeholder="Filter by name, stack or year"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </label>
        <nav className="projects-jump" aria-label="Project groups">
          {groups.map((g) => (
            <a key={g.key} href={`#${g.key}`} className={g.items.length === 0 ? 'is-empty' : ''}>
              {g.title}
              <span className="projects-jump-count">{g.items.length}</span>
            </a>
          ))}
        </nav>
      </div>

      {shown === 0 ? (
        <p className="projects-empty">
          Nothing matches “{q}”. Try a shorter word, a technology like Next.js, or a year.
        </p>
      ) : (
        groups.map((g) =>
          g.items.length === 0 ? null : (
            <section key={g.key} id={g.key} className="projects-group">
              <div className="projects-group-head">
                <h2>{g.title}</h2>
                <p>{g.blurb}</p>
              </div>
              <ProjectList items={g.items} />
            </section>
          ),
        )
      )}
    </div>
  );
}

export type { Category };
