import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HABIT_TEMPLATES } from "@/constants/habits";
import { useApp, HabitType } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function HabitSetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: HabitType }>();
  const { setHabit, completeOnboarding, profile } = useApp();

  const template = HABIT_TEMPLATES.find((h) => h.type === type);

  const [packsPerDay, setPacksPerDay] = useState("1");
  const [dailyCost, setDailyCost] = useState("");
  const [quitMode, setQuitMode] = useState<"immediate" | "gradual">(
    "immediate"
  );
  const [customName, setCustomName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!dailyCost || isNaN(Number(dailyCost)))
      e.dailyCost = "أدخل التكلفة اليومية";
    if (type === "custom" && !customName.trim())
      e.customName = "اسم العادة مطلوب";
    return e;
  };

  const handleStart = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setHabit({
      type: type ?? "custom",
      name: template?.nameAr ?? customName,
      packsPerDay: Number(packsPerDay),
      dailyCost: Number(dailyCost),
      quitMode,
      customName: customName.trim() || undefined,
      startDate: new Date().toISOString(),
    });
    completeOnboarding();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/dashboard");
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

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
          إعداد {template?.nameAr ?? "العادة"}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          تفاصيل {template?.nameAr ?? "العادة"}
        </Text>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
          هذه البيانات تساعدنا في حساب مدخراتك بدقة
        </Text>

        {type === "custom" && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              اسم العادة *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.foreground,
                  borderColor: errors.customName
                    ? colors.destructive
                    : colors.border,
                },
              ]}
              value={customName}
              onChangeText={setCustomName}
              placeholder="أدخل اسم العادة"
              placeholderTextColor={colors.mutedForeground}
              textAlign="right"
            />
            {errors.customName ? (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {errors.customName}
              </Text>
            ) : null}
          </View>
        )}

        {type === "smoking" && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              عدد العلب يوميًا
            </Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={[styles.counterBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => {
                  const v = Math.max(1, Number(packsPerDay) - 1);
                  setPacksPerDay(String(v));
                  Haptics.selectionAsync();
                }}
              >
                <Ionicons name="remove" size={20} color={colors.foreground} />
              </TouchableOpacity>
              <Text style={[styles.counterValue, { color: colors.foreground }]}>
                {packsPerDay}
              </Text>
              <TouchableOpacity
                style={[styles.counterBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => {
                  const v = Number(packsPerDay) + 1;
                  setPacksPerDay(String(v));
                  Haptics.selectionAsync();
                }}
              >
                <Ionicons name="add" size={20} color={colors.foreground} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            التكلفة اليومية ({profile?.currency ?? "KWD"}) *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: errors.dailyCost ? colors.destructive : colors.border,
              },
            ]}
            value={dailyCost}
            onChangeText={(t) => {
              setDailyCost(t);
              if (errors.dailyCost) setErrors((e) => ({ ...e, dailyCost: "" }));
            }}
            placeholder="0.00"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="decimal-pad"
            textAlign="right"
          />
          {errors.dailyCost ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {errors.dailyCost}
            </Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            طريقة الإقلاع
          </Text>
          <View style={styles.quitModeRow}>
            {[
              { value: "immediate", labelAr: "فوري", icon: "flash", desc: "توقف الآن بشكل كامل" },
              { value: "gradual", labelAr: "تدريجي", icon: "trending-down", desc: "تخفيض تدريجي للعادة" },
            ].map((mode) => (
              <TouchableOpacity
                key={mode.value}
                style={[
                  styles.quitModeCard,
                  {
                    backgroundColor:
                      quitMode === mode.value
                        ? colors.primary + "22"
                        : colors.card,
                    borderColor:
                      quitMode === mode.value ? colors.primary : colors.border,
                    flex: 1,
                  },
                ]}
                onPress={() => {
                  setQuitMode(mode.value as "immediate" | "gradual");
                  Haptics.selectionAsync();
                }}
              >
                <Ionicons
                  name={mode.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={
                    quitMode === mode.value ? colors.primary : colors.mutedForeground
                  }
                />
                <Text
                  style={[
                    styles.quitModeLabel,
                    {
                      color:
                        quitMode === mode.value
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  {mode.labelAr}
                </Text>
                <Text
                  style={[styles.quitModeDesc, { color: colors.mutedForeground }]}
                >
                  {mode.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.infoBox,
            { backgroundColor: colors.primary + "11", borderColor: colors.primary + "33" },
          ]}
        >
          <Ionicons name="information-circle" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            سيبدأ عداد توقفك من الآن مباشرة
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: colors.primary }]}
          onPress={handleStart}
          testID="habit-setup-start-btn"
        >
          <Ionicons name="checkmark-circle" size={22} color={colors.primaryForeground} />
          <Text style={[styles.startBtnText, { color: colors.primaryForeground }]}>
            ابدأ رحلتي الآن
          </Text>
        </TouchableOpacity>
      </View>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 28 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 32,
  },
  formGroup: { marginBottom: 28 },
  label: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorText: { fontSize: 12, textAlign: "right", marginTop: 4 },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: {
    fontSize: 32,
    fontWeight: "700",
    minWidth: 50,
    textAlign: "center",
  },
  quitModeRow: { flexDirection: "row", gap: 12 },
  quitModeCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  quitModeLabel: { fontSize: 16, fontWeight: "700" },
  quitModeDesc: { fontSize: 11, textAlign: "center" },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  infoText: { fontSize: 13, flex: 1, textAlign: "right" },
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  startBtnText: { fontSize: 18, fontWeight: "700" },
});
