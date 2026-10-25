import { categories, type Project } from '../data/projects';
import './ProjectTable.css';

/**
 * One row per project, as a real table so the columns line up and screen
 * readers get headers. Name links out when there is a public URL; the last
 * column says what else there is: source, or why there is no link.
 */
export default function ProjectTable({
  items,
  showGroup = false,
}: {
  items: Project[];
  showGroup?: boolean;
}) {
  return (
    <table className="ptable">
      <thead>
        <tr>
          <th scope="col">Project</th>
          {showGroup && <th scope="col">Group</th>}
          <th scope="col">Stack</th>
          <th scope="col" className="ptable-year">
            Year
          </th>
          <th scope="col" className="ptable-open">
            Open
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <tr key={p.name}>
            <td className="ptable-main">
              <span className="ptable-name">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </span>
              <span className="ptable-blurb">{p.blurb}</span>
            </td>
            {showGroup && (
              <td className="ptable-group">
                <span className={`tag tag-${p.category}`}>{categories[p.category].title}</span>
              </td>
            )}
            <td className="ptable-stack">
              {p.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </td>
            <td className="ptable-year mono">{p.year}</td>
            <td className="ptable-open">
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="ptable-link">
                  Site
                </a>
              )}
              {p.code && (
                <a href={p.code} target="_blank" rel="noopener noreferrer" className="ptable-link">
                  Source
                </a>
              )}
              {!p.url && !p.code && <span className="ptable-access">{p.access ?? 'Offline'}</span>}
              {!p.url && p.code && p.access && <span className="ptable-access">{p.access}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
