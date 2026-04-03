import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type HabitType =
  | "smoking"
  | "vaping"
  | "social_media"
  | "digital_content"
  | "caffeine"
  | "custom";

export interface UserProfile {
  nickname: string;
  age: number;
  currency: string;
  country?: string;
  gender?: string;
}

export interface HabitConfig {
  type: HabitType;
  name: string;
  packsPerDay?: number;
  dailyCost: number;
  quitMode: "immediate" | "gradual";
  customName?: string;
  startDate: string;
}

export interface CravingEntry {
  id: string;
  timestamp: string;
  resisted: boolean;
}

export interface RelapseEntry {
  id: string;
  timestamp: string;
  note?: string;
}

export interface AppState {
  isOnboarded: boolean;
  profile: UserProfile | null;
  habit: HabitConfig | null;
  cravings: CravingEntry[];
  relapses: RelapseEntry[];
  unlockedTrophies: string[];
  subscriptionTier: "free" | "premium";
}

interface AppContextValue extends AppState {
  setProfile: (p: UserProfile) => void;
  setHabit: (h: HabitConfig) => void;
  completeOnboarding: () => void;
  logCraving: (resisted: boolean) => void;
  logRelapse: () => void;
  unlockTrophy: (id: string) => void;
  resetApp: () => void;
  isLoading: boolean;
}

const defaultState: AppState = {
  isOnboarded: false,
  profile: null,
  habit: null,
  cravings: [],
  relapses: [],
  unlockedTrophies: [],
  subscriptionTier: "free",
};

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "@ana_aquder_state";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const stateRef = useRef<AppState>(defaultState);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState(parsed);
        stateRef.current = parsed;
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const persist = useCallback(async (next: AppState) => {
    stateRef.current = next;
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const setProfile = useCallback(
    (profile: UserProfile) => {
      persist({ ...stateRef.current, profile });
    },
    [persist]
  );

  const setHabit = useCallback(
    (habit: HabitConfig) => {
      persist({ ...stateRef.current, habit });
    },
    [persist]
  );

  const completeOnboarding = useCallback(() => {
    persist({ ...stateRef.current, isOnboarded: true });
  }, [persist]);

  const logCraving = useCallback(
    (resisted: boolean) => {
      const entry: CravingEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        resisted,
      };
      persist({
        ...stateRef.current,
        cravings: [entry, ...stateRef.current.cravings],
      });
    },
    [persist]
  );

  const logRelapse = useCallback(() => {
    const entry: RelapseEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    const cur = stateRef.current;
    const newHabit = cur.habit
      ? { ...cur.habit, startDate: new Date().toISOString() }
      : null;
    persist({
      ...cur,
      habit: newHabit,
      relapses: [entry, ...cur.relapses],
    });
  }, [persist]);

  const unlockTrophy = useCallback(
    (id: string) => {
      const cur = stateRef.current;
      if (!cur.unlockedTrophies.includes(id)) {
        persist({
          ...cur,
          unlockedTrophies: [...cur.unlockedTrophies, id],
        });
      }
    },
    [persist]
  );

  const resetApp = useCallback(() => {
    persist(defaultState);
  }, [persist]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setProfile,
        setHabit,
        completeOnboarding,
        logCraving,
        logRelapse,
        unlockTrophy,
        resetApp,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
