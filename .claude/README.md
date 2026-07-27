# WhatsMark.io docs — the `.claude/` layer

This folder holds the agents and skills that write, draft, and monitor the
customer-facing documentation at `docs.whatsmark.io`. It's organised as two
layers on top of one shared rulebook.

Built from the findings of the July 2026 audit (`skills/docs-audit/reports/2026-07-26-audit.md`)
— every monitoring check here exists because it caught a real problem on the live site.

---

## Layout

```
.claude/
├── agents/
│   ├── docs-writer.md         — general-purpose author: write, rewrite, review, fact-check any page
│   ├── docs-drafter.md        — turns short bullet notes + screenshots into a finished page
│   ├── docs-reviewer.md       — QA gate: pass/fail punch list on a changed page or PR
│   └── docs-manager.md        — MASTER agent: runs the full audit, auto-fixes what's safe, routes the rest
├── skills/
│   ├── whatsmark-docs/SKILL.md            — the rulebook: voice, brand, banned words, structure, Mintlify mechanics
│   ├── docs-fact-check/SKILL.md           — verify a claim against the product source
│   ├── docs-competitor-benchmark/SKILL.md — benchmark against AiSensy, Wati, respond.io, BotSailor, Interakt
│   ├── docs-from-notes/
│   │   ├── SKILL.md                — method: short notes + screenshots → full on-brand page
│   │   └── INTAKE-TEMPLATE.md      — fill one per feature; keeps notes structured
│   ├── docs-consistency-lint/SKILL.md     — brand, Free Forever, banned words, images, icons, headings, time promises
│   ├── docs-grammar-style/SKILL.md        — proofreading pass (grounded in the real error patterns)
│   ├── docs-link-integrity/SKILL.md       — links, anchors, image paths, redirects, Meta soft-404s
│   └── docs-audit/
│       ├── SKILL.md                — full-site health sweep + report template + severity model
│       └── reports/                — dated audit reports land here
```

## How the two layers fit together

| Layer | Files | Job |
| --- | --- | --- |
| **Rulebook** | `whatsmark-docs` | The authoritative rules: voice, banned words, brand, mechanics, Meta citations, shared-repo safety, checklist |
| **Writing** | `docs-writer` + `docs-fact-check`, `docs-competitor-benchmark` | Author and fact-check pages from scratch |
| **Drafting from notes** | `docs-drafter` + `docs-from-notes` (+ `INTAKE-TEMPLATE.md`) | Turn short bullets + screenshots into a finished page |
| **Monitoring / QA** | `docs-manager` + `docs-reviewer` + the 4 monitoring skills | Keep the whole site healthy; gate every change |

Nothing is duplicated — every new file points back to `whatsmark-docs` as the single source of truth, the same way `docs-writer` does.

## How to use it

- **Draft a page from your notes:** fill `docs-from-notes/INTAKE-TEMPLATE.md` for the feature, attach the screenshots, and hand both to `docs-drafter`. It reads the images, verifies the labels against the product, and returns a finished on-brand page for your review.
- **Author a page from scratch:** ask `docs-writer`.
- **Before you publish / on a PR:** run `docs-reviewer` on the changed files — get a pass/fail punch list. Nothing ships red.
- **Weekly, or after any reorg:** run `docs-manager` — it runs a full `docs-audit` sweep, auto-fixes the safe items on a scoped branch, and reports the rest.
- **One-off:** invoke any skill directly, e.g. "run docs-consistency-lint on `settings/`".

Every monitoring agent has `Bash`, so the grep / `mint broken-links` / `curl` / `WebFetch` checks in the skills run for real, not by inference.

## The one rule that makes this safe

**Auto-fix only the unambiguous, mechanical things; escalate everything with a judgement, a fact, or a voice rewrite.** The split is defined once, in `docs-manager` ("Decision model"), and every skill defers to it. And the shared-repo rule from `whatsmark-docs` §7 always holds: touch only the files a task owns, keep `docs.json` diffs tiny, never overwrite another writer's recent work.

## How the checks map to the audit findings

| Audit finding | Caught going forward by |
| --- | --- |
| Broken `/automation/chatbot-flows`, `/automation/appointments` (reorg rot — confirmed in 9+ files, not the 2 first sampled) | `docs-link-integrity` §2 (post-reorg stale-path sweep) |
| "tenant", bare "WhatsMark", "Free plan" | `docs-consistency-lint` §1–3 |
| Jargon page (`whatsapp.mdx`: WABA, Embedded Signup, webhook) | `docs-consistency-lint` §3 → escalate to `docs-writer` |
| Grammar errors (E1–E7) | `docs-grammar-style` |
| Bare images vs `<BrowserFrame>`; Title vs sentence case; UI-label casing | `docs-consistency-lint` §4, §6–8 |
| Setup-time promise in `register.mdx` | `docs-consistency-lint` §5 |
| `ai-and-more/` taxonomy; activity-log duplication | `docs-audit` §5 (information architecture — still needs your decision) |
| Unverified Meta error-codes link | `docs-link-integrity` §6 |
| Empty `AGENTS.md` boilerplate | fixed 2026-07-27 — `AGENTS.md` now points at `whatsmark-docs` |
| `/scratchpad` not explicitly excluded | fixed 2026-07-27 — added to `.mintignore` |

Findings A–F (the content fixes themselves — broken links, brand slips, grammar, IA decisions) are **still open**. This layer exists so `docs-manager` can action the mechanical ones and route the rest on the next run, rather than the audit being a one-time document nobody follows up on.

---

*Uses British spelling and the house voice, matching the rest of `.claude/`.*
