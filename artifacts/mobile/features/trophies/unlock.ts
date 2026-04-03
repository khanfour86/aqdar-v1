import { Trophy, TROPHIES } from "@/constants/trophies";
import { canUnlockTrophy } from "@/features/entitlements";
import { SubscriptionTier } from "@/store/types";

// ─────────────────────────────────────────────────────────────────────────────
// Trophy domain service
// All unlock logic lives here — dashboard and other screens are display-only.
// ─────────────────────────────────────────────────────────────────────────────

export interface StreakSnapshot {
  days: number;
  moneySaved: number;
  cravingsResisted: number;
}

export interface TrophyUnlockResult {
  newlyUnlocked: Trophy[];
}

/**
 * Evaluate which trophies should be unlocked given the current streak snapshot.
 * Returns only the newly unlocked ones (not already in unlockedIds).
 * Premium trophies are silently skipped for free users.
 */
export function evaluateTrophyUnlocks(
  snapshot: StreakSnapshot,
  unlockedIds: string[],
  tier: SubscriptionTier
): TrophyUnlockResult {
  const newlyUnlocked: Trophy[] = [];

  for (const trophy of TROPHIES) {
    if (unlockedIds.includes(trophy.id)) continue;
    if (!canUnlockTrophy(trophy.isPremium, tier)) continue;

    const { type, value } = trophy.requirement;

    const meetsRequirement =
      (type === "days" && snapshot.days >= value) ||
      (type === "money" && snapshot.moneySaved >= value) ||
      (type === "cravings_resisted" && snapshot.cravingsResisted >= value);

    if (meetsRequirement) {
      newlyUnlocked.push(trophy);
    }
  }

  return { newlyUnlocked };
}

/**
 * Returns trophies the user has unlocked, sorted by requirement ascending.
 */
export function getUnlockedTrophies(unlockedIds: string[]): Trophy[] {
  return TROPHIES.filter((t) => unlockedIds.includes(t.id));
}

/**
 * Returns the next trophy the user can earn (respects entitlements).
 */
export function getNextTrophy(
  unlockedIds: string[],
  tier: SubscriptionTier
): Trophy | null {
  return (
    TROPHIES.find(
      (t) =>
        !unlockedIds.includes(t.id) && canUnlockTrophy(t.isPremium, tier)
    ) ?? null
  );
}

/**
 * Returns progress (0–1) toward the next trophy.
 */
export function progressToNextTrophy(
  next: Trophy | null,
  snapshot: StreakSnapshot
): number {
  if (!next) return 1;
  const { type, value } = next.requirement;
  if (type === "days") return Math.min(1, snapshot.days / value);
  if (type === "money") return Math.min(1, snapshot.moneySaved / value);
  if (type === "cravings_resisted")
    return Math.min(1, snapshot.cravingsResisted / value);
  return 0;
}
