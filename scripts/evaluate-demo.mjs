// Synthetic constraint evaluation, not a Gemini accuracy or customer-impact benchmark.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {initialState,applyExtraction,confirmEvidence,plansFor,prove,unsafePlan,POLICY} from '../public/core.mjs';

function extracted(routes=2,confidence=.95) {
  const source=`Supplier B delivery 48 hours late. ${routes} routes affected. Thursday capacity not confirmed.`;
  const raw={supplier:'Supplier B',delay_hours:48,affected_routes:routes,capacity_confirmed:null,
    summary:'Synthetic extraction fixture for constraint evaluation.',confidence,
    evidence_quotes:{delay_hours:'48 hours late',affected_routes:`${routes} routes affected`,capacity_confirmed:null}};
  return applyExtraction(initialState(),raw,source);
}
const scenarios=[];
for(const capacity of [0,49,50,60,119,120,180,10000])for(const routes of [0,2,3,5,100]) {
  const state=confirmEvidence(extracted(routes),capacity),plans=[];
  for(const plan of plansFor(state)) {
    // Check domain invariants directly, independently of the Proof Gate result.
    const quantities=[plan.transfer_cases,plan.supplier_b_cases,plan.emergency_cases];
    assert.ok(quantities.every(q=>Number.isInteger(q)&&q>=0&&q%10===0));
    assert.ok(plan.supplier_b_cases<=capacity);
    assert.ok(plan.supplier_b_cases===0||plan.supplier_b_cases>=50);
    assert.ok(plan.transfer_cases<=Math.min(90,Math.max(0,150-routes*30)));
    assert.ok(plan.emergency_cases<=100);
    const cash=120*plan.transfer_cases+820*plan.supplier_b_cases+1280*plan.emergency_cases;
    assert.equal(plan.cash_required_bdt,cash);assert.ok(cash<=240000);
    const proof=await prove(plan,state);assert.equal(proof.status,'PASS');assert.equal(proof.checks.length,8);
    plans.push({id:plan.id,transfer:plan.transfer_cases,supplier:plan.supplier_b_cases,emergency:plan.emergency_cases,
      cashBDT:cash,simulatedStockout:plan.expected_stockout_cases,proof:proof.status});
  }
  scenarios.push({capacity,routes,plans});
}
const ready=confirmEvidence(extracted(),120),balanced=plansFor(ready).find(p=>p.id==='balanced');
const unsafeCases=[
 ['aggressive',unsafePlan()],['cash mismatch',{...balanced,cash_required_bdt:balanced.cash_required_bdt+1}],
 ['supplier over capacity',{...balanced,supplier_b_cases:130}],['fractional transfer',{...balanced,transfer_cases:89.5}],
 ['pack violation',{...balanced,transfer_cases:89}],['donor limit',{...balanced,transfer_cases:100}],
 ['emergency limit',{...balanced,emergency_cases:110}],['below MOQ',{...balanced,supplier_b_cases:40}]
];
const blocked=[];
for(const [name,plan] of unsafeCases){const proof=await prove(plan,ready);assert.equal(proof.status,'BLOCK');blocked.push({name,status:proof.status});}
const held=[];
for(const [name,state] of [['unreviewed capacity',extracted()],['low confidence',extracted(2,.4)],['missing evidence',initialState()]]){
 const proof=await prove(plansFor(state).find(p=>p.id==='balanced'),state);assert.equal(proof.status,'HOLD');held.push({name,status:proof.status});
}
assert.deepEqual([balanced.transfer_cases,balanced.supplier_b_cases,balanced.emergency_cases,balanced.cash_required_bdt,balanced.expected_stockout_cases],[90,120,60,186000,30]);
const report={generatedAt:new Date().toISOString(),coreSha256:createHash('sha256').update(await readFile(new URL('../public/core.mjs',import.meta.url))).digest('hex'),
 scope:'Synthetic deterministic constraint evaluation. Extraction fixtures are supplied directly; no Gemini call is made. Not measured retailer impact, general AI accuracy or server-authoritative approval.',
 policyVersion:POLICY.version,scenarioCount:scenarios.length,feasiblePlansChecked:scenarios.reduce((n,s)=>n+s.plans.length,0),
 unsafeProposalsBlocked:blocked.length,incompleteEvidenceHeld:held.length,
 allExpectedResultsPassed:true,scenarios,blocked,held};
const args=process.argv.slice(2);
if(args.length===2&&args[0]==='--output'){await writeFile(args[1],JSON.stringify(report,null,2)+'\n');console.log('Controlled evaluation saved to '+args[1]);}
else if(args.length===1&&args[0]==='--summary'){const {scenarios,blocked,held,...summary}=report;console.log(JSON.stringify(summary,null,2));}
else if(args.length===0)console.log(JSON.stringify(report,null,2));
else throw Error('Usage: node scripts/evaluate-demo.mjs [--summary | --output FILE]');
