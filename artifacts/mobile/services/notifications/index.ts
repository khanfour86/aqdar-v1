/**
 * Notifications Service — stub for future Expo Notifications integration
 *
 * Future integrations:
 * - expo-notifications
 * - Push notification scheduling for daily check-ins
 * - Streak reminders
 * - Craving alerts
 */

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    // TODO: const { status } = await Notifications.requestPermissionsAsync()
    return false;
  },

  async scheduleStreakReminder(): Promise<void> {
    // TODO: Notifications.scheduleNotificationAsync({
    //   content: { title: "أنا أقدر", body: "تذكر التزامك اليوم!" },
    //   trigger: { hour: 9, minute: 0, repeats: true }
    // })
  },

  async scheduleCravingCheck(): Promise<void> {
    // TODO: Schedule periodic craving resistance check-ins
  },

  async cancelAll(): Promise<void> {
    // TODO: Notifications.cancelAllScheduledNotificationsAsync()
  },
};
