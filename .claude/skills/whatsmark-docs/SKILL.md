---
name: whatsmark-docs
description: Authoritative rules for writing and editing any page in the docs.whatsmark.io Mintlify site — plain-language voice, the WhatsMark.io brand and plan-naming rules, the banned-claims list, honest plan gating, Mintlify component and docs.json mechanics (Lucide icons, redirects, the index.mdx root rule), image/BrowserFrame conventions, the shared-repo safety rules for working alongside other writers, and the verification checklist every page must pass. Activate for ANY task that creates, rewrites, reviews, or fact-checks a docs page, edits docs.json or navigation, or when the user mentions the docs site, a docs page, Mintlify, or quickstart.
---

# WhatsMark.io Documentation

You write the customer-facing docs at `docs.whatsmark.io`. The audience is a **small-business owner or their staff** — not a developer. Most arrive from the marketing site while deciding whether to buy.

Two goals, in this order:

1. **Understand** — a visitor grasps what WhatsMark.io does within 15 seconds of landing.
2. **Onboard** — they reach their first sent message without getting stuck or scared off.

Everything below serves those two. When a rule conflicts with elegance, the rule wins — most of them exist because breaking one caused a real problem.

---

## 1. Voice: plain language, always

Write like you're explaining it to a shop owner over the counter. Short sentences. One idea each. Second person ("you").

**Never use these words on a customer-facing page.** Left column is banned; use the right.

| Never write | Write instead |
|---|---|
| tenant | workspace |
| WABA / WhatsApp Business Account (unqualified) | your WhatsApp Business account, or just "your number" |
| session message | free-form message / writing back in your own words |
| 24-hour customer service window | "you can write back freely for 24 hours" |
| embedded signup (as a bare noun) | "Meta's own pop-up window walks you through it" |
| provisioning / instantiate | setting up |
| quota / entitlement | limit, or how much you can use |
| endpoint, payload, webhook (outside the API pages) | avoid entirely |
| leverage, utilise, seamless, robust, powerful | use, or delete the sentence |

Two exceptions where a term is unavoidable: **template** and **channel**. Both are the actual UI labels. Define each on first use in a page, in one sentence, then use it freely:

> These pre-approved messages are called **templates** — think of them as reusable message formats with blanks for each person's name, order number, and so on.

**Explain the why, not just the what.** "You can't send this" is frustrating; "this is a WhatsApp rule, not ours" is reassuring. Whenever a limit comes from Meta rather than from us, say so.

**Don't answer objections the reader doesn't have.** Reassurance like "no coding required", "you don't need a developer", "no technical knowledge needed" *creates* the worry it's trying to remove — a shop owner who never suspected programming was involved now wonders whether it normally is. We don't sell a code-based product, so never raise the subject.

The same trap applies to any "don't worry about X" phrasing. If the reader wouldn't have thought of X unaided, leave it out. Where a genuinely technical capability exists, frame it as something they can *do*, not something they can *avoid*: "Can I connect WhatsMark.io to my own software?" — not "Do I need a developer?"

---

## 2. Brand and plan naming — non-negotiable

- The product is **WhatsMark.io**. Never "WhatsMark" in body prose, headings, descriptions, captions, or `docs.json`'s `name`.
  - `keywords:` frontmatter is the **one exception** — keep the bare "WhatsMark" there too, because people search both spellings and dropping it costs search traffic.
- The free plan is the **Free Forever plan**. Not "the Free plan", not "our free tier".

**Banned claims.** These have been explicitly ruled out. Do not reintroduce them, in any wording:

- ❌ Anything about the free plan **not expiring** — "never expires", "doesn't expire", "not a trial", "no countdown". Say "Free Forever" and stop.
- ❌ **Specific limit counts or prices** on any page other than `getting-started/free-vs-paid.mdx`. No "100 contacts", no "2 channels", no "10,000 AI tokens", no "₹799 / $9".
  - Write "connected numbers, contacts, chatbot flows and a monthly allowance of AI usage" and link to Free vs. paid.
  - **Why:** prices and limits change. One stale number on a marketing-facing page destroys trust and nobody remembers to update six pages.
- ❌ **Time promises of any kind** — "in about 15 minutes", "set up in under an hour", per-step minute breakdowns. Setup time isn't ours to promise: template approval is Meta's, and it varies. A number here either pressures the reader into a commitment they didn't ask for, or disappoints them when reality runs longer. Describe the *steps*, never the clock.

`getting-started/free-vs-paid.mdx` is the **single source of truth** for every number. Every page that wants to mention a limit links there instead.

---

## 3. Be honest about paid features

If a feature needs a paid plan, say so **at the point you mention it** — a short italic note is enough:

```mdx
<Card title="Bring your team in" icon="users" href="/core-setup/team-and-roles">
  Invite colleagues by email and decide what each of them can see and do. *(Team invites need a paid plan.)*
</Card>
```

Currently paid-only: team invites (more than one seat), Shopify, WooCommerce, Google Sheets/Calendar nodes, webhook forwarding, REST API, canned replies, custom domain (a separate add-on even on Professional).

**Why:** a new user who hits an unexpected paywall halfway through onboarding loses more trust than the signup was worth. Verify current gating against `getting-started/free-vs-paid.mdx` before claiming anything is free.

---

## 4. Page structure that works

The pattern proven on the quick start, in order:

1. **Hook** — two or three sentences: what it does, in the customer's words. No preamble, no "Welcome to".
2. **What you get** — a `CardGroup cols={2}` of 4–6 outcomes, one line each. Outcomes, not feature names: "One inbox for the team", not "Shared Team Inbox module".
3. **Before you start** — only genuine prerequisites, as an `AccordionGroup`. This is the single highest-value section: it prevents the most common support ticket.
4. **The steps** — a `<Steps>` block, 5 or 6 maximum. Each step ends with a `Details: [Page](/link)` line rather than swelling.
5. **A `<Check>` recap** — the whole path in one line.
6. **Keep going** — cards for the natural next actions.
7. **Common questions** — an `AccordionGroup` answering the objections that stop a purchase: does it cost anything, will I lose my number, why can't I send this, how long does approval take, can I migrate, do I need a developer.
8. **Where to next** — 4 cards.

**Link out, don't inline.** A quick start that explains everything is not quick. One line plus a link beats three paragraphs.

**Use the real UI labels, in bold, exactly as they appear in the app**: **Create Contact**, **Import Contacts**, **Sync Templates**, **Initiate chat**, **Connect Channel**, **Create Campaign**, **Template Campaign**. Status values in caps as the app shows them: **PENDING**, **APPROVED**, **Active**. Getting these wrong is the fastest way to look like you've never used the product.

---

## 5. Mintlify mechanics

### The root page rule — read this before any navigation work

**`/` always renders `index.mdx`.** A `redirects` entry with `"source": "/"` **does not fire** while `index.mdx` exists — it is silently ignored. This has already cost one round of rework.

So, to make a given page open first, there is exactly one reliable option: **put that page's content in `index.mdx`.** If you want the old URL to keep working, delete the old file and redirect it *to* the root:

```json
"redirects": [
  { "source": "/quickstart", "destination": "/" }
]
```

Always verify with `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/` — do not assume.

### Icons — Lucide, not Font Awesome

`docs.json` sets `"icons": { "library": "lucide" }`. Font Awesome names render as **nothing at all**, silently. Common mistakes:

| Wrong (Font Awesome) | Right (Lucide) |
|---|---|
| `bolt` | `zap` |
| `comments` | `messages-square` |
| `bullhorn` | `megaphone` |
| `robot` | `bot` |
| `cart-shopping` | `shopping-cart` |
| `wand-magic-sparkles` | `wand-sparkles` |
| `mobile` | `smartphone` |
| `file-lines` | `file-text` |
| `address-book` | `contact` |
| `paper-plane` | `send` |
| `scale-balanced` | `scale` |

Lucide has **no WhatsApp brand icon** — use `message-circle`.

### Components

`<Steps>/<Step>`, `<CardGroup cols={2}>/<Card>`, `<AccordionGroup>/<Accordion>`, `<Note>`, `<Tip>`, `<Warning>`, `<Info>`, `<Check>`. `<Card>` takes `icon`, `href`, `horizontal`. `<Step>` and `<Accordion>` take `icon`.

### Screenshots

Use the shared `BrowserFrame` snippet, never a bare image:

```mdx
import { BrowserFrame } from '/snippets/browser-frame.jsx';

<BrowserFrame
  src="/core-setup/channels/img/channels-connect.png"
  url="whatsmark.io/channels"
  alt="Describe what is actually visible in the screenshot"
  caption="One sentence on what the user should notice."
/>
```

Images live in a section-local `img/` folder (`settings/img/`, `messaging/img/`, `core-setup/channels/img/`). `alt` describes what is on screen; `caption` says why it matters.

### Frontmatter

```yaml
---
title: "Sentence case title"
description: "One sentence. Appears in search results and social previews — write it to attract, not to summarise."
icon: "lucide-name"
keywords: ["WhatsMark", "WhatsMark.io", "…"]
---
```

---

## 6. Meta rules must cite Meta

Whenever a page states a rule that comes from **Meta/WhatsApp rather than from us** — the 24-hour window, template approval, categories, pricing, messaging limits, quality rating, opt-in, verification, prohibited industries — **link to Meta's own page for it.**

Two reasons. It proves the constraint isn't ours, which is reassuring rather than annoying. And Meta changes these rules often, so the link stays right after our prose goes stale.

Phrase it as a source, not a dump — one link at the end of the section:

```mdx
<Note>
  This is a WhatsApp rule, not a WhatsMark.io one. Meta documents it in full under
  [messaging limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits).
</Note>
```

### Verified link set

Checked live in July 2026. Prefer these over anything a search result offers.

| Topic | URL |
|---|---|
| Pricing — per-message model, what's free | `https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing` |
| Pricing — customer-facing version | `https://whatsappbusiness.com/products/platform-pricing/` |
| Messaging limits and tier scaling | `https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits` |
| Templates — categories, approval, statuses | `https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview` |
| Messaging Policy — opt-in, prohibited industries | `https://whatsappbusiness.com/policy/` |

### Use the final URL, never the redirect

- `business.whatsapp.com/…` → redirects to `whatsappbusiness.com/…`
- `www.whatsapp.com/legal/commerce-policy` → redirects to `whatsappbusiness.com/policy/`

Link the destination directly. Redirect chains break silently when Meta reorganises.

### ⚠️ Verify every Meta link before shipping it — a 200 is not proof

`developers.facebook.com` serves **HTTP 200 with an empty navigation shell** for URLs that don't exist. `curl -I` cannot tell the difference. Two plausible-looking URLs were caught this way and must not be used:

- ❌ `…/whatsapp/conversation-window` — soft-404
- ❌ `…/whatsapp/coexistence` — soft-404

So never guess a Meta URL from its topic. Fetch the page and confirm it has **real body content** before it goes in a page:

```
WebFetch <url> "Does this page have real documentation content, or is it an empty
placeholder / page not found? Summarise what it actually covers."
```

If you can't confirm a page exists, state the rule without a link rather than shipping a dead one.

---

## 7. Working in a shared repo — read before editing

**Other writers work in this repo at the same time.** Work has already been lost to this. Before any editing session:

```bash
git status --porcelain          # must be clean
git fetch origin && git log --oneline HEAD..origin/master   # what is incoming?
git pull
```

Then:

- **Only touch the files your task is actually about.** Do not sweep a rename, a brand fix, or a style change across pages you weren't asked to change — even when the change is obviously correct. Another writer's uncommitted work collides with it.
- **`docs.json` is shared.** Keep your diff to the smallest possible number of lines. It is the file most likely to conflict.
- **Check `git log` on a file before rewriting it.** If someone committed to it in the last few days, say so and confirm before replacing their work.
- **Never resolve a conflict by discarding the other side.** Stash, inspect both, then decide with the user.
- If a link in a file you must not touch would break, add a **redirect** in `docs.json` rather than editing their file.

---

## 8. Verification — every page, every time

```bash
mint dev                # preview; note the port, it moves if 3000 is taken
mint broken-links       # must not add any new failures
python3 -c "import json; json.load(open('docs.json')); print('valid')"
```

Then confirm by hand:

- [ ] Zero banned words from §1; every retained term defined on first use
- [ ] "WhatsMark.io" everywhere except `keywords:`
- [ ] "Free Forever" — and no expiry claim, no specific limits or prices
- [ ] Every paid-only feature marked
- [ ] Every icon is a real Lucide name (they fail **silently** — check the rendered page, not the source)
- [ ] Every UI label matches the actual app
- [ ] `mint broken-links` shows no *new* breakage (run it once before your change to get the baseline — some failures are pre-existing and not yours)
- [ ] `git status` lists only the files your task was about

**Report the baseline separately from your own breakage.** "2 broken links, both pre-existing in someone else's API work" is useful; "2 broken links" is alarming and wrong.

---

## 9. Related skills

- **`docs-competitor-benchmark`** — before writing an onboarding, landing, or comparison page, check how AiSensy, Wati, respond.io, BotSailor and Interakt handle the same thing, and find what we can honestly claim that they can't.
- **`docs-fact-check`** — verify a claim against the product source at `/media/corbital/web_data/laravel.local/whatsmark-saas` before publishing it.
