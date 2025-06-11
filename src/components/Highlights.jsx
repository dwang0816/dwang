import React from 'react';
import './Highlights.css';

const Highlights = () => {
  return (
    <div className="highlights-container">
      {/* Background Animation Layer - Can be easily removed */}
      <div className="highlights-bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
        <div className="floating-shape shape-6"></div>
        <div className="floating-shape shape-7"></div>
        <div className="floating-shape shape-8"></div>
      </div>
      
      <div className="highlights-main-content">
        <h2>Highlights</h2>
        <div className="highlights-content">
          
          {/* Featured Article */}
          <div className="highlight-section">
            <h3>Featured Article</h3>
            <div className="highlight-card article-card">
              <div className="highlight-info">
                <h4>Mental Gyms for the AI Age: Why Humanity Still Needs Conflict</h4>
                <p className="highlight-description">
                  In a world where AI handles more of our daily tasks, we're losing something precious: the struggle that makes us human. 
                  This piece explores why we still need challenges, disagreements, and mental friction to grow as people. 
                  It's about staying sharp, thinking for ourselves, and remembering that our greatest strength isn't convenience—it's resilience.
                </p>
                <div className="highlight-meta">
                  <span className="platform">Published on Medium</span>
                  <span className="divider">•</span>
                  <span className="topic">AI & Philosophy</span>
                </div>
              </div>
              <div className="highlight-links">
                <a 
                  href="https://medium.com/@dwang0816/mental-gyms-for-the-ai-age-why-humanity-still-needs-conflict-b1ae3fde043b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="primary-link"
                >
                  Read Article
                </a>
              </div>
            </div>
          </div>

          {/* Featured Project */}
          <div className="highlight-section">
            <h3>Featured Project</h3>
            <div className="highlight-card project-card">
              <div className="highlight-info">
                <h4>Mental Gym</h4>
                <p className="highlight-description">
                  Sometimes the hardest problems have the simplest solutions, and sometimes simple questions reveal the deepest truths. 
                  This platform creates spaces where your mind can wander, struggle, and discover. It's not about being smarter—
                  it's about being more curious, more resilient, and more comfortable with not knowing all the answers.
                </p>
                <div className="highlight-meta">
                  <span className="stack">React.js, Modern Web Technologies</span>
                  <span className="divider">•</span>
                  <span className="status">Live Project</span>
                </div>
              </div>
              <div className="highlight-links">
                <a 
                  href="https://app.netlify.com/projects/mental-gym/deploys/6849fe06728fba5e015ce345" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="primary-link"
                >
                  View Project
                </a>
              </div>
            </div>
          </div>

          {/* Connection Section */}
          <div className="highlight-connection">
            <div className="connection-card">
              <h4>The Connection</h4>
              <p>
                Writing about the need for intellectual challenge is one thing. Building something that actually provides it is another. 
                These two pieces—one philosophical, one practical—represent different sides of the same question: 
                How do we stay human in a world that's increasingly automated? The answer lies somewhere between understanding why it matters 
                and actually doing the work.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Highlights; 