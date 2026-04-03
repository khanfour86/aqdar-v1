import { router, Slot } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

/**
 * (app) route group guard — runs before every protected screen.
 *
 * Guards:
 * - isLoading: show spinner until state is hydrated
 * - !isOnboarded: redirect to welcome (blocks deep-link bypass)
 * - isOnboarded + no habit: redirect to welcome (broken-state recovery)
 */
export default function AppGroupLayout() {
  const { isOnboarded, isLoading, habit } = useApp();
  const colors = useColors();

  useEffect(() => {
    if (isLoading) return;
    if (!isOnboarded || !habit) {
      router.replace("/");
    }
  }, [isLoading, isOnboarded, habit]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!isOnboarded || !habit) return null;

  return <Slot />;
}
