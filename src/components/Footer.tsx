import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="section-padding py-12 border-t border-border">
      <div className="flex flex-col items-center justify-between gap-8">
        <img src={logo} alt="Bombshell" className="h-24 w-auto invert" />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <a href="https://www.instagram.com/bombshell.usa?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>
          <span className="w-px h-3 bg-border" />
          <a href="https://www.tiktok.com/@bombshell.usa?_r=1&_t=ZT-94S57HVbxc5" target="_blank" rel="noopener noreferrer" className="nav-link">TikTok</a>
          <span className="w-px h-3 bg-border" />
          <Link to="/privacy" className="nav-link">Privacy Policy</Link>
          <span className="w-px h-3 bg-border" />
          <Link to="/sms-terms" className="nav-link">SMS Terms</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © 2026 Bombshell. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
