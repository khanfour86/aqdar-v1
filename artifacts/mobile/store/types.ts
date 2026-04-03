// ─────────────────────────────────────────────────────────────────────────────
// Core domain types — schema v2 (multi-habit, domain slices, versioning)
// ─────────────────────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 2;

export type HabitType =
  | "smoking"
  | "vaping"
  | "social_media"
  | "digital_content"
  | "caffeine"
  | "custom";

export type SubscriptionTier = "free" | "premium";
export type QuitMode = "immediate" | "gradual";
export type Gender = "male" | "female";

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  nickname: string;
  age: number;
  currency: string;
  country?: string;
  gender?: Gender;
}

// ─── Habit ───────────────────────────────────────────────────────────────────

export interface HabitConfig {
  id: string;
  type: HabitType;
  name: string;
  customName?: string;
  packsPerDay?: number;
  dailyCost: number;
  quitMode: QuitMode;
  startDate: string;
  createdAt: string;
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface CravingEntry {
  id: string;
  habitId: string;
  timestamp: string;
  resisted: boolean;
}

export interface RelapseEntry {
  id: string;
  habitId: string;
  timestamp: string;
  note?: string;
}

// ─── Domain slices ───────────────────────────────────────────────────────────

export interface SessionState {
  isOnboarded: boolean;
}

export interface ProgressState {
  cravings: CravingEntry[];
  relapses: RelapseEntry[];
}

export interface TrophiesState {
  unlockedIds: string[];
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  expiresAt?: string;
}

// ─── Root state ──────────────────────────────────────────────────────────────

export interface AppState {
  schemaVersion: number;
  session: SessionState;
  profile: UserProfile | null;
  habits: HabitConfig[];
  activeHabitId: string | null;
  progress: ProgressState;
  trophies: TrophiesState;
  subscription: SubscriptionState;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_STATE: AppState = {
  schemaVersion: SCHEMA_VERSION,
  session: { isOnboarded: false },
  profile: null,
  habits: [],
  activeHabitId: null,
  progress: { cravings: [], relapses: [] },
  trophies: { unlockedIds: [] },
  subscription: { tier: "free" },
};
