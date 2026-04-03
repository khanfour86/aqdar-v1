import { SubscriptionTier } from "@/store/types";

// ─────────────────────────────────────────────────────────────────────────────
// Entitlement definitions
// All feature gating must go through this module — never check tier directly.
// ─────────────────────────────────────────────────────────────────────────────

export const FREE_HABIT_LIMIT = 1;
export const PREMIUM_HABIT_LIMIT = 10;

export interface Entitlements {
  maxHabits: number;
  canAddHabit: (currentCount: number) => boolean;
  premiumTrophies: boolean;
  aiCoach: boolean;
  advancedStats: boolean;
  community: boolean;
  exportData: boolean;
}

export function getEntitlements(tier: SubscriptionTier): Entitlements {
  const isPremium = tier === "premium";

  return {
    maxHabits: isPremium ? PREMIUM_HABIT_LIMIT : FREE_HABIT_LIMIT,
    canAddHabit: (count) =>
      isPremium ? count < PREMIUM_HABIT_LIMIT : count < FREE_HABIT_LIMIT,
    premiumTrophies: isPremium,
    aiCoach: true,         // basic AI messages for all; full chat = premium
    advancedStats: isPremium,
    community: isPremium,
    exportData: isPremium,
  };
}

export function useEntitlements(tier: SubscriptionTier): Entitlements {
  return getEntitlements(tier);
}

// ─── Guard helpers ────────────────────────────────────────────────────────────

export function isPremium(tier: SubscriptionTier): boolean {
  return tier === "premium";
}

export function canUnlockTrophy(
  trophyIsPremium: boolean,
  tier: SubscriptionTier
): boolean {
  if (!trophyIsPremium) return true;
  return tier === "premium";
}
