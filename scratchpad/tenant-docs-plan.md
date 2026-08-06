# WhatsMark Tenant Docs — Full Plan

Status check against the live docs repo (`docs.whatsmark.io`) as of today:

**Already written:** Introduction (`index.mdx`), Register (`register.mdx`), Login (`log-in.mdx`), Getting Started (`getting-started.mdx`), API Overview (`overview.mdx`).

**Not written yet:** everything else below — 20 feature areas, ~45 potential pages. This file is the analysis + step-by-step writing plan. Nothing here changes `docs.json` or any existing page.

---

## 1. The full tenant journey (onboarding → daily use → growth)

This is the actual end-to-end flow a customer goes through, in order. Docs should follow this same order so a new reader can go top-to-bottom.

```
STAGE 0 — Discovery
  Pricing page → pick Free / Professional / Reseller(waitlist)

STAGE 1 — Onboarding                              [DOCUMENTED]
  Register (account + workspace + OTP) → Provisioning → (payment if paid plan) → Dashboard

STAGE 2 — First-run setup                          [PARTIALLY DOCUMENTED]
  Connect a Channel (WhatsApp/Messenger)            [in Getting Started, needs own deep page]
  Invite your Team                                  [in Getting Started, needs own deep page]
  Explore the Dashboard                             [in Getting Started, needs own deep page]

STAGE 3 — Core setup (config before daily use)      [NOT DOCUMENTED]
  Settings: General, Business Hours, Contacts defaults, Notifications, Billing Details
  Contacts: Labels / Groups / Statuses / Sources / Custom Fields
  Roles & Permissions (if using custom roles)

STAGE 4 — Daily operation                           [NOT DOCUMENTED]
  Contacts (add/import/manage)
  Chat / Live Inbox (talk to customers)
  Templates (get messages approved by Meta)
  Campaigns (broadcast to many contacts)
  WhatsApp Flows + Appointments (interactive forms/bookings)
  Automations / Chatbot (no-human-needed flows)
  AI features (chat assist, custom prompts, AI flow generation)
  Media Library

STAGE 5 — Monitoring & governance                   [NOT DOCUMENTED]
  Feature Usage page
  Activity Log + WhatsApp Activity Log
  Notifications Center

STAGE 6 — Growth / scale                            [NOT DOCUMENTED]
  Billing & Subscription (upgrade, add-ons, invoices, coupons)
  API Access (build your own integrations)
  Custom Domain
  Google Accounts (Sheets/Calendar integration)
  Webhooks (forward events out)

STAGE 7 — Team lifecycle                            [NOT DOCUMENTED]
  Team Invitation acceptance (the invited person's side)
  Account closure / danger zone
```

---

## 2. Proposed doc structure (groups → pages)

Suggested Mintlify grouping once you're ready to wire it into `docs.json` (naming only — I have not touched the nav):

```
Getting Started            [exists]
  - Introduction
  - Register
  - Login
  - Getting Started overview

Core Setup                 [new group]
  - Connecting a Channel (WhatsApp & Messenger)
  - Inviting Your Team & Roles
  - Workspace Settings (General, Business Hours, Notifications)
  - Contact Configuration (Labels, Groups, Statuses, Sources, Custom Fields)

Contacts                   [new group]
  - Managing Contacts (create/edit/view)
  - Importing & Exporting Contacts
  - Bulk Actions & Merging
  - Contact Notes

Messaging                  [new group]
  - Live Chat / Team Inbox
  - WhatsApp Message Templates
  - Messenger Templates
  - Campaigns (Message & Template)
  - Merge Fields Reference

Automation & AI            [new group]
  - WhatsApp Flows (builder + library)
  - Appointments & Booking
  - Chatbot / Automation Flows
  - AI Chat Assist & Custom Prompts
  - AI Flow Generation

Reporting                  [new group]
  - Dashboard & Feature Usage
  - Activity Log
  - WhatsApp Activity Log
  - Notifications Center

Media                      [new group]
  - Media Library

Billing                    [new group]
  - Plans & Subscription
  - Add-ons & Contact Upgrades
  - Payments, Invoices & Coupons

Settings Reference          [new group]
  - Full Settings Index (table of every settings page)
  - Custom Domain
  - Webhooks
  - Google Accounts
  - API Keys / Developer Access
  - Account & Danger Zone

Api                         [exists — 1 page today]
  - Overview
  - (future: per-module reference pages generated from Postman collection)
```

---

## 3. Feature-by-feature detail (source of truth for writing each page)

Each block below = one future doc page. Use this as your outline when drafting — I've kept it to the concrete UI actions, not implementation detail.

### Dashboard
- Route: `/dashboard`
- What it shows: greeting card, promotional banner carousel, "Usage & Limits" panel (progress bars per plan feature with "View X" links), "Upcoming Campaigns" panel, charts (messages over time, new contacts trend, contact lifecycle breakdown, contact source breakdown, per-channel in/out, most-engaged chats, unreplied chats), each with its own date range (Today/7d/15d/30d/1y).
- Actions: Refresh button (busts usage + chart cache), email-verification banner if unverified.
- Gated widgets: contacts, template_campaigns, message_campaigns, ai_prompts, ai_tokens_monthly, staff, bot_flow, appointment_forms, appointments, appointments_monthly, conversations, channel_accounts, media_library_mb.

### Feature Usage page
- Route: `/feature-usage`
- Full audit table: every plan feature grouped by category (AI/Messaging/Automation/Channel/Integration/API/Team), type (boolean/limit/quota), usage vs limit, % bar, "Unlimited" badge for -1, near-limit warnings, upgrade link.

### Contacts — Core
- Route: `/contacts`
- Table with search/filter (status/source/group/label/assignee/channel).
- Create/edit via Sheet form (name, phone, email, custom fields, groups, labels, status, source, assignment).
- Row actions: Initiate Chat (WhatsApp template), Initiate Messenger Chat, Send a WhatsApp Flow, open in live chat, activate/deactivate, delete.
- Contact detail Sheet (activity, notes, custom fields).
- Gate: `contacts` limit; upsize via paid add-on.

### Contacts — Import/Export
- 3-step import wizard: upload → column mapping (auto-suggested) → confirm; job progress; error report download; import history list.
- Export filtered lists to file.

### Contacts — Bulk Actions & Merge
- Bulk (selection or "select all matching"): status, type, group add/remove, label add/remove, assign staff, activate/deactivate, link/unlink channel, delete.
- Merge: single (pick winner) or bulk merge (fold 2+ losers into one winner).
- Per-contact notes CRUD.

### Contacts — Configuration
- Labels (CRUD + reorder), Groups (CRUD), Statuses (CRUD + reorder + default toggle), Sources (CRUD + reorder), Custom Fields (CRUD + reorder + active toggle; types: text/dropdown/radio/checkbox/switch/date).
- Contact auto-create defaults (global + per-WhatsApp-channel): lifecycle stage, status, source, labels, groups, assignment strategy for inbound-created contacts. Route: `/settings/contacts`.

### Chat / Live Inbox
- Route: `/chat`
- 4-pane layout: sidebar (All/Mine/Unassigned/per-status/per-channel/Team Inboxes with live counters) → conversation list → message thread → contact panel.
- Composer: text, media (image/video/audio/doc with progress), location, contact cards, canned replies, reply-to.
- "Send template" prompt when 24h window closed (WhatsApp) / always (Messenger).
- AI improve/translate button (Sparkles) with Undo/Regenerate.
- Assign to member(s) or Team Inbox; mark read; clear; delete conversation; delete/restore message (2-min window).
- Manual bot-flow run or WhatsApp Flow send from chat.
- Realtime via WebSocket (no polling).
- Team Inboxes management (create/rename/delete/manage members).
- Gates: `conversations` quota, `chat_history_days`, `chat_message_restore`, `automated_read_receipts`, AI trio.

### Campaigns
- Route: `/campaigns`
- 4-step wizard: Basics (name/type) → Audience (group/filter/manual) → Content (message/template, media, merge fields) → Schedule (now/later).
- Two types: Message Campaigns (24h-window free text) vs Template Campaigns (Meta-approved, any contact).
- Launch/pause/resume/cancel, resend-failed-only, clone-for-replied.
- Detail page: delivery analytics (sent/delivered/read/failed) + recipients table.
- Merge Fields reference page (`/campaigns/merge-fields`).
- MM Lite auto-routing (silent, no user action).
- Gates: `message_campaigns`, `template_campaigns` (independent quotas).

### WhatsApp Message Templates
- Route: `/messaging/whatsapp/templates`
- Table filter by account/status/category/language, quality badges.
- Create: type picker (Header/Carousel/Authentication) → Basic Info → Header → Body (live `{{n}}` detection) → Footer → Buttons (Quick Reply/URL/Phone) — Carousel: 2-10 cards; Authentication: OTP button types + expiry.
- Live preview pane. Template Library (pre-built, tabbed, favouritable).
- Submit to Meta, webhook-driven status updates + in-app notification.
- Edit content (name/lang/category locked post-submit), delete, sync (single or all channels).
- Per-template analytics (sent/delivered/read/clicked/cost).

### Messenger Templates
- Route: `/messaging/messenger/templates`
- 5 local preset types: text, quick replies (≤13), button template (≤3 buttons), generic/carousel (≤10 cards), media (URL + caption).
- Used in campaigns, chat composer, Initiate Chat.

### WhatsApp Flows
- Route: `/wa-flows`
- Visual 3-pane drag-and-drop builder (screens + palette → editor → live phone preview) or raw JSON edit.
- Field types: text, textarea, phone, date, dropdown, radio, checkbox, opt-in.
- Publish/deprecate, clone, active toggle, sync (flow or channel).
- Send via: Contact row, template FLOW button, campaign, automation node.
- Submissions: view/export (CSV/XLSX), detail drawer, field-mapping to contact/custom fields/tags.
- Flow Library (Appointment/Lead-Capture/Survey/Support-Ticket/Event-Registration/Callback-Request) — clone via "Use This."
- Special: Appointment Booking flow (dynamic, endpoint-backed; per-flow booking window: slot length/capacity/lead/horizon days; one-time RSA key setup).
- Gate: `wa_flow_templates` limit.

### Appointments
- Route: `/bookings`
- List or Calendar (month grid) view; filter by channel/source/status/date; update status.
- Settings: weekly business hours, holidays, timezone, services list, confirmation message template.
- Public booking link per channel (white-label, self-book without WhatsApp).
- Gates: `appointment_forms`, `appointments`, `appointments_monthly`.

### Channels
- Route: `/channels`
- Unified table of connected accounts (WABA/Page), phone numbers/handles, status, platform.
- Connect WhatsApp: Embedded Signup (one-click OAuth) or Manual (WABA ID + token + app creds).
- Connect Messenger: same two methods.
- Default endpoint per platform, disconnect account/endpoint, refresh health, webhook re-subscribe, fill missing credentials.
- WABA health/analytics (quality rating, review/verification status), per-number quality.
- Business Profile edit (about/address/description/email/websites/vertical + photo).
- Test message send. Coexistence mode (native app + API, chat history import).
- "Supported channels" card shows locked/upgrade rows for platforms not on plan.
- Gates: `channel_accounts`, `manual_channel`, `emb_signup`, `emb_signup_catalog`, `messenger_manual`, `messenger_emb_signup`, `coexistence`.

### Automations (Chatbot / Flow Builder)
- Route: `/automations`
- Visual canvas builder (React Flow), triggers by keyword/event.
- Node types: text/button/list/media/location/contact-card/template/Messenger-template/WA-Flow-send/reaction/update-contact/API-request/delay/condition-branch/ask-question(+phone/email/address/location/media)/AI-Assistant/sequence/connect-to-flow/save-response/Google-Sheets-read-write/Google-Calendar-create/assign-tag-label-group/update-custom-field/wait-timer/wait-for-reply/logic-control.
- CRUD + duplicate + active toggle + priority + export.
- "Generate with AI" — plain-English description → proposed node graph.
- Flow Library (Lead Qualification, Appointment Booking, Customer Support, Sales Pipeline CRM, E-commerce Order Flow, Recruitment/HR).
- Gates: `bot_flow` limit, `ai_flow_generation`, `typing_indicator`, `google_sheet`, `google_calendar`.

### AI Features
- **Chat AI (Sparkles):** Improve/Fix Grammar/Formal/Casual/Shorten, Translate (configured language list), custom saved prompts, token meter, Undo/Regenerate. Gates: `ai_chat_assist`, `ai_tokens_monthly`, `ai_prompts`.
- **Custom AI Prompts page** (`/ai-prompts`): CRUD/reorder/toggle named rewrite presets.
- **AI Flow Generation:** covered in Automations.
- **AI Settings** (`/settings/ai`): tenant's own AI provider key (only if superadmin allows), test-key button.

### Team Management
- Route: `/team`
- List members w/ role/status, invite by email (revocable link), create directly, member detail page, remove, change role (owner-only for privilege changes).
- Gate: `staff` limit.

### Roles & Permissions
- Route: `/roles`
- Custom roles beyond Owner/Admin/Member; granular View/Create/Edit/Delete matrix across every module; edit/delete custom roles; "any capability implies View" enforced live.

### Settings — full index
Table for a single reference page listing every settings sub-page with route + one-line purpose:
Profile · Password · Two-Factor Auth · Appearance · Verify Phone · General · Business Hours · Billing Details · Custom Domain · Contacts (auto-create defaults) · Webhooks · AI · Google Accounts · Inbound Media · WhatsApp Connection (reseller-only) · Account (Danger Zone) · Notifications · Theme · API Keys.

(Full one-line descriptions are in the Explore-agent findings above — copy directly into the table when drafting.)

### Billing & Subscription
- Route: `/billing`
- Current plan/usage, My Subscription detail (status/renewal/cycle).
- Upgrade/downgrade/change plan (proration preview), change cycle, cancel/resume, cancel pending downgrade.
- Pay via Razorpay or Offline (proof upload, admin review).
- Add-ons: browse, cart, quantity change, cancel.
- Contact-limit upgrade as add-on (order/verify/offline/schedule-downgrade/cancel-downgrade/preview).
- Coupons at checkout (subscribe/addon/cart) with live tax-inclusive recalculation.
- Payment Methods (add/default/delete) — owner only.
- Invoices: view/download PDF, filterable table.
- Renewal calculator page. Disable auto-renewal.

### API Access (Developer)
- Route: `/api-keys`
- Create named tokens with scopes (contacts/channels/messages/templates/groups/labels/sources/statuses/conversations/OTP/account/usage), regenerate, revoke.
- Authenticates against `api.whatsmark.io/api/v1/...`.
- Gates: `api_access` boolean (page visibility), `api_requests` monthly quota.
- *(Already partly covered by your API Overview page — this would be the "how to manage tokens in the dashboard" companion page, separate from the API reference itself.)*

### Reporting — Activity Log
- Route: `/activity-log`
- Filterable audit trail (event type, user/causer); delete entry (unless protected); bulk-delete; clear all.

### Reporting — WhatsApp Activity Log
- Route: `/whatsapp-activity-log`
- Every outbound WhatsApp message sent by the platform across all sources (Initiate Chat/Campaign/Bot Flow/Message Bot/Inbox Reply), filterable by category, drill into raw Meta request/response JSON.

### Notifications Center
- Route: `/notifications` (+ bell dropdown)
- View all in-app notifications, mark one/all read, delete one/all, bulk actions.

### Media Library
- Route: `/media`
- Upload images/video/audio/docs; folders (create/rename/delete); move files; bulk delete/move; storage usage vs quota; used as a picker everywhere (chat, templates, flows).
- Gate: `media_library_mb`.

### Seeder Library (cross-cutting, not a standalone page)
- Surfaces inside Automations/Templates/Flows as "Library" tabs; browse admin-curated starter content, favourite, "Use" to clone. Counts against the relevant limit (`wa_flow_templates` / `bot_flow`) when cloned.

### OTP Verification (contact-facing / self-service)
- Via REST API: send/check/verify/resend/delete OTP for a phone number (for the tenant's own apps).
- Self-service internal uses: Profile phone-number change, invitation acceptance — 6-digit WhatsApp code, escalating resend cooldown (30s→60s→300s→3600s→block).

### Merge Fields (reference utility)
- Route: `/campaigns/merge-fields`
- Browsable list of every `{{token}}`: Contact Fields, Custom Fields, Team/Workspace fields. Same `@`-picker appears in campaigns, templates, automation nodes.

### Team Invitation Acceptance (the invited user's side)
- Route: `/invitations/accept/{token}`
- View invite → set up account/password → verify WhatsApp via OTP → join with assigned role.

### Account Closure / Danger Zone
- Route: `/settings/account`
- Owner-only: request/cancel account closure (schedules deletion, cancels subscription).

---

## 4. Recommended writing order

Write in this order so each page can link back to something that already exists:

1. **Core Setup** group (Channels, Team & Roles, Workspace Settings, Contact Configuration) — completes the onboarding arc already started by Getting Started.
2. **Contacts** group (Core, Import/Export, Bulk/Merge) — the most-used feature day-to-day.
3. **Messaging** group (Chat, WA Templates, Messenger Templates, Campaigns, Merge Fields) — the core value prop.
4. **Automation & AI** group (WA Flows, Appointments, Automations, AI features) — the differentiators.
5. **Reporting** group (Dashboard/Feature Usage, Activity Logs, Notifications) — short pages, quick wins.
6. **Media Library** — one short page.
7. **Billing** group — needed before "Growth/scale" but lower urgency for new users.
8. **Settings Reference + API Access + Custom Domain + Webhooks + Google Accounts** — reference-style pages, can trail last.
9. **Team Invitation Acceptance** — short page, pairs with Team Management.

## 5. Plan-gating reference (for "Not available on your plan" callouts)

| Category | Feature keys |
|---|---|
| AI | `ai_chat_assist`, `ai_prompts`, `ai_tokens_monthly` |
| Messaging | `message_campaigns`, `template_campaigns`, `contacts`, `conversations`, `canned_replies`, `chat_history_days`, `media_library_mb`, `chat_message_restore` |
| Automation | `bot_flow`, `wa_flow_templates`, `appointment_forms`, `appointments`, `appointments_monthly`, `automated_read_receipts`, `typing_indicator`, `ai_flow_generation` |
| Channel | `channel_accounts` |
| Integration | `manual_channel`, `emb_signup`, `coexistence`, `emb_signup_catalog`, `messenger_manual`, `messenger_emb_signup`, `form_builder`, `custom_domain`, `webhook_forwarding`, `google_sheet`, `google_calendar` |
| API | `api_access`, `api_requests` |
| Team | `staff` |

Use this table whenever a page needs a "not available on Free" / "requires Professional" style callout — check the actual seeder value before claiming a specific plan gates a specific feature (some are boolean on/off, some are numeric limits with 0 meaning off).
