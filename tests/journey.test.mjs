import test from 'node:test';
import assert from 'node:assert/strict';
import {journeyFor,resumeTarget} from '../public/journey.mjs';
import {translate,translations} from '../public/i18n.mjs';
const vm=(state={},extra={})=>({state:{source:'',liveVerified:false,evidenceReviewed:false,proof:null,actions:[],...state},holds:[],stale:false,approved:false,...extra});
const scenarios=[
  ['new',vm(),'#evidenceWorkspace','Start a recovery decision'],
  ['analyzed',vm({liveVerified:true}),'#evidenceScout','Confirm what the supplier can deliver'],
  ['reviewed',vm({liveVerified:true,evidenceReviewed:true}),'#scenarioWorkspace','Compare your recovery options'],
  ['blocked',vm({liveVerified:true,evidenceReviewed:true,proof:{status:'BLOCK'}}),'#proofWorkspace','Choose a plan that passes the checks'],
  ['passed',vm({liveVerified:true,evidenceReviewed:true,proof:{status:'PASS'}}),'#approvalSummary','Your plan is ready for review'],
  ['approved',vm({liveVerified:true,evidenceReviewed:true,proof:{status:'PASS'},actions:[{}]},{approved:true}),'#actionWorkspace','This decision is saved'],
  ['stale',vm({liveVerified:true,evidenceReviewed:true,proof:{status:'PASS'}},{stale:true,approved:false}),'#evidenceWorkspace','Continue with your updated message'],
  ['missing fact',vm({liveVerified:true,evidenceReviewed:true},{holds:['Delivery delay is unknown']}),'#evidenceWorkspace','Resolve the missing facts']
];
for(const [name,state,target,title] of scenarios)test('journey resumes '+name+' at its verified next step',()=>{
  assert.equal(resumeTarget(state),target);assert.equal(journeyFor(state).title,title);
});
test('completed guidance changes with the current view and offers a new decision',()=>{
  const state=scenarios.find(v=>v[0]==='approved')[1];
  assert.equal(journeyFor(state).target,'#actionWorkspace');
  assert.equal(journeyFor(state,{view:'saved'}).target,'#auditWorkspace');
  assert.equal(journeyFor(state).newDecision,true);
});
test('unconfirmed write offers reconciliation instead of approval or starting over',()=>{
  const guide=journeyFor(scenarios[5][1],{blocked:true});
  assert.equal(guide.kind,'reload');assert.equal(guide.newDecision,undefined);
});
for(const [locale,script] of [['bn',/[\u0980-\u09ff]/],['km',/[\u1780-\u17ff]/]])test(locale+' translates all state-derived onboarding instructions',()=>{
  for(const [,state] of scenarios)for(const [field,key] of Object.entries(journeyFor(state))){
    if(!['title','body','action','step'].includes(field))continue;
    assert.ok(translations[locale][key],key);
    assert.match(translate(key,locale,{count:5}),script);
    assert.doesNotMatch(translate(key,locale,{count:5}),/\{count\}/);
  }
});
