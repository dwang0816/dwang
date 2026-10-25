import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Dennis Wang</span>
        <a href="mailto:dwang0816@gmail.com">dwang0816@gmail.com</a>
        <a href="https://github.com/dwang0816/dwang" target="_blank" rel="noopener noreferrer">
          Source for this site
        </a>
      </div>
    </footer>
  );
}
