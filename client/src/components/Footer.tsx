import { Link } from "wouter";
import { MapPin, Phone, Mail, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-white/80" style={{ backgroundColor: "var(--brand-slate)" }}>
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img
              src="/img/clarks-logo.webp"
              alt="Clark's Bookkeeping & Tax Preparation"
              className="h-16 w-auto mb-4"
              style={{ filter: "drop-shadow(0 1px 4px oklch(0 0 0 / 0.4))" }}
            />
            <p className="text-sm leading-relaxed text-white/65">
              Providing trusted tax preparation, payroll, accounting, and bookkeeping services for individuals and small businesses — with professionalism and personal care.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/"><a className="text-white/65 hover:text-white transition-colors duration-150">Home</a></Link></li>
              <li><a href="/#about" className="text-white/65 hover:text-white transition-colors duration-150">About Us</a></li>
              <li><a href="/#services" className="text-white/65 hover:text-white transition-colors duration-150">Services</a></li>
              <li><a href="/#contact" className="text-white/65 hover:text-white transition-colors duration-150">Contact</a></li>
              <li><Link href="/upload"><a className="text-white/65 hover:text-white transition-colors duration-150">Secure Document Upload</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://maps.google.com/?q=1812+33rd+St+S,+Moorhead,+MN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-white/65 hover:text-white"
                >
                  <MapPin size={15} className="flex-shrink-0 mt-0.5" style={{ color: "var(--brand-green-light)" }} />
                  <span>1812 33rd St S<br />Moorhead, Minnesota</span>
                </a>
              </li>
              <li>
                <a href="tel:7017998446" className="flex items-center gap-2 text-white/65 hover:text-white">
                  <Phone size={15} className="flex-shrink-0" style={{ color: "var(--brand-green-light)" }} />
                  701-799-8446
                </a>
              </li>
              <li>
                <a href="mailto:Lisaclarktaxpro2023@gmail.com" className="flex items-center gap-2 text-white/65 hover:text-white break-all">
                  <Mail size={15} className="flex-shrink-0" style={{ color: "var(--brand-green-light)" }} />
                  Lisaclarktaxpro2023@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-6 flex items-start gap-2 text-xs text-white/50 leading-relaxed">
              <Shield size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--brand-green-light)" }} />
              <span>Document uploads are encrypted and transmitted securely.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: "oklch(0.35 0.02 240)" }}>
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Clark's Bookkeeping and Tax Preparation Services. All rights reserved.</span>
          <span>1812 33rd St S, Moorhead, MN · 701-799-8446</span>
        </div>
      </div>
    </footer>
  );
}
