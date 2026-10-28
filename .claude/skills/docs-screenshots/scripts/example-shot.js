// Template for one screenshot. Copy it to your scratch folder, change the steps, run:
//
//   node my-shot.js shots/raw-my-shot.png
//   python3 -I finish.py shots/raw-my-shot.png docs/section/img/my-shot.png
//
// Keep each script small: open the page, set it up the way the docs describe it,
// capture one region. Fill forms to show values, but do not click Save unless the
// person you work for agreed to creating sample data.
const { run, captureClip, captureElement, captureContent, BASE } = require('./lib');

const OUT = process.argv[2] || 'shots/raw-example.png';

run(async (page) => {
  await page.goto(BASE + '/settings/contacts', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1) A whole page area, without the left menu:
  // await captureContent(page, OUT);

  // 2) One card, dialog or side panel:
  const card = page.getByText('Global Defaults', { exact: true }).first().locator('xpath=ancestor::*[@data-slot="card"][1]');
  await captureElement(page, OUT, card, { blurTexts: [] });

  // 3) An exact region you measured yourself:
  // const box = await page.locator('[role=dialog]').last().boundingBox();
  // await captureClip(page, OUT, { x: box.x, y: box.y, width: box.width, height: 420 }, { blurTexts: ['Acme Ltd'] });
}, 1100); // window height for this shot; the width is always SHOT_WIDTH
