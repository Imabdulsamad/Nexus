import { getInitials } from "../../utils/jwt";

const AVATAR_STYLES = [
  { bg: "from-emerald-500/25 to-teal-600/10", text: "text-emerald-400", ring: "ring-emerald-500/30", dot: "bg-emerald-400" },
  { bg: "from-sky-500/25 to-blue-600/10", text: "text-sky-400", ring: "ring-sky-500/30", dot: "bg-sky-400" },
  { bg: "from-violet-500/25 to-purple-600/10", text: "text-violet-400", ring: "ring-violet-500/30", dot: "bg-violet-400" },
  { bg: "from-amber-500/25 to-orange-600/10", text: "text-amber-400", ring: "ring-amber-500/30", dot: "bg-amber-400" },
];

export function Avatar({ name, avatarIdx = 0, size = "md", showDot = false, dotColor = "bg-emerald-400" }) {
  const a = AVATAR_STYLES[avatarIdx % AVATAR_STYLES.length];
  const sz = { xs: "w-6 h-6 text-[9px]", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" }[size];
  return (
    <div className={`relative ${sz} rounded-full bg-gradient-to-br ${a.bg} ring-1 ${a.ring} flex items-center justify-center font-semibold ${a.text} tracking-tight flex-shrink-0`}>
      {getInitials(name)}
      {showDot && <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${dotColor}`} />}
    </div>
  );
}