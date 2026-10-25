import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Masthead.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/writing', label: 'Writing' },
  { to: '/play', label: 'Play' },
  { to: '/about', label: 'About' },
];

export default function Masthead() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link to="/" className="masthead-name" onClick={close}>
          Dennis Wang
        </Link>

        <button
          type="button"
          className="masthead-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav id="site-nav" className={`masthead-nav ${open ? 'is-open' : ''}`} aria-label="Site">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
              {l.label}
            </NavLink>
          ))}
          <span className="masthead-sep" aria-hidden="true" />
          <a href="https://github.com/dwang0816" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/denniswang4/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>
    </header>
  );
}
