// @ts-nocheck
import React from 'react';
import './Projects.css';

const projects = [
  {
    title: 'NYC Trees',
    description: `NYC Tree is a data visualization app that showcases the diverse and historic trees of New York City. Using interactive maps and detailed insights, users can explore dated trees across the city, uncovering their species, age, and ecological impact.`,
    stack: 'React.js, MapBox.js, Ruby on Rails',
    links: [
      { label: 'Site', url: 'https://scintillating-pasca-0fd429.netlify.app/' },
      { label: 'Github', url: 'https://github.com/dwang0816/Nyc-Trees-Frontend/blob/master/README.md' }
    ]
  },
  {
    title: 'Stripeify',
    description: 'A React.js web app where users can create, listen to, and vote on playlists.',
    stack: 'React.js, Ruby on Rails, PostgreSQL, AudioSpectrum',
    links: [
      { label: 'Frontend', url: 'https://github.com/dwang0816/Stripeify-Frontend' },
      { label: 'Backend', url: 'https://github.com/dwang0816/stripeify-backend' }
    ]
  },
  {
    title: 'Moodi Day',
    description: 'A creative space where users can share art, videos, and plant-based remedies designed to promote relaxation and well-being.',
    stack: 'React.js, Next.js',
    links: [
      { label: 'Site', url: 'https://deploy--stunning-semolina-2fbfd2.netlify.app/' }
    ]
  },
  {
    title: 'iWomanTV',
    description: 'A social media platform dedicated to fostering meaningful engagement and empowerment for women and minorities.',
    stack: 'Wordpress, PHP',
    links: [
      { label: 'Site', url: 'https://iwoman.tv/' }
    ]
  }
];

const Projects = () => (
  <div className="projects-container">
    <h2>Projects</h2>
    <div className="projects-list">
      {projects.map((project, idx) => (
        <div className="project-card" key={idx}>
          <div className="project-info">
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <p className="project-stack">{project.stack}</p>
            <div className="project-links">
              {project.links.map((link, lidx) => (
                <a href={link.url} key={lidx} target="_blank" rel="noopener noreferrer">{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Projects; 