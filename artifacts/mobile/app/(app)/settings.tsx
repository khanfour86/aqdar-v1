import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useStreak } from "@/hooks/useStreak";

const AGE_GROUPS = [
  { value: "21", label: "18 – 24" },
  { value: "29", label: "25 – 34" },
  { value: "39", label: "35 – 44" },
  { value: "49", label: "45 – 54" },
  { value: "59", label: "55 – 64" },
  { value: "65", label: "65 فأكثر" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, habit, resetApp, subscriptionTier, unlockedTrophies } = useApp();
  const streak = useStreak();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleReset = () => {
    Alert.alert(
      "إعادة الضبط",
      "هل أنت متأكد؟ سيتم حذف جميع بياناتك وبدء من جديد.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "إعادة الضبط",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            resetApp();
            router.replace("/");
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: "حسابك",
      items: [
        {
          icon: "person-outline" as const,
          label: "الاسم",
          value: profile?.nickname ?? "—",
          color: colors.primary,
        },
        {
          icon: "calendar-outline" as const,
          label: "العمر",
          value: profile?.age
            ? (AGE_GROUPS.find((g) => g.value === String(profile.age))?.label ?? `${profile.age} سنة`)
            : "—",
          color: colors.primary,
        },
        {
          icon: "cash-outline" as const,
          label: "العملة",
          value: profile?.currency ?? "—",
          color: colors.gold,
        },
      ],
    },
    {
      title: "عادتك",
      items: [
        {
          icon: "fitness-outline" as const,
          label: "العادة",
          value: habit?.name ?? "—",
          color: colors.destructive,
        },
        {
          icon: "flash-outline" as const,
          label: "طريقة الإقلاع",
          value: habit?.quitMode === "immediate" ? "فوري" : "تدريجي",
          color: colors.primary,
        },
        {
          icon: "wallet-outline" as const,
          label: "التكلفة اليومية",
          value: habit?.dailyCost ? `${habit.dailyCost} ${profile?.currency}` : "—",
          color: colors.gold,
        },
      ],
    },
    {
      title: "إحصائياتك",
      items: [
        {
          icon: "time-outline" as const,
          label: "أيام الصمود",
          value: `${streak.days} يوم`,
          color: colors.primary,
        },
        {
          icon: "trophy-outline" as const,
          label: "الإنجازات",
          value: `${unlockedTrophies.length} إنجاز`,
          color: colors.gold,
        },
        {
          icon: "diamond-outline" as const,
          label: "الاشتراك",
          value: subscriptionTier === "premium" ? "مميز" : "مجاني",
          color: subscriptionTier === "premium" ? colors.gold : colors.mutedForeground,
        },
      ],
    },
  ];

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
          الإعدادات
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
              {section.title}
            </Text>
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {section.items.map((item, idx) => (
                <View key={item.label}>
                  <View style={styles.settingRow}>
                    <Text
                      style={[styles.settingValue, { color: item.color }]}
                    >
                      {item.value}
                    </Text>
                    <View style={styles.settingLeft}>
                      <Text
                        style={[styles.settingLabel, { color: colors.foreground }]}
                      >
                        {item.label}
                      </Text>
                      <View
                        style={[
                          styles.settingIcon,
                          { backgroundColor: item.color + "22" },
                        ]}
                      >
                        <Ionicons name={item.icon} size={16} color={item.color} />
                      </View>
                    </View>
                  </View>
                  {idx < section.items.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View
          style={[
            styles.communityCard,
            { backgroundColor: colors.navyMid, borderColor: colors.border },
          ]}
        >
          <Ionicons name="people" size={24} color={colors.primary} />
          <View style={styles.communityText}>
            <Text style={[styles.communityTitle, { color: colors.foreground }]}>
              مجتمع أنا أقدر
            </Text>
            <Text
              style={[styles.communityDesc, { color: colors.mutedForeground }]}
            >
              انضم لمجتمعنا لمشاركة تقدمك وتحفيز الآخرين
            </Text>
          </View>
          <View
            style={[styles.comingSoonBadge, { backgroundColor: colors.primary + "22" }]}
          >
            <Text
              style={[styles.comingSoonText, { color: colors.primary }]}
            >
              قريبًا
            </Text>
          </View>
        </View>

        {subscriptionTier !== "premium" && (
          <TouchableOpacity
            style={[
              styles.premiumUpgradeBtn,
              {
                backgroundColor: colors.gold + "18",
                borderColor: colors.gold + "55",
              },
            ]}
            onPress={() => router.push("/premium")}
            activeOpacity={0.85}
          >
            <Ionicons name="diamond" size={18} color={colors.gold} />
            <View style={styles.premiumUpgradeText}>
              <Text style={[styles.premiumUpgradeTitle, { color: colors.gold }]}>
                ترقية إلى المميز
              </Text>
              <Text style={[styles.premiumUpgradeDesc, { color: colors.mutedForeground }]}>
                عادات متعددة · مدرب AI · إنجازات حصرية
              </Text>
            </View>
            <Ionicons name="chevron-back" size={18} color={colors.gold} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.resetBtn,
            {
              backgroundColor: colors.destructive + "18",
              borderColor: colors.destructive + "44",
            },
          ]}
          onPress={handleReset}
          testID="reset-btn"
        >
          <Ionicons name="refresh" size={18} color={colors.destructive} />
          <Text style={[styles.resetBtnText, { color: colors.destructive }]}>
            إعادة ضبط التطبيق
          </Text>
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
  content: { paddingHorizontal: 20, paddingTop: 24 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: { fontSize: 15, fontWeight: "600" },
  settingValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginHorizontal: 16 },
  communityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 20,
  },
  communityText: { flex: 1 },
  communityTitle: { fontSize: 15, fontWeight: "700", textAlign: "right" },
  communityDesc: { fontSize: 12, textAlign: "right", marginTop: 2 },
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  comingSoonText: { fontSize: 11, fontWeight: "700" },
  premiumUpgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  premiumUpgradeText: { flex: 1, alignItems: "flex-end" },
  premiumUpgradeTitle: { fontSize: 15, fontWeight: "700" },
  premiumUpgradeDesc: { fontSize: 12, marginTop: 2, textAlign: "right" },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  resetBtnText: { fontSize: 15, fontWeight: "600" },
});
