---
name: "docs-consistency-lint"
description: "Site-wide sweep for brand, banned-word, plan-naming, formatting, and time-promise drift on docs.whatsmark.io — bare 'WhatsMark' outside keywords, 'tenant' instead of 'workspace', 'Free plan' instead of 'Free Forever', developer jargon (WABA, webhook, embedded signup) on customer pages, bare markdown images that should be <BrowserFrame>, Lucide icon typos, Title Case vs sentence case drift, inconsistent UI-label casing, and setup-time promises. Grounded in the July 2026 site audit, where every check here caught a real, repeated instance. Activate for a pre-launch sweep, a scheduled docs-manager run, or 'lint this page/section for brand and formatting issues'."
---

# Consistency lint: brand, banned words, formatting, time promises

A mechanical pass over the rules in `whatsmark-docs` §1, §2, §5, §6. This skill exists because these specific slips were found **repeated across many files**, not once — grep the whole site, don't sample. Every section below is a reproducible check; run the command, don't eyeball it.

Read `whatsmark-docs` first if you haven't — this skill only *finds* violations of its rules, it doesn't restate the reasoning behind them.

---

## §1 — Banned words in body prose

```bash
grep -rn --include="*.mdx" -w "tenant" .
grep -rn --include="*.mdx" -wE "provisioning|instantiate" .
grep -rn --include="*.mdx" -wE "leverage|utilise|utilize|seamless|robust" .
grep -rn --include="*.mdx" -E "session message|24-hour customer service window" .
```

`quota`, `entitlement`, `endpoint`, `payload`, `webhook` are banned **outside the Api tab** — scope the grep to guide pages only:

```bash
grep -rln --include="*.mdx" -wE "quota|entitlement|endpoint|payload|webhook" . | grep -v "^overview.mdx" | grep -v "^api/"
```

Fix: swap for the house term (`tenant` → `workspace`, etc. — full table in `whatsmark-docs` §1). This is a pure find-replace; no judgement needed unless the surrounding sentence was built around the banned word (see §3 jargon drift below for that case).

## §2 — Bare "WhatsMark" instead of "WhatsMark.io"

```bash
grep -rnE --include="*.mdx" "WhatsMark[^.]" . | grep -v "keywords"
```

Every hit outside a `keywords:` array should read **WhatsMark.io**. Watch for the regex matching a sentence end (`WhatsMark.` with a period, which is correct) — read the actual match, don't blind-replace.

## §3 — Plan naming and jargon drift

**"Free plan" instead of "Free Forever":**

```bash
grep -rnE --include="*.mdx" "Free[- ]plan" .
```

Mechanical fix: `Free plan` / `Free-plan` → `Free Forever plan` / `Free Forever workspaces`.

**Jargon drift (judgement — escalate, don't auto-fix):** developer-y terms on a customer page where the surrounding sentence needs rewriting, not just a word swap — unqualified `WABA`/`WhatsApp Business Account`, `embedded signup` as a bare noun, `webhook subscription`. Find candidates:

```bash
grep -rniE --include="*.mdx" "\bWABA\b|WhatsApp Business Account|embedded signup|webhook subscription" . | grep -v "^overview.mdx"
```

A hit here is a **plain-language pass**, not a find-replace — reword the sentence (`whatsmark-docs` §1, the WABA/embedded-signup/webhook row) and hand it to `docs-writer` rather than auto-fixing. Exception: literal field labels (**WABA ID**, **Access Token**, **App Secret**) are correct *inside a Manual-connection step*, where they're the real UI text — don't flag those.

## §4 — Lucide icon names

Font Awesome names render as nothing, silently — a grep can't see a blank icon, so check both the source and the rendered page.

```bash
grep -rn --include="*.mdx" -E 'icon="(bolt|comments|bullhorn|robot|cart-shopping|wand-magic-sparkles|mobile|file-lines|address-book|paper-plane|scale-balanced)"' .
grep -rn "docs.json" -e '"icon"' | grep -E 'bolt|comments|bullhorn|robot|cart-shopping'
```

Full known-bad → correct table is in `whatsmark-docs` §5. After any fix, load the page in `mint dev` and **look** — a correct-looking name can still be wrong if it's not real Lucide, and the source alone won't tell you.

## §5 — Setup-time promises

Banned everywhere except a factual, non-promissory note (`whatsmark-docs` §2).

```bash
grep -rniE --include="*.mdx" "in (a |just )?(a couple of|[0-9]+) (minutes|seconds|hours)|set up in (under|less than)|takes only|ready in" .
```

Triage each hit:
- **Our own setup-time claim** ("ready to send in a couple of minutes") → delete the timing, keep the rest of the sentence.
- **Meta's approval time** ("approval usually takes a few minutes") → soften to the house hedge, verbatim: *"Usually a few minutes. Occasionally longer."* Don't invent a different hedge per page — match existing wording site-wide.
- **A factual, non-promise duration** ("DNS changes can take a few minutes to propagate") → leave as-is; this isn't a promise about our product.

## §6 — Bare images instead of `<BrowserFrame>`

```bash
grep -rn --include="*.mdx" "!\[" .
```

Every hit should be wrapped in the shared snippet (`whatsmark-docs` §5, Screenshots). Converting one is mechanical *if* the file already has enough context to write `alt`/`caption` — describe what's visible (`alt`) and why it matters (`caption`); don't invent detail the screenshot doesn't show. If you can't tell what the image shows, escalate rather than writing a vague caption.

## §7 — UI-label casing consistency

The same button or toggle referred to with two different capitalisations in different places on the same page, or across pages, e.g. "Enable live booking" vs "Enable Live Booking". This is not Title-Case-vs-sentence-case (§8) — it's the *same label* rendered two ways.

```bash
# spot-check a specific label across the whole site once you notice a mismatch
grep -rn --include="*.mdx" -i "enable live booking" .
```

There's no single grep that finds all instances of this site-wide — it surfaces during a close read of a page (`docs-reviewer`) or a `docs-fact-check` pass. When found: the **real UI label** (confirmed via `docs-fact-check`) wins; make every reference match it exactly, everywhere.

## §8 — Title Case vs sentence case

The house rule (`whatsmark-docs` §4) is sentence case for titles and headings. Find the drift:

```bash
# frontmatter titles that look Title Case (naive heuristic — multiple capitalised words)
grep -rnE --include="*.mdx" '^title: "([A-Z][a-z]*\s+){2,}' .
# in-page headings, same heuristic
grep -rnE --include="*.mdx" '^#{2,3} ([A-Z][a-z]*\s+){2,}[A-Z]' .
```

This heuristic over-matches (proper nouns, "WhatsApp Templates" as a legitimate product noun phrase) — **read every hit**, don't bulk-replace. This is a **judgement call, escalate to the user**: it's a site-wide convention decision (do we keep the guide's rule or standardise on the Title Case that's already dominant?), not a per-page fix. Once decided, applying it is mechanical.

---

## Reporting

Report as a flat list grouped by section number, each line `file:line — current text — proposed fix`. Separate **mechanical** hits (§1, §2, §3 plan-naming, §4, §5, §6) from **judgement** hits (§3 jargon drift, §7, §8) — this split is what `docs-manager` uses to decide auto-fix vs escalate. Don't silently skip a section because it returned zero in your sample; state "zero hits" explicitly so the reader knows it was checked, not skipped.
