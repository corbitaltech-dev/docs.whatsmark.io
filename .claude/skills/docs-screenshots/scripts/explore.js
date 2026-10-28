// Look at a page before writing a capture script: prints its buttons, tabs, form labels,
// inputs and headings, and saves a full-window screenshot so you can see the layout.
//
//   node explore.js /settings/contacts [shots/explore.png]
const { run, BASE } = require('./lib');

const route = process.argv[2] || '/';
const out = process.argv[3] || 'shots/explore.png';

run(async (page) => {
  const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const clean = (a) => a.map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  console.log('status', res && res.status(), 'url', page.url());
  console.log('headings', JSON.stringify(clean(await page.locator('h1, h2, h3').allTextContents())));
  console.log('buttons', JSON.stringify(clean(await page.getByRole('button').allTextContents())));
  console.log('tabs', JSON.stringify(clean(await page.getByRole('tab').allTextContents())));
  console.log('labels', JSON.stringify(clean(await page.locator('label').allTextContents())));
  console.log('placeholders', JSON.stringify(await page.locator('input[placeholder], textarea[placeholder]').evaluateAll((els) => els.map((e) => e.placeholder))));
  console.log('comboboxes', JSON.stringify(clean(await page.getByRole('combobox').allTextContents())));
  await page.screenshot({ path: out });
  console.log('saved', out, '— open it to see the layout');
});
