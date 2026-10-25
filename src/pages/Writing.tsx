import { articles, caseStudy, formatDate } from '../data/writing';
import './Writing.css';

const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));

export default function Writing() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Writing</h1>
        <p>Essays on Medium and Notion, mostly about making things and staying sharp around AI.</p>
      </div>

      <ol className="writing-list">
        {sorted.map((a) => (
          <li key={a.url}>
            <h2>
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                {a.title}
              </a>
            </h2>
            <p className="writing-meta">
              {formatDate(a.date)}, {a.readTime} read on {a.where}
            </p>
            <p className="writing-summary">{a.summary}</p>
          </li>
        ))}
      </ol>

      <section className="writing-case">
        <h2>Case study</h2>
        <h3>
          <a href={caseStudy.url} target="_blank" rel="noopener noreferrer">
            {caseStudy.title}
          </a>
        </h3>
        <p>{caseStudy.summary}</p>
      </section>
    </div>
  );
}
