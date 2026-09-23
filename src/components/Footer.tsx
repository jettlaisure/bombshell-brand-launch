import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="section-padding py-12 border-t border-border">
      <div className="flex flex-col items-center justify-between gap-8">
        <img src={logo} alt="Bombshell" className="h-24 w-auto invert" />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {[
            <a key="ig" href="https://www.instagram.com/bombshell.usa?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>,
            <a key="tt" href="https://www.tiktok.com/@bombshell.usa?_r=1&_t=ZT-94S57HVbxc5" target="_blank" rel="noopener noreferrer" className="nav-link">TikTok</a>,
            <Link key="pp" to="/privacy" className="nav-link">Privacy Policy</Link>,
            <Link key="st" to="/sms-terms" className="nav-link">SMS Terms</Link>,
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-6">
              {i > 0 && <span className="w-px h-3 bg-border" />}
              {item}
            </span>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © 2026 Bombshell. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
