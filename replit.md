# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a mobile app "أنا أقدر" (I Can) — an Arabic-first habit-breaking app built with Expo/React Native.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server artifact)
- **Database**: PostgreSQL + Drizzle ORM (not used by mobile app in v1)
- **Mobile**: Expo + React Native + expo-router
- **State management**: React Context + AsyncStorage (mobile)
- **Font**: Cairo (Arabic-optimized Google Font)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/mobile run dev` — run Expo dev server

## Mobile App: أنا أقدر

### Screens
- `app/index.tsx` — Welcome/Splash with animated rotating phrases
- `app/onboarding/profile.tsx` — Profile setup (nickname, age, currency)
- `app/onboarding/habit-select.tsx` — Habit selection (smoking, vaping, etc.)
- `app/onboarding/habit-setup.tsx` — Habit configuration (cost, quit mode)
- `app/dashboard.tsx` — Main dashboard with live streak timer, stats, AI coach
- `app/trophies.tsx` — Trophy/Achievement system
- `app/settings.tsx` — App settings and stats

### Architecture
- `context/AppContext.tsx` — Global state with AsyncStorage persistence
- `hooks/useStreak.ts` — Live streak calculations
- `constants/colors.ts` — Design tokens (deep navy + teal + gold)
- `constants/trophies.ts` — Trophy definitions
- `constants/habits.ts` — Habit templates

### Service Stubs (ready for future integration)
- `services/auth/` — Apple, Google, Facebook, Supabase Auth
- `services/analytics/` — Firebase Analytics
- `services/notifications/` — Expo Notifications
- `services/ai/` — OpenAI Coach (with local fallback messages)
- `services/subscription/` — RevenueCat + entitlement system
- `services/database/` — Supabase backend

### Design System
- Background: Deep navy #0D1B2A
- Primary: Teal #2EC4B6
- Accent/Gold: #F4A261
- Font: Cairo (Arabic-optimized)
- Dark theme by default

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
