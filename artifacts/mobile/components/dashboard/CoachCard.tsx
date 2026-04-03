import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CoachMessage } from "@/services/ai";
import { useColors } from "@/hooks/useColors";

interface Props {
  message: CoachMessage | null;
  onRefresh: () => void;
}

export function CoachCard({ message, onRefresh }: Props) {
  const colors = useColors();

  if (!message) return null;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.navyMid, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={colors.gold} />
        <Text style={[styles.title, { color: colors.gold }]}>مدربك الشخصي</Text>
      </View>
      <Text style={[styles.text, { color: colors.foreground }]}>
        {message.text}
      </Text>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
        <Ionicons name="refresh" size={14} color={colors.mutedForeground} />
        <Text style={[styles.refreshText, { color: colors.mutedForeground }]}>
          رسالة جديدة
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 18 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  title: { fontSize: 13, fontWeight: "700" },
  text: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "right",
    marginBottom: 12,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  refreshText: { fontSize: 12 },
});
