import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { subscriptionService } from "@/services/subscription";

// ─── Plan definitions ─────────────────────────────────────────────────────────

type PlanId = "monthly" | "yearly";

interface Plan {
  id: PlanId;
  label: string;
  price: string;
  period: string;
  perMonth?: string;
  badge?: string;
  productId: string;
}

const PLANS: Plan[] = [
  {
    id: "yearly",
    label: "السنوي",
    price: "199.99",
    period: "/ سنة",
    perMonth: "≈ 16.66 ر.س / شهر",
    badge: "وفّر 43%",
    productId: "premium_yearly",
  },
  {
    id: "monthly",
    label: "الشهري",
    price: "29.99",
    period: "/ شهر",
    productId: "premium_monthly",
  },
];

// ─── Feature rows ─────────────────────────────────────────────────────────────

interface FeatureRow {
  label: string;
  free: string | boolean;
  premium: string | boolean;
}

const FEATURES: FeatureRow[] = [
  { label: "عدد العادات",        free: "واحدة",           premium: "غير محدود"     },
  { label: "مدرب الذكاء الاصطناعي", free: false,            premium: true            },
  { label: "الإنجازات",          free: "أساسية",          premium: "كاملة + مميزة" },
  { label: "تحليل المدخرات",      free: "أساسي",           premium: "متقدم"         },
  { label: "دعم الرسائل اليومية", free: true,              premium: true            },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PremiumScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { subscriptionTier, setSubscriptionTier } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const isPremium = subscriptionTier === "premium";

  // ─── Purchase ───────────────────────────────────────────────────────────────

  const handleUpgrade = async () => {
    if (loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      const plan = PLANS.find((p) => p.id === selectedPlan)!;
      const result = await subscriptionService.purchaseProduct(
        plan.productId as never
      );

      if (result.success || __DEV__) {
        // In dev: stub always simulates success so you can test the flow.
        // In production: RevenueCat confirms the transaction.
        setSubscriptionTier("premium");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "مبروك! 🎉",
          "أنت الآن مشترك في أنا أقدر المميز. استمتع بجميع المزايا!",
          [{ text: "رائع", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("تعذّر الشراء", "لم تتم عملية الشراء. حاول مجدداً.");
      }
    } catch {
      Alert.alert("خطأ", "حدث خطأ أثناء معالجة طلبك. حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Restore ────────────────────────────────────────────────────────────────

  const handleRestore = async () => {
    if (restoring) return;
    Haptics.selectionAsync();
    setRestoring(true);
    try {
      const result = await subscriptionService.restorePurchases();
      if (result.tier === "premium") {
        setSubscriptionTier("premium");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("تم الاسترداد", "تم استرداد اشتراكك بنجاح!", [
          { text: "حسناً", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          "لا يوجد اشتراك",
          "لم نعثر على اشتراك نشط مرتبط بحسابك."
        );
      }
    } catch {
      Alert.alert("خطأ", "تعذّر استرداد المشتريات. حاول مجدداً.");
    } finally {
      setRestoring(false);
    }
  };

  // ─── Already premium state ───────────────────────────────────────────────────

  if (isPremium) {
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
            الاشتراك المميز
          </Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.alreadyPremium}>
          <View
            style={[
              styles.premiumBadgeCircle,
              { backgroundColor: colors.gold + "22", borderColor: colors.gold + "55" },
            ]}
          >
            <Ionicons name="diamond" size={48} color={colors.gold} />
          </View>
          <Text style={[styles.alreadyTitle, { color: colors.foreground }]}>
            أنت مشترك مميز
          </Text>
          <Text style={[styles.alreadySubtitle, { color: colors.mutedForeground }]}>
            تمتع بجميع المزايا الحصرية في أنا أقدر
          </Text>
          <View style={styles.premiumFeaturesList}>
            {FEATURES.map((f) => (
              <View key={f.label} style={styles.premiumFeatureRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                <Text style={[styles.premiumFeatureText, { color: colors.foreground }]}>
                  {f.label}
                  {typeof f.premium === "string" ? ` — ${f.premium}` : ""}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.doneBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.doneBtnText, { color: colors.primaryForeground }]}>
              رائع، شكراً!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Upgrade state ──────────────────────────────────────────────────────────

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
          الاشتراك المميز
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View
            style={[
              styles.heroIconWrap,
              {
                backgroundColor: colors.gold + "22",
                borderColor: colors.gold + "44",
              },
            ]}
          >
            <Ionicons name="diamond" size={44} color={colors.gold} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            ارتقِ برحلتك
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.mutedForeground }]}>
            أطلق كامل إمكانيات أنا أقدر واحصل على دعم شخصي في كل خطوة
          </Text>
        </View>

        {/* Feature comparison */}
        <View
          style={[
            styles.comparisonCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Column headers */}
          <View style={styles.comparisonHeader}>
            <View style={styles.featureLabelCol} />
            <View style={styles.comparisonCol}>
              <Text style={[styles.colHeaderFree, { color: colors.mutedForeground }]}>
                مجاني
              </Text>
            </View>
            <View style={styles.comparisonCol}>
              <View
                style={[
                  styles.premiumColBadge,
                  { backgroundColor: colors.gold + "22" },
                ]}
              >
                <Ionicons name="diamond" size={10} color={colors.gold} />
                <Text style={[styles.colHeaderPremium, { color: colors.gold }]}>
                  مميز
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.comparisonDivider, { backgroundColor: colors.border }]} />

          {FEATURES.map((feature, idx) => (
            <View key={feature.label}>
              <View style={styles.featureRow}>
                {/* Feature label (rightmost) */}
                <View style={styles.featureLabelCol}>
                  <Text style={[styles.featureLabel, { color: colors.foreground }]}>
                    {feature.label}
                  </Text>
                </View>

                {/* Free column */}
                <View style={styles.comparisonCol}>
                  {feature.free === false ? (
                    <Ionicons name="close" size={18} color={colors.mutedForeground} />
                  ) : feature.free === true ? (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  ) : (
                    <Text style={[styles.featureVal, { color: colors.mutedForeground }]}>
                      {feature.free}
                    </Text>
                  )}
                </View>

                {/* Premium column */}
                <View style={styles.comparisonCol}>
                  {feature.premium === true ? (
                    <Ionicons name="checkmark-circle" size={18} color={colors.gold} />
                  ) : (
                    <Text style={[styles.featureVal, { color: colors.gold }]}>
                      {feature.premium}
                    </Text>
                  )}
                </View>
              </View>

              {idx < FEATURES.length - 1 && (
                <View
                  style={[
                    styles.featureDivider,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Plan cards */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          اختر خطتك
        </Text>

        <View style={styles.plansRow}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isHighlighted = plan.id === "yearly";
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => {
                  setSelectedPlan(plan.id);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: isSelected
                      ? colors.primary + "18"
                      : colors.card,
                    borderColor: isSelected
                      ? colors.primary
                      : isHighlighted
                      ? colors.gold + "55"
                      : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                activeOpacity={0.8}
              >
                {/* Best value badge */}
                {plan.badge && (
                  <View
                    style={[
                      styles.planBadge,
                      { backgroundColor: colors.gold },
                    ]}
                  >
                    <Text style={[styles.planBadgeText, { color: colors.navy }]}>
                      {plan.badge}
                    </Text>
                  </View>
                )}

                {/* Selected indicator */}
                <View style={styles.planRadioRow}>
                  <View
                    style={[
                      styles.planRadio,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.planRadioDot,
                          { backgroundColor: colors.primaryForeground },
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.planLabel,
                      {
                        color: isSelected ? colors.primary : colors.foreground,
                      },
                    ]}
                  >
                    {plan.label}
                  </Text>
                </View>

                <Text style={[styles.planPrice, { color: colors.foreground }]}>
                  <Text style={styles.planPriceNum}>{plan.price}</Text>
                  <Text style={[styles.planPriceCur, { color: colors.mutedForeground }]}>
                    {" "}ر.س
                  </Text>
                </Text>
                <Text style={[styles.planPeriod, { color: colors.mutedForeground }]}>
                  {plan.period}
                </Text>
                {plan.perMonth && (
                  <Text style={[styles.planPerMonth, { color: colors.primary }]}>
                    {plan.perMonth}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upgrade CTA */}
        <TouchableOpacity
          onPress={handleUpgrade}
          style={[
            styles.upgradeBtn,
            { backgroundColor: loading ? colors.primary + "88" : colors.primary },
          ]}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <>
              <Ionicons
                name="diamond-outline"
                size={18}
                color={colors.primaryForeground}
              />
              <Text style={[styles.upgradeBtnText, { color: colors.primaryForeground }]}>
                اشترك الآن
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Restore purchases */}
        <TouchableOpacity
          onPress={handleRestore}
          style={styles.restoreBtn}
          activeOpacity={0.7}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator color={colors.mutedForeground} size="small" />
          ) : (
            <Text style={[styles.restoreText, { color: colors.mutedForeground }]}>
              استرداد المشتريات السابقة
            </Text>
          )}
        </TouchableOpacity>

        {/* Legal note */}
        <Text style={[styles.legalNote, { color: colors.mutedForeground }]}>
          يتجدد الاشتراك تلقائياً ما لم يُلغَ قبل 24 ساعة من نهاية الفترة الحالية.
          يمكن إدارة الاشتراك أو إلغاؤه من إعدادات حسابك في متجر التطبيقات.
        </Text>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

  // ─── Hero ──────────────────────────────────────────────────────────────────
  hero: { alignItems: "center", marginBottom: 28 },
  heroIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  // ─── Comparison ────────────────────────────────────────────────────────────
  comparisonCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 28,
  },
  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  featureLabelCol: { flex: 1 },
  comparisonCol: { width: 72, alignItems: "center" },
  colHeaderFree: { fontSize: 13, fontWeight: "600" },
  premiumColBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  colHeaderPremium: { fontSize: 13, fontWeight: "700" },
  comparisonDivider: { height: 1, marginHorizontal: 0 },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  featureLabel: { fontSize: 14, fontWeight: "600", textAlign: "right" },
  featureVal: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  featureDivider: { height: 1, marginHorizontal: 16 },

  // ─── Plans ─────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  plansRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: "flex-end",
    position: "relative",
    overflow: "visible",
  },
  planBadge: {
    position: "absolute",
    top: -10,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  planBadgeText: { fontSize: 11, fontWeight: "800" },
  planRadioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginTop: 6,
  },
  planRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  planRadioDot: { width: 8, height: 8, borderRadius: 4 },
  planLabel: { fontSize: 15, fontWeight: "700" },
  planPrice: { textAlign: "right" },
  planPriceNum: { fontSize: 26, fontWeight: "800" },
  planPriceCur: { fontSize: 14 },
  planPeriod: { fontSize: 13, textAlign: "right", marginTop: 2 },
  planPerMonth: { fontSize: 12, fontWeight: "600", textAlign: "right", marginTop: 6 },

  // ─── CTA ───────────────────────────────────────────────────────────────────
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    paddingVertical: 17,
    marginBottom: 14,
  },
  upgradeBtnText: { fontSize: 17, fontWeight: "800" },

  restoreBtn: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },
  restoreText: { fontSize: 14, textDecorationLine: "underline" },

  legalNote: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },

  // ─── Already premium ───────────────────────────────────────────────────────
  alreadyPremium: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  premiumBadgeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  alreadyTitle: { fontSize: 24, fontWeight: "800", marginBottom: 10, textAlign: "center" },
  alreadySubtitle: { fontSize: 15, textAlign: "center", lineHeight: 24, marginBottom: 28 },
  premiumFeaturesList: { alignSelf: "stretch", gap: 12, marginBottom: 32 },
  premiumFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "flex-end",
  },
  premiumFeatureText: { fontSize: 15, fontWeight: "600" },
  doneBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
  },
  doneBtnText: { fontSize: 16, fontWeight: "700" },
});
