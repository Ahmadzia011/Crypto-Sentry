import Sidebar from "../component/Sidebar";
import { prisma } from "../lib/prisma";

export default async function History() {
  const records = await prisma.cryptoAlert.findMany({
    orderBy: { detected_at: 'desc' }
  });

  return (
    <div className="flex min-h-screen bg-[#05070a]">

        <Sidebar/>
      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl ml-20">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">System Database</span>
              </div>
             <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
        Sentry <span className="text-blue-500">Logs</span>
      </h2>
              <p className="text-slate-500 font-mono text-sm mt-1">Historical database of market volatility detections.</p>
            </div>

            <div className="bg-[#070b14] border border-slate-800/60 p-5 rounded-2xl flex items-center gap-8 shadow-xl">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Total Detections</p>
                <p className="text-2xl font-mono font-black text-white">{records.length}</p>
              </div>
              <div className="w-[1px] h-10 bg-slate-800" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Database Health</p>
                <p className="text-xs font-mono text-emerald-500 font-bold uppercase">Optimal</p>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#070b14] border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-5 px-8 py-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black bg-slate-900/20 border-b border-slate-800/60">
              <div className="col-span-2">Asset Intelligence</div>
              <div>Detection Price</div>
              <div>Volatility Index</div>
              <div className="text-right">Event Timestamp</div>
            </div>

            <div className="divide-y divide-slate-800/40">
              {records.length > 0 ? (
                records.map((item) => (
                  <div 
                    key={item.id} 
                    className="grid grid-cols-1 md:grid-cols-5 items-center px-8 py-6 hover:bg-blue-600/[0.02] transition-colors group"
                  >
                    {/* Asset Info */}
                    <div className="col-span-2 mb-4 md:mb-0">
                      <p className="text-[10px] font-mono text-blue-500/80 mb-1 tracking-tighter italic">#{item.id.slice(-6)}</p>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.asset_name}   
                      </h3>
                    </div>

                    {/* Price Data */}
                    <div className="mb-3 md:mb-0">
                      <p className="text-[10px] text-slate-600 md:hidden uppercase font-bold mb-1">Price at Drop</p>
                      <p className="font-mono text-slate-300 text-sm">${item.price_at_drop.toLocaleString()}</p>
                    </div>

                    {/* Drop Percentage */}
                    <div className="mb-3 md:mb-0">
                      <p className="text-[10px] text-slate-600 md:hidden uppercase font-bold mb-1">Volatility</p>
                      <span className="text-rose-500 font-black bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-xs">
                        -{item.drop_percentage}%
                      </span>
                    </div>

                    {/* Date */}
                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-300 font-mono">
                        {new Date(item.detected_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase tracking-tighter">
                        {new Date(item.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32">
                  <div className="inline-flex p-4 rounded-full bg-slate-900/50 mb-4 border border-slate-800">
                  </div>
                  <p className="text-slate-500 font-mono text-sm">Sentry database is currently synchronized but empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}