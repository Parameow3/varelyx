import {test,expect} from '@playwright/test';
const signal='Supplier B delivery 48 hours late. 2 routes affected. Thursday capacity not confirmed.';
const extraction={supplier:'Supplier B',delay_hours:48,affected_routes:2,capacity_confirmed:null,summary:'Delay with capacity unknown.',confidence:0.95,evidence_quotes:{delay_hours:'48 hours late',affected_routes:'2 routes affected',capacity_confirmed:null}};

// Exercise the real UI, planner, proof and persistence adapter with isolated
// service responses. This is not evidence of live Gemini or Firebase operation.
test.beforeEach(async({page,baseURL})=>{
  test.skip(!['127.0.0.1','localhost'].includes(new URL(baseURL).hostname),'Isolated service fixtures run locally only');
  let envelope=null;
  await page.addInitScript(value=>{globalThis.__qaExtraction=value;},extraction);
  const sdk={
    'firebase-app.js':'export const initializeApp=()=>({});',
    'firebase-auth.js':'export const getAuth=()=>({authStateReady:async()=>{},currentUser:{uid:"isolated-qa",getIdToken:async()=>"fixture-token"}}); export const signInAnonymously=async()=>({});',
    'firebase-app-check.js':'export class ReCaptchaEnterpriseProvider{};export const initializeAppCheck=()=>({});export const getToken=async()=>({token:"fixture-appcheck"});',
    'firebase-ai.js':'export class GoogleAIBackend{};export const getAI=()=>({});export const getGenerativeModel=()=>({generateContent:async()=>({response:{text:()=>JSON.stringify(globalThis.__qaExtraction)}})});'
  };
  await page.route('https://www.gstatic.com/firebasejs/**',route=>route.fulfill({contentType:'text/javascript',headers:{'access-control-allow-origin':'*'},body:sdk[new URL(route.request().url()).pathname.split('/').pop()]??''}));
  await page.route('https://*.firebasedatabase.app/**',async route=>{
    const request=route.request();
    if(request.method()==='PUT') envelope=request.postDataJSON();
    await route.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-expose-headers':'etag',etag:'"'+(envelope?.revision??0)+'"'},body:JSON.stringify(envelope)});
  });
  await page.goto('/');
  await expect(page.locator('#persistenceStatus')).toContainText('Firebase server read verified');
});
async function evidence(page){await page.locator('.workflow-tabs a[href="#evidenceWorkspace"]').click();if(await page.locator('#signalPanel').getAttribute('open')===null)await page.locator('#signalPanel > summary').click();}
async function analyze(page){await evidence(page);await page.locator('#disruptionInput').fill(signal);await page.locator('#analyzeBtn').click();await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED');}

test('isolated full flow: evidence save, PASS/BLOCK/PASS, approval, reload and stale edit',async({page},testInfo)=>{
  await expect(page.locator('#capacityInput')).toHaveValue('');
  await analyze(page);
  await expect(page.locator('#capacityInput')).toBeVisible();
  await expect(page.locator('#evidenceFacts')).toBeVisible();
  await expect(page.locator('#signalPanel')).not.toHaveAttribute('open');
  await expect(page.locator('#statusHelperText')).toContainText('Evidence saved');
  await expect(page.locator('#statusHelperText')).not.toContainText('Decision saved');
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('evidence-workspace.png'),fullPage:true});
  await page.locator('#capacityInput').fill('60');await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
  await expect(page.locator('#decisionStateValue')).toHaveText('Ready for Proof Gate');
  await expect(page.locator('#planBrief')).toContainText('60 cases');
  await expect(page.locator('#planBrief')).toContainText('BDT 240,000');
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('comparison-workspace.png'),fullPage:true});
  await page.reload();await expect(page.locator('#capacityInput')).toHaveValue('60');
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toHaveText('Proof PASS');
  await expect(page.locator('#reviewBrief .brief-card').nth(0).locator('strong')).toHaveText('8');
  await expect(page.locator('#reviewBrief .brief-card').nth(1).locator('strong')).toHaveText('0');
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('approval-workspace.png'),fullPage:true});
  await page.locator('[data-proof="unverified-aggressive"]').click();await expect(page.locator('#proofState')).toHaveText('Proof BLOCK');
  await expect(page.locator('#approveBtn')).toBeDisabled();
  await expect(page.locator('#decisionBanner')).toContainText('BLOCK');
  await expect(page.locator('#reviewBrief .brief-card').nth(1).locator('strong')).not.toHaveText('0');
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toHaveText('Proof PASS');
  await page.locator('#approveBtn').click();await expect(page.locator('#dialogTitle')).toHaveText('Approve this sandbox decision?');await expect(page.locator('#dialogContent')).toContainText('BDT');await page.locator('#dialogConfirm').click();await expect(page.locator('#actions')).toContainText('Saved');
  await expect(page.locator('#actions')).toContainText('Store transfer');
  await expect(page.locator('#savedBrief .brief-card').nth(0).locator('strong')).toHaveText('5');
  await expect(page.locator('#savedBrief .brief-card').nth(1).locator('strong')).toHaveText('Verified');
  await expect(page.locator('#actions')).not.toContainText('transfer_cases');
  await expect(page.locator('#decisionStateValue')).toHaveText('Approved · sandbox actions saved');
  await expect(page.locator('#nextStepBtn')).toHaveText('View audit trail');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator('#approveBtn')).toBeDisabled();
  if(process.env.LOCAL_QA_CAPTURE==='1'){await page.screenshot({path:testInfo.outputPath('approved-sandbox.png'),fullPage:true});await page.locator('#commandCenter').screenshot({path:testInfo.outputPath('decision-desk.png')});}
  await page.reload();await expect(page.locator('#decisionStateValue')).toHaveText('Approved · sandbox actions saved');
  await expect(page.locator('#statusHelperText')).toContainText('Decision saved');
  await expect(page.locator('#proofHistory li .status')).toHaveText(['PASS','BLOCK','PASS']);
  await expect(page.locator('#nextStepBtn')).toHaveAttribute('href','#auditWorkspace');
  await page.locator('#actionWorkspace a[href="#auditWorkspace"]').click();
  await expect(page.locator('#auditBrief .brief-card').nth(0).locator('strong')).toHaveText('6');
  await expect(page.locator('#auditBrief .brief-card').nth(1).locator('strong')).toHaveText('1');
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('audit-workspace.png'),fullPage:true});
  await evidence(page);await page.locator('#disruptionInput').fill(signal+' Edited');
  await expect(page.locator('#proofState')).toHaveText('Proof stale');
  await expect(page.locator('#planBrief')).toContainText('Not confirmed');
  await expect(page.locator('#reviewBrief .brief-card').nth(1).locator('strong')).toHaveText('Stale');
  await expect(page.locator('#proofState')).not.toHaveClass(/\bok\b/);
  await expect(page.locator('#proof .proof-hero h2')).toHaveText('STALE');
  await expect(page.locator('#approveBtn')).toBeDisabled();
  await expect(page.locator('#statusHelperText')).toContainText('Signal edited');
  await expect(page.locator('#nextStepBtn')).toHaveAttribute('href','#evidenceWorkspace');
});
test('reanalysis clears old input and presents extracted capacity as an unconfirmed suggestion',async({page})=>{
  await analyze(page);await page.locator('#capacityInput').fill('60');await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
  await expect(page.locator('#decisionStateValue')).toHaveText('Ready for Proof Gate');
  await analyze(page);await expect(page.locator('#capacityInput')).toHaveValue('');
  await evidence(page);const source=signal+' Thursday capacity confirmed 120 cases.';
  await page.evaluate(value=>{globalThis.__qaExtraction={...globalThis.__qaExtraction,capacity_confirmed:120,evidence_quotes:{...globalThis.__qaExtraction.evidence_quotes,capacity_confirmed:'capacity confirmed 120 cases'}};});
  await page.locator('#disruptionInput').fill(source);await page.locator('#analyzeBtn').click();
  await expect(page.locator('#capacitySuggestion')).toContainText('Gemini suggestion: 120 cases — unconfirmed');
  await expect(page.locator('#capacitySuggestion')).toContainText('capacity confirmed 120 cases');
  await expect(page.locator('#capacityInput')).toHaveValue('');
  await expect(page.locator('#decisionStateValue')).toHaveText('Evidence review required');
  await page.locator('#capacityInput').fill('0');await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
  await expect(page.locator('#decisionStateValue')).toHaveText('Ready for Proof Gate');
  await page.reload();await expect(page.locator('#capacityInput')).toHaveValue('0');
});

test('review can be cancelled without confirming evidence and blank capacity has an inline error',async({page},testInfo)=>{
  await analyze(page);
  await page.locator('#answerBtn').click();
  await expect(page.locator('#capacityError')).toContainText('Empty input is not zero');
  await expect(page.locator('#capacityInput')).toBeFocused();
  await page.locator('#capacityInput').fill('120');
  await expect(page.locator('#capacityError')).toBeEmpty();
  await page.locator('#answerBtn').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#dialogTitle')).toHaveText('Confirm the supplier evidence');
  await expect(page.locator('#dialogContent')).toContainText('120 cases');
  await expect(page.locator('#dialogConfirm')).toBeInViewport();
  await expect(page.locator('#dialogCancel')).toBeInViewport();
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('evidence-review.png')});
  await page.getByText('Review full supplier message',{exact:true}).click();
  await expect(page.locator('.dialog-source p')).toHaveText(signal);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#decisionStateValue')).toHaveText('Evidence review required');
  await expect(page.locator('#answerBtn')).toBeFocused();
  await expect(page.locator('#capacityInput')).toHaveValue('120');
});

test('source edits lock review and proof, next-step guidance focuses reanalysis, and reset is cancellable',async({page})=>{
  await analyze(page);
  await page.locator('#capacityInput').fill('120');await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
  await expect(page.locator('[data-proof="balanced"]')).toBeEnabled();
  await evidence(page);await page.locator('#disruptionInput').fill(signal+' Changed');
  await expect(page.locator('#answerBtn')).toBeDisabled();
  await expect(page.locator('[data-proof="balanced"]')).toBeDisabled();
  await expect(page.locator('[data-proof="unverified-aggressive"]')).toBeDisabled();
  await page.locator('#nextStepBtn').click();await expect(page.locator('#disruptionInput')).toBeFocused();
  await page.locator('#resetBtn').click();await expect(page.locator('#dialogTitle')).toHaveText('Start a new decision?');
  await page.locator('#dialogCancel').click();await expect(page.locator('#disruptionInput')).toHaveValue(signal+' Changed');
  await expect(page.locator('#capacityInput')).toHaveValue('120');
});


test('an unverified save stays visible in the current-step guide and locks retries',async({page})=>{
  await page.route('https://*.firebasedatabase.app/**',async route=>{
    if(route.request().method()==='PUT')await route.fulfill({status:403,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"error":"Permission denied"}'});
    else await route.fallback();
  });
  await page.locator('#disruptionInput').fill(signal);
  await page.locator('#analyzeBtn').click();
  await expect(page.locator('#persistenceStatus')).toContainText('Firebase save NOT VERIFIED');
  await expect(page.locator('#statusHelperText')).toContainText('Firebase save NOT VERIFIED');
  await expect(page.locator('#approveBtn')).toBeDisabled();
  await expect(page.locator('#analyzeBtn')).toBeDisabled();
  await expect(page.locator('#actions')).toContainText('No saved actions yet');
  await expect(page.locator('#operationFeedback')).toBeVisible();
  await expect(page.locator('#operationFeedback')).toContainText('Reload before retrying');
});


test('light navigation collapses or opens as a drawer and routes restore with browser history',async({page})=>{
  const mobile=page.viewportSize().width<=800;
  const sidebar=page.locator('#workspaceNavigation');
  if(mobile){
    await expect(sidebar).not.toBeInViewport();
    await page.getByRole('button',{name:'Open navigation',exact:true}).click();
    await expect(sidebar).toBeInViewport();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button',{name:'Open navigation',exact:true})).toBeFocused();
    await expect(sidebar).not.toBeInViewport();
    await page.getByRole('button',{name:'Open navigation',exact:true}).click();
  }else{
    const expanded=(await sidebar.boundingBox()).width;
    await page.getByRole('button',{name:'Collapse navigation',exact:true}).click();
    await expect(page.getByRole('button',{name:'Expand navigation',exact:true})).toBeVisible();
    await expect.poll(async()=>(await sidebar.boundingBox()).width).toBeLessThan(expanded/2);
    await page.reload();
    await expect(page.getByRole('button',{name:'Expand navigation',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Expand navigation',exact:true}).click();
  }
  await sidebar.getByRole('link',{name:'Saved actions',exact:true}).click();
  await expect(page.locator('#actionWorkspace')).toBeVisible();
  await expect(page.locator('#evidenceWorkspace')).not.toBeVisible();
  await expect(page.locator('[data-view]:visible')).toHaveCount(1);
  await page.goBack();
  await expect(page.locator('#evidenceWorkspace')).toBeVisible();
  if(mobile){
    await expect(sidebar).not.toBeInViewport();
    await page.getByRole('button',{name:'Open navigation',exact:true}).click();
    await page.locator('#navigationBackdrop').click({position:{x:page.viewportSize().width-10,y:100}});
    await expect(sidebar).not.toBeInViewport();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('Khmer and currency preferences preserve the proven decision through approval and reload',async({page},testInfo)=>{
  await analyze(page);
  await page.locator('#languageSelect').selectOption('km');
  await expect(page.locator('html')).toHaveAttribute('lang','km');
  await expect(page.locator('#viewTitle')).toHaveText('ពិនិត្យទិន្នន័យអ្នកផ្គត់ផ្គង់');
  await expect(page.locator('#decisionBanner')).not.toContainText('Operator must');
  await expect(page.locator('#disruptionInput')).toHaveValue(signal);
  await page.locator('#answerBtn').click();
  await expect(page.locator('#capacityError')).toContainText('ប្រអប់ទទេមិនមែនសូន្យទេ');
  await page.locator('#capacityInput').fill('120');await page.locator('#answerBtn').click();
  await expect(page.locator('#dialogTitle')).toHaveText('បញ្ជាក់ទិន្នន័យអ្នកផ្គត់ផ្គង់');
  await page.locator('#dialogConfirm').click();
  await expect(page.locator('#scenarioWorkspace')).toBeVisible();
  await page.locator('#currencySelect').selectOption('USD');
  await expect(page.locator('#selectedCandidate')).toContainText('USD 1,506.68');
  await page.locator('.connection-details > summary').click();
  await page.locator('#bdtRate').fill('120');await page.locator('#khrRate').fill('4000');
  await page.locator('#currencyForm button[type="submit"]').click();
  await expect(page.locator('#selectedCandidate')).toContainText('USD 1,550.00');
  const popup=await page.locator('#systemStatusBar').boundingBox();expect(popup.x).toBeGreaterThanOrEqual(0);expect(popup.x+popup.width).toBeLessThanOrEqual(page.viewportSize().width+1);
  await page.locator('#bdtRate').fill('0');await page.locator('#currencyForm button[type="submit"]').click();
  await expect(page.locator('#selectedCandidate')).toContainText('USD 1,550.00');
  expect(await page.locator('#bdtRate').evaluate(el=>el.validity.valid)).toBe(false);
  await page.locator('#bdtRate').fill('120');await page.locator('.connection-details > summary').click();
  await page.locator('#currencySelect').selectOption('KHR');
  await expect(page.locator('#selectedCandidate')).toContainText('KHR 6,200,000');
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('khmer-khr-plans.png'),fullPage:true});
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toContainText('PASS');
  const receipt=await page.locator('#proofReceiptHash').textContent();
  await expect(page.locator('#approvalNumbers')).toContainText('KHR 6,200,000');
  await page.locator('#currencySelect').selectOption('USD');
  await expect(page.locator('#approvalNumbers')).toContainText('USD 1,550.00');
  await expect(page.locator('#proofReceiptHash')).toHaveText(receipt);
  await page.locator('[data-proof="unverified-aggressive"]').click();await expect(page.locator('#proofState')).toContainText('BLOCK');await expect(page.locator('#approveBtn')).toBeDisabled();
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toContainText('PASS');
  await page.locator('#approveBtn').click();await expect(page.locator('#dialogContent')).toContainText('USD 1,550.00');await page.locator('#dialogConfirm').click();
  await expect(page.locator('#actionWorkspace')).toBeVisible();await expect(page.locator('#actions')).toContainText('បានរក្សាទុក');
  const downloadPromise=page.waitForEvent('download');await page.locator('#exportBtn').click();const download=await downloadPromise;
  const exported=JSON.parse(await (await import('node:fs/promises')).readFile(await download.path(),'utf8'));
  expect(exported.state.proof.payload.plan.cash_required_bdt).toBe(186000);expect(exported.state.phase).toBe('APPROVED_SANDBOX');expect(exported.backendReadBack.verified).toBe(true);
  await page.reload();await expect(page.locator('#currencySelect')).toHaveValue('USD');await expect(page.locator('#languageSelect')).toHaveValue('km');
  await expect(page.locator('#actions')).toContainText('បានរក្សាទុក');await expect(page.locator('#proofReceiptHash')).toHaveText(receipt);
  await page.locator('#currencySelect').selectOption('KHR');
  await page.locator('.workflow-tabs a[href="#proofWorkspace"]').click();await expect(page.locator('#approvalNumbers')).toContainText('KHR 6,200,000');
  await page.locator('#languageSelect').selectOption('en');await expect(page.locator('#viewTitle')).toHaveText('Verify and approve');await expect(page.locator('#actions')).toContainText('Saved');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('localized demo samples switch before editing and preserve user or analyzed evidence',async({page})=>{
 await page.locator('#languageSelect').selectOption('km');await expect(page.locator('#disruptionInput')).toHaveValue(/យឺតប្រហែល 48 ម៉ោង/);
 await page.locator('#languageSelect').selectOption('bn');await expect(page.locator('#disruptionInput')).toHaveValue(/48 ঘণ্টা দেরি/);
 await page.locator('#languageSelect').selectOption('en');await expect(page.locator('#disruptionInput')).toHaveValue(/48 hours late/);
 await expect(page.locator('.brand-mark img')).toBeAttached();expect(await page.locator('.brand-mark img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
 await page.locator('#disruptionInput').fill(signal);await page.locator('#languageSelect').selectOption('km');await expect(page.locator('#disruptionInput')).toHaveValue(signal);
 await page.locator('#analyzeBtn').click();await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED');
 await page.reload();await expect(page.locator('#disruptionInput')).toHaveValue(signal);
 await page.locator('#languageSelect').selectOption('bn');await expect(page.locator('#disruptionInput')).toHaveValue(signal);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('context help supports hover or tap, keyboard focus, dismissal and viewport containment',async({page})=>{
 const trigger=page.locator('.source-actions [data-help]');const help=page.locator('#sourceHelp');
 await expect(page.locator('#mainWorkspace [data-operation]:visible')).toHaveCount(1);
 await expect(help).not.toBeVisible();
 if(page.viewportSize().width>800)await trigger.hover();else await trigger.tap();
 await expect(help).toBeVisible();await expect(help).toContainText('AI extracts facts');
 if(page.viewportSize().width<=800){
   // A phone can finish scrolling after the tap/focus has opened help.
   const before=await page.evaluate(()=>scrollY);
   await page.evaluate(()=>window.scrollBy({top:24,behavior:'instant'}));
   await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before);
   await expect(help).toBeVisible();await expect(trigger).toHaveAttribute('aria-expanded','true');
   await page.setViewportSize({width:360,height:780});
   await expect(help).toBeVisible();
 }
 const box=await help.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(page.viewportSize().width);expect(box.y+box.height).toBeLessThanOrEqual(page.viewportSize().height);
 await page.keyboard.press('Escape');await expect(help).not.toBeVisible();
 await page.locator('#viewTitle').click();await trigger.focus();await expect(help).toBeVisible();
 await page.keyboard.press('Escape');await expect(help).not.toBeVisible();
 await trigger.click();await expect(help).toBeVisible();await page.locator('#viewTitle').click();await expect(help).not.toBeVisible();
 await analyze(page);await expect(page.locator('#capacityInput')).toBeVisible();
 await expect(page.locator('#questionBox')).not.toBeVisible();
 await page.locator('#evidenceScout [data-help]').click();await expect(page.locator('#capacityHelp')).toBeVisible();await expect(page.locator('#questionBox')).toContainText('Thursday');
 await page.keyboard.press('Escape');await page.locator('#capacityInput').fill('120');await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
 await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proof .status.PASS')).toHaveCount(8);
 await expect(page.locator('#proofObservations')).not.toBeVisible();await page.locator('#proofOutcome > .panel-heading [data-help]').click();await expect(page.locator('#proofObservations')).toBeVisible();await expect(page.locator('#proofObservations')).toContainText('BDT 240,000');
 const proofBox=await page.locator('#proofHelp').boundingBox();expect(proofBox.x).toBeGreaterThanOrEqual(0);expect(proofBox.x+proofBox.width).toBeLessThanOrEqual(page.viewportSize().width);expect(proofBox.y+proofBox.height).toBeLessThanOrEqual(page.viewportSize().height);
 await page.keyboard.press('Escape');await expect(page.locator('#proofHelp')).not.toBeVisible();
});

// Inspect application text and accessible labels, including closed help/disclosures.
// Original supplier evidence and machine-readable extraction/receipts are deliberately excluded.
async function expectLocalizedInterface(page, findings) {
  const leftovers=await page.evaluate(()=>{
    const found=new Set();
    function inspect(value){
      const remaining=String(value).replace(/\b[a-f0-9]{12,}\b/gi,'').replace(/\b(?:Varelyx|Firebase|Gemini|Google|AI Logic|AI|SDK|App Check|Proof Gate|USD|BDT|KHR|ERP|WMS|JSON|QA|HTTP|SHA-256|PASS|BLOCK|HOLD|STALE|B)\b/g,'');
      if(/[A-Za-z]{2,}/.test(remaining))found.add(value.trim());
    }
    const excluded='[data-verbatim],textarea,input,script,style,pre,code,#geminiResult,#languageSelect';
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode())if(!walker.currentNode.parentElement.closest(excluded))inspect(walker.currentNode.textContent);
    for(const el of document.querySelectorAll('[aria-label],[title],[data-label]')){
      if(el.closest(excluded))continue;
      for(const attr of ['aria-label','title','data-label'])if(el.hasAttribute(attr))inspect(el.getAttribute(attr));
    }
    inspect(document.title);
    return [...found];
  });
  if(findings)findings.push(...leftovers);
  else expect(leftovers,'Untranslated application-owned text').toEqual([]);
}
for(const locale of ['bn','km'])test(`${locale} translates every workflow screen, help, dialogs and reload without changing evidence`,async({page},testInfo)=>{
  const findings=[];
  await page.locator('#languageSelect').selectOption(locale);
  await expectLocalizedInterface(page,findings);
  await page.evaluate(()=>{globalThis.__qaExtraction.evidence_quotes.affected_routes='2 routes';});
  await analyze(page); // An English custom source must remain verbatim even in a translated UI.
  await expect(page.locator('#estimated [data-verbatim]').last()).toHaveText('“2 routes”');
  await expect(page.locator('#disruptionInput')).toHaveValue(signal);
  await page.locator('#answerBtn').click();
  await expect(page.locator('#capacityError')).not.toBeEmpty();
  await expectLocalizedInterface(page,findings);
  await page.locator('#capacityInput').fill('120');await page.locator('#answerBtn').click();
  await expect(page.locator('#reviewDialog')).toBeVisible();
  await expect(page.locator('#dialogConfirm')).toBeInViewport();
  await expect(page.locator('#dialogCancel')).toBeInViewport();
  await expect(page.locator('.dialog-source p')).toHaveText(signal);
  await expectLocalizedInterface(page,findings);
  await page.locator('#dialogConfirm').click();
  await expect(page.locator('#scenarioWorkspace')).toBeVisible();
  await expectLocalizedInterface(page,findings);
  await page.locator('#scenarioWorkspace [data-help]').click();await expect(page.locator('#planHelp')).toBeVisible();
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath(locale+'-plan.png'),fullPage:true});
  await page.keyboard.press('Escape');
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toContainText('PASS');
  await expectLocalizedInterface(page,findings);
  await page.locator('[data-proof="unverified-aggressive"]').click();await expect(page.locator('#proofState')).toContainText('BLOCK');
  await expect(page.locator('#approveBtn')).toBeDisabled();await expectLocalizedInterface(page,findings);
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toContainText('PASS');
  await page.locator('#approveBtn').click();await expect(page.locator('#reviewDialog')).toBeVisible();await expectLocalizedInterface(page,findings);
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath(locale+'-approval-dialog.png'),fullPage:true});
  await page.locator('#dialogConfirm').click();await expect(page.locator('#actionWorkspace')).toBeVisible();
  await expect(page.locator('#actions tbody tr')).toHaveCount(5);await expectLocalizedInterface(page,findings);
  await page.locator('#actionWorkspace a[href="#auditWorkspace"]').click();await expectLocalizedInterface(page,findings);
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath(locale+'-audit.png'),fullPage:true});
  await page.reload();await expect(page.locator('#languageSelect')).toHaveValue(locale);
  await expect(page.locator('#auditBrief strong').first()).toHaveText('6');
  await expect(page.locator('#disruptionInput')).toHaveValue(signal);await expectLocalizedInterface(page,findings);
  // Repeated language switching must rebuild labels without translating stored source or quotes.
  for(const language of ['en',locale])await page.locator('#languageSelect').selectOption(language);
  await expectLocalizedInterface(page,findings);
  await page.locator('#resetBtn').click();await expect(page.locator('#reviewDialog')).toBeVisible();await expectLocalizedInterface(page,findings);await page.locator('#dialogCancel').click();
  expect([...new Set(findings)],'Untranslated application-owned text across the full flow').toEqual([]);
});

for(const locale of ['bn','km'])test(`${locale} keeps failed-save feedback localized and approval locked`,async({page})=>{
  await page.locator('#languageSelect').selectOption(locale);
  await page.route('https://*.firebasedatabase.app/**',async route=>{
    if(route.request().method()==='PUT')await route.fulfill({status:403,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"error":"Permission denied"}'});
    else await route.fallback();
  });
  await page.locator('#analyzeBtn').click();
  await expect(page.locator('#operationFeedback')).toBeVisible();
  await expect(page.locator('#persistenceStatus')).toContainText('403');
  await expect(page.locator('#analyzeBtn')).toBeDisabled();
  await expect(page.locator('#approveBtn')).toBeDisabled();
  await expectLocalizedInterface(page);
  for(const language of ['en',locale])await page.locator('#languageSelect').selectOption(language);
  await expectLocalizedInterface(page);
});

test('start guidance, stage-aware resume and a confirmed new decision preserve saved receipts',async({page},testInfo)=>{
  await expect(page.locator('#journeyStep')).toHaveText('Start here');
  await expect(page.locator('#journeyNewDecision')).not.toBeVisible();
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('new-user-start.png'),fullPage:true});
  await page.locator('#journeyAction').click();await expect(page.locator('#disruptionInput')).toBeFocused();
  await expect(page.locator('#capacityInput')).not.toBeVisible();
  await analyze(page);await expect(page.locator('#journeyTitle')).toHaveText('Confirm what the supplier can deliver');
  await page.goto('/');await expect(page.locator('#persistenceStatus')).toContainText('Restored directly from Firebase');
  await expect(page.locator('#journeyStep')).toHaveText('Welcome back');
  await expect(page).toHaveURL(/#evidenceScout$/);await page.locator('#journeyAction').click();await expect(page.locator('#capacityInput')).toBeFocused();
  await page.locator('#capacityInput').fill('120');await page.locator('#answerBtn').click();await page.locator('#dialogConfirm').click();
  await expect(page.locator('#scenarioWorkspace')).toBeVisible();
  await page.goto('/');await expect(page.locator('#persistenceStatus')).toContainText('Restored directly from Firebase');await expect(page).toHaveURL(/#scenarioWorkspace$/);
  await page.locator('[data-proof="unverified-aggressive"]').click();await expect(page.locator('#proofState')).toContainText('BLOCK');
  await page.goto('/');await expect(page.locator('#persistenceStatus')).toContainText('Restored directly from Firebase');await expect(page).toHaveURL(/#proofWorkspace$/);
  await page.locator('#journeyAction').click();await expect(page.locator('[data-proof="balanced"]')).toBeFocused();await expect(page.locator('#approveBtn')).toBeDisabled();
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toContainText('PASS');
  await page.goto('/');await expect(page.locator('#persistenceStatus')).toContainText('Restored directly from Firebase');await expect(page).toHaveURL(/#approvalSummary$/);
  await page.locator('#journeyAction').click();await expect(page.locator('#approveBtn')).toBeFocused();
  await page.locator('#approveBtn').click();await page.locator('#dialogConfirm').click();await expect(page.locator('#actions tbody tr')).toHaveCount(5);
  const receipt=await page.locator('#proofReceiptHash').textContent();
  await page.goto('/');await expect(page.locator('#persistenceStatus')).toContainText('Restored directly from Firebase');await expect(page).toHaveURL(/#actionWorkspace$/);
  await expect(page.locator('#journeyTitle')).toHaveText('This decision is saved');await expect(page.locator('#journeyDescription')).toContainText('5 sandbox actions');
  await expect(page.locator('#journeyNewDecision')).toBeVisible();await expect(page.locator('#journeyAction')).toHaveText('View audit trail');
  if(process.env.LOCAL_QA_CAPTURE==='1')await page.screenshot({path:testInfo.outputPath('returning-user-saved.png'),fullPage:true});
  await page.locator('#journeyAction').click();await expect(page.locator('#auditWorkspace')).toBeVisible();
  await page.goto('/#evidenceWorkspace');await page.reload();await expect(page.locator('#persistenceStatus')).toContainText('Restored directly from Firebase');
  await expect(page.locator('#evidenceWorkspace')).toBeVisible();await expect(page.locator('#journeyAction')).toHaveText('View saved actions');
  await page.locator('#journeyAction').click();await expect(page.locator('#actionWorkspace')).toBeVisible();
  await page.locator('#journeyNewDecision').click();await expect(page.locator('#reviewDialog')).toBeVisible();await page.locator('#dialogCancel').click();
  await expect(page.locator('#actions tbody tr')).toHaveCount(5);await expect(page.locator('#proofReceiptHash')).toHaveText(receipt);
  await page.locator('#journeyNewDecision').click();await page.locator('#dialogConfirm').click();
  await expect(page.locator('#journeyStep')).toHaveText('Start here');await expect(page.locator('#evidenceWorkspace')).toBeVisible();
  await page.goto('/#auditWorkspace');await page.reload();await expect(page.locator('#persistenceStatus')).toContainText('Restored directly from Firebase');
  await expect(page.locator('#auditBrief strong').nth(1)).toHaveText('1');await expect(page.locator('#actions tbody tr')).toHaveCount(0);
  await expect(page.locator('#approveBtn')).toBeDisabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
