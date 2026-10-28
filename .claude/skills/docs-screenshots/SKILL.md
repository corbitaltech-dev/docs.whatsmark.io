---
name: docs-screenshots
description: Take real, consistent screenshots of a web app for a documentation site — log in with a test account, set the screen up the way the page describes it, capture just the part that matters at a fixed 1905px window width, blur private details (emails, account names, IDs, keys), and wrap the image in the same Mac-style window frame every time. Includes ready-made Playwright and Pillow scripts. Activate when a docs page needs a new or retaken screenshot, when a page has a hidden SCREENSHOT placeholder, when the app's UI changed and images look outdated, or when the user says "take a screenshot", "capture this screen", or "replace this image".
---

# Docs screenshots

Every screenshot in the docs must be a **real capture of the running app**, taken the same way every time, so the images look like one set. This skill gives you the scripts and the rules.

```
scripts/
  lib.js          log in, tidy the page, capture a region, record what to blur
  load-env.js     reads .env.screenshots (URL, login, window size, private text)
  explore.js      prints a page's buttons/labels/fields and saves a full-window shot
  example-shot.js template for one capture script
  finish.py       blur + Mac-style frame → the final PNG in the docs repo
config.example.env  every setting, explained
```

`SKILL_DIR` below means this skill's folder (for example `.claude/skills/docs-screenshots`).

---

## 1. One-time setup

1. **Settings file.** Copy `config.example.env` to **`.env.screenshots` in the docs repo root**, and fill in `SHOT_BASE_URL`, `SHOT_EMAIL` and `SHOT_PASSWORD`. The person you work for gives you these.
   - Add `.env.screenshots` to `.gitignore` before anything else. It holds a password.
   - Never write the password into a page, a commit, a script you save in the repo, or your memory files. If you need it again in a later session, read it from `.env.screenshots` or ask.
   - Put the test account's email and workspace name in `SHOT_BLUR_TEXTS` so they are blurred in every image.
2. **Tools.**
   - Node 18+ and Playwright: `npm i -D playwright && npx playwright install chromium` in a scratch folder, **or** set `SHOT_PLAYWRIGHT` to an existing `node_modules/playwright` (the app's own repo often has one).
   - Python 3 with Pillow: `python3 -c "import PIL"` must work (`pip install pillow` if not).
3. **Check it works:**
   ```bash
   cd <scratch folder> && node SKILL_DIR/scripts/explore.js / shots/home.png
   ```
   It should log in and print the dashboard's buttons. Open `shots/home.png` and look at it.

Work in a **scratch folder outside the docs repo** for raw captures and your capture scripts. Only the finished PNG goes into the repo.

---

## 2. The look — never change these

These values make new images match the old ones. Don't "improve" them per image.

| Setting | Value |
|---|---|
| Browser window | **1905 × 859**, scale 1 (`SHOT_WIDTH` / `SHOT_HEIGHT`). Use a taller window only when one shot needs more height; never change the width |
| Theme | Light |
| Frame | 24px margin on `#fcfcfc` with a soft shadow; 34px `#f6f6f6` title bar with red/yellow/green dots at x = 13.5 / 31 / 48.5; 1px `#e3e3e6` line under the bar; 12px rounded corners (all built into `finish.py`) |
| Blur | Gaussian, radius 6, 3px padding (built into `finish.py`) |
| Format | PNG, saved in the section's `img/` folder next to the page, with a short kebab-case name that says what is shown (`contact-defaults-team-groups.png`) |

**What to crop:**

- **A page:** the main area only, from the breadcrumb/title down to the last content. **Leave out the left menu** (`captureContent`). Only include the menu when the image is *about* the menu.
- **A card, dialog or side panel:** just that element plus about 10px around it (`captureElement`).
- **A settings panel in a builder:** the panel from its header down to the last field, plus about 60px.
- **A canvas or diagram:** the nodes plus about 40–70px of empty canvas around them.

Before you start, open two or three existing images in the same section and match their crop.

---

## 3. Workflow for each image

1. **Know what the image must show.** Read the page text around the image or placeholder (`{/* SCREENSHOT: path — what it must show */}`). The image must show exactly what the text describes: same labels, same selected options, same example values.
2. **Explore first.** Run `node SKILL_DIR/scripts/explore.js /the/route shots/x.png` and **look at the PNG**. Use the printed labels and placeholders to find elements. Prefer `getByRole`, `getByText(…, {exact:true})` and `getByPlaceholder` over CSS classes.
3. **Write a small capture script** from `example-shot.js`, in your scratch folder. One script per image (or a few related images). Steps:
   - go to the page and wait for `networkidle`, plus a short pause for animations;
   - set the screen up: open the dialog, pick the options, type realistic example values;
   - capture with `captureContent`, `captureElement` or `captureClip`, passing any extra private text in `blurTexts`.
4. **Run it**, then finish the image straight into the docs repo:
   ```bash
   node my-shot.js shots/raw-name.png
   python3 -I SKILL_DIR/scripts/finish.py shots/raw-name.png <docs-repo>/section/img/name.png
   ```
5. **Look at the final PNG yourself, every time.** Check: right screen, nothing cut off, no toast or tooltip, no focus ring or blinking cursor, every private value blurred, nothing important blurred by mistake.
6. **Put it on the page** as a plain markdown image with real alt text that says what is actually visible:
   ```mdx
   ![The Global Defaults card with Assign To set to Round Robin and the Sales team picked in Team groups](/settings/img/contact-defaults-team-groups.png)
   ```
   - Replace the `{/* SCREENSHOT: … */}` placeholder with it, if there is one.
   - If the image differs from what the text says (an example value, a label), fix the text so they match.
   - Don't put `{` or `}` in alt text (MDX treats them as code and the page breaks). Write "the first variable", not `{{1}}`.
7. **Check the page:** run the docs site's link check (for Mintlify: `mint broken-links`) and open the page in the local preview.

---

## 4. Privacy — blur, don't skip

Blur anything that identifies a real person, account or secret:

- the test account's email and name, workspace names;
- connected account names and handles (Page names, `@username`s, phone numbers);
- account/page/app IDs, API keys, tokens, webhook URLs, secrets;
- profile photos of real people (`blurSelectors: ['img.avatar']` or a measured box).

How:

- Put values that show up everywhere in `SHOT_BLUR_TEXTS`.
- Pass page-specific values in `blurTexts`. Matching finds the text **inside longer text too**, so a name in a sentence is blurred, and only the text itself is blurred, not the whole table cell.
- Private text outside the captured region is ignored automatically.

Don't blur things readers need to read: labels, buttons, example values you typed, team or label names you created.

---

## 5. Sample data — ask first, clean up after

- **Filling a form to show values is fine. Clicking Save, Publish, Send or Delete is not**, unless the person you work for agreed to it. Capture the filled form, then leave without saving.
- If a screen only makes sense with data (a list, a flow, a chat), **ask before creating it**. Use obviously sample values ("Sales hand-off", "Priya Sharma", "priya@example.com").
- Never do anything that reaches real people or outside services: sending messages, publishing to a connected social account, charging a card. If the screen needs that, ask.
- **Clean up afterwards**: delete what you created and check it's gone. Tell the person exactly what you created and removed.

---

## 6. Scope

- Only change the images you were asked to change. If you notice other outdated images, **list them and ask** instead of retaking them.
- When asked "which images need changing?", check every image on the affected pages: open each one and compare it with the current app.
- If a screen is locked (the plan doesn't include the feature, or the role can't see it), say so and ask. Don't change plan settings or permissions yourself.

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| Login times out | Check `SHOT_AFTER_LOGIN` matches the URL after login, and the selectors in `.env.screenshots`. Look at the failure screenshot `run()` saves in `shots/`. |
| The app returns an empty reply or won't load | The local web server may be down. For a Laravel app you can run `php artisan serve --host=127.0.0.1 --port=8010`, set `SHOT_BASE_URL=http://<app host>:8010` and `SHOT_HOST_MAP=MAP <app host> 127.0.0.1`. Apps that pick the workspace from the hostname keep working. Stop the server when done. |
| A button can't be clicked ("element is not enabled") | A required field is still empty, e.g. a channel picker. Fill it first. |
| A palette item isn't a `button` | Use `getByText('Name', {exact:true}).first()`. Drag-and-drop works with `locator.dragTo(canvas, { targetPosition })`. |
| Placeholder text not found | The app may use `…` (one character) instead of `...`. Match with a regex: `getByPlaceholder(/Type and press Enter/)`. |
| Blank or half-loaded areas | Wait longer after `goto`, or wait for a specific text before capturing. |
| Toasts, focus rings or tooltips in the image | `lib.js` hides toasts and blurs the focused field, but close menus with `Escape` and move the mouse away before capturing. |
| The docs preview shows a broken image | It loaded a half-written file. `finish.py` saves through a temp file; reload the preview. |
| A link to a heading with an apostrophe doesn't jump | Some sites keep the curly `’` in heading IDs. Reword the heading without an apostrophe. |
| Layout looks squeezed compared with the person's screen | The window is too narrow. Keep `SHOT_WIDTH=1905`. |

---

## 8. When you finish

Tell the person:

- each image you made or replaced, the page it's on, and what it shows;
- any text you changed so it matches the image;
- the sample data you created and confirmed deleted, and anything you set but did not save;
- anything you couldn't capture and why (locked feature, missing data, server down).

Don't commit or push until they ask.
