import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Lock, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await api.get<{ admin: { email: string } | null }>("/api/auth/me");
      if (!cancelled) {
        if (r.ok && r.data.admin) setLocation("/admin/dashboard");
        setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [setLocation]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const r = await api.post<{ ok: boolean }>("/api/auth/login", { email, password });
    setSubmitting(false);
    if (r.ok) {
      toast.success("Logged in.");
      setLocation("/admin/dashboard");
    } else {
      toast.error(r.error || "Login failed");
    }
  }

  if (checking) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.22 0.025 235) 0%, oklch(0.27 0.02 235) 60%, oklch(0.32 0.03 165) 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <Link href="/">
          <a className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4">
            <ChevronLeft size={16} /> Back to Home
          </a>
        </Link>
        <div className="bg-white rounded-xl p-8 border shadow-lg" style={{ borderColor: "oklch(0.85 0.006 240)" }}>
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--brand-green)" }}>
              <Lock className="text-white" size={26} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--brand-slate)" }}>Admin Login</h1>
          <p className="text-sm text-center text-muted-foreground mb-6">Authorized personnel only.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "oklch(0.45 0.015 240)" }}>Email</label>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded border text-sm outline-none focus:border-[var(--brand-green)]"
                style={{ borderColor: "oklch(0.85 0.006 240)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "oklch(0.45 0.015 240)" }}>Password</label>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded border text-sm outline-none focus:border-[var(--brand-green)]"
                style={{ borderColor: "oklch(0.85 0.006 240)" }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
