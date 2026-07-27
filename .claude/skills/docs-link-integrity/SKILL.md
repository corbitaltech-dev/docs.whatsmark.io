---
name: "docs-link-integrity"
description: "Finds and fixes broken links on docs.whatsmark.io — stale internal paths left behind by a section reorg, dead image references, docs.json validity, and Meta/WhatsApp developer links that return a soft-404 (HTTP 200 with an empty shell) which curl and mint broken-links cannot detect. Activate after any folder rename or navigation reorg, before launch, on a scheduled docs-manager sweep, or when a reader reports a dead link."
---

# Link integrity: internal, image, and Meta links

Three distinct failure modes, three distinct checks. `mint broken-links` catches the first two; it cannot catch the third.

---

## §1 — Internal links (authoritative check)

```bash
mint broken-links
```

This is ground truth for internal `href`s and anchors. Run it **before and after** any change so you can separate your own breakage from what was already there — report both counts, never conflate them ("2 broken links, both pre-existing in someone else's API work" vs. just "2 broken links").

## §2 — Stale paths after a section reorg (the recurring failure mode)

A folder move or nav reorg leaves the **old path** referenced in cards, prose links, and accordions across the site — not just the one or two pages someone remembered to check. Every confirmed instance of this so far has turned out to be **wider than the first grep suggested**: treat one hit as a signal to sweep the whole repo, not as the full list.

```bash
# generic pattern: after any rename old/path -> new/path, sweep for the old path everywhere
grep -rn --include="*.mdx" "old/path/segment" .
```

Known reorg (2026-07): `automation/chatbot-flows` → `/automation/overview`, and `automation/appointments` → `/ai-and-more/appointments`. Verify current state before assuming these are fixed:

```bash
grep -rn --include="*.mdx" "automation/chatbot-flows" .
grep -rn --include="*.mdx" "automation/appointments" .
```

Cross-check every hit against the **live navigation** in `docs.json` — a link is only "stale" if the path it targets isn't actually a page anymore; confirm before bulk-replacing.

## §3 — Image references

```bash
# bare images (also owned by docs-consistency-lint §6, but confirm the src actually resolves)
grep -rn --include="*.mdx" "!\[" .
grep -rn --include="*.mdx" "src=\"" .
```

For each `src`, confirm the file exists on disk at that path — a `<BrowserFrame src="...">` with a typo'd path fails just as silently as a bad Lucide icon name; `mint broken-links` may not flag component props the same way it flags `href`. Check visually in `mint dev` when in doubt.

## §4 — Duplicate assets

```bash
# same filename living in more than one img/ folder is a sign of duplicated content, not just a duplicate file
find . -path "*/img/*" -type f -name "*.png" -exec basename {} \; | sort | uniq -d
```

A duplicate image usually means duplicate documentation (see the information-architecture side of `docs-audit` §F) — flag both, don't just dedupe the file.

## §5 — `docs.json` validity

```bash
python3 -c "import json; json.load(open('docs.json')); print('valid')"
```

Run this after *any* edit to `docs.json`, including ones made by another skill — it's the single file most likely to be mid-edit by another writer (`whatsmark-docs` §7), so a syntax error here breaks the whole site's navigation, not just one page.

## §6 — Meta/WhatsApp developer links: the soft-404 trap

`developers.facebook.com` returns **HTTP 200 with an empty navigation shell** for URLs that don't exist. `curl -I`, `curl -s -o /dev/null -w "%{http_code}"`, and `mint broken-links` all see a 200 and report success — none of them can catch this. Two plausible-looking URLs were already caught this way:

- ❌ `…/whatsapp/conversation-window` — soft-404
- ❌ `…/whatsapp/coexistence` — soft-404

**Never guess a Meta URL from its topic, and never trust a curl 200 for one.** Before any Meta link ships or is re-verified, `WebFetch` it and confirm real content:

```
WebFetch <url> "Does this page have real documentation content, or is it an empty
placeholder / page not found? Summarise what it actually covers."
```

Prefer the verified link set in `whatsmark-docs` §6 over anything discovered fresh. If a page links an **older path style** (e.g. `/docs/whatsapp/cloud-api/support/error-codes/`) where the rest of the site uses the newer `/documentation/business-messaging/whatsapp/…` structure, that's a consistency flag even if the old link still resolves — align it once you've confirmed the new URL has equivalent content.

If a Meta page can't be confirmed to exist, **state the rule without a link** rather than shipping a URL that might be dead — a missing citation is honest; a soft-404 citation looks authoritative and is silently wrong.

---

## Reporting

Group findings by section (§1–§6). For §2 (reorg rot), always report the **count of files affected**, not just the first hit found — this category has repeatedly turned out larger than the initial grep suggested. For §6, report each Meta link's verification status explicitly: confirmed-live, confirmed-dead, or not-yet-checked — never assume "not yet checked" is the same as "fine."
