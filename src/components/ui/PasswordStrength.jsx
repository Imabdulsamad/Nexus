export function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Symbol", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["bg-zinc-700", "bg-red-500", "bg-amber-500", "bg-sky-400", "bg-emerald-400"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score] : "bg-zinc-800"}`} />
          ))}
        </div>
        <span className={`text-[10px] font-mono ${["", "text-red-400", "text-amber-400", "text-sky-400", "text-emerald-400"][score]}`}>{labels[score]}</span>
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1 text-[10px] font-mono transition-colors ${c.ok ? "text-emerald-400" : "text-zinc-600"}`}>
            <span>{c.ok ? "✓" : "○"}</span>{c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
