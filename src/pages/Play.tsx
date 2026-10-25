import { byCategory, categories } from '../data/projects';
import ProjectList from '../components/ProjectList';

export default function Play() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>{categories.play.title}</h1>
        <p>{categories.play.blurb}</p>
      </div>
      <ProjectList items={byCategory('play')} />
    </div>
  );
}
