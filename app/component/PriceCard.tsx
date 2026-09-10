import WatchlistButton from "./WatchlistButton";

interface PriceCardProps {
  data: any;
  timeStamp: any;
  now: any;
  userEmail: string | null;
  initialWatchlisted: boolean;
}

export default function PriceCard({
  data,
  timeStamp,
  now,
  userEmail,
  initialWatchlisted,
}: PriceCardProps) {
  const lastUpdatedTime = new Date(timeStamp).getTime();
  const secondsAgo = Math.floor((now - lastUpdatedTime) / 1000);
  const isStale = secondsAgo >= 30;
  const isDrop = data.asset_24h < 0;
  const isSafe = data.safe_state;
  const formattedName =
    data.asset_name.charAt(0).toUpperCase() + data.asset_name.slice(1);

  return (
    <div className="group bg-transparent hover:bg-white/2 transition-all duration-300 px-10 py-7">
      <div className="grid grid-cols-1 md:grid-cols-6 items-center gap-8 pr-5">
        <div className="flex items-center gap-5">
          <div
            className={`w-1 h-10 rounded-full transition-all duration-700 ${
              isDrop
                ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            }`}
          />
          <div>
            <h3 className="text-white font-bold text-xl tracking-tight leading-none group-hover:text-blue-400 transition-colors">
              {formattedName}
            </h3>
            <p className="text-slate-600 text-[9px] font-mono mt-2 uppercase tracking-[0.15em] font-bold">
              {data.asset_symbol || "USDT"}{" "}
              <span className="text-slate-800 mx-1">|</span> CRYPTO
            </p>
          </div>
        </div>

        <div className="md:pl-4">
          <p className="text-white font-mono font-bold text-lg tracking-tighter">
            $
            {Number(data.asset_price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="md:text-center">
          <div
            className={`inline-flex items-center gap-1.5 font-mono font-bold text-sm ${
              isDrop ? "text-rose-500" : "text-emerald-400"
            }`}
          >
            {isDrop ? "v" : "^"} {Math.abs(data.asset_24h).toFixed(2)}%
          </div>
        </div>

        <div className="flex md:justify-center">
          {isSafe ? (
            <span className="text-emerald-500 text-[9px] font-black tracking-[0.2em] uppercase py-1.5 px-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg shadow-inner">
              Stable
            </span>
          ) : (
            <span className="flex items-center gap-2.5 text-rose-500 text-[9px] font-black tracking-[0.2em] uppercase py-1.5 px-4 bg-rose-500/5 border border-rose-500/10 rounded-lg animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              Critical
            </span>
          )}
        </div>

        <div className="flex md:justify-center items-center">
          {isStale ? (
            <div className="text-center">
              <span className="text-amber-500 text-[14px] font-black uppercase tracking-tighter">
                Stale
              </span>
              <p className="text-grey-600 text-[10px] font-mono mt-0.5">
                {secondsAgo}s delay
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-emerald-500/40">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">
                Live
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
          )}
        </div>

        <div className="flex md:justify-end">
          {userEmail && (
            <WatchlistButton
              assetId={data.asset_id}
              assetName={formattedName}
              initialWatchlisted={initialWatchlisted}
            />
          )}
        </div>
      </div>
    </div>
  );
}
