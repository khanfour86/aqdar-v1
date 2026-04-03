import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ProgressRing } from "@/components/ProgressRing";
import { HABIT_TEMPLATES } from "@/constants/habits";
import { HabitConfig } from "@/store/types";
import { useColors } from "@/hooks/useColors";

interface Props {
  habit: HabitConfig | null;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  progressToNextTrophy: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function HeroCard({
  habit,
  days,
  hours,
  minutes,
  seconds,
  progressToNextTrophy,
}: Props) {
  const colors = useColors();

  const habitDisplayName =
    habit?.type === "custom"
      ? (habit.customName ?? habit.name ?? "العادة")
      : (HABIT_TEMPLATES.find((t) => t.type === habit?.type)?.nameAr ??
        habit?.name ??
        "العادة");

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.top}>
        <View style={styles.habitInfo}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            أنا أقدر
          </Text>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {`اترك ${habitDisplayName}`}
          </Text>
        </View>
        <ProgressRing
          progress={progressToNextTrophy}
          size={110}
          strokeWidth={8}
          color={colors.primary}
          bgColor={colors.border}
          label={`${days}`}
          sublabel="يوم"
        />
      </View>

      <View style={[styles.timerRow, { borderTopColor: colors.border }]}>
        <View style={styles.timerUnit}>
          <Text style={[styles.timerNum, { color: colors.primary }]}>
            {pad(hours)}
          </Text>
          <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>
            ساعة
          </Text>
        </View>
        <Text style={[styles.colon, { color: colors.primary }]}>:</Text>
        <View style={styles.timerUnit}>
          <Text style={[styles.timerNum, { color: colors.primary }]}>
            {pad(minutes)}
          </Text>
          <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>
            دقيقة
          </Text>
        </View>
        <Text style={[styles.colon, { color: colors.primary }]}>:</Text>
        <View style={styles.timerUnit}>
          <Text style={[styles.timerNum, { color: colors.primary }]}>
            {pad(seconds)}
          </Text>
          <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>
            ثانية
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, padding: 20 },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  habitInfo: { flex: 1 },
  label: { fontSize: 13, marginBottom: 4 },
  name: { fontSize: 22, fontWeight: "800" },
  timerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  timerUnit: { alignItems: "center" },
  timerNum: { fontSize: 34, fontWeight: "700", letterSpacing: 2 },
  timerLabel: { fontSize: 11, marginTop: 2 },
  colon: { fontSize: 28, fontWeight: "700", marginBottom: 14 },
});
