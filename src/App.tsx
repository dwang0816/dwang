import { lazy, Suspense, useEffect } from 'react';
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
