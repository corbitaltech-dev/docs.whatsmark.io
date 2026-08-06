---
name: "docs-audit"
description: "Full-site health sweep for docs.whatsmark.io — runs the consistency, grammar, and link-integrity checks across every page, deep-reads a representative sample per section, and produces a severity-ranked report with a suggested order of work. This is the methodology behind the July 2026 audit, generalised into a repeatable process with a fixed report template and severity model. Activate for a pre-launch review, a scheduled full sweep (docs-manager runs this weekly or after any reorg), or when the user asks for a health check / audit of the docs site."
---

# Full-site documentation audit

The site-wide health check. It combines the mechanical sweeps (`docs-consistency-lint`, `docs-grammar-style`, `docs-link-integrity`) with a deep, line-by-line read of a representative sample, then reports everything in one severity-ranked document. This is not a new rulebook — every check here defers to `whatsmark-docs` for the *rule* and to the three checking skills for *how to find violations*; this skill owns the **process and the report shape**.

---

## 1. How to run it

1. **Read the governance files first**, every time — `AGENTS.md` and `.claude/skills/whatsmark-docs/SKILL.md` — even if you audited last month; rules change.
2. **Deep-read a representative sample**, not just the pages that changed recently: the flagship page (`index.mdx`), one page from each nav group, and any page flagged as high-traffic or high-risk (first-run onboarding, the primary channel-connection page, the plans page). Read these **in full**, line by line — this is where grammar errors and voice drift surface; a grep sweep alone will miss them.
3. **Run every mechanical check site-wide** — do not sample these, run them against all `~50` pages:
   - `docs-consistency-lint` (brand, banned words, plan naming, images, icons, casing, time promises)
   - `docs-link-integrity` (internal links, reorg rot, image paths, `docs.json` validity, Meta soft-404s)
   - `docs-grammar-style` on at least the deep-read sample; note which pages were *not* read line-by-line so a future pass knows what's left.
4. **Note what's already good.** An audit that only lists problems reads as harsher than the site deserves and teaches nothing about what to keep doing — always include a "keep doing this" section naming specific pages and patterns.

## 2. Severity and effort model

Rank every finding on two axes, independently — a finding can be low severity and high effort, or vice versa:

| Severity | Meaning |
|---|---|
| **High** | Breaks the reader's task right now — a 404 on click, a paywall surprise, a factual claim that's wrong. Fix before anything else ships. |
| **Medium** | Undermines trust or consistency but doesn't stop the reader — brand slips, casing drift, a grammar error, a self-contradiction on a flagship page. |
| **Low** | Internal hygiene with no reader-facing impact — misspelled asset filenames, empty boilerplate sections in a governance file. |

| Effort | Meaning |
|---|---|
| **Trivial** | A single-line fix, no judgement. |
| **Low** | A find-replace across a handful of files, still no judgement. |
| **Medium** | Requires rewriting a sentence or paragraph, but the fix is unambiguous once decided. |
| **Needs a decision** | The fix depends on a product/IA call only the user can make (e.g. which of two duplicate pages is canonical, whether to rename a folder). Never resolve these unilaterally — surface them as open questions. |

Bucket findings by theme (lettered, A/B/C…) the way the July 2026 audit did — flagship self-consistency, broken links, brand/banned-word slips, formatting, grammar, information architecture, repo hygiene — so the report reads as a punch list, not a wall of text. Reuse the same letters across audits where the theme is the same; it makes successive audits diffable against each other.

## 3. Report template

```markdown
# WhatsMark.io Documentation Audit

**Site:** docs.whatsmark.io (Mintlify)
**Date:** <date>
**Status:** <pre-launch / live / post-reorg, etc.>
**Audited against:** .claude/skills/whatsmark-docs/SKILL.md

## 1. How this audit was done
<governance files read, pages deep-read, sweeps run>

## 2. Reproduce / verify before shipping
<every grep/mint/python command used, so the dev team can rerun them>

## 3. Executive summary
<one paragraph, plus the severity × effort table of lettered buckets>

## 4. Findings
<one subsection per bucket; each finding: what, where (file:line), why it matters, fix>

## 5. What's already good (keep doing this)
<specific pages/patterns, named — this section is not optional>

## 6. Suggested order of work
<numbered, cheapest-and-highest-severity first, decisions last>

## 7. Time-promise check
<explicit pass over whatsmark-docs §2's banned time-promise rule — this has its own
section because it's easy to miss in a general grep pass and has shipped before>
```

## 4. What goes in "Findings" vs. what gets escalated

Every finding needs a **fix**, but not every fix is something to apply unilaterally. Mirror the split `docs-manager` uses:

- **Mechanical** (banned words, bare `WhatsMark`, `Free plan` naming, bare images, icon typos, dead old-path links) — state the fix directly; these are find-replace, no judgement.
- **Judgement** (jargon-heavy pages needing a voice rewrite, Title Case vs sentence-case as a site convention, which of two duplicate pages is canonical, whether to rename a folder) — state the **options**, not a single prescribed answer, and mark it "needs a decision" in the effort column. An audit that quietly picks the answer for an IA question removes the user's ability to disagree.

## 5. Common finding categories, from real audits (a checklist, not an exhaustive list)

- Flagship self-consistency — a number or claim on the highest-traffic page contradicts itself (e.g. a step count in a heading vs. its own recap).
- Broken internal links from a reorg — see `docs-link-integrity` §2; this category has repeatedly turned out wider than the first grep suggested.
- Brand / banned-word / plan-naming slips — see `docs-consistency-lint` §1–3.
- Formatting inconsistency — bare images, icon typos, heading casing — see `docs-consistency-lint` §4, §6–8.
- Grammar and typos — see `docs-grammar-style`.
- Information architecture — a folder/nav-group name that tells the reader nothing, or two pages documenting the same feature that will drift apart. These are always "needs a decision."
- Repo hygiene — placeholder governance files, files that must not be published leaking into the build, misspelled asset filenames.
- Time-promise leakage — see `whatsmark-docs` §2; check separately, it's easy to under-grep.

## 6. After the audit ships

The report is not the fix. Follow-up is `docs-manager`'s job: it takes this report, auto-fixes what's mechanical on a scoped branch, and routes the rest (voice rewrites to `docs-writer`, IA decisions to the user, unverified facts to `docs-fact-check`). Don't let an audit sit unactioned — a repeat audit that finds the same mechanical issues again means the routing step didn't happen.
