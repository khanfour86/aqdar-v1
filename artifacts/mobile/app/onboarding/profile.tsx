import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
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
  { code: "QAR", symbol: "ر.ق", label: "ريال قطري" },
  { code: "BHD", symbol: "د.ب", label: "دينار بحريني" },
  { code: "EGP", symbol: "ج.م", label: "جنيه مصري" },
  { code: "USD", symbol: "$", label: "دولار أمريكي" },
  { code: "EUR", symbol: "€", label: "يورو" },
  { code: "GBP", symbol: "£", label: "جنيه إسترليني" },
];

const AGE_GROUPS = [
  { value: "21", label: "18 – 24" },
  { value: "29", label: "25 – 34" },
  { value: "39", label: "35 – 44" },
  { value: "49", label: "45 – 54" },
  { value: "59", label: "55 – 64" },
  { value: "65", label: "65 فأكثر" },
];

export default function ProfileSetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setProfile } = useApp();

  const [nickname, setNickname] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [currency, setCurrency] = useState("KWD");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency)!;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nickname.trim()) e.nickname = "الاسم مطلوب";
    if (!ageValue) e.age = "اختر فئتك العمرية";
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
      age: Number(ageValue),
      currency,
      gender: gender || undefined,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/onboarding/habit-select");
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
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

        {/* Nickname */}
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

        {/* Age dropdown */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            العمر *
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.card,
                borderColor: errors.age ? colors.destructive : colors.border,
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAgeModal(true);
            }}
          >
            <Ionicons name="chevron-down" size={18} color={colors.mutedForeground} />
            <View style={styles.dropdownValue}>
              <Text
                style={[
                  styles.dropdownLabel,
                  { color: ageValue ? colors.foreground : colors.mutedForeground },
                ]}
              >
                {ageValue
                ? AGE_GROUPS.find((g) => g.value === ageValue)?.label ?? ageValue
                : "اختر فئتك العمرية"}
              </Text>
            </View>
          </TouchableOpacity>
          {errors.age ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {errors.age}
            </Text>
          ) : null}
        </View>

        {/* Currency dropdown */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            العملة *
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowCurrencyModal(true);
            }}
          >
            <Ionicons name="chevron-down" size={18} color={colors.mutedForeground} />
            <View style={styles.dropdownValue}>
              <Text style={[styles.dropdownSymbol, { color: colors.primary }]}>
                {selectedCurrency.symbol}
              </Text>
              <Text style={[styles.dropdownLabel, { color: colors.foreground }]}>
                {selectedCurrency.label}
              </Text>
            </View>
            <Text style={[styles.dropdownCode, { color: colors.mutedForeground }]}>
              {selectedCurrency.code}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            الجنس (اختياري)
          </Text>
          <View style={styles.genderRow}>
            {[
              { value: "male", label: "ذكر", icon: "man-outline" as const },
              { value: "female", label: "أنثى", icon: "woman-outline" as const },
            ].map((g) => (
              <TouchableOpacity
                key={g.value}
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor:
                      gender === g.value ? colors.primary + "28" : colors.card,
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
                <Ionicons
                  name={g.icon}
                  size={20}
                  color={gender === g.value ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.genderLabel,
                    {
                      color:
                        gender === g.value ? colors.primary : colors.foreground,
                      fontWeight: gender === g.value ? "700" : "500",
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

      {/* Next button */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.border, paddingBottom: insets.bottom + 16 },
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
          <Ionicons name="arrow-back" size={20} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>

      {/* Age Modal */}
      <Modal visible={showAgeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              اختر عمرك
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {AGE_GROUPS.map((g, idx) => {
                const selected = ageValue === g.value;
                return (
                  <TouchableOpacity
                    key={g.value}
                    style={[
                      styles.currencyRow,
                      {
                        backgroundColor: selected
                          ? colors.primary + "18"
                          : "transparent",
                        borderBottomColor: colors.border,
                        borderBottomWidth: idx < AGE_GROUPS.length - 1 ? 1 : 0,
                      },
                    ]}
                    onPress={() => {
                      setAgeValue(g.value);
                      if (errors.age) setErrors((e) => ({ ...e, age: "" }));
                      Haptics.selectionAsync();
                      setShowAgeModal(false);
                    }}
                  >
                    <View style={styles.currencyRowLeft}>
                      {selected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.primary}
                        />
                      ) : (
                        <View style={styles.radioEmpty} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.currencyRowLabel,
                        {
                          color: selected ? colors.primary : colors.foreground,
                          fontWeight: selected ? "700" : "500",
                          flex: 1,
                          textAlign: "right",
                        },
                      ]}
                    >
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.modalCloseBtn,
                { borderColor: colors.border, marginTop: 12 },
              ]}
              onPress={() => setShowAgeModal(false)}
            >
              <Text style={[styles.modalCloseBtnText, { color: colors.mutedForeground }]}>
                إغلاق
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              اختر العملة
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {CURRENCIES.map((c, idx) => {
                const selected = currency === c.code;
                return (
                  <TouchableOpacity
                    key={c.code}
                    style={[
                      styles.currencyRow,
                      {
                        backgroundColor: selected
                          ? colors.primary + "18"
                          : "transparent",
                        borderBottomColor: colors.border,
                        borderBottomWidth: idx < CURRENCIES.length - 1 ? 1 : 0,
                      },
                    ]}
                    onPress={() => {
                      setCurrency(c.code);
                      Haptics.selectionAsync();
                      setShowCurrencyModal(false);
                    }}
                  >
                    <View style={styles.currencyRowLeft}>
                      {selected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.primary}
                        />
                      ) : (
                        <View style={styles.radioEmpty} />
                      )}
                    </View>
                    <View style={styles.currencyRowInfo}>
                      <Text
                        style={[
                          styles.currencyRowLabel,
                          {
                            color: selected
                              ? colors.primary
                              : colors.foreground,
                            fontWeight: selected ? "700" : "500",
                          },
                        ]}
                      >
                        {c.label}
                      </Text>
                      <Text
                        style={[
                          styles.currencyRowCode,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {c.code}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.currencyRowSymbol,
                        {
                          color: selected ? colors.primary : colors.mutedForeground,
                        },
                      ]}
                    >
                      {c.symbol}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.modalCloseBtn,
                { borderColor: colors.border, marginTop: 12 },
              ]}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={[styles.modalCloseBtnText, { color: colors.mutedForeground }]}>
                إغلاق
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
    lineHeight: 20,
  },
  formGroup: { marginBottom: 26 },
  label: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorText: { fontSize: 12, textAlign: "right", marginTop: 6 },

  // Currency dropdown
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  dropdownValue: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  dropdownSymbol: { fontSize: 18, fontWeight: "700" },
  dropdownLabel: { fontSize: 15, fontWeight: "500" },
  dropdownCode: { fontSize: 13 },

  // Gender
  genderRow: { flexDirection: "row", gap: 12 },
  genderBtn: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  genderLabel: { fontSize: 16 },

  // Footer
  footer: { padding: 20, paddingTop: 16, borderTopWidth: 1 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  nextBtnText: { fontSize: 18, fontWeight: "700" },

  // Modal
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
    padding: 24,
    paddingBottom: 32,
    maxHeight: "75%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 12,
  },
  currencyRowLeft: { width: 24, alignItems: "center" },
  radioEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#7A94B0",
  },
  currencyRowInfo: { flex: 1, alignItems: "flex-end" },
  currencyRowLabel: { fontSize: 15 },
  currencyRowCode: { fontSize: 12, marginTop: 2 },
  currencyRowSymbol: { fontSize: 20, fontWeight: "700", minWidth: 32, textAlign: "center" },
  modalCloseBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  modalCloseBtnText: { fontSize: 15 },
});
