import type { Project } from '../data/projects';
import './ProjectList.css';

/**
 * One row per project. The name is the link when there is a public URL; otherwise
 * the row says why not (internal tool, private, password protected) and links the
 * source if that is public instead.
 */
export default function ProjectList({ items }: { items: Project[] }) {
  return (
    <ul className="plist">
      {items.map((p) => (
        <li key={p.name} className="plist-row">
          <div className="plist-main">
            <h3 className="plist-name">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </h3>
            <p className="plist-blurb">{p.blurb}</p>
            <div className="plist-meta-mobile">
              <span>{p.stack.join(', ')}</span>
              <span>{p.year}</span>
            </div>
            {(p.access || p.code) && (
              <p className="plist-aside">
                {p.access && <span>{p.access}</span>}
                {p.access && p.code && <span aria-hidden="true"> · </span>}
                {p.code && (
                  <a href={p.code} target="_blank" rel="noopener noreferrer">
                    Source
                  </a>
                )}
              </p>
            )}
          </div>
          <div className="plist-stack">{p.stack.join(', ')}</div>
          <div className="plist-year">{p.year}</div>
        </li>
      ))}
    </ul>
  );
}
