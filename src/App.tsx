import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Masthead from './layout/Masthead';
import Footer from './layout/Footer';
import Home from './pages/Home';
import './layout/Page.css';

// Home ships in the main bundle because it is the landing page; the other
// routes load the first time they are visited.
const Projects = lazy(() => import('./pages/Projects'));
const Writing = lazy(() => import('./pages/Writing'));
const Play = lazy(() => import('./pages/Play'));
const About = lazy(() => import('./pages/About'));

// Decoration waits until the page is idle, so it never delays the content.
const Backdrop = lazy(() => import('./layout/Backdrop'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function useIdle(): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) {
      w.requestIdleCallback(() => setIdle(true));
    } else {
      const t = setTimeout(() => setIdle(true), 600);
      return () => clearTimeout(t);
    }
  }, []);
  return idle;
}

export default function App() {
  const idle = useIdle();
  return (
    <BrowserRouter>
      <ScrollToTop />
      {idle && (
        <Suspense fallback={null}>
          <Backdrop />
        </Suspense>
      )}
      <Masthead />
      <main>
        <Suspense fallback={<div className="page" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/play" element={<Play />} />
            <Route path="/about" element={<About />} />
            <Route path="/highlights" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
