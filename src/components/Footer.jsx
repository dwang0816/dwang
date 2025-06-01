// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <span>&copy; {new Date().getFullYear()} Dennis Wang</span>
      <nav className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/about">About</Link>
        <a href="https://www.linkedin.com/in/dennis-wang-b2a99370/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </nav>
    </div>
  </footer>
);

export default Footer; 