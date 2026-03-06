import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="section-padding py-16 border-t border-border">
      <div className="flex flex-col items-center gap-8">
        <img src={logo} alt="Bombshell" className="h-20 w-auto invert" />

        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/bombshell.usa?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors duration-300">Instagram</a>
          <span className="w-px h-3 bg-border" />
          <a href="https://www.tiktok.com/@bombshell.usa?_r=1&_t=ZT-94S57HVbxc5" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors duration-300">TikTok</a>
        </div>

        <p className="text-[10px] text-muted-foreground/50 tracking-widest uppercase">
          © 2026 Bombshell. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
