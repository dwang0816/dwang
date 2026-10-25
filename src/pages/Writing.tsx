import { articles, caseStudy, formatDate } from '../data/writing';
import './Writing.css';

const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));

const whereColor: Record<string, string> = {
  Medium: 'var(--c-personal)',
  Notion: 'var(--c-template)',
  LinkedIn: 'var(--c-early)',
};

export default function Writing() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Writing</h1>
        <span className="kicker">{sorted.length} essays</span>
        <p>Mostly about making things and staying sharp around AI.</p>
      </div>

      <section className="panel">
        <ol className="wlist">
          {sorted.map((a) => (
            <li key={a.url}>
              <div className="wlist-main">
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="wlist-title">
                  {a.title}
                </a>
                <p className="wlist-summary">{a.summary}</p>
              </div>
              <div className="wlist-meta">
                <span className="tag" style={{ '--tag': whereColor[a.where] } as React.CSSProperties}>
                  {a.where}
                </span>
                <span className="mono">{formatDate(a.date)}</span>
                <span className="mono">{a.readTime}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel wcase" style={{ '--panel-accent': 'var(--c-client)' } as React.CSSProperties}>
        <div className="panel-head">
          <h2>Case study</h2>
          <span className="kicker">consulting</span>
        </div>
        <div className="wcase-body">
          <a href={caseStudy.url} target="_blank" rel="noopener noreferrer" className="wlist-title">
            {caseStudy.title}
          </a>
          <p className="wlist-summary">{caseStudy.summary}</p>
        </div>
      </section>
    </div>
  );
}
