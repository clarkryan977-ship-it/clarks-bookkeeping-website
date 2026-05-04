import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LogOut,
  MessageSquare,
  FileUp,
  Users,
  Trash2,
  Download,
  RefreshCcw,
  Search,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

type Tab = "contacts" | "uploads" | "clients";

interface Contact { id: number; full_name: string; phone: string | null; email: string; message: string; created_at: string; }
interface Upload { id: number; full_name: string; email: string; phone: string | null; note: string | null; original_filename: string; mime_type: string | null; size_bytes: number; created_at: string; }
interface Client {
  id: number; first_name: string | null; last_name: string | null; email: string | null;
  phone: string | null; address: string | null; city: string | null; state: string | null; zip: string | null;
  ssn_last4: string | null; filing_status: string | null; tax_year: string | null; notes: string | null;
  imported_at: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("contacts");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await api.get<{ admin: { email: string } | null }>("/api/auth/me");
      if (!cancelled) {
        if (!r.ok || !r.data.admin) {
          setLocation("/admin");
          return;
        }
        setAdminEmail(r.data.admin.email);
        setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [setLocation]);

  async function onLogout() {
    await api.post("/api/auth/logout");
    setLocation("/admin");
  }

  if (checking) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.97 0.005 240)" }}>
      <header className="border-b" style={{ backgroundColor: "var(--brand-slate)", borderColor: "oklch(0.35 0.02 240)" }}>
        <div className="container py-3 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src="/img/clarks-logo.webp" alt="Clark's" className="h-10 w-auto" />
              <span className="text-white font-semibold hidden sm:inline" style={{ fontFamily: "var(--font-display)" }}>Admin</span>
            </a>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-xs hidden sm:inline">{adminEmail}</span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded text-white/85 border"
              style={{ borderColor: "oklch(1 0 0 / 0.2)" }}
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="container pt-6">
        <div className="flex gap-2 flex-wrap">
          <TabBtn active={tab === "contacts"} onClick={() => setTab("contacts")} Icon={MessageSquare} label="Contact Submissions" />
          <TabBtn active={tab === "uploads"} onClick={() => setTab("uploads")} Icon={FileUp} label="Document Uploads" />
          <TabBtn active={tab === "clients"} onClick={() => setTab("clients")} Icon={Users} label="Client List" />
        </div>
      </div>
      <main className="container py-6 flex-1">
        {tab === "contacts" ? <ContactsTab /> : null}
        {tab === "uploads" ? <UploadsTab /> : null}
        {tab === "clients" ? <ClientsTab /> : null}
      </main>
    </div>
  );
}

function TabBtn({ active, onClick, Icon, label }: { active: boolean; onClick: () => void; Icon: React.ComponentType<{ size?: number }>; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-colors ${
        active ? "" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
      style={active ? { borderColor: "var(--brand-green)", color: "var(--brand-slate)", backgroundColor: "white" } : undefined}
    >
      <Icon size={15} /> {label}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border p-4 md:p-5" style={{ borderColor: "oklch(0.9 0.006 240)" }}>{children}</div>
  );
}

function ContactsTab() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await api.get<{ items: Contact[] }>("/api/admin/contacts");
    if (r.ok) setItems(r.data.items);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function onDelete(id: number) {
    if (!confirm("Delete this submission?")) return;
    const r = await api.delete<{ ok: boolean }>(`/api/admin/contacts/${id}`);
    if (r.ok) { setItems((xs) => xs.filter((x) => x.id !== id)); toast.success("Deleted."); }
    else toast.error(r.error);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--brand-slate)" }}>Contact Submissions ({items.length})</h2>
        <button onClick={load} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><RefreshCcw size={13} /> Refresh</button>
      </div>
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No contact submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Message</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b align-top hover:bg-muted/40">
                  <td className="py-3 pr-4 whitespace-nowrap text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</td>
                  <td className="py-3 pr-4 font-medium">{it.full_name}</td>
                  <td className="py-3 pr-4"><a href={`mailto:${it.email}`} className="text-[var(--brand-green)] hover:underline">{it.email}</a></td>
                  <td className="py-3 pr-4">{it.phone || "—"}</td>
                  <td className="py-3 pr-4 max-w-md whitespace-pre-wrap">{it.message}</td>
                  <td className="py-3 pr-4">
                    <button onClick={() => onDelete(it.id)} className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline">
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function UploadsTab() {
  const [items, setItems] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await api.get<{ items: Upload[] }>("/api/admin/uploads");
    if (r.ok) setItems(r.data.items);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function onDelete(id: number) {
    if (!confirm("Delete this upload (and its file)?")) return;
    const r = await api.delete<{ ok: boolean }>(`/api/admin/uploads/${id}`);
    if (r.ok) { setItems((xs) => xs.filter((x) => x.id !== id)); toast.success("Deleted."); }
    else toast.error(r.error);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--brand-slate)" }}>Document Uploads ({items.length})</h2>
        <button onClick={load} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><RefreshCcw size={13} /> Refresh</button>
      </div>
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No uploads yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">From</th>
                <th className="py-2 pr-4">File</th>
                <th className="py-2 pr-4">Note</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b align-top hover:bg-muted/40">
                  <td className="py-3 pr-4 whitespace-nowrap text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{it.full_name}</div>
                    <div className="text-xs text-muted-foreground">{it.email}{it.phone ? ` · ${it.phone}` : ""}</div>
                  </td>
                  <td className="py-3 pr-4 break-all">{it.original_filename}</td>
                  <td className="py-3 pr-4 max-w-xs">{it.note || "—"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">{prettyBytes(Number(it.size_bytes || 0))}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-3">
                      <a
                        href={`/api/admin/uploads/${it.id}/download`}
                        className="inline-flex items-center gap-1 text-xs text-[var(--brand-green)] hover:underline"
                      >
                        <Download size={13} /> Download
                      </a>
                      <button onClick={() => onDelete(it.id)} className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function ClientsTab() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load(search?: string) {
    setLoading(true);
    const path = search ? `/api/admin/clients?q=${encodeURIComponent(search)}` : "/api/admin/clients";
    const r = await api.get<{ items: Client[] }>(path);
    if (r.ok) setItems(r.data.items);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function onImport(file: File) {
    setImporting(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/clients/import", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Import failed.");
      } else {
        toast.success(`Imported ${data.inserted} of ${data.total} rows.`);
        await load(q);
      }
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this client?")) return;
    const r = await api.delete<{ ok: boolean }>(`/api/admin/clients/${id}`);
    if (r.ok) { setItems((xs) => xs.filter((x) => x.id !== id)); toast.success("Deleted."); }
    else toast.error(r.error);
  }

  async function onClearAll() {
    if (!confirm("Delete ALL clients? This cannot be undone.")) return;
    const r = await api.delete<{ ok: boolean }>("/api/admin/clients");
    if (r.ok) { setItems([]); toast.success("All clients cleared."); }
    else toast.error(r.error);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-lg font-semibold" style={{ color: "var(--brand-slate)" }}>Client List ({items.length})</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") load(q); }}
              placeholder="Search name / email / phone…"
              className="pl-8 pr-3 py-1.5 rounded border text-sm outline-none focus:border-[var(--brand-green)]"
              style={{ borderColor: "oklch(0.85 0.006 240)" }}
            />
          </div>
          <button onClick={() => load(q)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded border" style={{ borderColor: "oklch(0.85 0.006 240)" }}>
            <RefreshCcw size={13} /> Refresh
          </button>
          <label className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded text-white cursor-pointer" style={{ backgroundColor: "var(--brand-green)" }}>
            <UploadCloud size={13} /> {importing ? "Importing…" : "Import CSV"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              disabled={importing}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); }}
            />
          </label>
          <button onClick={onClearAll} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded border text-red-600" style={{ borderColor: "oklch(0.85 0.006 240)" }}>
            <Trash2 size={13} /> Clear All
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Import a CSV exported from CrossLink. Columns are auto-detected (first/last name, email, phone, address, city, state, zip, SSN, filing status, tax year, notes). Only the last 4 of the SSN is stored; the full row is preserved as JSON for reference.
      </p>
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clients imported yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">City / State</th>
                <th className="py-2 pr-4">Tax Year</th>
                <th className="py-2 pr-4">Filing</th>
                <th className="py-2 pr-4">SSN</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b align-top hover:bg-muted/40">
                  <td className="py-3 pr-4 font-medium">{[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}</td>
                  <td className="py-3 pr-4">{c.email || "—"}</td>
                  <td className="py-3 pr-4">{c.phone || "—"}</td>
                  <td className="py-3 pr-4">{[c.city, c.state].filter(Boolean).join(", ") || "—"}</td>
                  <td className="py-3 pr-4">{c.tax_year || "—"}</td>
                  <td className="py-3 pr-4">{c.filing_status || "—"}</td>
                  <td className="py-3 pr-4">{c.ssn_last4 ? `***-**-${c.ssn_last4}` : "—"}</td>
                  <td className="py-3 pr-4">
                    <button onClick={() => onDelete(c.id)} className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline">
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function prettyBytes(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"]; let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
