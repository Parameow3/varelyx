import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState, applyExtraction, confirmEvidence, plansFor, prove, prepareApproval, restore, validateExtraction} from '../public/core.mjs';
import {buildViewModel, getStageState} from '../public/ui-state.mjs';
const source='Supplier B delivery 48 hours late. 2 routes affected. Thursday capacity not confirmed.';
const raw=()=>({supplier:'Supplier B',delay_hours:48,affected_routes:2,capacity_confirmed:null,summary:'Delay and affected routes.',confidence:0.95,evidence_quotes:{delay_hours:'48 hours late',affected_routes:'2 routes affected',capacity_confirmed:null}});
const ready=()=>confirmEvidence(applyExtraction(initialState(),raw(),source),120);

test('approved receipt survives reload and completes Action rather than asking for approval again', async()=>{
  const approved=restore(JSON.stringify(await prepareApproval(ready())));
  const vm=buildViewModel(approved,source,true,{verified:true});
  assert.equal(vm.decisionState,'APPROVED_SANDBOX');
  assert.equal(vm.nextAction.id,'view-audit');
  assert.equal(getStageState(vm).action,'complete');
  const stale=buildViewModel(approved,source+' Changed',true,{verified:true});
  assert.equal(stale.approved,false);
  assert.equal(stale.system.proof,'STALE');
});
test('previous action records do not mark a different proven decision approved', async()=>{
  let state=await prepareApproval(ready());
  state=confirmEvidence(state,60);
  state.proof=await prove(plansFor(state).find(p=>p.id==='balanced'),state);
  const vm=buildViewModel(state,source,true,{verified:true});
  assert.equal(vm.approved,false);
  assert.equal(vm.nextAction.id,'approve');
});
test('saved confirmed capacity including zero survives restore and reanalysis clears it',()=>{
  for(const cap of [0,60,120]){
    const restored=restore(JSON.stringify(confirmEvidence(applyExtraction(initialState(),raw(),source),cap)));
    assert.equal(restored.supplierCapacity,cap);
    assert.equal(applyExtraction(restored,raw(),source).supplierCapacity,null);
  }
});
test('numbers quoted from the wrong field cannot become delay or route evidence',()=>{
  for(const [key,value,quote] of [['delay_hours',48,'48 cases'],['affected_routes',2,'2 hours late']]){
    const r=raw(); r[key]=value; r.evidence_quotes[key]=quote;
    assert.throws(()=>validateExtraction(r,source+' '+quote),/field\/unit/);
  }
});
test('delay unit conversion is bound to the number, not another number in a quote',()=>{
  const r=raw();r.delay_hours=48;r.evidence_quotes.delay_hours='2 days late';
  assert.equal(validateExtraction(r,source+' 2 days late').delay_hours,48);
  r.delay_hours=2;
  assert.throws(()=>validateExtraction(r,source+' 2 days late'),/field\/unit/);
});
test('negative, fractional, conflicting and negated field quotes remain unverified',()=>{
  for(const quote of ['-48 hours late','1.48 hours late','24 or 48 hours late','not 48 hours late']){
    const r=raw();r.evidence_quotes.delay_hours=quote;
    assert.throws(()=>validateExtraction(r,source+' '+quote),/field\/unit/);
  }
});
test('capacity needs capacity context and cases, with uncertainty preserved',()=>{
  for(const quote of ['capacity confirmed 120 cases','সর্বোচ্চ ক্ষমতা ১২০ কেস']){
    const r=raw();r.capacity_confirmed=120;r.evidence_quotes.capacity_confirmed=quote;
    assert.equal(validateExtraction(r,source+' '+quote).capacity_confirmed,120);
  }
  for(const quote of ['120 cases ordered','capacity 120 hours','capacity 120 cases not confirmed','capacity about 120 cases']){
    const r=raw();r.capacity_confirmed=120;r.evidence_quotes.capacity_confirmed=quote;
    assert.throws(()=>validateExtraction(r,source+' '+quote),/field\/unit/);
  }
});
test('estimated delay and distribution-route phrasing used by the default demo stay supported',()=>{
  const r=raw();r.evidence_quotes.delay_hours='approximately 48 hours late';r.evidence_quotes.affected_routes='2 distribution routes';
  assert.equal(validateExtraction(r,'Supplier B approximately 48 hours late. 2 distribution routes affected.').delay_hours,48);
});
test('historical saved sessions remain readable while new analyses require field units',()=>{
  const legacy=ready();delete legacy.extractionValidationVersion;
  legacy.extraction.evidence_quotes.delay_hours='48';
  assert.equal(restore(JSON.stringify(legacy)).supplierCapacity,120);
  assert.throws(()=>applyExtraction(legacy,legacy.extraction,source),/field\/unit/);
  const current={...legacy,extractionValidationVersion:1};
  assert.throws(()=>restore(JSON.stringify(current)),/field\/unit/);
});
test('edited evidence disables confirmation, proof and approval until reanalysis',async()=>{
  const state=ready();state.proof=await prove(plansFor(state).find(p=>p.id==='balanced'),state);
  const stale=buildViewModel(state,source+' Edited',true,{verified:true});
  assert.equal(stale.canReview,false);assert.equal(stale.canProve,false);assert.equal(stale.canApprove,false);assert.equal(stale.estimatesReady,false);
  const current=buildViewModel(state,source,true,{verified:true});
  assert.equal(current.canReview,true);assert.equal(current.canProve,true);assert.equal(current.canApprove,true);
});
