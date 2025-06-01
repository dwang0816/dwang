// @ts-nocheck
import React from 'react';
import './About.css';

const About = () => (
  <div className="about-container">
    <h2>About Me</h2>
    <p>
      Hi, I'm Dennis Wang. I'm a software engineer passionate about building minimal, user-friendly web applications. I love working with React.js and modern web technologies to create beautiful, accessible, and performant experiences.
    </p>
    <h3>Skills</h3>
    <ul className="skills-list">
      <li>React.js &amp; JavaScript (ES6+)</li>
      <li>Ruby on Rails</li>
      <li>Node.js</li>
      <li>UI/UX Design</li>
      <li>Data Visualization</li>
      <li>APIs &amp; Integrations</li>
    </ul>
    <h3>Contact</h3>
    <p>
      Connect with me on <a href="https://www.linkedin.com/in/dennis-wang-b2a99370/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
    </p>
  </div>
);

export default About; 