"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { prisma } from "../lib/prisma";

// Resolves the DB user id from the current session.
// Returns null when there is no authenticated session or the user row is missing.
async function resolveUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true },
  });

  return user?.id ?? null;
}

/**
 * Toggles the watchlist state for a given asset.
 * – If the asset is already watchlisted it is removed.
 * – Otherwise a new record is created.
 * Returns the new watchlisted state so the client can update optimistically.
 */
export async function toggleWatchlist(
  assetId: string,
  assetName: string
): Promise<{ success: boolean; watchlisted: boolean; message: string }> {
  const userId = await resolveUserId();

  if (!userId) {
    return { success: false, watchlisted: false, message: "Not authenticated." };
  }

  console.log(userId)
  assetId = assetId.toString()
  try {
    const existing = await prisma.watchlist.findUnique({
      where: { user_id_asset_id: { user_id: userId, asset_id: assetId } },
    });

    if (existing) {
      await prisma.watchlist.delete({
        where: { user_id_asset_id: { user_id: userId, asset_id: assetId } },
      });
      return { success: true, watchlisted: false, message: `${assetName} removed from watchlist.` };
    } else {
      await prisma.watchlist.create({
        data: { user_id: userId, asset_id: assetId, asset_name: assetName },
      });
      return { success: true, watchlisted: true, message: `${assetName} added to watchlist.` };
    }
  } catch (error) {
    console.error("Watchlist toggle error:", error);
    return { success: false, watchlisted: false, message: "Could not update watchlist." };
  }
}

/**
 * Returns the set of asset_ids the current user has watchlisted.
 * Returns an empty array for unauthenticated users.
 */
export async function getUserWatchlistIds(): Promise<string[]> {
  const userId = await resolveUserId();
  if (!userId) return [];

  const records = await prisma.watchlist.findMany({
    where: { user_id: userId },
    select: { asset_id: true },
  });

  return records.map((r) => r.asset_id);
}
