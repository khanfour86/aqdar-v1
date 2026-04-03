import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { Trophy } from "@/constants/trophies";

interface Props {
  trophy: Trophy;
  unlocked: boolean;
}

export function TrophyCard({ trophy, unlocked }: Props) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: unlocked ? colors.card : colors.muted,
          borderColor: unlocked ? trophy.color + "44" : colors.border,
          opacity: unlocked ? 1 : 0.55,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: unlocked
              ? trophy.color + "22"
              : colors.border + "44",
          },
        ]}
      >
        <Ionicons
          name={trophy.icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color={unlocked ? trophy.color : colors.mutedForeground}
        />
      </View>
      <Text
        style={[
          styles.title,
          { color: unlocked ? colors.foreground : colors.mutedForeground },
        ]}
      >
        {trophy.titleAr}
      </Text>
      <Text style={[styles.desc, { color: colors.mutedForeground }]}>
        {trophy.descriptionAr}
      </Text>
      {trophy.isPremium && !unlocked && (
        <View style={[styles.premiumBadge, { backgroundColor: colors.gold + "22" }]}>
          <Ionicons name="lock-closed" size={10} color={colors.gold} />
          <Text style={[styles.premiumText, { color: colors.gold }]}>
            {" "}مميز
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  desc: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
