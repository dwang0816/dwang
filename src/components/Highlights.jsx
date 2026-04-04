import React from 'react';
import './Highlights.css';

const Highlights = () => {
  return (
    <div className="highlights-container">
      <div className="highlights-content">
        <h2>Highlights</h2>

        <div className="highlights-cards-row">
          {/* Featured Article */}
          <div className="highlight-section">
            <h3>Featured Article</h3>
            <div className="highlight-card">
              <h4>Creating Without a Cause: What The Beginner's Guide Teaches Us About Escaping Creative Paralysis</h4>
              <p className="highlight-description">
                Most people wait for a reason to create. A purpose, an audience, a goal.
                This piece looks at what happens when you remove all of that — and why creating
                without a cause might be the only way some people ever create at all.
              </p>
              <div className="highlight-meta">
                <span className="platform">Published on Notion</span>
                <span className="divider">•</span>
                <span className="topic">Creativity / Philosophy</span>
              </div>
              <div className="highlight-links">
                <a
                  href="https://www.notion.so/Creating-Without-a-Cause-What-The-Beginner-s-Guide-Teaches-Us-About-Escaping-Creative-Paralysis-214d1d71cfeb8024adc0c4e293cd8ad8"
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
            <div className="highlight-card">
              <h4>The Beginner's Guide</h4>
              <p className="highlight-description">
                A project built alongside the article — exploring the same ideas through
                something you can actually interact with. Less about having the answers,
                more about sitting with the questions.
              </p>
              <div className="highlight-meta">
                <span className="stack">React.js, Netlify</span>
                <span className="divider">•</span>
                <span className="status">Live Project</span>
              </div>
              <div className="highlight-links">
                <a
                  href="https://the-beginners-guide.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-link"
                >
                  View Project
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Highlights;
