import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";

interface Props {
  label: string;
  value: string;
  sub?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  testID?: string;
}

export function StatCard({ label, value, sub, icon, iconColor, testID }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} testID={testID}>
      <Ionicons name={icon} size={18} color={iconColor ?? colors.primary} style={styles.icon} />
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      {sub ? <Text style={[styles.sub, { color: colors.mutedForeground }]}>{sub}</Text> : null}
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  icon: {
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  sub: {
    fontSize: 10,
    marginTop: 1,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
});
