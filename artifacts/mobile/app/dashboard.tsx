import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProgressRing } from "@/components/ProgressRing";
import { StatCard } from "@/components/StatCard";
import { TROPHIES } from "@/constants/trophies";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useStreak } from "@/hooks/useStreak";
import { aiService, CoachMessage } from "@/services/ai";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { habit, profile, logCraving, logRelapse, unlockedTrophies, unlockTrophy } = useApp();
  const streak = useStreak();
  const [coachMsg, setCoachMsg] = useState<CoachMessage | null>(null);
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [showRelapseModal, setShowRelapseModal] = useState(false);

  useEffect(() => {
    loadCoachMessage();
  }, []);

  useEffect(() => {
    checkAndUnlockTrophies();
  }, [streak.days, streak.moneySaved, streak.cravingsResisted]);

  const loadCoachMessage = async () => {
    const msg = await aiService.getMotivationalMessage(streak.days);
    setCoachMsg(msg);
  };

  const checkAndUnlockTrophies = () => {
    TROPHIES.forEach((t) => {
      if (unlockedTrophies.includes(t.id)) return;
      if (
        t.requirement.type === "days" &&
        streak.days >= t.requirement.value
      ) {
        unlockTrophy(t.id);
      } else if (
        t.requirement.type === "money" &&
        streak.moneySaved >= t.requirement.value
      ) {
        unlockTrophy(t.id);
      } else if (
        t.requirement.type === "cravings_resisted" &&
        streak.cravingsResisted >= t.requirement.value
      ) {
        unlockTrophy(t.id);
      }
    });
  };

  const currentTrophy = [...TROPHIES]
    .reverse()
    .find((t) => unlockedTrophies.includes(t.id));

  const nextTrophy = TROPHIES.find((t) => !unlockedTrophies.includes(t.id));

  const progressToNextTrophy = (() => {
    if (!nextTrophy) return 1;
    const req = nextTrophy.requirement;
    if (req.type === "days") return Math.min(1, streak.days / req.value);
    if (req.type === "money")
      return Math.min(1, streak.moneySaved / req.value);
    if (req.type === "cravings_resisted")
      return Math.min(1, streak.cravingsResisted / req.value);
    return 0;
  })();

  const pad = (n: number) => String(n).padStart(2, "0");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            <Ionicons name="settings-outline" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroTop}>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitLabel, { color: colors.mutedForeground }]}>
                تركت
              </Text>
              <Text style={[styles.habitName, { color: colors.foreground }]}>
                {habit?.name ?? "العادة الضارة"}
              </Text>
            </View>
            <ProgressRing
              progress={progressToNextTrophy}
              size={110}
              strokeWidth={8}
              color={colors.primary}
              bgColor={colors.border}
              label={`${streak.days}`}
              sublabel="يوم"
            />
          </View>

          <View style={[styles.timerRow, { borderTopColor: colors.border }]}>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNum, { color: colors.primary }]}>
                {pad(streak.hours)}
              </Text>
              <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>
                ساعة
              </Text>
            </View>
            <Text style={[styles.timerColon, { color: colors.primary }]}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNum, { color: colors.primary }]}>
                {pad(streak.minutes)}
              </Text>
              <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>
                دقيقة
              </Text>
            </View>
            <Text style={[styles.timerColon, { color: colors.primary }]}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNum, { color: colors.primary }]}>
                {pad(streak.seconds)}
              </Text>
              <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>
                ثانية
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="cash-outline"
            label="المدخرات"
            value={`${streak.moneySaved.toFixed(1)}`}
            sub={profile?.currency ?? "KWD"}
            iconColor={colors.gold}
            testID="stat-money"
          />
          <StatCard
            icon="shield-checkmark-outline"
            label="رغبات قاومت"
            value={`${streak.cravingsResisted}`}
            iconColor={colors.success}
            testID="stat-cravings"
          />
        </View>

        {currentTrophy && (
          <View
            style={[
              styles.trophyBanner,
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
            <View style={styles.trophyBannerText}>
              <Text
                style={[styles.trophyBannerTitle, { color: currentTrophy.color }]}
              >
                {currentTrophy.titleAr}
              </Text>
              <Text
                style={[styles.trophyBannerDesc, { color: colors.mutedForeground }]}
              >
                {currentTrophy.descriptionAr}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/trophies")}
              style={[
                styles.trophyViewBtn,
                { backgroundColor: currentTrophy.color + "22" },
              ]}
            >
              <Text style={[styles.trophyViewBtnText, { color: currentTrophy.color }]}>
                الكل
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {coachMsg && (
          <View
            style={[
              styles.coachCard,
              { backgroundColor: colors.navyMid, borderColor: colors.border },
            ]}
          >
            <View style={styles.coachHeader}>
              <Ionicons name="sparkles" size={16} color={colors.gold} />
              <Text style={[styles.coachTitle, { color: colors.gold }]}>
                مدربك الشخصي
              </Text>
            </View>
            <Text style={[styles.coachText, { color: colors.foreground }]}>
              {coachMsg.text}
            </Text>
            <TouchableOpacity
              onPress={loadCoachMessage}
              style={styles.refreshMsg}
            >
              <Ionicons
                name="refresh"
                size={14}
                color={colors.mutedForeground}
              />
              <Text
                style={[styles.refreshMsgText, { color: colors.mutedForeground }]}
              >
                رسالة جديدة
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {nextTrophy && (
          <View
            style={[
              styles.nextTrophyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.nextTrophyLabel, { color: colors.mutedForeground }]}>
              الجائزة القادمة
            </Text>
            <View style={styles.nextTrophyRow}>
              <Ionicons
                name={nextTrophy.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={nextTrophy.color}
              />
              <Text style={[styles.nextTrophyName, { color: colors.foreground }]}>
                {nextTrophy.titleAr}
              </Text>
            </View>
            <View
              style={[styles.progressBarBg, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.round(progressToNextTrophy * 100)}%` as any,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPct, { color: colors.mutedForeground }]}>
              {Math.round(progressToNextTrophy * 100)}%
            </Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: colors.primary + "22", borderColor: colors.primary + "55" },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowCravingModal(true);
            }}
            testID="craving-btn"
          >
            <Ionicons name="alert-circle" size={22} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>
              أشعر برغبة الآن
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.destructive + "18",
                borderColor: colors.destructive + "44",
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setShowRelapseModal(true);
            }}
            testID="relapse-btn"
          >
            <Ionicons
              name="refresh-circle"
              size={22}
              color={colors.destructive}
            />
            <Text
              style={[styles.actionBtnText, { color: colors.destructive }]}
            >
              تعثرت اليوم
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showCravingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              خذ نفسًا عميقًا
            </Text>
            <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
              هذه الرغبة ستمر في خلال 3-5 دقائق. أنت أقوى منها.
            </Text>
            <TouchableOpacity
              style={[styles.modalPrimaryBtn, { backgroundColor: colors.primary }]}
              onPress={handleCravingResisted}
            >
              <Ionicons name="shield-checkmark" size={20} color={colors.primaryForeground} />
              <Text style={[styles.modalPrimaryBtnText, { color: colors.primaryForeground }]}>
                قاومت الرغبة
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSecondaryBtn, { borderColor: colors.border }]}
              onPress={handleCravingFailed}
            >
              <Text style={[styles.modalSecondaryBtnText, { color: colors.mutedForeground }]}>
                لم أستطع المقاومة
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showRelapseModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Ionicons name="heart" size={36} color={colors.primary} style={styles.modalIcon} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              لا بأس، انهض مرة أخرى
            </Text>
            <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
              التعثر ليس فشلًا، بل جزء من الرحلة. كل خطوة للأمام تهم.
            </Text>
            <TouchableOpacity
              style={[
                styles.modalPrimaryBtn,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleRelapse}
            >
              <Ionicons name="refresh" size={20} color={colors.primaryForeground} />
              <Text
                style={[styles.modalPrimaryBtnText, { color: colors.primaryForeground }]}
              >
                أعد البداية
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSecondaryBtn, { borderColor: colors.border }]}
              onPress={() => setShowRelapseModal(false)}
            >
              <Text
                style={[styles.modalSecondaryBtnText, { color: colors.mutedForeground }]}
              >
                إلغاء
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  habitInfo: { flex: 1 },
  habitLabel: { fontSize: 13, marginBottom: 4 },
  habitName: { fontSize: 22, fontWeight: "800" },
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
  timerColon: { fontSize: 28, fontWeight: "700", marginBottom: 14 },
  statsRow: { flexDirection: "row", gap: 12 },
  trophyBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  trophyBannerText: { flex: 1 },
  trophyBannerTitle: { fontSize: 14, fontWeight: "700", textAlign: "right" },
  trophyBannerDesc: { fontSize: 12, textAlign: "right", marginTop: 2 },
  trophyViewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trophyViewBtnText: { fontSize: 12, fontWeight: "700" },
  coachCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  coachHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  coachTitle: { fontSize: 13, fontWeight: "700" },
  coachText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "right",
    marginBottom: 12,
  },
  refreshMsg: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  refreshMsgText: { fontSize: 12 },
  nextTrophyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  nextTrophyLabel: { fontSize: 12, textAlign: "right", marginBottom: 8 },
  nextTrophyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  nextTrophyName: { fontSize: 15, fontWeight: "700" },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: { height: 6, borderRadius: 3 },
  progressPct: { fontSize: 11, textAlign: "right" },
  actionRow: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  actionBtnText: { fontSize: 14, fontWeight: "700", textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 28,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
  modalIcon: { marginBottom: 16 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  modalPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    width: "100%",
    marginBottom: 12,
  },
  modalPrimaryBtnText: { fontSize: 17, fontWeight: "700" },
  modalSecondaryBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  modalSecondaryBtnText: { fontSize: 15 },
});
