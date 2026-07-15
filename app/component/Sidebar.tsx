import { LayoutDashboard, History, Coins } from "lucide-react";
import { LogOut } from "./Logout";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-800/60 bg-[#070b14] hidden md:flex flex-col sticky top-0 h-screen shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tighter leading-none">Crypto Sentry</h1>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Version 1.0</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 px-4 flex-1 flex flex-col justify-between pb-8">
        <div className="space-y-1">
          <SidebarLink href="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarLink href="/alertHistory" icon={<History size={18} />} label="Alert History" />
          <SidebarLink href="/watchlist" icon={<Coins size={18} />} label="Watchlist" />
        </div>

        <div className="pt-4 border-t border-slate-800/50">
          <LogOut />
        </div>
      </nav>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active = false }: any) {
  return (
    <a
      href={href}
      className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium group ${
        active 
        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border border-transparent"
      }`}
    >
      <span className="mr-3 transition-transform group-hover:scale-110">{icon}</span>
      {label}
    </a>
  );
}