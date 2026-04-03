import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AnimatedPhrases } from "@/components/AnimatedPhrases";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isOnboarded, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && isOnboarded) {
      router.replace("/dashboard");
    }
  }, [isLoading, isOnboarded]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const handleGuest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/onboarding/profile");
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topPad + 20,
          paddingBottom: bottomPad + 20,
        },
      ]}
    >
      <View style={styles.heroSection}>
        <View style={[styles.logoRing, { borderColor: colors.primary + "44" }]}>
          <View
            style={[styles.logoInner, { backgroundColor: colors.primary + "22" }]}
          >
            <Ionicons name="leaf" size={36} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.appName, { color: colors.foreground }]}>
          أنا أقدر
        </Text>

        <AnimatedPhrases color={colors.primary} fontSize={20} />

        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          رحلتك نحو حياة أفضل تبدأ الآن
        </Text>
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={handleGuest}
          testID="welcome-start-btn"
        >
          <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
            ابدأ رحلتك الآن
          </Text>
          <Ionicons
            name="arrow-back"
            size={20}
            color={colors.primaryForeground}
          />
        </TouchableOpacity>

        <View style={styles.socialSection}>
          <Text style={[styles.socialLabel, { color: colors.mutedForeground }]}>
            أو تسجيل الدخول بواسطة
          </Text>
          <View style={styles.socialBtns}>
            {[
              { icon: "logo-apple" as const, label: "Apple", color: "#fff" },
              { icon: "logo-google" as const, label: "Google", color: "#EA4335" },
              {
                icon: "logo-facebook" as const,
                label: "Facebook",
                color: "#1877F2",
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.socialBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/onboarding/profile");
                }}
              >
                <Ionicons name={item.icon} size={22} color={item.color} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/onboarding/profile");
          }}
        >
          <Text style={[styles.guestBtnText, { color: colors.mutedForeground }]}>
            تصفح كضيف
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  logoInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },
  ctaSection: {
    width: "100%",
    paddingBottom: 8,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 24,
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: "700",
  },
  socialSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  socialLabel: {
    fontSize: 13,
    marginBottom: 14,
  },
  socialBtns: {
    flexDirection: "row",
    gap: 16,
  },
  socialBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  guestBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  guestBtnText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
