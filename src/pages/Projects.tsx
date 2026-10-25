import { useDeferredValue, useMemo, useState } from 'react';
import { byCategory, categories, categoryOrder, projects, type Category, type Project } from '../data/projects';
import ProjectTable from '../components/ProjectTable';
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
  const [only, setOnly] = useState<Category | null>(null);
  const q = useDeferredValue(query.trim());

  const groups = useMemo(
    () =>
      categoryOrder.map((key) => ({
        key,
        ...categories[key],
        all: byCategory(key).length,
        items: byCategory(key).filter((p) => matches(p, q)),
      })),
    [q],
  );
  const visible = groups.filter((g) => (only ? g.key === only : true));
  const shown = visible.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Projects</h1>
        <span className="kicker">
          {shown} of {total}
        </span>
        <p>Everything shipped, grouped by who it was for. Newest first within each group.</p>
      </div>

      <div className="pfilters panel">
        <label className="pfilters-search">
          <span className="visually-hidden">Filter projects</span>
          <input
            type="search"
            placeholder="Filter by name, stack or year"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </label>
        <div className="pfilters-groups" role="group" aria-label="Show one group">
          <button
            type="button"
            className={`pfilter ${only === null ? 'is-on' : ''}`}
            onClick={() => setOnly(null)}
          >
            All <span className="mono">{total}</span>
          </button>
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              className={`pfilter pfilter-${g.key} ${only === g.key ? 'is-on' : ''}`}
              style={{ '--tag': g.color } as React.CSSProperties}
              onClick={() => setOnly(only === g.key ? null : g.key)}
              aria-pressed={only === g.key}
            >
              {g.title} <span className="mono">{q ? `${g.items.length}/${g.all}` : g.all}</span>
            </button>
          ))}
        </div>
      </div>

      {shown === 0 ? (
        <p className="pempty">
          Nothing matches “{q}”{only ? ` in ${categories[only].title}` : ''}. Try a shorter word,
          a technology like Next.js, or a year.
        </p>
      ) : (
        visible.map((g) =>
          g.items.length === 0 ? null : (
            <section
              key={g.key}
              id={g.key}
              className="panel pgroup"
              style={{ '--panel-accent': g.color } as React.CSSProperties}
            >
              <div className="panel-head">
                <h2 style={{ color: g.color }}>{g.title}</h2>
                <span className="kicker">
                  {g.items.length === g.all ? g.all : `${g.items.length} of ${g.all}`}
                </span>
                <p>{g.blurb}</p>
              </div>
              <ProjectTable items={g.items} />
            </section>
          ),
        )
      )}
    </div>
  );
}
