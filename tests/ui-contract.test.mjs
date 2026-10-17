import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const i18n=await readFile(new URL('../public/i18n.mjs',import.meta.url),'utf8');
for(const id of ['appShell','commandCenter','evidenceWorkspace','scenarioWorkspace','proofWorkspace','actionWorkspace','auditWorkspace','systemStatusBar']) test('premium workspace includes #'+id,()=>assert.match(html,new RegExp('id=["\\\']'+id+'["\\\']')));
test('scenario workspace includes direct comparison table',()=>assert.match(html,/id=["']strategyComparison["']/));
test('proof workspace exposes a copy receipt control',()=>assert.match(html,/id=["']copyReceiptBtn["']/));
test('human approval boundary is explicit',()=>assert.match(html,/Human authorization is required/i));
test('external dispatch disclaimer is explicit',()=>assert.match(html,/No supplier, ERP, WMS or external purchasing system is contacted/));
test('simulation disclaimer is explicit',()=>assert.match(html,/Controlled simulation\.<\/b> <span data-i18n="Not observed retailer outcomes\.">Not observed retailer outcomes\./));
test('operations first command center anchors exist',()=>{ for(const id of ['incidentCommand','decisionStateCard','nextActionCard']) assert.match(html,new RegExp('id=["\\\']'+id+'["\\\']')); });
test('command center exposes KNOW ASK DECIDE PROVE ACT',()=>{ for(const word of ['KNOW','ASK','DECIDE','PROVE','ACT']) assert.match(html,new RegExp(word)); });
test('opening workspace exposes unresolved evidence and decision state',()=>{assert.match(html,/Unresolved evidence/);assert.match(html,/Decision state/);assert.match(html,/Next best action/);});
test('opening workspace is operational rather than marketing-only',()=>assert.doesNotMatch(html,/class="orb"/));
test('responsive and keyboard accessibility contracts exist',()=>{assert.match(css,/@media\(max-width:390px\)/);assert.match(css,/:focus-visible/);assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);});
test('signal and evidence investigation anchors exist',()=>{for(const id of ['signalPanel','evidenceMatrix','evidenceScout']) assert.match(html,new RegExp('id=["\\\']'+id+'["\\\']'));});
test('evidence states include Confirmed Estimated Unknown and Stale labels',()=>{assert.match(html,/Operator reviewed/);assert.match(html,/Extracted \/ estimated/);assert.match(html,/Unknown/);assert.match(app,/STALE/);});
test('evidence scout explains why the question matters',()=>{assert.match(html,/id="capacityHelp"/);assert.match(html,/id="questionBox"/);});

test('decision surface has selected candidate and compact alternatives',()=>{
  for(const id of ['selectedCandidate','strategyComparison','proofOutcome','proofFreshness']) assert.match(html,new RegExp('id=["\\\']'+id+'["\\\']'));
  assert.match(app,/Balanced demo candidate/);
  assert.doesNotMatch(html,/>Best</i);
});
test('decision comparison names all operational tradeoffs',()=>{
  for(const label of ['Transfer','Supplier B','Emergency','Cash','Expected stockout','Robustness']) assert.match(html+app,new RegExp(label,'i'));
});
test('proof gate exposes text states and rule observed result semantics',()=>{
  for(const state of ['PASS','HOLD','BLOCK']) assert.match(html+app,new RegExp(state));
  assert.match(app,/Check/); assert.match(app,/proofObservations/); assert.match(app,/Result/);
});
test('unsafe proposal remains a secondary destructive test',()=>assert.match(html,/data-proof="unverified-aggressive" data-operation class="button secondary"/));
test('receipt and long proof content are locally contained',()=>{
  assert.match(html,/server-authoritative procurement approval/);
  assert.match(css,/overflow-wrap:anywhere/);
});

test('act workspace separates AI analysis from human authorization',()=>{
  for(const id of ['approvalSummary','actionLedger','shadowMode','auditSequence']) assert.match(html,new RegExp('id=["\\\']'+id+'["\\\']'));
  assert.match(html,/AI analysis/i); assert.match(html,/Human authorization/i);
});
test('sandbox action state and no-dispatch boundary stay explicit',()=>{
  assert.match(app,/APPROVED_SANDBOX/);
  assert.match(html,/No supplier, ERP, WMS or external purchasing system is contacted/);
});
test('shadow mode carries the exact simulation disclaimer',()=>assert.match(html,/Controlled simulation\.<\/b> <span data-i18n="Not observed retailer outcomes\.">Not observed retailer outcomes\./));
test('audit sequence names evidence proof approval and persistence',()=>{
  for(const label of ['Evidence reviewed','Proof generated','Human approval','Firebase save verified']) assert.match(html+app,new RegExp(label,'i'));
});
test('small-screen layout contains page overflow and keeps local comparison scroll',()=>{
  assert.match(css,/\.strategy-comparison\{[^}]*overflow:auto/);
  assert.match(css,/min-width:0/);
  assert.match(css,/\.action-card[^}]*overflow-wrap:anywhere/);
});

test('unanalyzed unresolved evidence is not rendered as a fake number',()=>assert.match(i18n,/notAssessed:'Not assessed'/));

test('system status uses customer-friendly readiness language',()=> {
  for (const label of ['AI connecting','Waiting for analysis','Proof pending','Save pending']) assert.match(html,new RegExp(label));
  for (const label of ['Firebase Ready','AI Ready','AI Verified','Review required','Evidence reviewed','Save verified']) assert.match(i18n,new RegExp(label));
  assert.doesNotMatch(html,/Gemini not run|Save not verified|Proof not run/);
});

test('language picker retains explicit locale values with flags',()=> {
  assert.match(html,/id="languageSelect"/);
  assert.match(html,/<option value="en">🇬🇧 English<\/option>/);
  assert.match(html,/<option value="bn">🇧🇩 বাংলা<\/option>/);
  assert.match(i18n,/export const translations/);
  assert.match(i18n,/bn:/);
  assert.match(i18n,/localStorage\.setItem\(STORAGE_KEY/);
  assert.match(app,/varelyx:languagechange/);
});

test('usability polish exposes next-step guidance and approval lock reason',()=> {
  for (const id of ['statusHelperText','nextStepBtn','approvalReason']) assert.match(html,new RegExp('id=["\\\\\']'+id+'["\\\\\']'));
  assert.match(html,/class="onboarding-strip"/);
  assert.match(i18n,/approvalBlocked/);
  assert.match(i18n,/guideSignal/);
  assert.match(css,/\.approval-reason/);
});
