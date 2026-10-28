// Shared helpers for docs screenshots: log in, capture a region, record private text to blur.
//
// Settings come from environment variables, usually loaded from `.env.screenshots`
// by `load-env.js`. See `config.example.env` for every setting.
require('./load-env');
const fs = require('fs');
const path = require('path');

function loadPlaywright() {
  const tries = [process.env.SHOT_PLAYWRIGHT, 'playwright', path.join(process.cwd(), 'node_modules/playwright')].filter(Boolean);
  for (const p of tries) {
    try { return require(p); } catch (e) { /* try the next one */ }
  }
  throw new Error('Playwright not found. Run `npm i -D playwright && npx playwright install chromium`, or set SHOT_PLAYWRIGHT to its folder.');
}
const { chromium } = loadPlaywright();

const env = (k, d) => (process.env[k] !== undefined && process.env[k] !== '' ? process.env[k] : d);
const BASE = env('SHOT_BASE_URL', '').replace(/\/$/, '');
const WIDTH = Number(env('SHOT_WIDTH', 1905));
const HEIGHT = Number(env('SHOT_HEIGHT', 859));
if (!BASE) throw new Error('SHOT_BASE_URL is not set. Copy config.example.env to .env.screenshots and fill it in.');

// Open a logged-in page. `height` lets one shot use a taller window than the default.
async function open(height = HEIGHT) {
  const args = [];
  if (env('SHOT_HOST_MAP')) args.push(`--host-resolver-rules=${env('SHOT_HOST_MAP')}`);
  const browser = await chromium.launch({ args });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: env('SHOT_IGNORE_HTTPS_ERRORS', '1') === '1',
    colorScheme: env('SHOT_COLOR_SCHEME', 'light'),
  });
  const page = await context.newPage();
  if (env('SHOT_EMAIL')) await login(page);
  return { browser, page };
}

async function login(page) {
  await page.goto(BASE + env('SHOT_LOGIN_PATH', '/login'), { waitUntil: 'networkidle' });
  await page.fill(env('SHOT_EMAIL_SELECTOR', 'input[type=email], input[name=email]'), env('SHOT_EMAIL'));
  await page.fill(env('SHOT_PASSWORD_SELECTOR', 'input[type=password]'), env('SHOT_PASSWORD', ''));
  const after = new RegExp(env('SHOT_AFTER_LOGIN', 'dashboard'));
  await Promise.all([
    page.waitForURL(after, { timeout: Number(env('SHOT_LOGIN_TIMEOUT', 60000)) }),
    page.click(env('SHOT_SUBMIT_SELECTOR', 'button[type=submit]')),
  ]);
}

// Hide things that should never be in a docs image: toasts, focus rings, the text cursor.
async function tidy(page) {
  await page.addStyleTag({
    content: [
      '[data-sonner-toaster],[data-sonner-toast],.toast,.Toastify,[role=status][aria-live]{display:none!important}',
      '*{caret-color:transparent!important}',
    ].join(''),
  }).catch(() => {});
  await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
  await page.mouse.move(WIDTH - 5, 5);
  await page.waitForTimeout(300);
}

// Rectangles of the text itself (not its whole box) for every match of each string.
// Matches inside longer text too, so a name inside a sentence is still found.
async function textBoxes(page, texts) {
  if (!texts.length) return [];
  return page.evaluate((texts) => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      for (const t of texts) {
        let i = n.textContent.indexOf(t);
        while (i >= 0) {
          const r = document.createRange();
          r.setStart(n, i);
          r.setEnd(n, i + t.length);
          for (const b of r.getClientRects()) if (b.width > 0) out.push({ x: b.x, y: b.y, width: b.width, height: b.height });
          i = n.textContent.indexOf(t, i + 1);
        }
      }
    }
    return out;
  }, texts);
}

// Boxes of elements (by CSS selector) to blur, such as avatars or QR codes.
async function selectorBoxes(page, selectors) {
  const out = [];
  for (const s of selectors) for (const el of await page.locator(s).all()) {
    const b = await el.boundingBox();
    if (b && b.width > 0) out.push(b);
  }
  return out;
}

// Screenshot one region. Writes `<out>` plus `<out>.blur.json` with the areas to blur,
// relative to the region. Private values default to SHOT_BLUR_TEXTS (comma-separated).
async function captureClip(page, out, clip, { blurTexts = [], blurSelectors = [] } = {}) {
  await tidy(page);
  const always = env('SHOT_BLUR_TEXTS', '').split(',').map((s) => s.trim()).filter(Boolean);
  const boxes = [...(await textBoxes(page, [...always, ...blurTexts])), ...(await selectorBoxes(page, blurSelectors))];
  const rel = boxes
    .map((b) => [b.x - clip.x, b.y - clip.y, b.width, b.height])
    .filter(([x, y, w, h]) => x + w > 0 && y + h > 0 && x < clip.width && y < clip.height);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out + '.blur.json', JSON.stringify(rel));
  await page.screenshot({ path: out, clip: roundClip(clip) });
  console.log('captured', out, `${Math.round(clip.width)}x${Math.round(clip.height)}`, `${rel.length} area(s) to blur`);
}

// Screenshot a whole element (a card, a dialog, a side panel) with a small margin.
async function captureElement(page, out, locator, { pad = 10, maxBottom, ...opts } = {}) {
  await tidy(page);
  const b = await locator.boundingBox();
  if (!b) throw new Error('captureElement: element is not visible');
  const vp = page.viewportSize();
  const x = Math.max(0, b.x - pad);
  const y = Math.max(0, b.y - pad);
  const bottom = Math.min(maxBottom || vp.height, b.y + b.height + pad);
  return captureClip(page, out, { x, y, width: Math.min(vp.width - x, b.width + 2 * pad), height: bottom - y }, opts);
}

// Screenshot the page's main area, leaving out the left menu: from the top of `startSelector`
// (usually the breadcrumb) down to the lowest visible content, full width minus the menu.
async function captureContent(page, out, { startSelector = 'nav[aria-label="breadcrumb"], [aria-label="breadcrumb"], main h1', menuWidth, ...opts } = {}) {
  await tidy(page);
  const left = menuWidth ?? Number(env('SHOT_MENU_WIDTH', 264));
  const vp = page.viewportSize();
  const start = await page.locator(startSelector).first().boundingBox();
  const top = Math.max(0, (start ? start.y : 0) - 10);
  const bottom = await page.evaluate((left) => {
    let b = 0;
    for (const el of document.querySelectorAll('main *, [role=main] *')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.left >= left && getComputedStyle(el).visibility !== 'hidden') b = Math.max(b, r.bottom);
    }
    return b;
  }, left);
  const height = Math.min((bottom || vp.height) + 18, vp.height) - top;
  return captureClip(page, out, { x: left, y: top, width: vp.width - left - 16, height }, opts);
}

function roundClip(c) {
  return { x: Math.round(c.x), y: Math.round(c.y), width: Math.round(c.width), height: Math.round(c.height) };
}

// Run a capture script body with the browser always closed, even on errors.
async function run(fn, height) {
  const { browser, page } = await open(height);
  try {
    await fn(page);
  } catch (e) {
    const dump = path.resolve(env('SHOT_OUT_DIR', 'shots'), 'error-' + Date.now() + '.png');
    fs.mkdirSync(path.dirname(dump), { recursive: true });
    await page.screenshot({ path: dump }).catch(() => {});
    console.error(e.message, '\nfull-page screenshot of the failure:', dump);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

module.exports = { open, login, run, tidy, textBoxes, captureClip, captureElement, captureContent, BASE, WIDTH, HEIGHT };
