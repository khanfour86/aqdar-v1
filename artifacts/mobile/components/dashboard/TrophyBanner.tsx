import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Trophy } from "@/constants/trophies";
import { useColors } from "@/hooks/useColors";

interface Props {
  currentTrophy: Trophy | null;
  nextTrophy: Trophy | null;
  progress: number;
}

export function TrophyBanner({ currentTrophy, nextTrophy, progress }: Props) {
  const colors = useColors();

  return (
    <>
      {currentTrophy && (
        <View
          style={[
            styles.banner,
            {
              backgroundColor: currentTrophy.color + "18",
              borderColor: currentTrophy.color + "44",
            },
          ]}
        >
          <Ionicons
            name={currentTrophy.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={currentTrophy.color}
          />
          <View style={styles.bannerText}>
            <Text style={[styles.bannerTitle, { color: currentTrophy.color }]}>
              {currentTrophy.titleAr}
            </Text>
            <Text
              style={[styles.bannerDesc, { color: colors.mutedForeground }]}
            >
              {currentTrophy.descriptionAr}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/trophies")}
            style={[
              styles.viewBtn,
              { backgroundColor: currentTrophy.color + "22" },
            ]}
          >
            <Text style={[styles.viewBtnText, { color: currentTrophy.color }]}>
              الكل
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {nextTrophy && (
        <View
          style={[
            styles.nextCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.nextLabel, { color: colors.mutedForeground }]}>
            الجائزة القادمة
          </Text>
          <View style={styles.nextRow}>
            <Ionicons
              name={nextTrophy.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={nextTrophy.color}
            />
            <Text style={[styles.nextName, { color: colors.foreground }]}>
              {nextTrophy.titleAr}
            </Text>
          </View>
          <View
            style={[styles.progressBg, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${Math.round(progress * 100)}%` as any,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressPct, { color: colors.mutedForeground }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: "700", textAlign: "right" },
  bannerDesc: { fontSize: 12, textAlign: "right", marginTop: 2 },
  viewBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  viewBtnText: { fontSize: 12, fontWeight: "700" },
  nextCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  nextLabel: { fontSize: 12, textAlign: "right", marginBottom: 8 },
  nextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  nextName: { fontSize: 15, fontWeight: "700" },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: { height: 6, borderRadius: 3 },
  progressPct: { fontSize: 11, textAlign: "right" },
});
