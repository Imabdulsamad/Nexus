import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/ui/Field";
import { PasswordStrength } from "../components/ui/PasswordStrength";
import { Toast } from "../components/ui/Toast";
import { Spinner } from "../components/ui/Spinner";

const AVATAR_STYLES = [
  { bg: "from-emerald-500/25 to-teal-600/10", text: "text-emerald-400", ring: "ring-emerald-500/30" },
  { bg: "from-sky-500/25 to-blue-600/10", text: "text-sky-400", ring: "ring-sky-500/30" },
  { bg: "from-violet-500/25 to-purple-600/10", text: "text-violet-400", ring: "ring-violet-500/30" },
  { bg: "from-amber-500/25 to-orange-600/10", text: "text-amber-400", ring: "ring-amber-500/30" },
];

export default function RegisterScreen({ onLogin, onSuccess }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false, type: "info" });
  const [step, setStep] = useState(1); // 1=info, 2=password, 3=success

  const showToast = (msg, type = "info") => {
    setToast({ msg, visible: true, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const f = (field) => (e) => setForm(v => ({ ...v, [field]: e.target.value }));

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e = {};
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setStep(3);
    } catch (err) {
      showToast(err.message, "error");
      setErrors({ email: err.message });
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const strengthScore = [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-zinc-950 flex" style={{ fontFamily: "'Syne', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-zinc-900/40 border-r border-white/5 p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-400/5 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-white font-semibold tracking-tight">nexus</span>
          </div>

          <h2 className="text-3xl font-semibold text-white leading-tight mb-4">Join the future<br />of communication</h2>
          <p className="text-zinc-500 text-sm leading-relaxed mb-10">WebRTC-powered video calls, encrypted by default. No third-party servers. Just you and the people you trust.</p>

          <div className="space-y-4">
            {[
              { icon: "🔐", title: "JWT Authentication", desc: "Secure, stateless sessions with 24h access tokens + 7d refresh" },
              { icon: "🔒", title: "End-to-end encrypted", desc: "All video data travels directly peer-to-peer via WebRTC DTLS" },
              { icon: "⚡", title: "Sub-50ms latency", desc: "STUN/TURN optimized ICE negotiation for the fastest connections" },
            ].map(f => (
              <div key={f.title} className="flex gap-3 items-start">
                <span className="text-xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{f.title}</p>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] font-mono text-zinc-700">© 2026 Nexus · Built with WebRTC + JWT</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Step indicator */}
          {step < 3 && (
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all
                    ${step === s ? "bg-emerald-400 text-zinc-950" : step > s ? "bg-emerald-400/20 text-emerald-400" : "bg-zinc-800 text-zinc-600"}`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-[10px] font-mono tracking-widest uppercase ${step === s ? "text-zinc-300" : "text-zinc-600"}`}>
                    {s === 1 ? "Your info" : "Password"}
                  </span>
                  {s < 2 && <div className={`h-px w-8 transition-colors ${step > s ? "bg-emerald-400/40" : "bg-zinc-800"}`} />}
                </div>
              ))}
            </div>
          )}

          {step === 3 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center animate-bounce">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Nexus!</h2>
              <p className="text-zinc-500 text-sm mb-2">Your account has been created.</p>
              <p className="text-[11px] font-mono text-zinc-700 mb-8">JWT token issued · Session active for 24h</p>
              <button onClick={onSuccess}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20">
                Enter Nexus →
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                  {step === 1 ? "Create account" : "Set your password"}
                </h1>
                <p className="text-zinc-500 text-sm">
                  {step === 1 ? "Start with your basic information." : "Choose a strong password to protect your account."}
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-6 space-y-4 mb-4">
                {step === 1 ? (
                  <>
                    <Field label="Full name" value={form.name} onChange={f("name")} placeholder="Alex Morgan" error={errors.name} required />
                    <Field label="Email address" type="email" value={form.email} onChange={f("email")} placeholder="you@example.com" error={errors.email} required />
                    <button onClick={handleNext}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl py-3.5 text-sm transition-all mt-2 flex items-center justify-center gap-2">
                      Continue
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </>
                ) : (
                  <>
                    <Field label="Password" type="password" value={form.password} onChange={f("password")} placeholder="Min. 8 characters" error={errors.password} required />
                    {form.password && <PasswordStrength password={form.password} />}
                    <Field label="Confirm password" type="password" value={form.confirm} onChange={f("confirm")} placeholder="Re-enter your password" error={errors.confirm} required />

                    <div className="flex gap-3 pt-1">
                      <button onClick={() => { setStep(1); setErrors({}); }}
                        className="flex-1 bg-zinc-800/80 border border-white/8 text-zinc-300 hover:text-white rounded-xl py-3 text-sm transition-colors">
                        ← Back
                      </button>
                      <button onClick={handleSubmit} disabled={loading || strengthScore < 2}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2">
                        {loading ? <Spinner size={16} /> : "Create account"}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <p className="text-center text-sm text-zinc-600">
                Already have an account?{" "}
                <button onClick={onLogin} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Sign in</button>
              </p>

              <p className="text-center text-[11px] text-zinc-700 mt-4 leading-relaxed">
                By creating an account, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and never sold.
              </p>
            </>
          )}
        </div>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} type={toast.type} />
    </div>
  );
}
