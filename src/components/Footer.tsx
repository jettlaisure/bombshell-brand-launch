import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="section-padding py-12 border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <img src={logo} alt="Bombshell" className="h-24 w-auto invert" />
        <div className="flex items-center gap-8">
          <a href="#" className="nav-link">Instagram</a>
          <a href="#" className="nav-link">Twitter</a>
          <a href="https://www.tiktok.com/@bombshell.usa?_r=1&_t=ZT-94S57HVbxc5" target="_blank" rel="noopener noreferrer" className="nav-link">TikTok</a>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Bombshell. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
