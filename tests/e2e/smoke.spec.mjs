import {test, expect} from '@playwright/test';

async function waitForLatestUi(page) {
  const initErrors=[];
  page.on('pageerror', error=>initErrors.push(error.message));
  page.on('requestfailed', request=>{
    const url=new URL(request.url());
    if(['script','stylesheet'].includes(request.resourceType())&&url.origin===new URL(page.url()).origin)
      initErrors.push(url.pathname+': '+request.failure()?.errorText);
  });
  const attempts = Number(process.env.PREVIEW_READY_ATTEMPTS || 18);
  const delayMs = Number(process.env.PREVIEW_READY_DELAY_MS || 5000);
  for (let i = 0; i < attempts; i += 1) {
    await page.goto('/', {waitUntil:'domcontentloaded'});
    if (await page.locator('#commandCenter').count()) {
      // HTML can arrive before its module graph; inspect the initialized UI.
      try { await expect(page.locator('#mainWorkspace')).toHaveAttribute('aria-busy', /^(true|false)$/, {timeout:15_000}); }
      catch(error){throw Error(error.message+'\nInitialization errors: '+JSON.stringify(initErrors));}
      return;
    }
    if (i < attempts - 1) await page.waitForTimeout(delayMs);
  }
  throw new Error('Latest Decision Command Center did not appear before preview readiness timeout');
}

test('Decision Command Center renders safely without page-level overflow', async ({page}, testInfo) => {
  test.setTimeout(120_000);
  const browserErrors=[];
  page.on('pageerror', err => browserErrors.push(`pageerror: ${err.message}`));
  page.on('console', msg => {
    if (msg.type() === 'error' && /(?:Uncaught|ReferenceError|TypeError|SyntaxError)/i.test(msg.text())) browserErrors.push(`console: ${msg.text()}`);
  });

  await waitForLatestUi(page);
  await expect(page.locator('#commandCenter')).toBeVisible();
  await expect(page.locator('#viewTitle')).toHaveText('Review supplier evidence');
  await expect(page.locator('.workflow-tabs')).toBeVisible();
  await expect(page.locator('.incident-scope')).toHaveText('Controlled simulation');
  await expect(page.locator('#capacityInput')).not.toBeVisible();
  await expect(page.locator('#evidenceFacts')).not.toBeVisible();
  await expect(page.locator('#decisionBanner')).not.toBeVisible();
  await expect(page.locator('#analyzeBtn')).toBeInViewport();
  await expect(page.locator('#capacityInput')).toHaveValue('');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, `page-level horizontal overflow at ${testInfo.project.name}`).toBeLessThanOrEqual(1);
  expect(browserErrors).toEqual([]);
});

test('language can switch to Bangla and persists on reload', async ({page}) => {
  await waitForLatestUi(page);
  const selector = page.locator('#languageSelect');
  await expect(selector).toBeVisible();
  await selector.selectOption('bn');
  await expect(page.locator('html')).toHaveAttribute('lang','bn');
  await expect(page.getByText('বিঘ্ন বিশ্লেষণ করুন',{exact:true})).toBeVisible();
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('html')).toHaveAttribute('lang','bn');
  await expect(selector).toHaveValue('bn');
  await selector.selectOption('en');
  await expect(page.getByRole('button',{name:'Analyze disruption',exact:true})).toBeVisible();
});

test('opening has one primary action and later steps retain guidance', async ({page}) => {
  await waitForLatestUi(page);
  await expect(page.locator('#statusHelperText')).not.toBeVisible();
  await expect(page.locator('#analyzeBtn')).toBeVisible();
  await page.locator('.workflow-tabs a[href="#approvalSummary"]').click();await expect(page.locator('#approvalStatus')).toBeVisible();
  const href=await page.locator('#nextStepBtn').getAttribute('href');
  expect(href).toMatch(/^#/);
});

test('preview clearly identifies UI-only mode and uses current realistic scenario', async ({page}) => {
  await waitForLatestUi(page);
  await expect(page.locator('#disruptionInput')).toContainText('vehicle breakdown and warehouse congestion');
  const host = new URL(page.url()).hostname;
  if (host.endsWith('onrender.com')) {
    await expect(page.locator('#setupWarningTitle')).toHaveText(/Preview environment/i);
    await expect(page.locator('#persistenceStatus')).toContainText(/Preview mode/i);
    await expect(page.locator('#setupWarning a')).toHaveAttribute('href','https://varelyx-ai-builder-cup.web.app');
  }
});
