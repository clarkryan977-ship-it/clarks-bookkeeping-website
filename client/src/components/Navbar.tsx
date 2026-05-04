import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Lock, Menu, X } from "lucide-react";

const sections = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/#about" },
  { id: "services", label: "Services", href: "/#services" },
  { id: "certifications", label: "Credentials", href: "/#certifications" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("/#")) return;
    const id = href.slice(2);
    if (location === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? "oklch(0.22 0.025 240 / 0.96)"
          : "oklch(0.22 0.025 240)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? "0 1px 12px oklch(0 0 0 / 0.25)" : "none",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/">
            <a className="flex items-center" aria-label="Clark's Bookkeeping & Tax Preparation Home">
              <img
                src="/img/clarks-logo.webp"
                alt="Clark's Bookkeeping & Tax Preparation"
                className="h-12 md:h-14 w-auto object-contain"
                style={{ filter: "drop-shadow(0 1px 3px oklch(0 0 0 / 0.3))" }}
              />
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {sections.map((s) => (
              <a
                key={s.id}
                href={s.href}
                onClick={(e) => handleAnchor(e, s.href)}
                className="nav-link"
              >
                {s.label}
              </a>
            ))}
            <Link href="/upload">
              <a>
                <span
                  className="inline-flex items-center px-4 py-2 rounded text-sm font-semibold text-white transition-all duration-150"
                  style={{ backgroundColor: "var(--brand-green)" }}
                >
                  Upload Documents
                </span>
              </a>
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link href="/admin">
              <a>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ml-2"
                  style={{
                    color: "oklch(0.82 0.02 240)",
                    border: "1px solid oklch(0.45 0.02 240)",
                  }}
                >
                  <Lock size={11} />
                  Admin Login
                </span>
              </a>
            </Link>
          </div>

          <button
            className="md:hidden text-white p-1"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open ? (
          <div
            className="md:hidden border-t pb-4 pt-2"
            style={{ borderColor: "oklch(1 0 0 / 0.1)" }}
          >
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  onClick={(e) => handleAnchor(e, s.href)}
                  className="px-2 py-2 rounded text-white/85 hover:bg-white/5"
                >
                  {s.label}
                </a>
              ))}
              <Link href="/upload">
                <a className="px-2 py-2 rounded text-white font-semibold" style={{ color: "var(--brand-gold)" }}>
                  Upload Documents
                </a>
              </Link>
              <Link href="/admin">
                <a className="px-2 py-2 rounded text-white/85 inline-flex items-center gap-2">
                  <Lock size={14} /> Admin Login
                </a>
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
