import { useEffect, useState } from "react";

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

function computeStats(
  startDate: string | undefined,
  dailyCost: number,
  cravings: { resisted: boolean }[]
): StreakStats {
  const start = startDate ? new Date(startDate) : new Date();
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - start.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const moneySaved = parseFloat(
    ((days + hours / 24 + minutes / 1440) * dailyCost).toFixed(2)
  );

  const cravingsResisted = cravings.filter((c) => c.resisted).length;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    moneySaved,
    cravingsAvoided: cravingsResisted,
    cravingsResisted,
  };
}

export function useStreak(): StreakStats {
  const { habit, cravings } = useApp();

  const [stats, setStats] = useState<StreakStats>(() =>
    computeStats(habit?.startDate, habit?.dailyCost ?? 0, cravings)
  );

  useEffect(() => {
    const tick = () => {
      setStats(
        computeStats(habit?.startDate, habit?.dailyCost ?? 0, cravings)
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [habit?.startDate, habit?.dailyCost, cravings]);

  return stats;
}
