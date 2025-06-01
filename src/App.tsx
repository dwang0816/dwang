import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Projects from './components/Projects';
import About from './components/About';
import './App.css';

const Sidebar = () => (
  <aside className="sidebar">
    <div>
      <div className="sidebar-title">Dennis<br/>Wang</div>
      <div className="sidebar-subtitle">Software Engineer. Cloud, Observability, Hardware &amp; DevOps.</div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </nav>
    </div>
    <div className="sidebar-footer">
      <div style={{fontSize: '1.2em', marginBottom: 8}}>
        <span style={{marginRight: 8}}>📡</span>
        <span style={{marginRight: 8}}>💬</span>
        <span>✉️</span>
      </div>
    </div>
  </aside>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
