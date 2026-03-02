const Footer = () => {
  return (
    <footer className="section-padding py-12 border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-foreground">
          Bombshell
        </p>
        <div className="flex items-center gap-8">
          <a href="#" className="nav-link">Instagram</a>
          <a href="#" className="nav-link">Twitter</a>
          <a href="#" className="nav-link">TikTok</a>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2025 Bombshell. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
