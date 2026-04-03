// ─────────────────────────────────────────────────────────────────────────────
// Static application config (non-secret, safe to bundle)
// ─────────────────────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: "أنا أقدر",
  version: "1.0.0",
  buildNumber: 1,

  // Streak
  sleepHoursPerDay: 8,
  awakeHoursPerDay: 16,
  cigarettesPerPack: 20,

  // Coach message rotation
  coachMessageIntervalMs: 60_000,

  // Subscription
  premiumHabitLimit: 10,
  freeHabitLimit: 1,

  // Storage
  storageKey: "@ana_aquder_state_v2",
  legacyStorageKey: "@ana_aquder_state",

  // AI fallback (used when OpenAI is not configured)
  useFallbackMessages: true,

  // Trophy check debounce (ms)
  trophyCheckDebounceMs: 2_000,
} as const;
