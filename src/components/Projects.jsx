// @ts-nocheck
import React from 'react';
import './Projects.css';

const projects = [
  // Recent projects
  {
    title: 'Eastside Stories',
    description: 'A community storytelling and media platform amplifying AAPI voices, creatives, and culture. Built as an early-stage creator collective focused on authentic narratives, media, and community-driven content.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://eastsidestories.vercel.app' }
    ]
  },
  {
    title: 'Pure Play Mahjong',
    description: 'A lifestyle brand and shop centered around modernized, design-conscious mahjong sets. Targeted toward a younger, aesthetic-forward audience looking to bring a fresh take to a classic game.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://www.pureplaymahjong.com' }
    ]
  },
  {
    title: 'Bears by Brit',
    description: 'An artisan handmade shop by an independent creator specializing in custom plush bears and soft goods. A personal brand storefront bringing handcrafted charm to online retail.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://www.bearsbybrit.com' }
    ]
  },
  {
    title: 'QSpace Crafter',
    description: 'A content and workspace crafting tool designed to help users generate, structure, and organize ideas or knowledge. A lightweight builder for creative thinkers and structured minds.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://qspacecrafter.vercel.app' }
    ]
  },
  {
    title: 'Constantly Create Shop',
    description: 'A custom e-commerce storefront for an independent creator brand selling original products, art, or merch. Built as a standalone shop with a focus on personal brand identity.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://constantlycreateshop.vercel.app' }
    ]
  },
  {
    title: 'GED Prep',
    description: 'An interactive GED preparation platform to help learners study and practice for the General Educational Development test. Features subject-focused modules and practice materials.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://ged-prep.vercel.app' }
    ]
  },
  {
    title: 'Made Here Events',
    description: 'Event venue and experience website for Made Here Events. Showcasing spaces, packages, and booking information for a modern events destination.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://www.madehere.events/' }
    ]
  },
  {
    title: 'Rochester Metals',
    description: 'Website for Rochester Metals, a metal manufacturing and supply company. Features product and services information with a professional industrial design.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://rochestermetals.com/' }
    ]
  },
  {
    title: 'Core Mechanical',
    description: 'Industry-leading mechanical contracting website featuring complete HVAC, refrigeration, chiller, and industrial piping services. Designed for facility managers with 24/7 emergency support, planned maintenance programs, and custom design-build solutions.',
    stack: 'React, Vite, Modern Web',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://core-mechanical.vercel.app' }
    ]
  },
  {
    title: 'Elevated Solutions',
    description: 'Mechanical insulation, scaffolding, and maintenance services website for the Midwest region. Sister company modeled after Core Mechanical, featuring comprehensive industrial solutions with 24/7 emergency service and certified professionals.',
    stack: 'React, Vite, Modern Web',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://elevated-seven.vercel.app/' }
    ]
  },
  {
    title: "Mike's Trash Service",
    description: 'Local waste management service website for Fulton County and Rochester, Indiana. Features residential pickup, dumpster rentals, bulk pickup, and roll-off containers. Serving the community for over 30 years with honest, neighbor-focused service.',
    stack: 'React, Vite, Modern Web',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://mike-trash.vercel.app/' }
    ]
  },
  {
    title: 'City of Rochester',
    description: 'Municipal website for the City of Rochester, Indiana. Features city services, utilities, government information, events calendar, and community resources. Serving residents with transparency and dedication to community prosperity.',
    stack: 'WordPress, Municipal Platform',
    category: 'WordPress',
    links: [
      { label: 'View Site', url: 'https://rochester.in.us' }
    ]
  },
  {
    title: 'Constitution Manufacturing',
    description: 'Precision manufacturing company website showcasing specialized manufacturing capabilities and services. Professional industrial platform highlighting expertise and quality craftsmanship.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://www.constmfg.com' }
    ]
  },
  {
    title: 'Split Road Media - Internal Tools',
    description: 'Internal payment processing tool and client sign-up form system for Split Road Media. Streamlined workflow solutions for agency operations and client management.',
    stack: 'Internal Tools',
    category: 'Internal',
    links: []
  },
  {
    title: 'Discs4Bros',
    description: 'Disc golf product website and future e-commerce platform. Designed for disc golf enthusiasts with product showcase and future online store capabilities.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://discs4bros.com' }
    ]
  },

  {
    title: 'Fulton Economic Development (FEDCO)',
    description: 'Economic development website for Fulton County highlighting relocation opportunities, small business programs (BizGro), county facts, workforce data, and top employers.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://www.fultonedc.com/' }
    ]
  },

  {
    title: 'Ruthless Bar',
    description: 'Website for Ruthless Bar, a modern bar and nightlife destination. Features the venue\'s atmosphere, drink offerings, and event information with a bold, brand-forward design.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://ruthlessbar.com' }
    ]
  },
  {
    title: 'Akron Vet Clinic',
    description: 'Professional veterinary clinic website for Akron Vet Clinic. Showcases services, staff, and essential information for pet owners seeking compassionate and quality animal care.',
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://www.akronvetclinic.com' }
    ]
  },

  // Previous projects
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
    stack: 'React, Vite',
    category: 'React',
    links: [
      { label: 'View Site', url: 'https://fulton-county-airport.vercel.app/' }
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
      { label: 'View Site', url: 'https://www.hartlandenterprise.com/' }
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
    title: "The Beginner's Guide",
    description: 'A project built alongside an article about creative paralysis and what it means to make something without a clear reason. Less about answers, more about sitting with the questions.',
    stack: 'React.js, Netlify',
    category: 'React',
    links: [
      { label: 'View Project', url: 'https://the-beginners-guide.netlify.app' }
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
