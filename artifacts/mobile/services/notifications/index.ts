import { INotificationClient } from "@/services/contracts";

/**
 * Notifications Service — stub implementing INotificationClient
 *
 * Future integration: expo-notifications + Firebase Cloud Messaging
 */
class StubNotificationClient implements INotificationClient {
  async requestPermission(): Promise<boolean> {
    // TODO: const { status } = await Notifications.requestPermissionsAsync()
    return false;
  }

  async scheduleDaily(
    hour: number,
    minute: number,
    title: string,
    body: string
  ): Promise<void> {
    // TODO: Notifications.scheduleNotificationAsync({
    //   content: { title, body },
    //   trigger: { hour, minute, repeats: true }
    // })
    if (__DEV__) console.log("[Notifications] schedule:", { hour, minute, title, body });
  }

  async cancelAll(): Promise<void> {
    // TODO: Notifications.cancelAllScheduledNotificationsAsync()
  }

  async getToken(): Promise<string | null> {
    // TODO: Notifications.getExpoPushTokenAsync()
    return null;
  }
}

export const notificationService: INotificationClient =
  new StubNotificationClient();
