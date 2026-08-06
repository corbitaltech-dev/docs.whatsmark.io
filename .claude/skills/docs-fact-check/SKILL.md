---
name: docs-fact-check
description: How to verify a documentation claim against the real WhatsMark.io product before publishing it — locating the feature in the Laravel/Vue source at /media/corbital/web_data/laravel.local/whatsmark.io, confirming exact UI button and status labels, checking plan gating and limits, and routing to the right feature specialist agent. Activate when writing any factual claim about how the product behaves, when a page mentions a button/screen/limit, when auditing an existing page for accuracy, or when the user asks whether a documented behaviour is real.
---

# Fact-checking a docs claim

Every behavioural claim in the docs must be traceable to the product. A page that describes a button that doesn't exist is worse than a missing page — it burns the trust the docs are there to build.

**Product source:** `/media/corbital/web_data/laravel.local/whatsmark.io` — Laravel + Vue/Inertia (`resources/js/pages`, no `app/Livewire`).

⚠️ **Do not use `/media/corbital/web_data/laravel.local/whatsmark-saas`.** That is the older Livewire v1 product and does **not** match what the docs describe. Confirm you have the right repo before grepping: the current one has `resources/js/pages` and an empty `app/Livewire`.

---

## Check `developer-docs/` first

Before grepping the product source, look in
`/media/corbital/web_data/laravel.local/whatsmark.io/developer-docs/`. That folder is the
internal feature-behaviour reference — exact UI labels, status strings, navigation paths,
plan gates and known gaps — and it exists precisely so customer pages are not written by
re-deriving those facts from code every time.

Browse it with `cd developer-docs && bun run dev`. Eighteen feature docs cover essentially
the whole tenant surface:

| Area | Files under `developer-docs/features/` |
|---|---|
| Getting started | `signup-and-login`, `plans-and-pricing`, `connect-account` |
| Messaging | `live-chat`, `campaigns`, `whatsapp-templates`, `messenger-templates` |
| Contacts | `contacts` |
| Automation & AI | `chatbot-flows`, `whatsapp-flows`, `appointments`, `ai-and-shortcuts` |
| Workspace | `workspace`, `settings`, `integrations`, `public-api`, `reseller` |

`developer-docs/known-issues.md` is the fastest way to spot something advertised but not
implemented — read it before writing any page that claims a capability.

**`plans-and-pricing.md` is the source for every number.** The rule that limits and prices
live only on `getting-started/free-vs-paid.mdx` still holds; that page should be written
from this file, not from the seeders directly.

If it has a file for your feature and the `_Last verified:_` date is recent, use it. If the
file is missing, stale, or contradicts the code, **fix it there first**, then write the
customer page from it. Do not quietly work around a wrong developer doc — the next writer
hits the same problem.

Its `## Known gaps` section is the fastest way to spot something advertised but not
implemented, which is exactly the kind of claim that must never reach a customer page.

## What must be verified before it ships

- **Every UI label** — button text, menu item, page name, tab, field label.
- **Every status value** — `Active`, `PENDING`, `APPROVED`, `Connected`. Case matters; the docs show what the screen shows.
- **Every navigation path** — "Templates → WhatsApp → Create Template" must match the real sidebar.
- **Every plan gate** — is this feature really available on Free Forever?
- **Every limit or price** — and remember these belong only in `getting-started/free-vs-paid.mdx` (see the `whatsmark-docs` skill).

## How to check

**UI labels** — grep the Vue pages for the visible string:

```bash
cd /media/corbital/web_data/laravel.local/whatsmark.io
grep -rn "Sync Templates" resources/js --include="*.vue" | head
```

If the string only appears in a translation file, check the current value there — that is what users see.

**Plan gating and limits** — these live in the feature/plan seeders and are read through `FeatureService`. Grep for the feature key, then cross-check against `getting-started/free-vs-paid.mdx`. If the docs and the seeder disagree, the **seeder is right** and the docs page needs fixing — say so rather than quietly matching the stale page.

**Behaviour** — trace the controller or job rather than inferring from the UI.

## Route to a specialist instead of guessing

The product repo ships feature-specialist agents that already know their subsystem. When a claim is non-trivial, ask the matching one rather than reading half a subsystem yourself:

| Claim is about | Agent |
|---|---|
| Connecting numbers, embedded signup, coexistence, MM Lite | `whatsapp-channels` |
| Templates, sync, approval, categories, carousels | `whatsapp-templates` |
| Campaigns, audiences, scheduling, delivery stats | `campaigns` |
| Live chat, team inbox, assignment, the 24-hour window | `chat` |
| Contacts, import/export, merge, bulk actions | `contacts` |
| Plans, limits, add-ons, invoices, quotas | `tenant-billing` |
| Chatbot flows, WhatsApp Flows, appointments | `whatsapp-flow-templates` |
| AI composer, custom prompts, token quotas | `ai-chat-assist` |
| Shopify | `shopify` |
| REST API endpoints, scopes, tokens | `tenant-api` / `api-docs` |

Only spawn one when the user's request warrants it — a single label check is a `grep`, not an agent.

## When you can't verify

State it rather than guessing. `<Note>` a caveat, or leave the claim out and flag it to the user. Never soften an unverified claim into vague language to make it feel safe — vague and wrong is still wrong.

## Known traps

- **The docs can be stale.** Existing pages are not evidence. Verify against source, not against a neighbouring page.
- **Feature availability moves.** Coexistence and AI plan gating have both changed. Re-check rather than trusting a claim written months ago.
- **`free-vs-paid.mdx` is the single source of truth for numbers** — but only because someone keeps it current. If you find it contradicts the seeders, fixing that page is the priority.
