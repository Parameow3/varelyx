import {test, expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

async function exportEvidence(page, testInfo, name) {
  const pending = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await pending;
  const path = testInfo.outputPath(name + '.json');
  await download.saveAs(path);
  return JSON.parse(await readFile(path, 'utf8'));
}

async function enableCiAppCheck(page) {
  const token = process.env.FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (token) await page.addInitScript(value => { self.FIREBASE_APPCHECK_DEBUG_TOKEN = value; }, token);
}

test('real judge flow: Firebase + Gemini + HOLD/PASS/BLOCK + approval + reload restore', async ({page}, testInfo) => {
  test.skip(process.env.LIVE_JUDGE_FLOW !== '1', 'Opt in only for an authorized synthetic session against real Firebase/Gemini');
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
  await expect(page.locator('#approveBtn')).toBeDisabled();

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
  await expect(page.locator('#approveBtn')).toBeDisabled();

  await page.locator('[data-proof="balanced"]').click();
  await expect(page.locator('#proof')).toContainText('PASS', {timeout:20_000});

  await page.locator('#approveBtn').click();await page.locator('#dialogConfirm').click();
  await expect(persistence).toContainText('FIREBASE SAVE VERIFIED', {timeout:20_000});
  await expect(page.locator('#actions')).toContainText('APPROVED_SANDBOX');
  await expect(page.locator('#approveBtn')).toBeDisabled();
  await expect(page.locator('#proofHistory li .status')).toHaveText(['PASS', 'BLOCK', 'PASS']);
  const saved = await exportEvidence(page, testInfo, 'live-saved-evidence');
  expect(saved.state.phase).toBe('APPROVED_SANDBOX');
  expect(saved.state.liveVerified).toBe(true);
  expect(saved.state.evidenceReviewed).toBe(true);
  expect(saved.state.supplierCapacity).toBe(120);
  expect(saved.state.proof.status).toBe('PASS');
  expect(saved.state.receipts[saved.state.proof.receipt_hash]).toBeTruthy();
  expect(saved.state.actions.length).toBeGreaterThan(0);
  expect(saved.state.actions.every(action => action.status === 'APPROVED_SANDBOX')).toBe(true);
  expect(saved.state.audit.filter(event => event.event === 'APPROVAL_PREPARED')).toHaveLength(1);
  expect(saved.backendReadBack.verified).toBe(true);
  if (process.env.EVIDENCE_CAPTURE === '1') {
    await page.screenshot({
      path: testInfo.outputPath('varelyx-desktop-1440-save-verified.png'),
      fullPage: true
    });
  }

  await page.reload({waitUntil:'domcontentloaded'});
  await expect(persistence).toContainText('Restored directly from Firebase', {timeout:30_000});
  await expect(page.locator('#actions')).toContainText('APPROVED_SANDBOX');
  await expect(page.locator('#capacityInput')).toHaveValue('120');
  await expect(page.locator('#proofHistory li .status')).toHaveText(['PASS', 'BLOCK', 'PASS']);
  await expect(page.locator('#approveBtn')).toBeDisabled();
  const restored = await exportEvidence(page, testInfo, 'live-restored-evidence');
  expect(restored.state).toEqual(saved.state);
  expect(restored.backendReadBack.restoredFromServer).toBe(true);
  expect(restored.backendReadBack.revision).toBe(saved.backendReadBack.revision);
  if (process.env.EVIDENCE_CAPTURE === '1') {
    await page.screenshot({path:testInfo.outputPath('varelyx-desktop-1440-restored.png'), fullPage:true});
  }
});
