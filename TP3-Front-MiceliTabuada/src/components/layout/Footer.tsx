import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MiApp — Miceli &amp; Tabuada</p>
    </footer>
  );
};

export default Footer;
