import {test, expect} from '@playwright/test';

async function enableCiAppCheck(page) {
  const token = process.env.FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (token) await page.addInitScript(value => { self.FIREBASE_APPCHECK_DEBUG_TOKEN = value; }, token);
}

test('real judge flow: Firebase + Gemini + HOLD/PASS/BLOCK + approval + reload restore', async ({page}, testInfo) => {
  test.skip(process.env.LIVE_JUDGE_FLOW !== '1', 'Run only against the official Firebase deployment');
  test.skip(testInfo.project.name !== 'desktop-1440', 'Run the real mutating judge flow once; responsive coverage is handled separately');
  test.setTimeout(180_000);
  await enableCiAppCheck(page);

  await page.goto('/', {waitUntil:'domcontentloaded'});

  const persistence = page.locator('#persistenceStatus');
  await expect(persistence).toContainText(/Firebase server read verified|Restored directly from Firebase/, {timeout:30_000});

  const syntheticSignal = 'Synthetic competition QA: Supplier B delivery is 48 hours late. 2 routes affected. Thursday capacity is not confirmed.';
  await page.locator('#disruptionInput').fill(syntheticSignal);
  await page.locator('#analyzeBtn').click();

  await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED', {timeout:60_000});
  await expect(page.locator('#decisionBanner')).toContainText('HOLD');

  await page.locator('#capacityInput').fill('120');
  await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
  await expect(page.locator('#decisionBanner')).toContainText('DECISION READY', {timeout:20_000});

  await page.locator('[data-proof="balanced"]').click();
  await expect(page.locator('#proof')).toContainText('PASS', {timeout:20_000});
  if (process.env.EVIDENCE_CAPTURE === '1') {
    await page.screenshot({
      path: testInfo.outputPath('varelyx-desktop-1440-pass.png'),
      fullPage: true
    });
  }

  await page.locator('[data-proof="unverified-aggressive"]').click();
  await expect(page.locator('#proof')).toContainText('BLOCK', {timeout:20_000});

  await page.locator('[data-proof="balanced"]').click();
  await expect(page.locator('#proof')).toContainText('PASS', {timeout:20_000});

  await page.locator('#approveBtn').click();await page.locator('#dialogConfirm').click();
  await expect(persistence).toContainText('FIREBASE SAVE VERIFIED', {timeout:20_000});
  await expect(page.locator('#actions')).toContainText('APPROVED_SANDBOX');
  if (process.env.EVIDENCE_CAPTURE === '1') {
    await page.screenshot({
      path: testInfo.outputPath('varelyx-desktop-1440-save-verified.png'),
      fullPage: true
    });
  }

  await page.reload({waitUntil:'domcontentloaded'});
  await expect(persistence).toContainText('Restored directly from Firebase', {timeout:30_000});
  await expect(page.locator('#actions')).toContainText('APPROVED_SANDBOX');
});
