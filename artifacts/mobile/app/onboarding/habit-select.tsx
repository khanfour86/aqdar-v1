import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HABIT_TEMPLATES } from "@/constants/habits";
import { useColors } from "@/hooks/useColors";
import { HabitType } from "@/context/AppContext";

export default function HabitSelectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<HabitType | null>(null);

  const handleNext = () => {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/onboarding/habit-setup", params: { type: selected } });
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
          العادة التي تريد تركها
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
          اختر عادتك
        </Text>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
          النسخة المجانية تتيح عادة واحدة
        </Text>

        <View style={styles.grid}>
          {HABIT_TEMPLATES.map((habit) => {
            const isSelected = selected === habit.type;
            return (
              <TouchableOpacity
                key={habit.type}
                style={[
                  styles.habitCard,
                  {
                    backgroundColor: isSelected
                      ? habit.color + "22"
                      : colors.card,
                    borderColor: isSelected ? habit.color : colors.border,
                  },
                ]}
                onPress={() => {
                  setSelected(habit.type);
                  Haptics.selectionAsync();
                }}
              >
                <View
                  style={[
                    styles.habitIconWrap,
                    {
                      backgroundColor: isSelected
                        ? habit.color + "33"
                        : colors.muted,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={28}
                    color={isSelected ? habit.color : colors.mutedForeground}
                  />
                </View>
                <Text
                  style={[
                    styles.habitName,
                    { color: isSelected ? habit.color : colors.foreground },
                  ]}
                >
                  {habit.nameAr}
                </Text>
                {isSelected && (
                  <View
                    style={[
                      styles.checkBadge,
                      { backgroundColor: habit.color },
                    ]}
                  >
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
          style={[
            styles.nextBtn,
            {
              backgroundColor: selected ? colors.primary : colors.muted,
            },
          ]}
          onPress={handleNext}
          disabled={!selected}
          testID="habit-select-next-btn"
        >
          <Text
            style={[
              styles.nextBtnText,
              {
                color: selected
                  ? colors.primaryForeground
                  : colors.mutedForeground,
              },
            ]}
          >
            التالي
          </Text>
          <Ionicons
            name="arrow-back"
            size={20}
            color={selected ? colors.primaryForeground : colors.mutedForeground}
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  backBtn: { width: 40, alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
  },
  habitCard: {
    width: "47%",
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  habitIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  habitName: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
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
