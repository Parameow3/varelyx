import {issues, plansFor, nextQuestion} from './core.mjs';

export function buildViewModel(state, draftSource = '', connected = false, saveState = null) {
  const stale = Boolean(state.source && draftSource.trim() !== state.source);
  const holds = issues(state);
  if (stale) holds.push('Analyze the edited message before approving');
  const proofStatus = stale ? 'STALE' : (state.proof?.status ?? 'NOT_RUN');
  const approved = !stale && state.proof?.status === 'PASS' && state.actions.some(action => action.receipt_hash === state.proof.receipt_hash);
  const decisionStatus = holds.length ? 'HOLD' : approved ? 'APPROVED' : state.proof?.status === 'BLOCK' ? 'BLOCK' : state.proof?.status === 'HOLD' ? 'HOLD' : (state.proof?.status === 'PASS' ? 'PROVEN' : 'READY');
  const question = nextQuestion(state);
  const unresolvedEvidenceCount = !state.liveVerified || !state.extraction ? null : [
    state.extraction.delay_hours === null,
    state.extraction.affected_routes === null,
    String(state.extraction.supplier ?? '').trim().toLowerCase() !== 'supplier b',
    !state.evidenceReviewed || state.supplierCapacity === null
  ].filter(Boolean).length;
  const proofFreshness = stale ? 'STALE' : state.proof ? 'CURRENT' : 'NOT_RUN';
  const decisionState = stale ? 'STALE_PROOF'
    : !state.liveVerified ? 'WAITING_FOR_ANALYSIS'
    : !state.evidenceReviewed ? 'WAITING_FOR_EVIDENCE_REVIEW'
    : approved ? 'APPROVED_SANDBOX'
    : state.proof?.status === 'PASS' ? 'READY_FOR_HUMAN_APPROVAL'
    : state.proof?.status === 'BLOCK' ? 'BLOCKED_BY_PROOF'
    : state.proof?.status === 'HOLD' ? 'HELD_BY_PROOF'
    : 'READY_FOR_PROOF';
  const incident = {
    status: state.liveVerified ? (state.evidenceReviewed ? 'REVIEWED' : 'ANALYZED') : 'UNANALYZED',
    supplier: state.extraction?.supplier ?? 'Supplier B',
    delayHours: state.extraction?.delay_hours ?? null,
    affectedRoutes: state.extraction?.affected_routes ?? null
  };
  const base = {
    state,
    approved,
    canReview:connected && state.liveVerified && Boolean(state.extraction) && !stale,
    canProve:connected && !holds.length,
    canApprove:connected && !holds.length && proofStatus === 'PASS' && !approved,
    estimatesReady:!holds.length,
    stale,
    holds,
    plans: plansFor(state),
    question,
    saveState,
    system: {
      firebase: connected ? 'VERIFIED' : 'NOT_VERIFIED',
      gemini: state.liveVerified ? 'VERIFIED' : 'NOT_RUN',
      evidence: !stale && state.evidenceReviewed ? 'REVIEWED' : 'REVIEW_REQUIRED',
      proof: proofStatus,
      save: saveState?.verified ? 'VERIFIED' : 'NOT_VERIFIED'
    },
    decision: {status: decisionStatus, stale},
    incident,
    unresolvedEvidenceCount,
    decisionState,
    proofFreshness
  };
  base.nextAction = getPrimaryAction(base);
  return base;
}

export function getStageState(vm) {
  if (!vm.state.liveVerified) return {signal:'active', evidence:'waiting', decision:'waiting', proof:'waiting', action:'waiting'};
  if (!vm.state.evidenceReviewed || vm.stale) return {signal:'complete', evidence:'active', decision:'waiting', proof:vm.stale?'stale':'waiting', action:'waiting'};
  if (vm.approved) return {signal:'complete', evidence:'complete', decision:'complete', proof:'complete', action:'complete'};
  if (!vm.state.proof) return {signal:'complete', evidence:'complete', decision:'active', proof:'waiting', action:'waiting'};
  if (vm.state.proof.status === 'PASS') return {signal:'complete', evidence:'complete', decision:'complete', proof:'complete', action:'active'};
  return {signal:'complete', evidence:'complete', decision:'complete', proof:'active', action:'waiting'};
}

export function getPrimaryAction(vm) {
  if (!vm.state.liveVerified || vm.stale) return {id:'analyze', label:'Analyze disruption', disabled:vm.system.firebase !== 'VERIFIED'};
  if (!vm.state.evidenceReviewed) return {id:'review-evidence', label:'Review evidence & confirm capacity', disabled:false};
  if (vm.approved) return {id:'view-audit', label:'View saved decision audit', disabled:false};
  if (!vm.state.proof || vm.state.proof.status !== 'PASS') return {id:'prove-balanced', label:'Send balanced candidate to Proof Gate', disabled:false};
  return {id:'approve', label:'Approve sandbox actions', disabled:false};
}
