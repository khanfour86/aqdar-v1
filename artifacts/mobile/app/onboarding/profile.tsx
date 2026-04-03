import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CURRENCIES = [
  { code: "KWD", symbol: "د.ك", label: "دينار كويتي" },
  { code: "SAR", symbol: "ر.س", label: "ريال سعودي" },
  { code: "AED", symbol: "د.إ", label: "درهم إماراتي" },
  { code: "USD", symbol: "$", label: "دولار أمريكي" },
  { code: "EUR", symbol: "€", label: "يورو" },
  { code: "GBP", symbol: "£", label: "جنيه إسترليني" },
  { code: "EGP", symbol: "ج.م", label: "جنيه مصري" },
  { code: "QAR", symbol: "ر.ق", label: "ريال قطري" },
  { code: "BHD", symbol: "د.ب", label: "دينار بحريني" },
];

export default function ProfileSetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setProfile } = useApp();

  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [currency, setCurrency] = useState("KWD");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nickname.trim()) e.nickname = "الاسم مطلوب";
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 100)
      e.age = "أدخل عمرًا صحيحًا";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setProfile({
      nickname: nickname.trim(),
      age: Number(age),
      currency,
      country: country.trim() || undefined,
      gender: gender || undefined,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/onboarding/habit-select");
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
          معلوماتك
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          أخبرنا عن نفسك
        </Text>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
          هذه المعلومات تساعدنا في تخصيص تجربتك
        </Text>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            اسمك أو لقبك *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: errors.nickname ? colors.destructive : colors.border,
              },
            ]}
            value={nickname}
            onChangeText={(t) => {
              setNickname(t);
              if (errors.nickname) setErrors((e) => ({ ...e, nickname: "" }));
            }}
            placeholder="أدخل اسمك"
            placeholderTextColor={colors.mutedForeground}
            textAlign="right"
          />
          {errors.nickname ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {errors.nickname}
            </Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            عمرك *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: errors.age ? colors.destructive : colors.border,
              },
            ]}
            value={age}
            onChangeText={(t) => {
              setAge(t);
              if (errors.age) setErrors((e) => ({ ...e, age: "" }));
            }}
            placeholder="عمرك بالسنوات"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            textAlign="right"
          />
          {errors.age ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {errors.age}
            </Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            العملة *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.currencyScroll}
          >
            {CURRENCIES.map((c) => (
              <TouchableOpacity
                key={c.code}
                style={[
                  styles.currencyChip,
                  {
                    backgroundColor:
                      currency === c.code
                        ? colors.primary + "33"
                        : colors.card,
                    borderColor:
                      currency === c.code ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  setCurrency(c.code);
                  Haptics.selectionAsync();
                }}
              >
                <Text
                  style={[
                    styles.currencySymbol,
                    {
                      color:
                        currency === c.code
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  {c.symbol}
                </Text>
                <Text
                  style={[
                    styles.currencyLabel,
                    {
                      color:
                        currency === c.code
                          ? colors.primary
                          : colors.mutedForeground,
                    },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            الجنس (اختياري)
          </Text>
          <View style={styles.genderRow}>
            {[
              { value: "male", label: "ذكر" },
              { value: "female", label: "أنثى" },
            ].map((g) => (
              <TouchableOpacity
                key={g.value}
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor:
                      gender === g.value ? colors.primary + "33" : colors.card,
                    borderColor:
                      gender === g.value ? colors.primary : colors.border,
                    flex: 1,
                  },
                ]}
                onPress={() => {
                  setGender(g.value as "male" | "female");
                  Haptics.selectionAsync();
                }}
              >
                <Text
                  style={[
                    styles.genderLabel,
                    {
                      color:
                        gender === g.value
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          testID="profile-next-btn"
        >
          <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>
            التالي
          </Text>
          <Ionicons
            name="arrow-back"
            size={20}
            color={colors.primaryForeground}
          />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  backBtn: {
    width: 40,
    alignItems: "center",
  },
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
    lineHeight: 20,
  },
  formGroup: { marginBottom: 24 },
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
  currencyScroll: { marginTop: 4 },
  currencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 10,
    alignItems: "center",
    minWidth: 90,
  },
  currencySymbol: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  currencyLabel: { fontSize: 11 },
  genderRow: { flexDirection: "row", gap: 12 },
  genderBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  genderLabel: { fontSize: 16, fontWeight: "600" },
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  nextBtnText: { fontSize: 18, fontWeight: "700" },
});
