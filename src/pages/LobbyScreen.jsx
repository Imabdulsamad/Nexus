import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "../components/ui/Avatar";
import { Field } from "../components/ui/Field";
import { suggestMeetingTimes } from "../utils/aiAssistant";
import ChatPanel from "../components/ui/ChatPanel";

const CONTACTS = [
  { id: 1, name: "Alex Morgan", role: "Product Designer", status: "online", avatarIdx: 0, language: "Spanish", availability: ["Mon 10AM", "Tue 3PM"] },
  { id: 2, name: "Jamie Kim", role: "Lead Engineer", status: "online", avatarIdx: 1, language: "English", availability: ["Tue 1PM", "Wed 11AM"] },
  { id: 3, name: "Sara Reyes", role: "Data Analyst", status: "away", avatarIdx: 2, language: "Spanish", availability: ["Thu 2PM", "Fri 10AM"] },
  { id: 4, name: "Tom Drake", role: "DevOps", status: "offline", avatarIdx: 3, language: "English", availability: ["Mon 4PM", "Wed 5PM"] },
];

export default function LobbyScreen({ onJoin, onProfile }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("join");
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);
  const generated = useRef("nexus-" + Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 6));

  const copyCode = () => {
    navigator.clipboard?.writeText(`nexus.app/${generated.current}`).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col" style={{ fontFamily: "'Syne', sans-serif" }}>
      <nav className="flex items-center justify-between px-6 py-3.5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-emerald-400" /></div>
          <span className="text-white font-semibold tracking-tight">nexus</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onProfile} className="flex items-center gap-2.5 hover:bg-white/5 rounded-xl px-3 py-1.5 transition-colors">
            <Avatar name={user?.name} avatarIdx={user?.avatar} size="sm" showDot dotColor="bg-emerald-400" />
            <span className="text-sm text-zinc-400 hidden sm:block">{user?.name}</span>
          </button>
          <button onClick={logout} className="text-zinc-600 hover:text-zinc-400 transition-colors p-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-64 border-r border-white/5 p-4 gap-5">
          <div>
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mb-2">Contacts</p>
            {CONTACTS.map(c => (
              <button key={c.id} onClick={() => onJoin(c)} className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors group text-left">
                <div className="relative">
                  <Avatar name={c.name} avatarIdx={c.avatarIdx} size="sm" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${c.status === "online" ? "bg-emerald-400" : c.status === "away" ? "bg-amber-400" : "bg-zinc-700"}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-zinc-200 group-hover:text-white truncate">{c.name}</p>
                  <p className="text-[10px] text-zinc-600 truncate">{c.role}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="ml-auto opacity-0 group-hover:opacity-100 text-emerald-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </button>
            ))}
          </div>

          <div className="bg-zinc-900/50 border border-white/8 rounded-3xl p-4">
            <ChatPanel compact />
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                Good to see you,<br /><span className="text-emerald-400">{user?.name?.split(" ")[0]}</span>
              </h1>
              <p className="text-zinc-500 text-sm">Ready to connect?</p>
            </div>

            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl overflow-hidden">
              <div className="flex border-b border-white/8">
                {["join", "new"].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t ? "text-white border-b-2 border-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}>
                    {t === "join" ? "Join a call" : "New meeting"}
                  </button>
                ))}
              </div>
              <div className="p-5 space-y-4">
                {tab === "join" ? (
                  <>
                    <Field label="Room code" value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="nexus-xxxx-xxxx" />
                    <button onClick={() => onJoin(CONTACTS[0])}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl py-3.5 text-sm transition-all flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                      Join call
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-zinc-800/50 rounded-xl p-3.5 border border-white/5">
                      <p className="text-[10px] font-mono text-zinc-600 mb-1.5">YOUR MEETING LINK</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono text-emerald-400 flex-1 truncate">nexus.app/{generated.current}</p>
                        <button onClick={copyCode} className="p-1.5 hover:bg-white/8 rounded-lg text-zinc-500 hover:text-white transition-colors">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                            {copied ? <path d="M20 6L9 17l-5-5" /> : <><path d="M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1" /></>}
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button onClick={() => onJoin(CONTACTS[0])}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl py-3.5 text-sm transition-all flex items-center justify-center gap-2">
                      Start meeting
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
