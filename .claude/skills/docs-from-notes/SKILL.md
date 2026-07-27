---
name: "docs-from-notes"
description: "Turns a short, point-by-point feature description plus screenshots into a complete, on-brand docs.whatsmark.io page. Reads the images to see the real UI (labels, buttons, states), reads the author's terse bullets and instructions, then expands them into a full MDX page that follows the house voice and the proven page structure — hook, what you get, before you start, steps, check, keep going, common questions, where next — with each screenshot placed as a BrowserFrame with written alt and caption, paid features marked, Meta rules cited, and every fact flagged for verification. Expansion means wording, flow, and structure only: it never invents a label, limit, or behaviour that isn't in the notes, the image, or the verified product. Activate when the user provides feature notes and/or screenshots and wants them written up, says 'draft a page from these bullets', or hands over a filled intake template."
---

# Docs from notes + screenshots

The author gives you a little; you produce a complete page. The input is short bullets and one or more screenshots. The output is a finished MDX page that reads like the rest of the site. **Your job is to expand wording, flow, and structure — never to invent facts.** A label, limit, or behaviour that isn't in the notes, visible in the image, or confirmed in the product does not go on the page.

**Read `whatsmark-docs` first** — it sets the voice, banned words, brand and plan naming, Mintlify mechanics, Meta-citation rules, and the page structure you build to. This skill is the intake-to-draft method on top of it. Verify facts with `docs-fact-check`; check the finished page with `docs-reviewer`.

---

## What you receive

Ideally the author fills the intake template (`INTAKE-TEMPLATE.md`, next to this skill). If they send loose bullets instead, ask them to map to those fields — or infer the mapping and confirm. Either way you need, per feature:

- the feature name **as the app shows it**,
- one line on what it does, in customer words,
- the steps in order (with the exact button labels),
- the screenshots, each with a one-line "this shows…" and which step it belongs to,
- the plan gate, prerequisites, and gotchas (if any).

## Step 1 — Read the screenshots

For each image, look and record: which screen it is, the exact visible labels and button text, any status values (`Active`, `PENDING`), and what a reader should notice. This is where the real UI labels come from.

⚠️ **Vision can misread text.** A label you read off an image is a *candidate*, not a fact. Confirm every button name, menu path, and status string against the product with `docs-fact-check` before it ships. If the notes and the image disagree on a label, the product source decides.

## Step 2 — Verify the facts

Before drafting, resolve anything the page will assert:

- **Labels & nav paths** — grep the product source (`docs-fact-check`).
- **Plan gate** — is this really on Free Forever, or Professional / an add-on? Never guess a gate; a wrong one sends a reader into a paywall mid-task.
- **Limits & prices** — these belong only on `getting-started/free-vs-paid.mdx`; link there, don't restate a number.
- **Meta rules** — if a constraint (24-hour window, template approval, messaging limits) is Meta's, cite Meta's page for it.

Anything you can't verify: draft around it and **flag it to the author**, or leave a `<Note>` caveat. Never soften an unverified claim into vague wording to make it feel safe.

## Step 3 — Choose the structure

Map the notes to the proven pattern (`whatsmark-docs` §4). **Use only the sections that fit** — a small feature page is often just hook → steps → what's next. Don't force all eight.

| Section | Build it from | Skip when |
| --- | --- | --- |
| **Hook** (2–3 sentences) | the one-line "what it does" | never — always lead with the outcome |
| **What you get** (`CardGroup`) | multiple distinct outcomes | a single-purpose feature |
| **Before you start** (`AccordionGroup`) | the prerequisites bullet | there are no real prerequisites |
| **Steps** (`<Steps>`, 5–6 max) | the ordered step bullets | the feature has no procedure |
| **`<Check>` recap** | the whole path in one line | a reference/settings page |
| **Keep going** (cards) | "related pages" | nothing natural to point to |
| **Common questions** (`AccordionGroup`) | the gotchas / "why can't I…" | no known objections |
| **What's next** (cards) | the related pages, forward only | — |

Momentum rule: "Keep going" and "What's next" point to pages the reader **hasn't** seen yet, never backwards (`whatsmark-docs` §1a).

## Step 4 — Write the prose

Expand each bullet into plain, short sentences. Outcomes before mechanics; benefit before button name. Use the exact UI labels in **bold**. Define `template` and `channel` on first use. Mark every paid-only feature right where you mention it — `*(Needs a paid plan.)*`. Do not add "no coding required" style reassurance (§1 trap). Do not over-explain; if something's obvious, leave it out.

## Step 5 — Place the screenshots

- Copy each image into the **section-local `img/` folder** (`settings/img/`, `messaging/img/`, `core-setup/channels/img/`), with a descriptive name (`canned-reply-form.png`, not `image3.png`).
- Wrap every screenshot in `<BrowserFrame>` — never a bare `![]()`:
  ```mdx
  import { BrowserFrame } from '/snippets/browser-frame.jsx';

  <BrowserFrame
    src="/core-setup/img/canned-reply-form.png"
    url="whatsmark.io/canned-replies"
    alt="Describe exactly what is on screen"
    caption="One sentence on what the reader should notice."
  />
  ```
- `alt` = what's visible; `caption` = why it matters. One image per meaningful step. Don't front-load images at the top (looks like an ad); interleave them beside the step they illustrate.

## Step 6 — Frontmatter

```yaml
---
title: "Sentence case title"
description: "One sentence, written to attract, not summarise — it shows in search and social. Plain text, no **bold**."
icon: "lucide-name"     # Lucide only; they fail silently. message-circle for WhatsApp.
keywords: ["WhatsMark", "WhatsMark.io", "…"]   # bare WhatsMark allowed here only
---
```

## Step 7 — Gaps: ask, don't invent

Ask a focused question **only** when a genuine gap blocks the page — an unknown prerequisite, an unclear plan gate, a step whose outcome you can't tell from the notes or the image. Otherwise draft, and state any assumption inline so the author can correct it. One question at a time; deliver everything that isn't blocked first.

## Step 8 — Review before it's "done"

- Show the author the **rendered copy**, not a diff or a file path — they review words, not code.
- Run `docs-reviewer` (lint + grammar + links) on the new page.
- `mint dev`, `mint broken-links`, and **confirm icons rendered on the page** (Lucide fails silently).

---

## Worked example (compact)

**Author's input:**
> Feature: Canned Replies. What: save replies you send a lot, insert with a shortcut. Plan: paid only. Steps: 1) Settings → Canned Replies → **Add Canned Reply** 2) give it a **Title** and **Message** 3) in a chat type `/` and pick it. Screenshot: `canned-reply-form.png` = the add form (step 2). Gotcha: shortcuts are per-workspace, everyone on the team sees them.

**Draft output (excerpt):**
```mdx
---
title: "Canned replies"
description: "Save the answers you send every day and drop them into a chat with a shortcut."
icon: "message-square-quote"
keywords: ["WhatsMark", "WhatsMark.io", "canned replies", "quick replies", "shortcuts", "live chat"]
---

import { BrowserFrame } from '/snippets/browser-frame.jsx';

Save the replies you type again and again, and drop them into any chat in one click. *(Canned replies need a paid plan.)*

## Add a canned reply

<Steps>
  <Step title="Open canned replies">
    Go to **Settings → Canned Replies** and click **Add Canned Reply**.
  </Step>
  <Step title="Write it">
    Give it a **Title** you'll recognise and the **Message** you want to send.

    <BrowserFrame
      src="/core-setup/img/canned-reply-form.png"
      url="whatsmark.io/canned-replies"
      alt="The Add Canned Reply form with a Title field and a Message field"
      caption="The Title is only for you; the Message is what the customer receives."
    />
  </Step>
  <Step title="Use it in a chat">
    In any conversation, type `/` and pick the reply to drop it into the message box.
  </Step>
</Steps>

<Note>
  Canned replies are shared across your workspace — everyone on your team can use the ones you save.
</Note>
```

Notice: the paid gate is marked at first mention, labels are bold and exact, the image sits beside its step with a written alt and caption, nothing beyond the author's notes was invented, and the shortcut behaviour ("per-workspace, team sees them") became the `<Note>`. Before shipping, the labels **Add Canned Reply / Title / Message** get confirmed via `docs-fact-check`.
