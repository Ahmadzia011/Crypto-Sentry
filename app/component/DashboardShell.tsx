import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#05070a] overflow-hidden">
        <header className="flex justify-between items-center px-10 py-8 border-b border-white/3 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
              Market <span className="text-blue-500">Sentry</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-mono tracking-[0.3em] mt-1">
              LIVE_TERMINAL_FEED_01
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                System Online
              </span>
            </div>
            <button className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all">
              User
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col p-8">
          <div className="bg-[#070b14] border border-white/5 rounded-4xl flex flex-col h-full overflow-hidden shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)]">
            <div className="hidden md:grid grid-cols-6 px-10 py-8 bg-slate-900/20 border-b border-white/3 text-[10px] uppercase font-black tracking-[0.25em] text-slate-500">
              <div>Asset Name</div>
              <div>Current Value</div>
              <div className="text-center">24h Volatility</div>
              <div className="text-center">Coin status</div>
              <div className="text-center">Health</div>
              <div className="text-right">Watchlist</div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/2 custom-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
