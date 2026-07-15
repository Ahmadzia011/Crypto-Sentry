"use client";

import { Star, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleWatchlist } from "../actions/watchlist";
import { stringify } from "querystring";

interface WatchlistButtonProps {
  assetId: string;
  assetName: string;
  initialWatchlisted: boolean;
}

export default function WatchlistButton({
  assetId,
  assetName,
  initialWatchlisted,
}: WatchlistButtonProps) {
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(initialWatchlisted);
  // useTransition gives us a pending flag so we can disable the button
  // while the server action round-trip is in flight.
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const optimisticNext = !isWatchlisted;
    setIsWatchlisted(optimisticNext);

    startTransition(async () => {

      const result = await toggleWatchlist(assetId, assetName);
      if (!result.success) {
        // Revert optimistic update on failure.
        setIsWatchlisted(!optimisticNext);
      } else {
        setIsWatchlisted(result.watchlisted);
      }
    });
  };

  return (
    <button
      id={`watchlist-btn-${assetId}`}
      onClick={handleToggle}
      disabled={isPending}
      title={isWatchlisted ? `Remove ${assetName} from watchlist` : `Add ${assetName} to watchlist`}
      className="cursor-pointer p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-600 hover:text-yellow-500 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all duration-300 group/star disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin text-yellow-500/60" />
      ) : (
        <Star
          size={18}
          className={`transition-all duration-300 ${
            isWatchlisted
              ? "fill-yellow-500 text-yellow-400"
              : "group-hover/star:scale-110"
          }`}
        />
      )}
    </button>
  );
}
