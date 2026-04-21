import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "../components/ui/Avatar";
import { Field } from "../components/ui/Field";
import { Toast } from "../components/ui/Toast";
import { Spinner } from "../components/ui/Spinner";
import { JWTViewer } from "../components/ui/JWTViewer";
import { decodeJWT, getInitials } from "../utils/jwt";

const AVATAR_STYLES = [
  { bg: "from-emerald-500/25 to-teal-600/10", text: "text-emerald-400", ring: "ring-emerald-500/30" },
  { bg: "from-sky-500/25 to-blue-600/10", text: "text-sky-400", ring: "ring-sky-500/30" },
  { bg: "from-violet-500/25 to-purple-600/10", text: "text-violet-400", ring: "ring-violet-500/30" },
  { bg: "from-amber-500/25 to-orange-600/10", text: "text-amber-400", ring: "ring-amber-500/30" },
];

export default function ProfileScreen({ onBack }) {
  const { user, token, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", avatarIdx: user?.avatar || 0 });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false, type: "info" });
  const [activeTab, setActiveTab] = useState("profile");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("email");

  useEffect(() => {
    setTwoFactorEnabled(localStorage.getItem('nexus_2fa_enabled') === 'true');
    setTwoFactorMethod(localStorage.getItem('nexus_2fa_method') || 'email');
  }, []);

  const showToast = (msg, type = "info") => {
    setToast({ msg, visible: true, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ name: form.name, avatar: form.avatarIdx });
      setSaved(true);
      showToast("Profile updated", "success");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = () => {
    const enabled = !twoFactorEnabled;
    setTwoFactorEnabled(enabled);
    localStorage.setItem('nexus_2fa_enabled', enabled ? 'true' : 'false');
    showToast(enabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled', 'success');
  };

  const updateTwoFactorMethod = (method) => {
    setTwoFactorMethod(method);
    localStorage.setItem('nexus_2fa_method', method);
    showToast(`2FA method set to ${method}`, 'success');
  };

  const tokenInfo = token ? (() => {
    try {
      const p = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      const msLeft = p.exp * 1000 - Date.now();
      const hLeft = Math.floor(msLeft / 3600000);
      const mLeft = Math.floor((msLeft % 3600000) / 60000);
      return { exp: new Date(p.exp * 1000).toLocaleString(), iat: new Date(p.iat * 1000).toLocaleString(), timeLeft: `${hLeft}h ${mLeft}m`, sub: p.sub };
    } catch { return null; }
  })() : null;

  return (
    <div className="min-h-screen bg-zinc-950" style={{ fontFamily: "'Syne', sans-serif" }}>
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-zinc-600 hover:text-zinc-300 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-medium text-zinc-300">Account Settings</span>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900/50 border border-white/8 rounded-xl p-1 mb-6">
          {[["profile", "Profile"], ["security", "Security & JWT"], ["danger", "Danger zone"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === id ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="space-y-5">
            {/* Avatar picker */}
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-5">
              <p className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase mb-4">Avatar</p>
              <div className="flex items-center gap-4">
                <Avatar name={form.name || user?.name} avatarIdx={form.avatarIdx} size="lg" />
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_STYLES.map((a, i) => (
                    <button key={i} onClick={() => setForm(v => ({ ...v, avatarIdx: i }))}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.bg} ring-2 transition-all ${form.avatarIdx === i ? `${a.ring} scale-110` : "ring-transparent"} flex items-center justify-center text-xs font-bold ${a.text}`}>
                      {getInitials(form.name || user?.name)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-5 space-y-4">
              <p className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase">Personal info</p>
              <Field label="Display name" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} placeholder="Your name" />
              <div>
                <label className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase block mb-1.5">Email address</label>
                <div className="flex items-center gap-3 bg-zinc-800/40 border border-white/5 rounded-xl px-4 py-3">
                  <span className="text-sm text-zinc-500">{user?.email}</span>
                  <span className="ml-auto text-[10px] font-mono text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded border border-white/5">VERIFIED</span>
                </div>
              </div>
            </div>

            <button onClick={handleSave} disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 font-bold rounded-xl py-3.5 text-sm transition-all flex items-center justify-center gap-2">
              {loading ? <Spinner size={16} /> : saved ? "✓ Saved" : "Save changes"}
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-5">
            {/* Session info */}
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase">Active session</p>
              </div>
              {tokenInfo && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["User ID", tokenInfo.sub?.slice(0, 16) + "..."],
                    ["Issued at", tokenInfo.iat],
                    ["Expires at", tokenInfo.exp],
                    ["Time remaining", tokenInfo.timeLeft],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-zinc-800/50 border border-white/5 rounded-xl p-3">
                      <p className="text-[10px] font-mono text-zinc-600 mb-1">{l.toUpperCase()}</p>
                      <p className="text-xs text-zinc-300 font-mono">{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase">Two-factor authentication</p>
                  <p className="text-sm text-zinc-400 mt-2">Add an extra layer of protection for your account and tokens.</p>
                </div>
                <button onClick={toggleTwoFactor}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${twoFactorEnabled ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {['email', 'authenticator'].map((method) => (
                  <button key={method} onClick={() => updateTwoFactorMethod(method)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${twoFactorMethod === method ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-zinc-950 text-zinc-300 hover:border-white/20'}`}>
                    <p className="font-medium capitalize">{method}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">{method === 'email' ? 'Send codes to your inbox' : 'Use authenticator app codes'}</p>
                  </button>
                ))}
              </div>

              {twoFactorEnabled && (
                <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
                  2FA is enabled using <span className="font-semibold">{twoFactorMethod}</span>. You will be prompted for a second factor during login and when refreshing a session.
                </p>
              )}
            </div>

            {/* JWT inspector */}
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-5">
              <p className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase mb-3">JWT token inspector</p>
              <JWTViewer token={token} />
            </div>

            {/* Auth flow diagram */}
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-5">
              <p className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase mb-4">Auth flow</p>
              <div className="space-y-2">
                {[
                  { step: "01", label: "Register / Login", desc: "POST /api/auth/{register|login}", color: "text-sky-400" },
                  { step: "02", label: "JWT issued", desc: "access_token (24h) + refresh_token (7d)", color: "text-emerald-400" },
                  { step: "03", label: "Authenticated requests", desc: "Authorization: Bearer <token>", color: "text-violet-400" },
                  { step: "04", label: "Token refresh", desc: "POST /api/auth/refresh → new access_token", color: "text-amber-400" },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/30 border border-white/5">
                    <span className={`text-[10px] font-mono font-bold ${s.color} mt-0.5 flex-shrink-0`}>{s.step}</span>
                    <div>
                      <p className="text-xs text-zinc-200">{s.label}</p>
                      <p className="text-[10px] font-mono text-zinc-600 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => { logout(); }} className="w-full bg-zinc-800/60 border border-white/8 text-zinc-300 hover:text-white rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              Sign out from this device
            </button>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="space-y-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <p className="text-sm font-medium text-red-400 mb-1">Sign out everywhere</p>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Invalidates all active sessions by revoking refresh tokens on the server.</p>
              <button onClick={() => { logout(); showToast("All sessions terminated", "info"); }}
                className="bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 rounded-xl px-4 py-2 text-sm transition-colors">
                Sign out all devices
              </button>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <p className="text-sm font-medium text-red-400 mb-1">Delete account</p>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Permanently delete your account and all associated data. This cannot be undone.</p>
              <button className="bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 rounded-xl px-4 py-2 text-sm transition-colors">
                Delete my account
              </button>
            </div>
          </div>
        )}
      </div>
      <Toast msg={toast.msg} visible={toast.visible} type={toast.type} />
    </div>
  );
}
