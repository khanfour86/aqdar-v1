import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionRow } from "@/components/dashboard/ActionRow";
import { CoachCard } from "@/components/dashboard/CoachCard";
import { CravingModal } from "@/components/dashboard/CravingModal";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { RelapseModal } from "@/components/dashboard/RelapseModal";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { TrophyBanner } from "@/components/dashboard/TrophyBanner";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useStreak } from "@/hooks/useStreak";
import { useEntitlements } from "@/features/entitlements";
import {
  evaluateTrophyUnlocks,
  getNextTrophy,
  getUnlockedTrophies,
  progressToNextTrophy,
} from "@/features/trophies/unlock";
import { aiService, CoachMessage } from "@/services/ai";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { habit, profile, logCraving, logRelapse, unlockedTrophies, unlockTrophy, subscription } = useApp();
  const streak = useStreak();
  const entitlements = useEntitlements(subscription.tier);

  const [coachMsg, setCoachMsg] = useState<CoachMessage | null>(null);
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [showRelapseModal, setShowRelapseModal] = useState(false);

  const coachIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Load coach message + rotate every minute ─────────────────────────────
  useEffect(() => {
    loadCoachMessage();
    coachIntervalRef.current = setInterval(loadCoachMessage, 60_000);
    return () => {
      if (coachIntervalRef.current) clearInterval(coachIntervalRef.current);
    };
  }, []);

  // ─── Trophy evaluation via domain service ─────────────────────────────────
  useEffect(() => {
    const snapshot = {
      days: streak.days,
      moneySaved: streak.moneySaved,
      cravingsResisted: streak.cravingsResisted,
    };
    const { newlyUnlocked } = evaluateTrophyUnlocks(
      snapshot,
      unlockedTrophies,
      subscription.tier
    );
    newlyUnlocked.forEach((t) => unlockTrophy(t.id));
  }, [streak.days, streak.moneySaved, streak.cravingsResisted]);

  const loadCoachMessage = async () => {
    const msg = await aiService.getMotivationalMessage(streak.days);
    setCoachMsg(msg);
  };

  // ─── Trophy derivations via domain service ────────────────────────────────
  const unlockedList = getUnlockedTrophies(unlockedTrophies);
  const currentTrophy = unlockedList[unlockedList.length - 1] ?? null;
  const nextTrophy = getNextTrophy(unlockedTrophies, subscription.tier);
  const trophyProgress = progressToNextTrophy(nextTrophy, {
    days: streak.days,
    moneySaved: streak.moneySaved,
    cravingsResisted: streak.cravingsResisted,
  });

  // ─── Craving handlers ─────────────────────────────────────────────────────
  const handleCravingResisted = () => {
    logCraving(true);
    setShowCravingModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCravingFailed = () => {
    logCraving(false);
    setShowCravingModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleRelapse = () => {
    setShowRelapseModal(false);
    logRelapse();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, borderBottomColor: colors.border },
        ]}
      >
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            مرحبًا،
          </Text>
          <Text style={[styles.userName, { color: colors.foreground }]}>
            {profile?.nickname ?? "بطل"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
            onPress={() => router.push("/trophies")}
            testID="trophies-btn"
          >
            <Ionicons name="trophy" size={20} color={colors.gold} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
            onPress={() => router.push("/settings")}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.foreground}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Scroll content ──────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard
          habit={habit}
          days={streak.days}
          hours={streak.hours}
          minutes={streak.minutes}
          seconds={streak.seconds}
          progressToNextTrophy={trophyProgress}
        />

        <StatsSection
          habit={habit}
          moneySaved={streak.moneySaved}
          currency={profile?.currency ?? "KWD"}
          cravingsResisted={streak.cravingsResisted}
          cigarettesAvoided={streak.cigarettesAvoided}
        />

        <TrophyBanner
          currentTrophy={currentTrophy}
          nextTrophy={nextTrophy}
          progress={trophyProgress}
        />

        <CoachCard message={coachMsg} onRefresh={loadCoachMessage} />

        <ActionRow
          onCraving={() => setShowCravingModal(true)}
          onRelapse={() => setShowRelapseModal(true)}
        />
      </ScrollView>

      {/* ─── Modals ───────────────────────────────────────────────────────── */}
      <CravingModal
        visible={showCravingModal}
        onResisted={handleCravingResisted}
        onFailed={handleCravingFailed}
      />
      <RelapseModal
        visible={showRelapseModal}
        onConfirm={handleRelapse}
        onDismiss={() => setShowRelapseModal(false)}
      />
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
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  greeting: { fontSize: 13 },
  userName: { fontSize: 22, fontWeight: "800" },
  headerActions: { flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
});
