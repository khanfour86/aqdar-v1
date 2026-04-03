import React from "react";
import { StyleSheet, View } from "react-native";

import { StatCard } from "@/components/StatCard";
import { HabitConfig } from "@/store/types";
import { useColors } from "@/hooks/useColors";

interface Props {
  habit: HabitConfig | null;
  moneySaved: number;
  currency: string;
  cravingsResisted: number;
  cigarettesAvoided: number;
}

export function StatsSection({
  habit,
  moneySaved,
  currency,
  cravingsResisted,
  cigarettesAvoided,
}: Props) {
  const colors = useColors();

  return (
    <>
      <View style={styles.row}>
        <StatCard
          icon="cash-outline"
          label="المدخرات"
          value={`${moneySaved.toFixed(1)}`}
          sub={currency}
          iconColor={colors.gold}
          testID="stat-money"
        />
        <StatCard
          icon="shield-checkmark-outline"
          label="رغبات قاومت"
          value={`${cravingsResisted}`}
          iconColor={colors.success}
          testID="stat-cravings"
        />
      </View>

      {habit?.type === "smoking" && (
        <View style={styles.row}>
          <StatCard
            icon="flame-outline"
            label="سيجارة تم اجتنابها"
            value={`${cigarettesAvoided}`}
            iconColor="#E63946"
            testID="stat-cigarettes"
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
});
