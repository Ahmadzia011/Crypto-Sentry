"use client";

import { useState, useEffect } from "react";
import Dashboard from "./dashboard/page";
import PriceCard from "./pricecard/page";
import { useSession } from "next-auth/react";
import { getUserWatchlistIds } from "./actions/watchlist";

export default function Home() {

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastTime, setLastTime] = useState("");
  const [now, setNow] = useState(Date.now());
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  const { data, status } = useSession();
  const userEmail = data?.user?.email ?? null;

  // Tick every second to keep the staleness indicator fresh.
  useEffect(() => {
    const ticker = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Fetch live price data from the sentry server on a 5-second cadence.
  useEffect(() => {
    getSentryData();
    const interval = setInterval(getSentryData, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the user's watchlist once the session is known.
  // We re-fetch whenever the email changes (login / logout).
  useEffect(() => {
    if (status === "loading") return;
    if (!userEmail) {
      setWatchlistIds([]);
      return;
    }
    getUserWatchlistIds().then(setWatchlistIds).catch(() => setWatchlistIds([]));
  }, [userEmail, status]);

  // Determine Global Status
  const secondsSinceUpdate = lastTime
    ? Math.floor((now - new Date(lastTime).getTime()) / 1000)
    : 999;
  const isSystemOnline = secondsSinceUpdate < 60;

  const getSentryData = async () => {
    try {
      const response = await fetch("http://localhost:3001/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error status");
      }

      const actual_result = await response.json();
      const result = actual_result["priceCache"];

      if (result && result.data && result.data.length > 0) {
        setAssets(result.data);
        setLastTime(result["lastUpdated"]);
        localStorage.setItem("cached_assets", JSON.stringify(result.data));
        localStorage.setItem("cached_time", result["lastUpdated"]);
        setLoading(false);
      }
    } catch (error) {
      // Fallback: show cached data rather than a blank screen.
      setLoading(false);
      const cache_asset: any = localStorage.getItem("cached_assets");
      const cache_lasttime: any = localStorage.getItem("cached_time");
      const cache_array = JSON.parse(cache_asset);
      setAssets(cache_array);
      setLastTime(cache_lasttime);
    }
  };

  return (
    <Dashboard isOnline={isSystemOnline}>
      {loading ? (
        <div className="text-white p-30"> 🛰️ Connecting to Sentry...</div>
      ) : (
        assets.map((coin: any, index) => (
          <PriceCard
            key={index}
            data={coin}
            timeStamp={lastTime}
            now={now}
            userEmail={userEmail}
            initialWatchlisted={watchlistIds.includes(coin.asset_id)}
          />
        ))
      )}
    </Dashboard>
  );
}
