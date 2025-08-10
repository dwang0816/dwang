// @ts-nocheck
import React from 'react';
import './Projects.css';

const projects = [
  // Special current project
  {
    title: 'Fulton Economic Development (FEDCO)',
    description: 'Economic development website for Fulton County highlighting relocation, small business programs (BizGro), county facts, workforce and top employers. Currently on Squarespace; in-progress React rebuild to modernize UX and performance.',
    stack: 'Squarespace → React (Rebuild)',
    category: 'Current Project',
    links: [
      { label: 'Current Site', url: 'https://www.fultondevelopment.org' },
      { label: 'React Preview', url: 'https://fedco.netlify.app' }
    ]
  },

  // New projects at the top in the exact order requested
  {
    title: 'Creekside Guest House (MissionsBnB)',
    description: 'Booking request site for a family-run guest house and adventures in North Central Indiana. Features a comprehensive reservation inquiry form and simple content management.',
    stack: 'WordPress',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://missionsbnb.com' }
    ]
  },
  {
    title: "Healey's Home Center",
    description: 'Local home center showcasing departments such as hardware, building materials, cabinetry, greenhouse, and services with clear CTAs and store information.',
    stack: 'WordPress',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://healeyshomecenter.com' }
    ]
  },
  {
    title: 'The Times Theater',
    description: 'Historic theater website highlighting events, live music, movies, and community programming with event discovery and newsletter signup.',
    stack: 'WordPress',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://thetimestheater.com' }
    ]
  },
  {
    title: 'Fulton County Airport',
    description: 'Municipal airport site offering facility info, services, and quick access to essential details like fuel, hours, and contacts.',
    stack: 'WordPress',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://fultoncountyairport.net' }
    ]
  },
  {
    title: 'Split Road Media',
    description: 'Agency website featuring web development, photography, videography, graphics, and print services with a content-first design.',
    stack: 'WordPress',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://splitroadmedia.com' }
    ]
  },
  {
    title: 'Hartland Enterprises',
    description: "Northern Indiana's provider of spray foam roofing, roof coatings, and foam insulation. Focused on evaluation through completion with trained specialists.",
    stack: 'WordPress',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://hartlandenterprise.com' }
    ]
  },
  {
    title: 'Kosciusko Senior Services',
    description: 'Nonprofit serving seniors with Mobile Meals, Handicapped Van Transportation, and a Senior Activity Center—supporting independence and connection.',
    stack: 'WordPress',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://kosciuskoseniors.org' }
    ]
  },

  // Existing projects follow
  {
    title: 'Fallen Timber',
    description: 'Professional tree service website for Warsaw, Indiana. Features comprehensive service offerings including tree removal, topping, chipping, and stump grinding. Built with WordPress for easy content management.',
    stack: 'WordPress, PHP, Custom Design',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://fallen-timber.com/' }
    ]
  },
  {
    title: 'Press Peels',
    description: 'Modern React-based website showcasing contemporary web development practices. Features responsive design and optimized performance for seamless user experience.',
    stack: 'React.js, Modern Web Technologies',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://presspeels.com' }
    ]
  },
  {
    title: 'Quality Lift Equipment',
    description: 'Industrial forklift equipment website featuring comprehensive product catalog including electric, diesel, and LPG forklifts. Includes inventory management and repair services.',
    stack: 'WordPress, PHP, E-commerce',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://qle-lift.com' }
    ]
  },
  {
    title: 'Visit Starke County',
    description: 'Tourism website for Starke County, Indiana. Showcases local attractions, outdoor activities, dining, and accommodations. Features event listings and visitor resources.',
    stack: 'WordPress, PHP, Tourism Platform',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://visitstarkecounty.com' }
    ]
  },
  {
    title: 'Mental Gym',
    description: 'Sometimes the hardest problems have the simplest solutions, and sometimes simple questions reveal the deepest truths. This platform creates spaces where your mind can wander, struggle, and discover.',
    stack: 'React.js, Modern Web Technologies',
    category: 'React',
    links: [
      { label: 'View Project', url: 'https://mental-gym.netlify.app' }
    ]
  },
  {
    title: 'NYC Trees',
    description: 'NYC Tree is a data visualization app that showcases the diverse and historic trees of New York City. Using interactive maps and detailed insights, users can explore dated trees across the city.',
    stack: 'React.js, MapBox.js, Ruby on Rails',
    category: 'Full Stack',
    links: [
      { label: 'View Site', url: 'https://scintillating-pasca-0fd429.netlify.app/' },
      { label: 'GitHub', url: 'https://github.com/dwang0816/Nyc-Trees-Frontend/blob/master/README.md' }
    ]
  },
  {
    title: 'Stripeify',
    description: 'A React.js web app where users can create, listen to, and vote on playlists. An interactive music platform that brings people together through shared musical experiences.',
    stack: 'React.js, Ruby on Rails, PostgreSQL',
    category: 'Full Stack',
    links: [
      { label: 'Frontend', url: 'https://github.com/dwang0816/Stripeify-Frontend' },
      { label: 'Backend', url: 'https://github.com/dwang0816/stripeify-backend' }
    ]
  },
  {
    title: 'Moodi Day',
    description: 'A creative space where users can share art, videos, and plant-based remedies designed to promote relaxation and well-being. A digital sanctuary focused on mental health and community support.',
    stack: 'React.js, Next.js',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://deploy--stunning-semolina-2fbfd2.netlify.app/' }
    ]
  },
  {
    title: 'iWomanTV',
    description: 'A social platform focused on empowerment and community. Built on WordPress with a content-forward design to support engagement and media publishing.',
    stack: 'WordPress, PHP',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://iwoman.tv/' }
    ]
  }
];

const Projects = () => (
  <div className="projects-container">
    <div className="projects-wrapper">
      <div className="projects-content">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.map((project, idx) => (
            <div className="project-item" key={idx}>
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <span className="project-category">{project.category}</span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-footer">
                <span className="project-stack">{project.stack}</span>
                <div className="project-links">
                  {project.links.map((link, lidx) => (
                    <a 
                      href={link.url} 
                      key={lidx} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Projects; 