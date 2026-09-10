import { getServerSession } from "next-auth";
import Sidebar from "../component/Sidebar";
import { authOptions } from "../lib/auth";
import { prisma } from "../lib/prisma";




export default async function Watchlist() {

  const session = await getServerSession(authOptions);
  const user_email: any = session?.user?.email
  let databaseError = "";
  let watchlist_records: any[] = [];

  try {
    if (user_email) {
      const user: any = await prisma.user.findUnique({
        where: {
          email: user_email
        },
        select: { id: true }
      })
      watchlist_records = user
        ? await prisma.watchlist.findMany({
            where: {
              user_id: user.id
            },
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: { added_at: "desc" },
          })
        : [];
    }
  } catch (error) {
    console.error("Could not load watchlist:", error);
    databaseError = "The database is unavailable right now, so your watchlist could not be loaded.";
  }


  return (
    <div className="flex min-h-screen bg-[#05070a]">
      <Sidebar />
      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl ml-20">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                  System Database
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
                Sentry <span className="text-blue-500">Watchlist</span>
              </h2>
              <p className="text-slate-500 font-mono text-sm mt-1">
                Historical database of user watchlisted assets.
              </p>
            </div>

            <div className="bg-[#070b14] border border-slate-800/60 p-5 rounded-2xl flex items-center gap-8 shadow-xl">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">
                  Total Detections
                </p>
                <p className="text-2xl font-mono font-black text-white">
                  {databaseError ? "—" : watchlist_records.length}
                </p>
              </div>
              <div className="w-[1px] h-10 bg-slate-800" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">
                  Database Health
                </p>
                <p className={`text-xs font-mono font-bold uppercase ${databaseError ? "text-amber-500" : "text-emerald-500"}`}>
                  {databaseError ? "Unavailable" : "Optimal"}
                </p>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#070b14] border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-5 px-8 py-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black bg-slate-900/20 border-b border-slate-800/60">
              <div className="col-span-2">Asset Name</div>
              <div>Asset ID</div>
              <div>User</div>
              <div className="text-right">Added At</div>
            </div>

            <div className="divide-y divide-slate-800/40">
              {databaseError ? (
                <div className="text-center py-32 px-6">
                  <p className="text-amber-500 font-mono text-sm">
                    {databaseError}
                  </p>
                </div>
              ) : watchlist_records.length > 0 ? (
                watchlist_records.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-5 items-center px-8 py-6 hover:bg-blue-600/[0.02] transition-colors group"
                  >
                    <div className="col-span-2 mb-4 md:mb-0">
                      <p className="text-[10px] font-mono text-blue-500/80 mb-1 tracking-tighter italic">
                        Watchlist #{item.id.slice(-6)}
                      </p>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.asset_name}
                      </h3>
                    </div>

                    <div className="mb-4 md:mb-0">
                      <p className="text-[10px] text-slate-600 md:hidden uppercase font-bold mb-1">
                        Asset ID
                      </p>
                      <p className="font-mono text-slate-300 text-sm">
                        {item.asset_id}
                      </p>
                    </div>

                    <div className="mb-4 md:mb-0">
                      <p className="text-[10px] text-slate-600 md:hidden uppercase font-bold mb-1">
                        User
                      </p>
                      <p className="text-sm font-bold text-slate-200">
                        {item.user?.name || "Unnamed user"}
                      </p>
                      <p className="mt-1 text-[10px] font-mono text-slate-500">
                        {item.user?.email || user_email}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-slate-600 md:hidden uppercase font-bold mb-1">
                        Added At
                      </p>
                      <p className="text-sm text-slate-300 font-mono">
                        {new Date(item.added_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase tracking-tighter">
                        {new Date(item.added_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32">
                  <div className="inline-flex p-4 rounded-full bg-slate-900/50 mb-4 border border-slate-800"></div>
                  <p className="text-slate-500 font-mono text-sm">
                    Sentry database is currently synchronized but empty.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
