import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  onCraving: () => void;
  onRelapse: () => void;
}

export function ActionRow({ onCraving, onRelapse }: Props) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: colors.primary + "22",
            borderColor: colors.primary + "55",
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onCraving();
        }}
        testID="craving-btn"
      >
        <Ionicons name="alert-circle" size={22} color={colors.primary} />
        <Text style={[styles.btnText, { color: colors.primary }]}>
          أشعر برغبة الآن
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: colors.destructive + "18",
            borderColor: colors.destructive + "44",
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onRelapse();
        }}
        testID="relapse-btn"
      >
        <Ionicons name="refresh-circle" size={22} color={colors.destructive} />
        <Text style={[styles.btnText, { color: colors.destructive }]}>
          تعثرت اليوم
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  btnText: { fontSize: 14, fontWeight: "700", textAlign: "center" },
});
