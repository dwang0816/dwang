// @ts-nocheck
import React from 'react';
import './About.css';

const skills = [
  'React.js', 'JavaScript (ES6+)', 'Vue.js', 'Python', 'Ruby on Rails',
  'Node.js', 'UI/UX Design', 'Datadog', 'Prometheus', 'Kibana',
  'APIs & Integrations', 'AWS Cloud Services', 'ServiceNow',
  'AI-Assisted Development', 'Cursor', 'GPT'
];

const certs = [
  { title: 'ServiceNow Certified System Administrator', issuer: 'ServiceNow' },
  { title: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance' },
];

const About = () => (
  <div className="about-container">
    <div className="about-wrapper">
      <h2 className="about-title">About Me</h2>

      <div className="about-grid">
        <div className="about-left">
          <section className="about-section">
            <p>
              Hi, I am Dennis Wang. I am a software engineer passionate about building minimal,
              user-friendly web applications. I love working with React.js and modern web
              technologies to create beautiful, accessible, and performant experiences.
            </p>
          </section>

          <section className="about-section">
            <h3>Current Focus</h3>
            <p>
              I am exploring how to use AI tools to build impactful and practical projects fast.
              I am interested in how AI-assisted development can help turn ideas into working
              solutions quickly, making programming more accessible and reducing the time between
              concept and reality.
            </p>
            <p>
              I recently wrote about{' '}
              <a
                href="https://www.notion.so/Creating-Without-a-Cause-What-The-Beginner-s-Guide-Teaches-Us-About-Escaping-Creative-Paralysis-214d1d71cfeb8024adc0c4e293cd8ad8?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                what "The Beginner's Guide" teaches us about escaping creative paralysis
              </a>
              , exploring how creation without purpose can paradoxically become the most
              meaningful work of all.
            </p>
          </section>

          <section className="about-section">
            <h3>Contact</h3>
            <p>
              Email me at{' '}
              <a href="mailto:dwang0816@gmail.com">dwang0816@gmail.com</a>{' '}
              or connect on{' '}
              <a href="https://www.linkedin.com/in/denniswang4/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>.
            </p>
          </section>
        </div>

        <div className="about-right">
          <section className="about-section">
            <h3>Skills</h3>
            <div className="skills-chips">
              {skills.map((skill, i) => (
                <span className="skill-chip" key={i}>{skill}</span>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h3>Certifications</h3>
            <div className="certs-list">
              {certs.map((cert, i) => (
                <div className="cert-item" key={i}>
                  <span className="cert-title">{cert.title}</span>
                  <span className="cert-issuer">{cert.issuer}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

export default About;
