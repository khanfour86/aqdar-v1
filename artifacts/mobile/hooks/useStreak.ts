import { useMemo } from "react";

import { useApp } from "@/context/AppContext";

export interface StreakStats {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  moneySaved: number;
  cravingsAvoided: number;
  cravingsResisted: number;
}

export function useStreak(): StreakStats {
  const { habit, cravings } = useApp();

  const stats = useMemo(() => {
    const startDate = habit?.startDate
      ? new Date(habit.startDate)
      : new Date();
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - startDate.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const dailyCost = habit?.dailyCost ?? 0;
    const moneySaved = parseFloat(
      ((days + hours / 24) * dailyCost).toFixed(2)
    );

    const cravingsAvoided = cravings.filter((c) => c.resisted).length;
    const cravingsResisted = cravings.filter((c) => c.resisted).length;

    return {
      totalSeconds,
      days,
      hours,
      minutes,
      seconds,
      moneySaved,
      cravingsAvoided,
      cravingsResisted,
    };
  }, [habit, cravings]);

  return stats;
}
