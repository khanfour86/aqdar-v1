/**
 * Database Service — stub for future Supabase integration
 *
 * Future integrations:
 * - @supabase/supabase-js
 * - Real-time sync of habits, streaks, and community data
 * - Cross-device sync
 */

export const databaseService = {
  async syncUserProfile(_profile: object): Promise<void> {
    // TODO: supabase.from('profiles').upsert(profile)
  },

  async syncHabitData(_habit: object): Promise<void> {
    // TODO: supabase.from('habits').upsert(habit)
  },

  async fetchCommunityPosts(_limit = 20): Promise<[]> {
    // TODO: supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(limit)
    return [];
  },

  async createPost(_content: string): Promise<void> {
    // TODO: supabase.from('posts').insert({ content, user_id: userId })
  },
};
