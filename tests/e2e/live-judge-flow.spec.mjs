import {test, expect} from '@playwright/test';
import {readFile, writeFile} from 'node:fs/promises';
import {DEMO_SIGNALS} from '../../public/demo-signals.mjs';

const locale = process.env.LIVE_DEMO_LOCALE || 'en';
const currency = {en:'USD',bn:'BDT',km:'KHR'}[locale];
const verifiedLabel = {en:'Verified',bn:'যাচাইকৃত',km:'បានផ្ទៀងផ្ទាត់'}[locale];
const savedLabel = {en:'Saved',bn:'সংরক্ষিত',km:'បានរក្សាទុក'}[locale];
const savedStatus = {en:'FIREBASE SAVE VERIFIED',bn:'Firebase সংরক্ষণ যাচাইকৃত',km:'បានផ្ទៀងផ្ទាត់ការរក្សាទុក Firebase'}[locale];
const restoredStatus = {en:'Restored directly from Firebase',bn:'সরাসরি Firebase থেকে পুনরুদ্ধার হয়েছে',km:'បានស្ដារទិន្នន័យដោយផ្ទាល់ពី Firebase'}[locale];

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

test(`real judge flow [${locale} UI]: Firebase + Gemini + HOLD/PASS/BLOCK + approval + reload restore`, async ({page}, testInfo) => {
  test.skip(process.env.LIVE_JUDGE_FLOW !== '1', 'Opt in only for an authorized synthetic session against real Firebase/Gemini');
  test.skip(testInfo.project.name !== 'desktop-1440', 'Run the real mutating judge flow once; responsive coverage is handled separately');
  test.setTimeout(180_000);
  const pageErrors = [];
  const network = [];
  page.on('requestfailed', request => {
    const host = new URL(request.url()).hostname;
    if (host.endsWith('.googleapis.com') || host.endsWith('.firebasedatabase.app'))
      network.push({host,method:request.method(),error:request.failure()?.errorText});
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  await enableCiAppCheck(page);

  try {
    await page.goto('/', {waitUntil:'domcontentloaded'});

    const persistence = page.locator('#persistenceStatus');
    await expect(persistence).toContainText(/Firebase server read verified|Restored directly from Firebase/, {timeout:30_000});

    expect(DEMO_SIGNALS[locale]).toBeTruthy();
    await page.locator('#languageSelect').selectOption(locale);
    await page.locator('#currencySelect').selectOption(currency);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    const syntheticSignal = DEMO_SIGNALS[locale];
    // Exercise the actual localized sample shown to users; do not substitute an English signal.
    await expect(page.locator('#disruptionInput')).toHaveValue(syntheticSignal);
    await page.locator('#analyzeBtn').click();

    await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED', {timeout:60_000});
    await expect(page.locator('#decisionBanner')).toContainText('HOLD');
    await expect(page.locator('#approveBtn')).toBeDisabled();

    await page.locator('#capacityInput').fill('120');
    await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
    await expect(page.locator('#scenarioWorkspace')).toBeVisible({timeout:20_000});
    await expect(page.locator('#planBrief strong').first()).toContainText('120');
    if (process.env.EVIDENCE_CAPTURE === '1') await page.screenshot({path:testInfo.outputPath('localized-plan.png'),fullPage:true});

    await page.locator('[data-proof="balanced"]').click();
    await expect(page.locator('#proof')).toContainText('PASS', {timeout:20_000});
    await expect(page.locator('#reviewBrief strong').nth(0)).toHaveText('8');
    await expect(page.locator('#reviewBrief strong').nth(1)).toHaveText('0');
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
    await expect(page.locator('#reviewBrief strong').nth(0)).toHaveText('8');
    await expect(page.locator('#reviewBrief strong').nth(1)).toHaveText('0');

    await page.locator('#approveBtn').click();await page.locator('#dialogConfirm').click();
    // Wait for this approval's read-back, not the preceding proof save's status.
    await expect(page.locator('#actionWorkspace')).toBeVisible({timeout:45_000});
    await expect(page.locator('#actions')).toContainText(savedLabel, {timeout:45_000});
    await expect(persistence).toContainText(savedStatus);
    await expect(page.locator('#approveBtn')).toBeDisabled();
    await expect(page.locator('#proofHistory li .status')).toHaveText(['PASS', 'BLOCK', 'PASS']);
    const saved = await exportEvidence(page, testInfo, 'live-saved-evidence');
    expect(saved.state.phase).toBe('APPROVED_SANDBOX');
    expect(saved.state.liveVerified).toBe(true);
    expect(saved.state.evidenceReviewed).toBe(true);
    expect(saved.state.supplierCapacity).toBe(120);
    expect(saved.state.proof.status).toBe('PASS');
    expect(saved.state.receipts[saved.state.proof.receipt_hash]).toBeTruthy();
    expect(saved.state.source).toBe(syntheticSignal);
    expect(saved.state.extraction.delay_hours).toBe(48);
    expect(saved.state.extraction.affected_routes).toBe(2);
    expect(saved.state.extraction.capacity_confirmed).toBeNull();
    expect(saved.state.actions).toHaveLength(5);
    expect(saved.state.actions.every(action => action.status === 'APPROVED_SANDBOX')).toBe(true);
    expect(saved.state.audit.filter(event => event.event === 'APPROVAL_PREPARED')).toHaveLength(1);
    expect(saved.backendReadBack.verified).toBe(true);
    await expect(page.locator('#savedBrief strong').nth(0)).toHaveText('5');
    await expect(page.locator('#savedBrief strong').nth(1)).toHaveText(verifiedLabel);
    await page.locator('a[href="#auditWorkspace"]').last().click();
    await expect(page.locator('#auditWorkspace')).toBeVisible();
    await expect(page.locator('#auditBrief strong').nth(0)).toHaveText(String(saved.state.audit.length));
    await expect(page.locator('#auditBrief strong').nth(1)).toHaveText('1');
    await expect(page.locator('#auditBrief strong').nth(2)).toHaveText('PASS');
    if (process.env.EVIDENCE_CAPTURE === '1') await page.screenshot({path:testInfo.outputPath('localized-audit.png'),fullPage:true});
    await page.locator('#auditWorkspace a[href="#actionWorkspace"]').click();
    if (process.env.EVIDENCE_CAPTURE === '1') {
      await page.screenshot({
        path: testInfo.outputPath('varelyx-desktop-1440-save-verified.png'),
        fullPage: true
      });
    }

    await page.reload({waitUntil:'domcontentloaded'});
    await expect(persistence).toContainText(restoredStatus, {timeout:30_000});
    await expect(page.locator('html')).toHaveAttribute('lang',locale);
    await expect(page.locator('#languageSelect')).toHaveValue(locale);
    await expect(page.locator('#currencySelect')).toHaveValue(currency);
    await expect(page.locator('#actions')).toContainText(savedLabel);
    await expect(page.locator('#capacityInput')).toHaveValue('120');
    await expect(page.locator('#proofHistory li .status')).toHaveText(['PASS', 'BLOCK', 'PASS']);
    await expect(page.locator('#approveBtn')).toBeDisabled();
    const restored = await exportEvidence(page, testInfo, 'live-restored-evidence');
    expect(restored.state).toEqual(saved.state);
    expect(restored.backendReadBack.restoredFromServer).toBe(true);
    expect(restored.backendReadBack.revision).toBe(saved.backendReadBack.revision);
    // Opening the root link should resume the completed decision, not an empty Evidence screen.
    await page.goto('/');
    await expect(persistence).toContainText(restoredStatus, {timeout:30_000});
    await expect(page.locator('#actionWorkspace')).toBeVisible();
    await expect(page.locator('#journeyDescription')).toContainText('5');
    await expect(page.locator('#journeyNewDecision')).toBeVisible();
    const resumed = await exportEvidence(page, testInfo, 'live-root-resumed-evidence');
    expect(resumed.state).toEqual(saved.state);
    expect(resumed.backendReadBack.revision).toBe(saved.backendReadBack.revision);
    expect(pageErrors).toEqual([]);
    if (process.env.EVIDENCE_CAPTURE === '1') {
      await page.screenshot({path:testInfo.outputPath('varelyx-desktop-1440-restored.png'), fullPage:true});
    }
  } finally {
    await writeFile(testInfo.outputPath('network-failures.json'),JSON.stringify(network,null,2));
  }
});
