import { IDatabaseClient } from "@/services/contracts";

/**
 * Database Service — stub implementing IDatabaseClient
 *
 * Future integration: @supabase/supabase-js
 * Provides real-time sync, cross-device, and community features.
 */
class StubDatabaseClient implements IDatabaseClient {
  async getProfile(_userId: string): Promise<unknown> {
    // TODO: supabase.from('profiles').select('*').eq('id', userId).single()
    return null;
  }

  async saveProfile(_userId: string, _data: unknown): Promise<void> {
    // TODO: supabase.from('profiles').upsert({ id: userId, ...data })
  }

  async getHabits(_userId: string): Promise<unknown[]> {
    // TODO: supabase.from('habits').select('*').eq('user_id', userId)
    return [];
  }

  async saveHabit(_userId: string, _habit: unknown): Promise<void> {
    // TODO: supabase.from('habits').upsert(habit)
  }

  async deleteHabit(_userId: string, _habitId: string): Promise<void> {
    // TODO: supabase.from('habits').delete().eq('id', habitId)
  }

  async getCravings(_userId: string, _habitId: string): Promise<unknown[]> {
    // TODO: supabase.from('cravings').select('*').eq('habit_id', habitId)
    return [];
  }

  async saveCraving(_userId: string, _craving: unknown): Promise<void> {
    // TODO: supabase.from('cravings').insert(craving)
  }
}

export const databaseService: IDatabaseClient = new StubDatabaseClient();
