import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import RegisterScreen from "./pages/RegisterScreen";
import LoginScreen from "./pages/LoginScreen";
import ProfileScreen from "./pages/ProfileScreen";
import LobbyScreen from "./pages/LobbyScreen";
import CallScreen from "./pages/CallScreen";
import { Spinner } from "./components/ui/Spinner";

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  const [screen, setScreen] = useState("login"); // login | register | lobby | profile | call
  const [callContact, setCallContact] = useState(null);

  useEffect(() => {
    if (!loading && isAuthenticated) setScreen("lobby");
    else if (!loading && !isAuthenticated) setScreen("login");
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center" style={{ fontFamily: "'Syne', sans-serif" }}>
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} />
          <p className="text-[11px] font-mono text-zinc-600 tracking-widest">RESTORING SESSION...</p>
        </div>
      </div>
    );
  }

  if (screen === "register") return <RegisterScreen onLogin={() => setScreen("login")} onSuccess={() => setScreen("lobby")} />;
  if (screen === "login") return <LoginScreen onRegister={() => setScreen("register")} onSuccess={() => setScreen("lobby")} />;
  if (screen === "profile") return <ProfileScreen onBack={() => setScreen("lobby")} />;
  if (screen === "lobby") return <LobbyScreen onJoin={(c) => { setCallContact(c); setScreen("call"); }} onProfile={() => setScreen("profile")} />;
  if (screen === "call") return <CallScreen contact={callContact} onBack={() => setScreen("lobby")} />;

  return null;
}

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        <AppRouter />
      </ChatProvider>
    </AuthProvider>
  );
}