# أنا أقدر — Project Overview

Arabic-first mobile habit-breaking app built with Expo/React Native.
Helps users quit harmful habits (smoking, vaping, social media, etc.), tracks streaks, calculates money saved, and unlocks trophies.

---

## Architecture (v2 — Production-Ready)

### Tech Stack
- **Frontend**: Expo / React Native (TypeScript)
- **Navigation**: expo-router (Stack-based, RTL)
- **State**: Domain-sliced AsyncStorage (schema versioned, migration-ready)
- **Fonts**: Cairo (Arabic-optimized) via @expo-google-fonts/cairo
- **API**: Backend stub in `/artifacts/api-server` (Express, port 8080)

### Design System
- Background: `#0D1B2A` (deep navy)
- Primary: `#2EC4B6` (teal)
- Accent/Gold: `#F4A261`
- Dark theme only
- RTL throughout — text aligns right, back arrows use `arrow-forward`

---

## Directory Structure (mobile app)

```
artifacts/mobile/
├── app/                       # expo-router screens
│   ├── index.tsx              # Welcome / landing
│   ├── (app)/                 # Protected route group (guard: onboarded + habit)
│   │   ├── _layout.tsx        # Route guard → redirects to / if not onboarded
│   │   ├── dashboard.tsx      # Main dashboard (decomposed)
│   │   ├── trophies.tsx       # Trophy collection
│   │   ├── settings.tsx       # User settings
│   │   └── premium.tsx        # Premium subscription paywall screen
│   └── onboarding/            # Onboarding flow (guard: redirects if already onboarded)
│       ├── _layout.tsx
│       ├── profile.tsx
│       ├── habit-select.tsx
│       └── habit-setup.tsx
│
├── store/                     # Domain state (v2)
│   ├── types.ts               # All core types (schema v2)
│   ├── migrations.ts          # v1→v2 migration engine
│   └── AppStore.tsx           # Main AppStoreProvider + useAppStore
│
├── features/
│   ├── entitlements/          # Feature flags + premium gating
│   │   └── index.ts           # getEntitlements(), canUnlockTrophy()
│   └── trophies/              # Trophy domain logic
│       └── unlock.ts          # evaluateTrophyUnlocks(), getNextTrophy()
│
├── config/
│   ├── app.ts                 # Static app config
│   └── env.ts                 # EXPO_PUBLIC_ env vars
│
├── services/
│   ├── contracts/             # Service interfaces (IAnalyticsClient, etc.)
│   │   └── index.ts
│   ├── ai/                    # Coach messages (ICoachClient stub)
│   ├── analytics/             # Analytics (IAnalyticsClient stub)
│   ├── auth/                  # Auth (IAuthClient stub)
│   ├── database/              # Database (IDatabaseClient stub)
│   ├── notifications/         # Notifications (INotificationClient stub)
│   └── subscription/          # Subscription (ISubscriptionClient stub)
│
├── components/
│   ├── dashboard/             # Dashboard sub-components
│   │   ├── HeroCard.tsx       # Habit name + progress ring + timer
│   │   ├── StatsSection.tsx   # Money saved + cravings + cigarettes
│   │   ├── TrophyBanner.tsx   # Current trophy + next trophy progress
│   │   ├── CoachCard.tsx      # AI coach message card
│   │   ├── ActionRow.tsx      # Craving + relapse buttons
│   │   ├── CravingModal.tsx   # Craving resistance modal
│   │   └── RelapseModal.tsx   # Relapse reset modal
│   ├── StatCard.tsx
│   ├── TrophyCard.tsx
│   ├── ProgressRing.tsx
│   └── AnimatedPhrases.tsx
│
├── context/
│   └── AppContext.tsx          # Thin re-export shim → store/AppStore
│
├── constants/
│   ├── habits.ts              # HABIT_TEMPLATES (dynamic form schema)
│   ├── trophies.ts            # TROPHIES definitions
│   └── colors.ts              # Color palette
│
└── hooks/
    ├── useColors.ts           # Color theme hook
    └── useStreak.ts           # Live streak timer + stats
```

---

## Key Architecture Decisions

### Multi-Habit Support (v2)
- `habits: HabitConfig[]` + `activeHabitId: string | null`
- Free users: 1 habit max (enforced by `features/entitlements`)
- Premium users: up to 10 habits

### Schema Versioning + Migrations
- `schemaVersion: 2` in stored state
- V1 (flat `habit: null`) auto-migrates to V2 (habits array)
- New migrations added in `store/migrations.ts`

### Entitlement System
- All premium gating through `features/entitlements/index.ts`
- Never check `subscription.tier` directly in UI
- Use `getEntitlements(tier).canAddHabit(count)`, etc.

### Trophy Service
- All unlock logic in `features/trophies/unlock.ts`
- Dashboard is display-only — calls service, doesn't own logic
- Premium trophies blocked for free users via entitlements

### Service Contracts
- All services implement interfaces from `services/contracts/index.ts`
- Swap concrete adapters (Supabase, Firebase, RevenueCat) without touching UI

### Legacy Compat
- `context/AppContext.tsx` re-exports from AppStore (backwards compat)
- `habit` (singular) is an alias for `activeHabit` 
- `unlockedTrophies` is alias for `trophies.unlockedIds`
- `subscriptionTier` is alias for `subscription.tier`

---

## Roadmap Integration Points

| Service | Interface | Adapter Path |
|---------|-----------|--------------|
| Supabase | IDatabaseClient | services/database |
| Firebase Analytics | IAnalyticsClient | services/analytics |
| RevenueCat | ISubscriptionClient | services/subscription |
| OpenAI (via proxy) | ICoachClient | services/ai |
| Expo Notifications | INotificationClient | services/notifications |
| Apple/Google Auth | IAuthClient | services/auth |
