// @ts-nocheck
import React from 'react';
import './Projects.css';

const projects = [
  {
    title: 'Mental Gym',
    description: 'Sometimes the hardest problems have the simplest solutions, and sometimes simple questions reveal the deepest truths. This platform creates spaces where your mind can wander, struggle, and discover. It\'s not about being smarter—it\'s about being more curious, more resilient, and more comfortable with not knowing all the answers.',
    stack: 'React.js, Modern Web Technologies',
    links: [
      { label: 'View Project', url: 'https://mental-gym.netlify.app' }
    ]
  },
  {
    title: 'NYC Trees',
    description: 'NYC Tree is a data visualization app that showcases the diverse and historic trees of New York City. Using interactive maps and detailed insights, users can explore dated trees across the city, uncovering their species, age, and ecological impact.',
    stack: 'React.js, MapBox.js, Ruby on Rails',
    links: [
      { label: 'View Site', url: 'https://scintillating-pasca-0fd429.netlify.app/' },
      { label: 'GitHub', url: 'https://github.com/dwang0816/Nyc-Trees-Frontend/blob/master/README.md' }
    ]
  },
  {
    title: 'Stripeify',
    description: 'A React.js web app where users can create, listen to, and vote on playlists. An interactive music platform that brings people together through shared musical experiences and community-driven content.',
    stack: 'React.js, Ruby on Rails, PostgreSQL, AudioSpectrum',
    links: [
      { label: 'Frontend', url: 'https://github.com/dwang0816/Stripeify-Frontend' },
      { label: 'Backend', url: 'https://github.com/dwang0816/stripeify-backend' }
    ]
  },
  {
    title: 'Moodi Day',
    description: 'A creative space where users can share art, videos, and plant-based remedies designed to promote relaxation and well-being. A digital sanctuary focused on mental health and community support.',
    stack: 'React.js, Next.js',
    links: [
      { label: 'View Site', url: 'https://deploy--stunning-semolina-2fbfd2.netlify.app/' }
    ]
  },
  {
    title: 'iWomanTV',
    description: 'A social media platform dedicated to fostering meaningful engagement and empowerment for women and minorities. Building community through shared stories and authentic connections.',
    stack: 'WordPress, PHP',
    links: [
      { label: 'View Site', url: 'https://iwoman.tv/' }
    ]
  }
];

const Projects = () => (
  <div className="projects-container">
    <div className="projects-content">
      <h2>Projects</h2>
      <div className="projects-list">
        {projects.map((project, idx) => (
          <div className="project-card" key={idx}>
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span className="project-stack">{project.stack}</span>
              <span className="divider">•</span>
              <span className="project-status">Live Project</span>
            </div>
            <div className="project-links">
              {project.links.map((link, lidx) => (
                <a 
                  href={link.url} 
                  key={lidx} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="primary-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Projects; 