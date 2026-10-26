import { useDeferredValue, useMemo, useState } from 'react';
import { byCategory, categories, categoryOrder, projects, vias, type Category, type Project, type Via } from '../data/projects';
import ProjectTable from '../components/ProjectTable';
import './Projects.css';

const total = projects.length;

function matches(p: Project, q: string): boolean {
  if (!q) return true;
  const hay = `${p.name} ${p.blurb} ${p.stack.join(' ')} ${p.year} ${p.via ?? ''}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

/** One selection: a client arrangement, a non-client group, or everything. */
type Pick = 'all' | Via | Exclude<Category, 'client'>;

const PICKS: { key: Pick; title: string; color: string }[] = [
  { key: 'company', title: vias.company.title, color: vias.company.color },
  { key: 'contract', title: vias.contract.title, color: vias.contract.color },
  ...categoryOrder
    .filter((c): c is Exclude<Category, 'client'> => c !== 'client')
    .map((c) => ({ key: c, title: categories[c].title, color: categories[c].color })),
];

function keep(p: Project, pick: Pick): boolean {
  if (pick === 'all') return true;
  if (pick === 'company' || pick === 'contract') return p.via === pick;
  return p.category === pick;
}

export default function Projects() {
  const [query, setQuery] = useState('');
  const [pick, setPick] = useState<Pick>('all');
  const q = useDeferredValue(query.trim());

  const groups = useMemo(
    () =>
      categoryOrder.map((key) => ({
        key,
        ...categories[key],
        all: byCategory(key).length,
        items: byCategory(key).filter((p) => matches(p, q) && keep(p, pick)),
      })),
    [q, pick],
  );
  const shown = groups.reduce((n, g) => n + g.items.length, 0);
  const countFor = (k: Pick) => projects.filter((p) => keep(p, k) && matches(p, q)).length;

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
        <div className="pfilters-groups" role="group" aria-label="Show">
          {PICKS.map((o) => (
            <button
              key={o.key}
              type="button"
              className={`pfilter pfilter-${o.key} ${pick === o.key ? 'is-on' : ''}`}
              style={{ '--tag': o.color } as React.CSSProperties}
              onClick={() => setPick(pick === o.key ? 'all' : o.key)}
              aria-pressed={pick === o.key}
            >
              {o.title} <span className="mono">{countFor(o.key)}</span>
            </button>
          ))}
          <button
            type="button"
            className={`pfilter ${pick === 'all' ? 'is-on' : ''}`}
            onClick={() => setPick('all')}
          >
            All <span className="mono">{countFor('all')}</span>
          </button>
        </div>
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
      </div>

      {shown === 0 ? (
        <p className="pempty">
          Nothing matches{q ? ` “${q}”` : ''}
          {pick !== 'all' ? ` in ${PICKS.find((o) => o.key === pick)?.title.toLowerCase()}` : ''}.
          Try a shorter word, a technology like Next.js, or a year.
        </p>
      ) : (
        groups.map((g) =>
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

export type { Category };
