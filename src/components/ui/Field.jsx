import { useState } from "react";

export function Field({ label, type = "text", value, onChange, placeholder, error, icon, hint, required }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase flex items-center gap-1">
          {label}{required && <span className="text-emerald-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">{icon}</div>
        )}
        <input
          type={isPass ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-zinc-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${isPass ? "pr-10" : ""}
            ${error ? "border-red-500/50 focus:border-red-400/70 bg-red-500/5" : "border-white/8 focus:border-emerald-400/40 focus:bg-zinc-900"}`}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              {show
                ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
              }
            </svg>
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}
      {hint && !error && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}
