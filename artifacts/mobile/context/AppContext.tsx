import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const saveState = useCallback(async (newState: AppState) => {
    setState(newState);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // ignore
    }
  }, []);

  const setProfile = useCallback(
    (profile: UserProfile) => {
      saveState({ ...state, profile });
    },
    [state, saveState]
  );

  const setHabit = useCallback(
    (habit: HabitConfig) => {
      saveState({ ...state, habit });
    },
    [state, saveState]
  );

  const completeOnboarding = useCallback(() => {
    saveState({ ...state, isOnboarded: true });
  }, [state, saveState]);

  const logCraving = useCallback(
    (resisted: boolean) => {
      const entry: CravingEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        resisted,
      };
      const newState = {
        ...state,
        cravings: [entry, ...state.cravings],
      };
      saveState(newState);
    },
    [state, saveState]
  );

  const logRelapse = useCallback(() => {
    const entry: RelapseEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    const newHabit = state.habit
      ? { ...state.habit, startDate: new Date().toISOString() }
      : null;
    const newState = {
      ...state,
      habit: newHabit,
      relapses: [entry, ...state.relapses],
    };
    saveState(newState);
  }, [state, saveState]);

  const unlockTrophy = useCallback(
    (id: string) => {
      if (!state.unlockedTrophies.includes(id)) {
        saveState({
          ...state,
          unlockedTrophies: [...state.unlockedTrophies, id],
        });
      }
    },
    [state, saveState]
  );

  const resetApp = useCallback(() => {
    saveState(defaultState);
  }, [saveState]);

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
