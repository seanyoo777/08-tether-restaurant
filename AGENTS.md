# AGENTS.md

## PROJECT OVERVIEW

This repository is part of the unified platform ecosystem.

Project Number:
08 = Tether Restaurant Platform

Core Principles:
- Do NOT remove existing features
- Always extend instead of replacing
- Keep build/lint passing
- Mock/demo mode first
- No real trading/payment API connection
- UI/UX priority
- Mobile-first responsive structure
- Keep architecture reusable for future integration

---

## REQUIRED DOCUMENT RULE

Whenever:
- structure changes
- new folders are added
- new systems are added
- architecture changes
- integrations are added

You MUST also update:
- `MASTER_MANUAL.md` (repository root: `tetherget-mvp/MASTER_MANUAL.md`)
- `08-tether-restaurant/docs/*.md` when the change applies to this app (at minimum `README.md` index; add or edit `ARCHITECTURE.md`, `ROUTES.md`, etc. as needed)

---

## DEVELOPMENT RULES

- Preserve compatibility
- Avoid breaking routing
- Avoid breaking layout structure
- Avoid direct dependency chaos
- Keep reusable modules separated
- Prefer centralized config/constants
- Prefer adapter pattern for external integrations

---

## CURRENT PLATFORM STATUS

Current stack:
- React
- TypeScript
- Vite

Current mode:
- mock/demo mode

Current priorities:
1. UI/UX
2. Stable structure
3. Admin system
4. Reusable architecture
5. Documentation

---

## FUTURE EXPANSION

Planned future integrations:
- OneAI bridge
- Unified admin
- Notification system
- Push system
- Market data adapters
- Universal platform integration

---

## IMPORTANT

When changing architecture:
Update documentation together.