import { router, Slot } from "expo-router";
import React, { useEffect } from "react";

import { useApp } from "@/context/AppContext";

/**
 * Onboarding route group guard.
 *
 * Guards:
 * - isOnboarded + has habit: redirect to dashboard
 *   (prevents re-onboarding without explicit reset, which would corrupt habit data)
 */
export default function OnboardingLayout() {
  const { isOnboarded, isLoading, habit } = useApp();

  useEffect(() => {
    if (isLoading) return;
    if (isOnboarded && habit) {
      router.replace("/dashboard");
    }
  }, [isLoading, isOnboarded, habit]);

  return <Slot />;
}
