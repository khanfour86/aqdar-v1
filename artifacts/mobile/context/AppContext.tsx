// ─────────────────────────────────────────────────────────────────────────────
// AppContext — thin backwards-compatibility shim over AppStore
// All screens still import from here; the real logic lives in store/AppStore.tsx
// ─────────────────────────────────────────────────────────────────────────────

export { AppStoreProvider as AppProvider, useAppStore as useApp } from "@/store/AppStore";

// Re-export types so existing imports still resolve
export type {
  HabitType,
  HabitConfig,
  UserProfile,
  CravingEntry,
  RelapseEntry,
  SubscriptionTier,
  AppState,
} from "@/store/types";
