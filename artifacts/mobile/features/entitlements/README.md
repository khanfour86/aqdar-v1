# Entitlements

All feature gating must go through this module. Never check `subscription.tier` directly in UI code.

## Usage

```ts
import { useEntitlements, canUnlockTrophy } from "@/features/entitlements";

const entitlements = useEntitlements(subscription.tier);
if (entitlements.canAddHabit(currentCount)) { ... }
if (entitlements.premiumTrophies) { ... }
```

## Free tier
- 1 habit max
- Basic trophies (non-premium)
- Basic AI motivational messages

## Premium tier
- Up to 10 habits
- All trophies including premium
- Full AI coach chat
- Advanced savings dashboard
- Community features
- Data export
