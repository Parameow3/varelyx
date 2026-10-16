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
  page.on('dialog',dialog=>dialog.accept());
  await page.goto('/');
  await expect(page.locator('#persistenceStatus')).toContainText('Firebase server read verified');
});
async function analyze(page){await page.locator('#disruptionInput').fill(signal);await page.locator('#analyzeBtn').click();await expect(page.locator('#geminiResult')).toContainText('LIVE GEMINI VERIFIED');}

test('isolated full flow: evidence save, PASS/BLOCK/PASS, approval, reload and stale edit',async({page},testInfo)=>{
  await expect(page.locator('#capacityInput')).toHaveValue('');
  await analyze(page);
  await expect(page.locator('#statusHelperText')).toContainText('Evidence saved');
  await expect(page.locator('#statusHelperText')).not.toContainText('Decision saved');
  await page.locator('#capacityInput').fill('60');await page.locator('#answerBtn').click();
  await expect(page.locator('#decisionStateValue')).toHaveText('Ready for Proof Gate');
  await page.reload();await expect(page.locator('#capacityInput')).toHaveValue('60');
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toHaveText('Proof PASS');
  await page.locator('[data-proof="unverified-aggressive"]').click();await expect(page.locator('#proofState')).toHaveText('Proof BLOCK');
  await expect(page.locator('#approveBtn')).toBeDisabled();
  await page.locator('[data-proof="balanced"]').click();await expect(page.locator('#proofState')).toHaveText('Proof PASS');
  await page.locator('#approveBtn').click();await expect(page.locator('#actions')).toContainText('APPROVED_SANDBOX');
  await expect(page.locator('#decisionStateValue')).toHaveText('Approved · sandbox actions saved');
  await expect(page.locator('#approveBtn')).toBeDisabled();
  if(process.env.LOCAL_QA_CAPTURE==='1') await page.screenshot({path:testInfo.outputPath('approved-sandbox.png'),fullPage:true});
  await page.reload();await expect(page.locator('#decisionStateValue')).toHaveText('Approved · sandbox actions saved');
  await expect(page.locator('#statusHelperText')).toContainText('Decision saved');
  await expect(page.locator('#nextStepBtn')).toHaveAttribute('href','#auditWorkspace');
  await page.locator('#disruptionInput').fill(signal+' Edited');
  await expect(page.locator('#proofState')).toHaveText('Proof stale');
  await expect(page.locator('#proofState')).not.toHaveClass(/\bok\b/);
  await expect(page.locator('#proof .proof-hero h2')).toHaveText('STALE');
  await expect(page.locator('#approveBtn')).toBeDisabled();
  await expect(page.locator('#statusHelperText')).toContainText('Signal edited');
  await expect(page.locator('#nextStepBtn')).toHaveAttribute('href','#evidenceWorkspace');
});
test('reanalysis clears old input and presents extracted capacity as an unconfirmed suggestion',async({page})=>{
  await analyze(page);await page.locator('#capacityInput').fill('60');await page.locator('#answerBtn').click();
  await expect(page.locator('#decisionStateValue')).toHaveText('Ready for Proof Gate');
  await analyze(page);await expect(page.locator('#capacityInput')).toHaveValue('');
  const source=signal+' Thursday capacity confirmed 120 cases.';
  await page.evaluate(value=>{globalThis.__qaExtraction={...globalThis.__qaExtraction,capacity_confirmed:120,evidence_quotes:{...globalThis.__qaExtraction.evidence_quotes,capacity_confirmed:'capacity confirmed 120 cases'}};});
  await page.locator('#disruptionInput').fill(source);await page.locator('#analyzeBtn').click();
  await expect(page.locator('#capacitySuggestion')).toContainText('Gemini suggestion: 120 cases — unconfirmed');
  await expect(page.locator('#capacitySuggestion')).toContainText('capacity confirmed 120 cases');
  await expect(page.locator('#capacityInput')).toHaveValue('');
  await expect(page.locator('#decisionStateValue')).toHaveText('Evidence review required');
  await page.locator('#capacityInput').fill('0');await page.locator('#answerBtn').click();
  await expect(page.locator('#decisionStateValue')).toHaveText('Ready for Proof Gate');
  await page.reload();await expect(page.locator('#capacityInput')).toHaveValue('0');
});
