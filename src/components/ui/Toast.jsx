export function Toast({ msg, visible, type = "info" }) {
  const colors = {
    info: "border-zinc-700/50 text-zinc-300 bg-zinc-950/95",
    success: "border-emerald-500/30 text-emerald-300 bg-emerald-500/5",
    error: "border-red-500/30 text-red-300 bg-red-500/5",
  };

  return (
    <div className={`fixed top-6 right-6 z-[100] max-w-sm transition-all duration-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className={`border rounded-3xl px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-sm ${colors[type]}`}>
        {msg}
      </div>
    </div>
  );
}
