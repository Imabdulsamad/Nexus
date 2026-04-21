import { useState } from "react";
import { decodeJWT } from "../../utils/jwt";

export function JWTViewer({ token }) {
  const [open, setOpen] = useState(false);
  if (!token) return null;
  const parts = token.split(".");
  const header = parts[0] ? JSON.parse(atob(parts[0])) : {};
  const payload = parts[1] ? JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))) : {};
  const expDate = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "—";
  const iatDate = payload.iat ? new Date(payload.iat * 1000).toLocaleString() : "—";

  return (
    <div className="mt-4">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
          className={`transition-transform ${open ? "rotate-90" : ""}`}><path d="M9 18l6-6-6-6" /></svg>
        {open ? "HIDE" : "INSPECT"} JWT TOKEN
      </button>
      {open && (
        <div className="mt-2 bg-zinc-950 border border-white/8 rounded-xl p-4 text-[11px] font-mono space-y-3">
          <div>
            <p className="text-sky-400 mb-1">// HEADER</p>
            <p className="text-zinc-500">alg: <span className="text-zinc-300">{header.alg}</span></p>
            <p className="text-zinc-500">typ: <span className="text-zinc-300">{header.typ}</span></p>
          </div>
          <div>
            <p className="text-emerald-400 mb-1">// PAYLOAD</p>
            <p className="text-zinc-500">sub: <span className="text-zinc-300">{payload.sub?.slice(0, 12)}...</span></p>
            <p className="text-zinc-500">name: <span className="text-zinc-300">{payload.name}</span></p>
            <p className="text-zinc-500">email: <span className="text-zinc-300">{payload.email}</span></p>
            <p className="text-zinc-500">iat: <span className="text-zinc-400">{iatDate}</span></p>
            <p className="text-zinc-500">exp: <span className="text-amber-400">{expDate}</span></p>
          </div>
          <div>
            <p className="text-red-400 mb-1">// SIGNATURE</p>
            <p className="text-zinc-600 break-all">{parts[2]?.slice(0, 24)}...</p>
          </div>
          <div className="pt-2 border-t border-white/5">
            <p className="text-zinc-600 mb-1">// RAW TOKEN</p>
            <p className="text-zinc-700 break-all leading-relaxed">{token.slice(0, 60)}...</p>
          </div>
        </div>
      )}
    </div>
  );
}
