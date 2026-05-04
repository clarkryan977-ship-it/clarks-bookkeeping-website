import { useRef, useState } from "react";
import { ChevronLeft, Shield, UploadCloud } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import SiteLayout from "@/components/SiteLayout";

export default function UploadPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("fullName", fullName);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("note", note);
    fd.append("document", file);
    try {
      const res = await fetch("/api/uploads", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Upload failed.");
        setSubmitting(false);
        return;
      }
      toast.success("Document uploaded securely. We'll be in touch.");
      setFullName(""); setEmail(""); setPhone(""); setNote(""); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error((err as Error).message || "Upload error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section
        className="pt-28 pb-16 md:pt-32 md:pb-20"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.22 0.025 235) 0%, oklch(0.27 0.02 235) 60%, oklch(0.32 0.03 165) 100%)",
        }}
      >
        <div className="container">
          <Link href="/">
            <a className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6">
              <ChevronLeft size={16} /> Back to Home
            </a>
          </Link>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "oklch(1 0 0 / 0.12)", color: "var(--brand-gold)" }}>
              <Shield size={14} /> Encrypted & Confidential
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Secure Document Upload
            </h1>
            <p className="text-white/75 text-base leading-relaxed">
              Send your W-2s, 1099s, receipts, or any tax documents directly to Lisa. All files are stored securely on our server and only accessible to authorized staff.
            </p>
          </div>
        </div>
      </section>
      <section className="py-14 md:py-20" style={{ backgroundColor: "var(--brand-cream)" }}>
        <div className="container">
          <form
            onSubmit={onSubmit}
            className="max-w-2xl mx-auto bg-white rounded-xl p-7 md:p-9 border shadow-sm space-y-5"
            style={{ borderColor: "oklch(0.88 0.006 240)" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *">
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} placeholder="Your name" />
              </Field>
              <Field label="Phone">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="Your phone" />
              </Field>
            </div>
            <Field label="Email Address *">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="your@email.com" />
            </Field>
            <Field label="Note (optional)">
              <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls + " resize-none"} placeholder="Anything we should know about this document?" />
            </Field>
            <Field label="Document *">
              <label
                htmlFor="docfile"
                className="flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted"
                style={{ borderColor: "oklch(0.85 0.006 240)" }}
              >
                <UploadCloud size={28} style={{ color: "var(--brand-green)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--brand-slate)" }}>
                  {file ? file.name : "Click to choose a file (max 50 MB)"}
                </span>
                <span className="text-xs text-muted-foreground">PDF, JPG, PNG, DOCX, XLSX, ZIP and more</span>
                <input
                  id="docfile"
                  ref={fileInputRef}
                  required
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              {submitting ? "Uploading…" : "Upload Securely"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              By uploading, you confirm the documents are yours to share. We treat all materials with strict confidentiality.
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded border text-sm outline-none focus:border-[var(--brand-green)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "oklch(0.45 0.015 240)" }}>{label}</label>
      {children}
    </div>
  );
}
