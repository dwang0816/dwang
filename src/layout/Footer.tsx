import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Dennis Wang</span>
        <a href="mailto:dwang0816@gmail.com">dwang0816@gmail.com</a>
      </div>
    </footer>
  );
}
