import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AppState,
  CravingEntry,
  DEFAULT_STATE,
  HabitConfig,
  RelapseEntry,
  SubscriptionTier,
  UserProfile,
} from "./types";
import { runMigrations } from "./migrations";
import { TROPHIES } from "@/constants/trophies";
import { canUnlockTrophy, getEntitlements } from "@/features/entitlements";

// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "@ana_aquder_state_v2";

// ─── Error types ──────────────────────────────────────────────────────────────

export class HabitLimitError extends Error {
  constructor() {
    super("حد العادات المجانية: تحتاج للاشتراك المميز لإضافة عادات إضافية.");
    this.name = "HabitLimitError";
  }
}

// ─── Context value ────────────────────────────────────────────────────────────

export interface AppStoreValue extends AppState {
  // Derived
  isLoading: boolean;
  activeHabit: HabitConfig | null;

  // Session
  completeOnboarding: () => void;
  resetApp: () => void;

  // Profile
  setProfile: (p: UserProfile) => void;

  // Habits — addHabit returns null if entitlement check fails
  addHabit: (h: Omit<HabitConfig, "id" | "createdAt">) => string | null;
  updateHabit: (id: string, patch: Partial<HabitConfig>) => void;
  removeHabit: (id: string) => void;
  setActiveHabit: (id: string) => void;

  // Progress
  logCraving: (resisted: boolean) => void;
  logRelapse: () => void;

  // Trophies — premium trophies silently blocked for free users at this boundary
  unlockTrophy: (id: string) => void;

  // Subscription
  setSubscriptionTier: (tier: SubscriptionTier) => void;

  // Legacy compat helpers (read-only aliases)
  habit: HabitConfig | null;
  unlockedTrophies: string[];
  cravings: CravingEntry[];
  relapses: RelapseEntry[];
  isOnboarded: boolean;
  subscriptionTier: SubscriptionTier;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<AppState>(DEFAULT_STATE);

  useEffect(() => {
    (async () => {
      try {
        let raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          raw = await AsyncStorage.getItem("@ana_aquder_state");
        }
        if (raw) {
          const parsed = JSON.parse(raw);
          const migrated = runMigrations(parsed);
          ref.current = migrated;
          setState(migrated);
        }
      } catch {
        // ignore parse errors — stay on DEFAULT_STATE
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: AppState) => {
    ref.current = next;
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  // ─── Session ─────────────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(() => {
    persist({ ...ref.current, session: { isOnboarded: true } });
  }, [persist]);

  const resetApp = useCallback(() => {
    persist(DEFAULT_STATE);
    AsyncStorage.removeItem("@ana_aquder_state").catch(() => {});
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, [persist]);

  // ─── Profile ─────────────────────────────────────────────────────────────────

  const setProfile = useCallback(
    (profile: UserProfile) => {
      persist({ ...ref.current, profile });
    },
    [persist]
  );

  // ─── Habits ──────────────────────────────────────────────────────────────────
  // DOMAIN INTEGRITY: entitlement check enforced here — the ONLY write path.
  // No other function may bypass this guard.

  const addHabit = useCallback(
    (h: Omit<HabitConfig, "id" | "createdAt">): string | null => {
      const cur = ref.current;
      const entitlements = getEntitlements(cur.subscription.tier);

      if (!entitlements.canAddHabit(cur.habits.length)) {
        // Block at domain boundary — free users cannot exceed their habit limit.
        if (__DEV__) {
          console.warn(
            `[Store] addHabit blocked: free user at habit limit (${cur.habits.length})`
          );
        }
        return null;
      }

      const id = `habit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const habit: HabitConfig = { ...h, id, createdAt: new Date().toISOString() };
      persist({
        ...cur,
        habits: [...cur.habits, habit],
        activeHabitId: cur.activeHabitId ?? id,
      });
      return id;
    },
    [persist]
  );

  const updateHabit = useCallback(
    (id: string, patch: Partial<HabitConfig>) => {
      const cur = ref.current;
      persist({
        ...cur,
        habits: cur.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
      });
    },
    [persist]
  );

  const removeHabit = useCallback(
    (id: string) => {
      const cur = ref.current;
      const remaining = cur.habits.filter((h) => h.id !== id);
      persist({
        ...cur,
        habits: remaining,
        activeHabitId:
          cur.activeHabitId === id
            ? (remaining[0]?.id ?? null)
            : cur.activeHabitId,
      });
    },
    [persist]
  );

  const setActiveHabit = useCallback(
    (id: string) => {
      persist({ ...ref.current, activeHabitId: id });
    },
    [persist]
  );

  // ─── Progress ────────────────────────────────────────────────────────────────

  const logCraving = useCallback(
    (resisted: boolean) => {
      const cur = ref.current;
      const entry: CravingEntry = {
        id: `craving_${Date.now()}`,
        habitId: cur.activeHabitId ?? "",
        timestamp: new Date().toISOString(),
        resisted,
      };
      persist({
        ...cur,
        progress: {
          ...cur.progress,
          cravings: [entry, ...cur.progress.cravings],
        },
      });
    },
    [persist]
  );

  const logRelapse = useCallback(() => {
    const cur = ref.current;
    const entry: RelapseEntry = {
      id: `relapse_${Date.now()}`,
      habitId: cur.activeHabitId ?? "",
      timestamp: new Date().toISOString(),
    };
    const updatedHabits = cur.habits.map((h) =>
      h.id === cur.activeHabitId
        ? { ...h, startDate: new Date().toISOString() }
        : h
    );
    persist({
      ...cur,
      habits: updatedHabits,
      progress: {
        ...cur.progress,
        relapses: [entry, ...cur.progress.relapses],
      },
    });
  }, [persist]);

  // ─── Trophies ────────────────────────────────────────────────────────────────
  // DOMAIN INTEGRITY: premium trophy protection enforced here — the ONLY write path.

  const unlockTrophy = useCallback(
    (id: string) => {
      const cur = ref.current;

      if (cur.trophies.unlockedIds.includes(id)) return;

      const trophy = TROPHIES.find((t) => t.id === id);
      if (!trophy) return;

      // Block premium trophies for free users at the domain boundary.
      if (!canUnlockTrophy(trophy.isPremium, cur.subscription.tier)) {
        if (__DEV__) {
          console.warn(
            `[Store] unlockTrophy blocked: premium trophy "${id}" for free user`
          );
        }
        return;
      }

      persist({
        ...cur,
        trophies: { unlockedIds: [...cur.trophies.unlockedIds, id] },
      });
    },
    [persist]
  );

  // ─── Subscription ────────────────────────────────────────────────────────────

  const setSubscriptionTier = useCallback(
    (tier: SubscriptionTier) => {
      persist({
        ...ref.current,
        subscription: { ...ref.current.subscription, tier },
      });
    },
    [persist]
  );

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const activeHabit =
    state.habits.find((h) => h.id === state.activeHabitId) ?? null;

  const value: AppStoreValue = {
    ...state,
    isLoading,
    activeHabit,

    // Actions
    completeOnboarding,
    resetApp,
    setProfile,
    addHabit,
    updateHabit,
    removeHabit,
    setActiveHabit,
    logCraving,
    logRelapse,
    unlockTrophy,
    setSubscriptionTier,

    // Legacy read-only compat aliases
    habit: activeHabit,
    unlockedTrophies: state.trophies.unlockedIds,
    cravings: state.progress.cravings,
    relapses: state.progress.relapses,
    isOnboarded: state.session.isOnboarded,
    subscriptionTier: state.subscription.tier,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
