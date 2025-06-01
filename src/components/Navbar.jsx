// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-logo">Dennis Wang</div>
    <ul className="navbar-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/projects">Projects</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><a href="https://www.linkedin.com/in/dennis-wang-b2a99370/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
    </ul>
  </nav>
);

export default Navbar; 