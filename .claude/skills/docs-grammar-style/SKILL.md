---
name: "docs-grammar-style"
description: "Proofreading pass for docs.whatsmark.io — grammar, missing/wrong verbs, singular-plural mismatches, subject-verb agreement, and broken-sentence checks, grounded in the real error patterns found in the July 2026 site audit (roughly one to two errors per longer page). Activate on any new or rewritten page before it ships, on a full-site proofreading sweep, or when the user asks to check a page for typos or grammar."
---

# Grammar and style proofreading

A line-by-line proofread, not a lint. The other skills catch mechanical brand/link/format drift; this one catches sentences that are simply wrong — missing verbs, wrong tense, subject-verb mismatches, singular/plural slips. British spelling throughout, matching the rest of `.claude/`.

The July 2026 audit sampled seven pages and found seven concrete errors — about one per longer page. Treat that as the base rate for the ~40 pages not yet read line-by-line: **a page that reads clean on skim still needs a slow read**, not just a search-replace.

---

## What to check, line by line

- **Every sentence has a verb**, and it's the right one. The classic failure mode: a bullet gets expanded into a sentence and the verb gets dropped or left in the wrong form. *"When a customer fill form and submits it, their answers are saved, and a card in the chat."* is missing a verb entirely in its last clause and has a subject-verb mismatch in the first (*fill* → *fills*).
- **Subject-verb agreement**, especially after "you" clauses that drift into third person mid-sentence, and after inserted clauses that change the apparent subject.
- **Singular/plural consistency within one sentence.** *"Select one or more option."* (should be *options*). *"Select one option from a few options."* — reads oddly because "option… options" collide; rephrase rather than just pluralising ("Select one option from a list.").
- **Capitalisation of ordinary verbs mid-sentence** — a common slip when a UI label's capitalisation bleeds into the surrounding prose: *"You **Select** one of two types…"* should be lowercase *select*; only the actual bolded UI label keeps its real-app capitalisation.
- **Singular/plural + link text on a shared term.** *"to add **a [Merge Fields]**"* mixes a singular article with a plural noun and links using the wrong case of the term; fix both the grammar and the link text together (`a [merge field]`).
- **Dangling or garbled clauses at the end of a sentence** — often where a page was edited and a clause got half-removed. Read the whole sentence aloud (mentally); if it doesn't parse, it's not a style nit, it's broken.

## Method

1. Read the page start to finish, at prose speed — not a `grep` pass. Grammar errors don't share a common substring; they only show up on a real read.
2. For every fix, quote the **current text**, the **fix**, and a one-line reason if it's not obvious (agreement, missing verb, singular/plural).
3. Don't rewrite voice or restructure while proofreading — that's `docs-writer`'s job. Fix the sentence that's broken; leave a correct-but-plain sentence alone even if you'd phrase it differently.
4. If a sentence is ambiguous about what it's trying to say (not just grammatically broken), flag it rather than guessing the intended meaning — a confident wrong fix is worse than a flagged sentence.

## Known site-wide patterns (don't re-derive, but re-check — this is not a permanent exemption list)

These exact errors were found and fixed once already; the point of listing them is to recognise the *pattern*, since the same mistake tends to recur elsewhere on the site, not to skip these specific files on the assumption they're already clean forever:

- Form-related copy: verb dropped after "customer" as the subject ("customer fill form").
- Field-description copy (checkboxes/radio/select-style fields): singular/plural collisions ("option… options").
- Any sentence built around a UI label: capitalisation of the label bleeding into a nearby verb.
- Descriptions / SEO frontmatter fields: bold markdown left in from a body-prose draft — `description:` and `keywords:` are plain text, no `**bold**`, no markdown at all.

## Reporting

One table per page: `location — current text — fix`. State the total error count and separate "sample read" pages (deep-read, exhaustive) from pages only grep-checked, so `docs-manager` knows which pages still need a full read.
