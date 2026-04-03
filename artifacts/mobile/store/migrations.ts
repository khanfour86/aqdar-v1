import { AppState, DEFAULT_STATE, SCHEMA_VERSION, HabitConfig } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Schema migration engine
// Each migration transforms the stored blob from version N → N+1.
// Add new entries here as the schema evolves.
// ─────────────────────────────────────────────────────────────────────────────

type RawBlob = Record<string, unknown>;

function migrateV1toV2(raw: RawBlob): RawBlob {
  // V1 had a flat `habit: HabitConfig | null` and `unlockedTrophies: string[]`
  const oldHabit = raw.habit as (HabitConfig & { id?: string }) | null | undefined;

  const habits: HabitConfig[] = [];
  let activeHabitId: string | null = null;

  if (oldHabit) {
    const id = oldHabit.id ?? `habit_${Date.now()}`;
    habits.push({
      id,
      type: oldHabit.type ?? "custom",
      name: oldHabit.name ?? "",
      customName: oldHabit.customName,
      packsPerDay: oldHabit.packsPerDay,
      dailyCost: oldHabit.dailyCost ?? 0,
      quitMode: oldHabit.quitMode ?? "immediate",
      startDate: oldHabit.startDate ?? new Date().toISOString(),
      createdAt: oldHabit.startDate ?? new Date().toISOString(),
    });
    activeHabitId = id;
  }

  const oldCravings = (raw.cravings as RawBlob[] | undefined) ?? [];
  const oldRelapses = (raw.relapses as RawBlob[] | undefined) ?? [];

  return {
    schemaVersion: 2,
    session: {
      isOnboarded: raw.isOnboarded ?? false,
    },
    profile: raw.profile ?? null,
    habits,
    activeHabitId,
    progress: {
      cravings: oldCravings.map((c) => ({
        ...c,
        habitId: activeHabitId ?? "",
      })),
      relapses: oldRelapses.map((r) => ({
        ...r,
        habitId: activeHabitId ?? "",
      })),
    },
    trophies: {
      unlockedIds:
        (raw.unlockedTrophies as string[] | undefined) ??
        (raw.trophies as { unlockedIds?: string[] } | undefined)
          ?.unlockedIds ??
        [],
    },
    subscription: {
      tier:
        (raw.subscriptionTier as string | undefined) === "premium"
          ? "premium"
          : ((raw.subscription as { tier?: string } | undefined)?.tier === "premium"
            ? "premium"
            : "free"),
    },
  };
}

const MIGRATIONS: Record<number, (raw: RawBlob) => RawBlob> = {
  1: migrateV1toV2,
};

export function runMigrations(raw: RawBlob): AppState {
  let version = (raw.schemaVersion as number | undefined) ?? 1;
  let state = raw;

  while (version < SCHEMA_VERSION) {
    const migrate = MIGRATIONS[version];
    if (!migrate) break;
    state = migrate(state);
    version++;
  }

  return { ...DEFAULT_STATE, ...(state as Partial<AppState>) } as AppState;
}
