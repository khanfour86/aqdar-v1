import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TrophyCard } from "@/components/TrophyCard";
import { TROPHIES } from "@/constants/trophies";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useStreak } from "@/hooks/useStreak";

export default function TrophiesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { unlockedTrophies } = useApp();
  const streak = useStreak();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const unlockedCount = unlockedTrophies.length;
  const totalCount = TROPHIES.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-forward" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          الإنجازات
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.gold + "18", borderColor: colors.gold + "44" },
          ]}
        >
          <Ionicons name="trophy" size={32} color={colors.gold} />
          <View style={styles.summaryText}>
            <Text style={[styles.summaryCount, { color: colors.foreground }]}>
              {unlockedCount} / {totalCount}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
              إنجازات مفتوحة
            </Text>
          </View>
          <View style={styles.summaryStats}>
            <Text style={[styles.summaryStatVal, { color: colors.primary }]}>
              {streak.days}
            </Text>
            <Text style={[styles.summaryStatLabel, { color: colors.mutedForeground }]}>
              يوم
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          جميع الإنجازات
        </Text>

        <View style={styles.grid}>
          {TROPHIES.map((trophy) => (
            <TrophyCard
              key={trophy.id}
              trophy={trophy}
              unlocked={unlockedTrophies.includes(trophy.id)}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/premium")}
          style={[
            styles.premiumBanner,
            { backgroundColor: colors.navyMid, borderColor: colors.border },
          ]}
          activeOpacity={0.85}
        >
          <Ionicons name="diamond" size={20} color={colors.gold} />
          <Text style={[styles.premiumBannerText, { color: colors.foreground }]}>
            افتح الإنجازات المميزة مع الاشتراك
          </Text>
          <View style={[styles.premiumBtn, { backgroundColor: colors.gold }]}>
            <Text style={[styles.premiumBtnText, { color: colors.navy }]}>
              اشترك
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  backBtn: { width: 40, alignItems: "center" },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  summaryText: { flex: 1 },
  summaryCount: { fontSize: 24, fontWeight: "800" },
  summaryLabel: { fontSize: 13, marginTop: 2 },
  summaryStats: { alignItems: "center" },
  summaryStatVal: { fontSize: 22, fontWeight: "700" },
  summaryStatLabel: { fontSize: 12 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 0,
    marginBottom: 20,
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 8,
  },
  premiumBannerText: { flex: 1, fontSize: 14, fontWeight: "600", textAlign: "right" },
  premiumBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  premiumBtnText: { fontSize: 13, fontWeight: "700" },
});
