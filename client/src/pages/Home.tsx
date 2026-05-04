import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronRight,
  Shield,
  Award,
  Users,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Building2,
  FileText,
  Calculator,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <About />
      <Tools />
      <Services />
      <SecureUploadStripe />
      <Certifications />
      <Contact />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section
      id="home"
      className="relative flex items-center min-h-[92vh] pt-20"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.22 0.025 235) 0%, oklch(0.27 0.02 235) 45%, oklch(0.32 0.03 165) 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 40%, oklch(0.38 0.025 235 / 0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.22 0.025 235 / 0.6), transparent)",
        }}
      />
      <div className="container relative z-10 py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="mb-8 flex justify-center w-full">
            <img
              src="/img/clarks-logo.webp"
              alt="Clark's Bookkeeping & Tax Preparation"
              className="h-44 sm:h-52 md:h-60 w-auto block mx-auto"
              style={{
                filter: "drop-shadow(0 2px 12px oklch(0 0 0 / 0.35))",
              }}
            />
          </div>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="inline-block w-10 h-px" style={{ backgroundColor: "var(--brand-gold)" }} />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--brand-gold)" }}
            >
              Moorhead, Minnesota • Est. 30+ Years
            </span>
            <span className="inline-block w-10 h-px" style={{ backgroundColor: "var(--brand-gold)" }} />
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome to <span style={{ color: "var(--brand-gold)" }}>Clark&rsquo;s</span>
          </h1>
          <p
            className="text-xl text-white/80 font-light leading-relaxed mb-4 max-w-lg"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            Bookkeeping &amp; Tax Preparation Services
          </p>
          <p className="text-base text-white/65 leading-relaxed mb-10 max-w-xl">
            Friendly, personalized tax preparation, payroll, bookkeeping, and accounting for individuals and small businesses — with 30 years of experience you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{
                backgroundColor: "var(--brand-green)",
                boxShadow: "0 4px 16px oklch(0.4 0.12 165 / 0.35)",
              }}
            >
              Get in Touch
              <ChevronRight size={16} />
            </a>
            <Link href="/upload">
              <a>
                <span
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white/90 font-semibold text-sm border transition-all duration-200 hover:bg-white/10 hover:text-white"
                  style={{ borderColor: "oklch(1 0 0 / 0.3)" }}
                >
                  <Shield size={15} />
                  Secure Document Upload
                </span>
              </a>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-6 justify-center">
            <Pillar Icon={Shield} label="Confidential & Secure" />
            <Pillar Icon={Award} label="Experienced Professional" />
            <Pillar Icon={Users} label="Personalized Service" />
            <Pillar Icon={CheckCircle2} label="Accurate & Reliable" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ Icon, label }: { Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/60">
      <Icon size={14} style={{ color: "var(--brand-gold)" }} />
      {label}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-20 md:py-28" style={{ backgroundColor: "var(--brand-cream)" }}>
      <div className="container">
        <div className="text-center mb-12">
          <p className="section-label mb-4 justify-center">About Us</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug" style={{ color: "var(--brand-slate)" }}>
            A Trusted Partner for Your Tax &amp; Financial Needs
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          {[
            { big: "30+", title: "Years of Experience", sub: "Accounting professional since the mid-1990s" },
            { big: "B.S.", title: "Accounting Degree", sub: "Moorhead State College, Major in Accounting" },
            { big: "IRS", title: "Authorized E-File Provider", sub: "Federally certified — background checked & fingerprinted" },
          ].map((c) => (
            <div
              key={c.title}
              className="flex-1 rounded-lg p-5 border-l-4 flex items-start gap-4 bg-white"
              style={{
                borderLeftColor: "var(--brand-green)",
                boxShadow: "0 1px 6px oklch(0 0 0 / 0.06)",
              }}
            >
              <div
                className="text-3xl font-bold leading-none mt-0.5"
                style={{ fontFamily: "var(--font-display)", color: "var(--brand-green)" }}
              >
                {c.big}
              </div>
              <div>
                <div className="text-sm font-bold mb-0.5" style={{ color: "var(--brand-slate)" }}>{c.title}</div>
                <div className="text-xs leading-snug text-muted-foreground">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: "oklch(0.38 0.018 240)" }}>
              <p>
                Lisa Clark is the founder and principal of Clark&rsquo;s Bookkeeping and Tax Preparation Services, bringing over <strong>30 years of professional accounting experience</strong> to every client engagement. A graduate of <strong>Moorhead State College with a major in Accounting</strong>, Lisa has spent her career helping individuals and small businesses navigate the complexities of taxes and financial record-keeping with confidence.
              </p>
              <p>
                As an <strong>IRS Authorized E-File Provider</strong> — a federal designation requiring rigorous testing, background checks, and fingerprinting — Lisa is fully credentialed to prepare and electronically file returns for individuals and small businesses. We specialize in personal returns and small business filings; we do not prepare taxes for corporations.
              </p>
              <p>
                Lisa provides personalized, one-on-one service — taking the time to understand your unique financial situation and ensuring every return is prepared accurately and completely. From simple personal returns to multi-state small business filings and payroll, she handles it all with the care and discretion your finances deserve.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { big: "30+", title: "Years Experience", sub: "Professional accounting since the mid-1990s" },
              { big: "All States", title: "State Tax Filings", sub: "No matter where you file" },
              { big: "E-File", title: "IRS Authorized", sub: "Federal e-file certification" },
              { big: "Secure", title: "Document Handling", sub: "Confidential & encrypted" },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-lg p-6 border" style={{ borderColor: "oklch(0.88 0.006 240)" }}>
                <div className="text-2xl font-bold mb-1" style={{ color: "var(--brand-green)", fontFamily: "var(--font-display)" }}>{c.big}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: "var(--brand-slate)" }}>{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tools() {
  const tools = [
    { name: "Microsoft Excel", sub: "Spreadsheets & Analysis", color: "#217346", letter: "X" },
    { name: "Microsoft Word", sub: "Documents & Reports", color: "#2B579A", letter: "W" },
    { name: "QuickBooks", sub: "Accounting Software", color: "#2CA01C", letter: "Q" },
    { name: "Rippling", sub: "Payroll Software", color: "#FF4F00", letter: "R" },
    { name: "ADP", sub: "Payroll & HR Software", color: "#D0021B", letter: "A" },
  ];
  return (
    <section className="py-12 md:py-16 bg-white border-t" style={{ borderColor: "oklch(0.92 0.006 240)" }}>
      <div className="container">
        <div className="text-center mb-10">
          <p className="section-label mb-3 justify-center">Software & Tools</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--brand-slate)" }}>
            Professional-Grade Tools
          </h2>
          <p className="text-sm max-w-lg mx-auto text-muted-foreground">
            Lisa works with industry-standard accounting, payroll, and productivity software to deliver accurate, efficient results for every client.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tools.map((t) => (
            <div
              key={t.name}
              className="flex flex-col items-center text-center p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
              style={{
                borderColor: "oklch(0.9 0.006 240)",
                backgroundColor: "oklch(0.985 0.003 240)",
                boxShadow: "0 1px 4px oklch(0 0 0 / 0.05)",
              }}
            >
              <div className="mb-3">
                <svg viewBox="0 0 40 40" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="8" fill={t.color} />
                  <text x="20" y="27" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Inter, Arial">
                    {t.letter}
                  </text>
                </svg>
              </div>
              <div className="text-sm font-bold mb-1" style={{ color: "var(--brand-slate)" }}>{t.name}</div>
              <div className="text-xs leading-snug text-muted-foreground">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-label mb-4 justify-center">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--brand-slate)" }}>
            Comprehensive Tax & Accounting Solutions
          </h2>
          <p className="text-base max-w-xl mx-auto text-muted-foreground">
            From personal returns and small business taxes to payroll processing — we offer a full range of services for individuals and small businesses.
          </p>
        </div>

        {/* Featured: Payroll */}
        <div
          className="mb-6 rounded-xl p-7 border-2 flex flex-col md:flex-row md:items-center gap-6"
          style={{
            borderColor: "var(--brand-green)",
            background:
              "linear-gradient(135deg, oklch(0.44 0.1 155 / 0.08) 0%, oklch(0.44 0.1 155 / 0.03) 100%)",
          }}
        >
          <div
            className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            <DollarSign className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold" style={{ color: "var(--brand-slate)" }}>Payroll Services</h3>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "var(--brand-green)" }}
              >
                Featured
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Complete small business payroll processing and management — calculating wages, withholdings, and deductions; filing payroll taxes; and generating pay stubs. We handle the details so you can focus on running your business.
            </p>
          </div>
          <a
            href="#contact"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded text-white text-sm font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            Get Started <ChevronRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { Icon: Building2, title: "Small Business Taxes", body: "Federal and state tax preparation for small businesses — sole proprietors, LLCs, and partnerships. We ensure accuracy and maximize every eligible deduction. We serve individuals and small businesses only, not corporations." },
            { Icon: FileText, title: "Personal Tax E-File", body: "Fast, accurate personal income tax preparation with e-filing available. Get your refund sooner with secure electronic submission to the IRS." },
            { Icon: MapPin, title: "Any State Tax Filings", body: "Multi-state tax filing expertise for individuals and small businesses. Whether you operate in one state or many, we handle all state income and business tax obligations." },
            { Icon: Calculator, title: "Accounting", body: "Professional bookkeeping and accounting services for individuals and small businesses. We keep your financial records organized, accurate, and ready for tax season." },
            { Icon: Briefcase, title: "Small Business Filings", body: "Assistance with small business formation filings, annual reports, and compliance documentation to keep your small business in good standing." },
          ].map(({ Icon, title, body }) => (
            <div
              key={title}
              className="service-card bg-white rounded-lg p-7 border flex flex-col items-center text-center"
              style={{ borderColor: "oklch(0.88 0.006 240)" }}
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-lg mb-5" style={{ backgroundColor: "oklch(0.44 0.1 155 / 0.1)" }}>
                <Icon size={22} style={{ color: "var(--brand-green)" }} />
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--brand-slate)" }}>{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}

          <div
            className="rounded-lg p-7 flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, var(--brand-slate) 0%, var(--brand-slate-mid) 100%)",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Ready to Get Started?</h3>
              <p className="text-sm text-white/65 leading-relaxed mb-6">
                Contact us today to discuss your individual or small business tax needs. We&rsquo;re here to help make the process simple and stress-free.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90 self-start"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              Contact Us <ChevronRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecureUploadStripe() {
  return (
    <section
      className="py-14"
      style={{
        background:
          "linear-gradient(90deg, oklch(0.44 0.1 155) 0%, oklch(0.38 0.09 155) 100%)",
      }}
    >
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "oklch(1 0 0 / 0.15)" }}>
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Secure Document Upload</h3>
              <p className="text-white/75 text-sm max-w-md">
                Safely send your W-2s, 1099s, receipts, and tax documents directly to us. All uploads are encrypted and handled with strict confidentiality.
              </p>
            </div>
          </div>
          <Link href="/upload">
            <a>
              <span
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded font-semibold text-sm whitespace-nowrap transition-all duration-150 hover:opacity-90"
                style={{ backgroundColor: "white", color: "var(--brand-green-dark)" }}
              >
                Upload Documents <ChevronRight size={16} />
              </span>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-28 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <p className="section-label mb-4 justify-center">Credentials & Recognition</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--brand-slate)" }}>
            Trusted, Certified, and Recognized
          </h2>
          <p className="text-base max-w-xl mx-auto text-muted-foreground">
            Lisa holds federal credentials and industry recognition that reflect her commitment to professional excellence in tax preparation and accounting.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div
            className="rounded-xl p-8 border-2 flex flex-col items-center text-center"
            style={{
              borderColor: "var(--brand-green)",
              background: "linear-gradient(135deg, oklch(0.97 0.008 155) 0%, oklch(0.99 0.004 155) 100%)",
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: "var(--brand-green)", boxShadow: "0 4px 16px oklch(0.44 0.1 155 / 0.3)" }}
            >
              <Award size={40} className="text-white" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--brand-green)" }}>
              Federal Certification
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--brand-slate)" }}>
              IRS Authorized E-File Provider
            </h3>
            <p className="text-sm leading-relaxed mb-5 text-muted-foreground">
              Lisa is an IRS Authorized E-File Provider — a federal designation that requires passing IRS-administered testing, a thorough background check, and fingerprinting. This certification authorizes her to electronically file federal tax returns on behalf of clients, ensuring your return is submitted securely and in compliance with IRS standards.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              <CheckCircle2 size={14} /> IRS Certified & Background Verified
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="rounded-xl p-6 border" style={{ borderColor: "oklch(0.88 0.006 240)", backgroundColor: "oklch(0.98 0.004 240)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                Industry Recognition
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--brand-slate)" }}>
                CrossLink Professional Tax Solutions
              </h3>
              <p className="text-sm leading-relaxed mb-4 text-muted-foreground">
                Recognized by CrossLink Professional Tax Solutions (CPTS) for outstanding performance as a Return Processor during the 2025 income tax year. CrossLink is one of the leading professional tax software platforms used by tax professionals nationwide.
              </p>
              <a
                href="/img/crosslink-certificate.png"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border transition-opacity hover:opacity-90"
                style={{ borderColor: "oklch(0.85 0.006 240)" }}
              >
                <img
                  src="/img/crosslink-certificate.png"
                  alt="CrossLink Certificate of Appreciation — Lisa Clark, 2025 Return Processor"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </a>
              <p className="text-xs mt-2 text-center text-muted-foreground">Click to view full certificate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const result = await api.post<{ ok: boolean }>("/api/contact", form);
    setSubmitting(false);
    if (result.ok) {
      toast.success("Thanks! Your message has been sent.");
      setForm({ fullName: "", phone: "", email: "", message: "" });
    } else {
      toast.error(result.error || "Could not send message.");
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28" style={{ backgroundColor: "var(--brand-cream)" }}>
      <div className="container">
        <div className="text-center mb-12">
          <p className="section-label mb-4 justify-center">Contact Us</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-4" style={{ color: "var(--brand-slate)" }}>
            We&rsquo;re Here to Help
          </h2>
          <p className="text-base max-w-xl mx-auto text-muted-foreground">
            Have questions about your taxes or need to schedule an appointment? Reach out to us directly — we&rsquo;d love to hear from you and discuss how we can assist with your individual or small business tax and accounting needs.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <div className="space-y-5">
              <ContactItem Icon={MapPin} label="Address" href="https://maps.google.com/?q=1812+33rd+St+S,+Moorhead,+MN" target="_blank">
                1812 33rd St S<br />Moorhead, Minnesota
              </ContactItem>
              <ContactItem Icon={Phone} label="Phone" href="tel:7017998446">
                701-799-8446
              </ContactItem>
              <ContactItem Icon={Mail} label="Email" href="mailto:Lisaclarktaxpro2023@gmail.com">
                Lisaclarktaxpro2023@gmail.com
              </ContactItem>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 border shadow-sm" style={{ borderColor: "oklch(0.88 0.006 240)" }}>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--brand-slate)" }}>Send Us a Message</h3>
            <p className="text-sm mb-6 text-muted-foreground">
              Fill out the form below and we&rsquo;ll get back to you promptly.
            </p>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *">
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border text-sm outline-none focus:border-[var(--brand-green)]"
                    style={{ borderColor: "oklch(0.85 0.006 240)" }}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    placeholder="Your phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border text-sm outline-none focus:border-[var(--brand-green)]"
                    style={{ borderColor: "oklch(0.85 0.006 240)" }}
                  />
                </Field>
              </div>
              <Field label="Email Address *">
                <input
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border text-sm outline-none focus:border-[var(--brand-green)]"
                  style={{ borderColor: "oklch(0.85 0.006 240)" }}
                />
              </Field>
              <Field label="Message *">
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border text-sm outline-none resize-none focus:border-[var(--brand-green)]"
                  style={{ borderColor: "oklch(0.85 0.006 240)" }}
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--brand-green)" }}
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "oklch(0.45 0.015 240)" }}>{label}</label>
      {children}
    </div>
  );
}

function ContactItem({
  Icon,
  label,
  href,
  target,
  children,
}: {
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  href: string;
  target?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="flex items-start gap-4 group"
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "oklch(0.44 0.1 155 / 0.12)" }}>
        <Icon size={20} style={{ color: "var(--brand-green)" }} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-muted-foreground">{label}</p>
        <p className="text-base font-semibold group-hover:underline" style={{ color: "var(--brand-slate)" }}>
          {children}
        </p>
      </div>
    </a>
  );
}
