import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Projects from './components/Projects';
import About from './components/About';
import Highlights from './components/Highlights';
import GlobeContainer from './components/GlobeContainer';
import './App.css';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        <div className="sidebar-title">Dennis<br/>Wang</div>
        <div className="sidebar-subtitle">Full-Stack Software Engineer | Certified Scrum Master | ServiceNow Certified System Administrator | Cloud & AI Enthusiast | Driving Digital Transformation and Scalable Solutions.</div>
        <nav>
          <NavLink to="/" end onClick={handleLinkClick}>Home</NavLink>
          <NavLink to="/highlights" onClick={handleLinkClick}>Highlights</NavLink>
          <NavLink to="/about" onClick={handleLinkClick}>About</NavLink>
          <NavLink to="/projects" onClick={handleLinkClick}>Projects</NavLink>
          <a href="https://www.github.com/dwang0816/" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/denniswang4/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </nav>
        <GlobeContainer />
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="layout">
        <button 
          className="mobile-menu-button" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="main" onClick={closeSidebar}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
