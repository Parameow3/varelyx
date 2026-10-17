// Guidance is derived from verified workflow state; it never approves or saves.
const hasMissingFacts = vm => vm.holds.some(reason=>!['Operator must review evidence and confirm capacity','Confirmed supplier capacity is missing'].includes(reason));
export function resumeTarget(vm) {
  if (!vm.state.liveVerified || vm.stale) return '#evidenceWorkspace';
  if (hasMissingFacts(vm)) return '#evidenceWorkspace';
  if (!vm.state.evidenceReviewed) return '#evidenceScout';
  if (vm.approved) return '#actionWorkspace';
  if (!vm.state.proof) return '#scenarioWorkspace';
  return vm.state.proof.status === 'PASS' ? '#approvalSummary' : '#proofWorkspace';
}
export function journeyFor(vm, {view='evidence', blocked=false}={}) {
  if(blocked)return {title:'Reconcile your last save',body:'The last save was not confirmed. Reload to check your saved work before continuing.',action:'Reload saved work',kind:'reload',step:'Action needed'};
  if(vm.approved)return {title:'This decision is saved',body:'Your approved plan and {count} sandbox actions are saved. Review the result or start a new decision.',action:['saved','audit'].includes(view)?'View audit trail':'View saved actions',target:['saved','audit'].includes(view)?'#auditWorkspace':'#actionWorkspace',step:'Completed',newDecision:true};
  if(vm.stale)return {title:'Continue with your updated message',body:'The supplier message changed. Analyze it again before using the previous plan.',action:'Review supplier message',target:'#evidenceWorkspace',focus:'message',step:'Step 1 · Evidence'};
  if(!vm.state.liveVerified)return {title:'Start a recovery decision',body:'Use the sample below or paste a supplier message, then analyze it to find the missing facts.',action:'Start with the message',target:'#evidenceWorkspace',focus:'message',step:'Start here'};
  if(hasMissingFacts(vm))return {title:'Resolve the missing facts',body:'Clarify the supplier message and analyze it again before choosing a plan.',action:'Review supplier message',target:'#evidenceWorkspace',focus:'message',step:'Step 1 · Evidence'};
  if(!vm.state.evidenceReviewed)return {title:'Confirm what the supplier can deliver',body:'Review the extracted facts and enter the quantity confirmed by your supplier.',action:'Review and confirm',target:'#evidenceScout',step:'Step 1 · Evidence'};
  if(!vm.state.proof)return {title:'Compare your recovery options',body:'Compare supply, cost and stockout risk, then check the balanced plan.',action:'Compare recovery plans',target:'#scenarioWorkspace',focus:view==='plan'?'proof':null,step:'Step 2 · Plan'};
  if(vm.state.proof.status!=='PASS')return {title:'Choose a plan that passes the checks',body:'The latest plan cannot be approved. Check the balanced plan to continue.',action:'Check the balanced plan',target:'#scenarioWorkspace',focus:'proof',step:'Step 3 · Verify'};
  return {title:'Your plan is ready for review',body:'The plan passed its checks. Review the quantities and approve the sandbox actions.',action:'Review approval',target:'#approvalSummary',focus:'approval',step:'Step 4 · Approve'};
}
