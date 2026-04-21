import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_API } from "../api/authService";
import { Field } from "../components/ui/Field";
import { Toast } from "../components/ui/Toast";
import { Spinner } from "../components/ui/Spinner";
import { JWTViewer } from "../components/ui/JWTViewer";

export default function LoginScreen({ onRegister, onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false, type: "info" });
  const [issuedToken, setIssuedToken] = useState(null);
  const [view, setView] = useState("login");
  const [resetData, setResetData] = useState({ email: "", code: "", password: "", confirm: "" });
  const [resetSent, setResetSent] = useState(false);
  const [resetTokenDisplay, setResetTokenDisplay] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, visible: true, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const f = (field) => (e) => setForm(v => ({ ...v, [field]: e.target.value }));
  const r = (field) => (e) => setResetData(v => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await login(form);
      setIssuedToken(result.token);
      showToast("Signed in — JWT issued", "success");
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      showToast(err.message, "error");
      setErrors({ password: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrors({});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetData.email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }

    setLoading(true);
    try {
      const { code } = await MOCK_API.requestPasswordReset({ email: resetData.email });
      setResetSent(true);
      setResetTokenDisplay(code);
      showToast("Password reset code generated", "success");
      setView("reset");
    } catch (err) {
      showToast(err.message, "error");
      setErrors({ email: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetData.email)) e.email = "Enter a valid email";
    if (!resetData.code) e.code = "Enter the reset code";
    if (resetData.password.length < 8) e.password = "Password must be at least 8 characters";
    if (resetData.password !== resetData.confirm) e.confirm = "Passwords must match";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await MOCK_API.resetPassword({
        email: resetData.email,
        code: resetData.code,
        password: resetData.password,
      });
      setView("login");
      setResetData({ email: "", code: "", password: "", confirm: "" });
      setResetSent(false);
      setResetTokenDisplay(null);
      showToast("Password has been reset. Please sign in.", "success");
    } catch (err) {
      showToast(err.message, "error");
      setErrors({ code: err.message, password: err.message });
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setView("login");
    setResetData({ email: "", code: "", password: "", confirm: "" });
    setErrors({});
    setResetSent(false);
    setResetTokenDisplay(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-white text-xl font-semibold tracking-tight">nexus</span>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 text-sm">Sign in to your account to continue</p>
        </div>

        <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-6 space-y-4 mb-4">
          {view === "login" && (
            <>
              <Field label="Email address" type="email" value={form.email} onChange={f("email")} placeholder="you@example.com" error={errors.email} />
              <Field label="Password" type="password" value={form.password} onChange={f("password")} placeholder="Your password" error={errors.password}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

              <div className="flex justify-between items-center">
                <button onClick={() => setView("forgot")} className="text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
                  Forgot password?
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 font-bold rounded-xl py-3.5 px-6 text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                  {loading ? <><Spinner size={16} /> Signing in...</> : "Sign in"}
                </button>
              </div>
            </>
          )}

          {view === "forgot" && (
            <>
              <Field label="Email address" type="email" value={resetData.email} onChange={r("email")} placeholder="you@example.com" error={errors.email} />
              <p className="text-sm text-zinc-500">Enter your account email and we’ll generate a reset code.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <button onClick={switchToLogin} className="text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
                  Back to sign in
                </button>
                <button onClick={handleForgotPassword} disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 font-bold rounded-xl py-3.5 px-6 text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                  {loading ? <><Spinner size={16} /> Sending...</> : "Send reset code"}
                </button>
              </div>
            </>
          )}

          {view === "reset" && (
            <>
              <Field label="Email address" type="email" value={resetData.email} onChange={r("email")} placeholder="you@example.com" error={errors.email} />
              <Field label="Reset code" type="text" value={resetData.code} onChange={r("code")} placeholder="ABC123" error={errors.code} />
              <Field label="New password" type="password" value={resetData.password} onChange={r("password")} placeholder="New password" error={errors.password} />
              <Field label="Confirm password" type="password" value={resetData.confirm} onChange={r("confirm")} placeholder="Confirm password" error={errors.confirm} />
              {resetTokenDisplay && (
                <div className="rounded-2xl bg-zinc-950/80 border border-white/10 p-3 text-sm text-zinc-400">
                  Demo reset code: <span className="text-emerald-300 font-semibold">{resetTokenDisplay}</span>
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <button onClick={switchToLogin} className="text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
                  Back to sign in
                </button>
                <button onClick={handleResetPassword} disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 font-bold rounded-xl py-3.5 px-6 text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                  {loading ? <><Spinner size={16} /> Reset password</> : "Reset password"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* JWT debug panel */}
        {issuedToken && (
          <div className="bg-zinc-900/40 border border-emerald-400/15 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 tracking-widest">JWT ISSUED SUCCESSFULLY</span>
            </div>
            <JWTViewer token={issuedToken} />
          </div>
        )}

        <p className="text-center text-sm text-zinc-600">
          New to Nexus?{" "}
          <button onClick={onRegister} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Create account</button>
        </p>

        {/* Demo hint */}
        <div className="mt-6 bg-zinc-900/40 border border-white/5 rounded-xl p-3.5">
          <p className="text-[10px] font-mono text-zinc-600 mb-1">// DEMO ACCOUNTS</p>
          <p className="text-[11px] text-zinc-500">Register a new account above, or use any email/password you previously registered with. All data is stored in localStorage for this demo.</p>
        </div>
      </div>
      <Toast msg={toast.msg} visible={toast.visible} type={toast.type} />
    </div>
  );
}
