import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}

const LegalPageLayout = ({ title, effectiveDate, children }: LegalPageLayoutProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar forceDark />
    <main className="section-padding pb-20 pt-40 md:pb-28 md:pt-48">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8 md:pb-10">
          <h1 className="text-3xl uppercase leading-tight tracking-normal md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{effectiveDate}</p>
        </header>
        <div className="space-y-7 pt-8 text-sm leading-7 text-foreground/80 md:space-y-8 md:pt-10 md:text-base md:leading-8">
          {children}
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default LegalPageLayout;