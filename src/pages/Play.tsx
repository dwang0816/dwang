import { byCategory, categories } from '../data/projects';
import ProjectTable from '../components/ProjectTable';

export default function Play() {
  const items = byCategory('play');
  return (
    <div className="page">
      <div className="page-head">
        <h1>{categories.play.title}</h1>
        <span className="kicker">{items.length} things to open</span>
        <p>{categories.play.blurb}</p>
      </div>
      <section className="panel" style={{ '--panel-accent': categories.play.color } as React.CSSProperties}>
        <ProjectTable items={items} />
      </section>
    </div>
  );
}
