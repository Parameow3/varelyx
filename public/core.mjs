// Controlled-simulation core. No LLM owns executable quantities.
export const POLICY = Object.freeze({version: 'simulation-v2', pack: 10, starting: 150,
  donor: 90, emergency: 100, cash: 240000, supplierCost: 820, emergencyCost: 1280,
  transferCost: 120, moq: 50, maxCapacity: 10000, demand: [380, 420, 460, 500]});
export const MODEL = 'gemini-3.5-flash-lite';
export const integer = (v, max = 10000) => Number.isSafeInteger(v) && v >= 0 && v <= max;
export function capacityInput(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) throw Error('Enter a whole, nonnegative capacity. Empty input is not zero.');
  const cap = Number(value.trim());
  if (!integer(cap, POLICY.maxCapacity)) throw Error('Capacity must be between 0 and 10000.');
  return cap;
}
export function canonical(x) {
  if (Array.isArray(x)) return '[' + x.map(canonical).join(',') + ']';
  if (x && typeof x === 'object') return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canonical(x[k])).join(',') + '}';
  return JSON.stringify(x);
}
export async function digest(x) {
  const bytes = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(x)));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
// Explicit demo policy, not a fitted logistics model: each affected route removes
// 30 cases from a nominal 150-case network route limit, capped by donor safety.
export function routeLimit(affected) {
  return integer(affected, 100) ? Math.min(POLICY.donor, Math.max(0, 150 - affected * 30)) : 0;
}
export function metrics(t, s, e) {
  const available = POLICY.starting + t + s + e;
  return {expected_stockout_cases: POLICY.demand.reduce((a, d) => a + Math.max(0, d - available), 0) / POLICY.demand.length,
    robustness_pct: 100 * POLICY.demand.filter(d => available >= d).length / POLICY.demand.length};
}
export function cost(p) { return p.transfer_cases * POLICY.transferCost + p.supplier_b_cases * POLICY.supplierCost + p.emergency_cases * POLICY.emergencyCost; }
export function solve(capacity, route, shortagePenalty, emergencyPenalty, target) {
  if (!integer(capacity) || !integer(route, POLICY.donor)) throw Error('Invalid solver inputs');
  let best;
  const bound = Math.min(capacity, Math.floor(POLICY.cash / POLICY.supplierCost));
  for (let t = 0; t <= route; t += POLICY.pack) {
    for (let s = 0; s <= bound; s += POLICY.pack) {
      if (s && s < POLICY.moq) continue;
      for (let e = 0; e <= POLICY.emergency; e += POLICY.pack) {
        const p = {transfer_cases: t, supplier_b_cases: s, emergency_cases: e};
        const cash = cost(p);
        if (cash > POLICY.cash) continue;
        const shortage = Math.max(0, target - POLICY.starting - t - s - e);
        const score = cash + shortage * shortagePenalty + e * emergencyPenalty;
        if (!best || score < best.score || (score === best.score && cash < best.cash_required_bdt)) {
          best = {...p, score, cash_required_bdt: cash, shortage_cases: shortage, ...metrics(t, s, e)};
        }
      }
    }
  }
  if (!best) throw Error('No feasible plan');
  const {score, ...result} = best;
  return result;
}
export function strategies(capacity, affectedRoutes) {
  const cap = capacity ?? 0, route = routeLimit(affectedRoutes);
  const current = {id: 'current', name: 'Current plan', transfer_cases: 0, supplier_b_cases: 0,
    emergency_cases: 0, cash_required_bdt: 0, shortage_cases: 270, ...metrics(0, 0, 0)};
  return [current,
    {id: 'cheapest', name: 'Cheapest feasible', ...solve(cap, route, 900, 350, 380)},
    {id: 'balanced', name: 'Balanced robust', ...solve(cap, route, 2500, 80, 420)},
    {id: 'max-availability', name: 'Maximum availability', ...solve(cap, route, 10000, 0, 500)}];
}
const normalize = s => String(s).replace(/[\u09e6-\u09ef]/g, c => String(c.charCodeAt(0) - 0x09e6)).replace(/[\u17e0-\u17e9]/g,c=>String(c.charCodeAt(0)-0x17e0)).replace(/\s+/g, ' ').trim().toLowerCase();
export const EXTRACTION_SCHEMA = {type: 'object', properties: {
  delay_hours: {type: ['integer', 'null']}, affected_routes: {type: ['integer', 'null']},
  supplier: {type: ['string', 'null']}, capacity_confirmed: {type: ['integer', 'null']},
  summary: {type: 'string'}, confidence: {type: 'number'},
  evidence_quotes: {type: 'object', properties: {delay_hours: {type: ['string', 'null']},
    affected_routes: {type: ['string', 'null']}, capacity_confirmed: {type: ['string', 'null']}},
    required: ['delay_hours', 'affected_routes', 'capacity_confirmed']}
}, required: ['delay_hours', 'affected_routes', 'supplier', 'capacity_confirmed', 'summary', 'confidence', 'evidence_quotes']};

// Conservative grounding checks, not a general natural-language verifier.
// Unknown units or ambiguous/negated clauses must be clarified and reviewed.
function fieldSupportsNumber(key, value, quote) {
  const text = normalize(quote);
  const units = key === 'delay_hours' ? '(hours?|hrs?|days?|din|ঘণ্টা|ঘন্টা|দিন|ម៉ោង|ថ្ងៃ)'
    : key === 'affected_routes' ? '((?:(?:distribution|delivery)\\s+)?routes?|রুট|ផ្លូវ)' : '(cases?|কেস|កេស)';
  const pair = new RegExp('(?<![\\d.\\-])([0-9]+)(?:টি|টা|ta)?[\\s-]*'+units+'(?![a-z\\u0980-\\u09ff\\u1780-\\u17ff])', 'g');
  const values = [...text.matchAll(pair)].map(match => key === 'delay_hours' && /^(days?|din|দিন|ថ្ងៃ)$/.test(match[2]) ? Number(match[1])*24 : Number(match[1]));
  if (!values.includes(value)) return false;
  if (/\b(?:not|unconfirmed|unknown|maybe|between|or)\b|অনিশ্চিত|অজানা|নয়|নেই|হয়নি|নিশ্চিত নয়|មិន|អត់|មិនដឹង|ចន្លោះ|ឬ/.test(text)) return false;
  if (key === 'capacity_confirmed' && /\b(?:approximately|about)\b|ប្រហែល/.test(text)) return false;
  if (key === 'delay_hours' && !/\b(?:late|delay(?:ed)?|deri)\b|দেরি|বিলম্ব|យឺត|ពន្យារ/.test(text)) return false;
  if (key === 'capacity_confirmed' && !/\b(?:capacity|maximum|max|can supply|can deliver)\b|ক্ষমতা|সরবরাহ করতে পার|បរិមាណ|សមត្ថភាព|អាចផ្គត់ផ្គង់|អាចដឹក/.test(text)) return false;
  // Multiple different values for the same unit in one quote are ambiguous.
  return new Set(values).size === 1;
}
export function validateExtraction(raw, source, {checkFieldUnits = true} = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Gemini output must be an object');
  if (typeof source !== 'string' || !source.trim() || source.length > 8000) throw Error('Evidence must contain 1-8000 characters');
  if (typeof raw.summary !== 'string' || !raw.summary.trim() || raw.summary.length > 2000) throw Error('Invalid evidence summary');
  if (typeof raw.confidence !== 'number' || !Number.isFinite(raw.confidence) || raw.confidence < 0 || raw.confidence > 1) throw Error('Invalid confidence');
  if (raw.supplier !== null && (typeof raw.supplier !== 'string' || raw.supplier.length > 100)) throw Error('Invalid supplier');
  const quotes = raw.evidence_quotes;
  if (!quotes || typeof quotes !== 'object') throw Error('Source quotations are required');
  const out = {supplier: raw.supplier, summary: raw.summary, confidence: raw.confidence, evidence_quotes: {}};
  for (const [key, max] of [['delay_hours', 720], ['affected_routes', 100], ['capacity_confirmed', 10000]]) {
    const value = raw[key], quote = quotes[key];
    if (value !== null && !integer(value, max)) throw Error('Invalid field: ' + key);
    if (value !== null) {
      if (typeof quote !== 'string' || !quote.trim() || !normalize(source).includes(normalize(quote))) throw Error('Ungrounded source: ' + key);
      const numbers = normalize(quote).match(/\d+/g)?.map(Number) || [];
      const days = key === 'delay_hours' && /days?|din|\u09a6\u09bf\u09a8|ថ្ងៃ/.test(normalize(quote));
      if (!numbers.includes(value) && !(days && numbers.some(n => n * 24 === value))) throw Error('Unsupported number: ' + key);
      if (checkFieldUnits && !fieldSupportsNumber(key, value, quote)) throw Error('Unsupported field/unit or ambiguous source: ' + key + '. Clarify the supplier message and analyze again.');
    }
    out[key] = value;
    out.evidence_quotes[key] = value === null ? null : quote;
  }
  return out;
}
export function initialState() {
  return {schemaVersion: 2, runId: globalThis.crypto.randomUUID(), source: '', extraction: null,
    liveVerified: false, evidenceReviewed: false, supplierCapacity: null, confirmedAt: null,
    phase: 'EVIDENCE_REQUIRED', proof: null, actions: [], archive: [], receipts: {}, audit: []};
}
export function applyExtraction(state, raw, source) {
  const extraction = validateExtraction(raw, source);
  return {...state, source, extraction, extractionValidationVersion: 1, liveVerified: true, evidenceReviewed: false, supplierCapacity: null,
    confirmedAt: null, proof: null, phase: 'EVIDENCE_REVIEW_REQUIRED',
    audit: [...state.audit, {event: 'LIVE_EVIDENCE_EXTRACTED', at: new Date().toISOString()}]};
}
export function issues(state) {
  const result = [];
  if (!state.liveVerified || !state.extraction) result.push('A successful live Gemini analysis is required');
  if (!state.evidenceReviewed) result.push('Operator must review evidence and confirm capacity');
  if (state.supplierCapacity === null || !integer(state.supplierCapacity)) result.push('Confirmed supplier capacity is missing');
  if (state.extraction) {
    if (state.extraction.confidence < 0.8) result.push('Low-confidence evidence: clarify and analyze again');
    if (state.extraction.delay_hours === null) result.push('Delivery delay is unknown');
    if (state.extraction.affected_routes === null) result.push('Affected route count is unknown');
    if (normalize(state.extraction.supplier) !== 'supplier b') result.push('This controlled scenario supports Supplier B only');
  }
  return result;
}
export function confirmEvidence(state, capacity) {
  if (!integer(capacity)) throw Error('Invalid confirmed capacity');
  if (!state.extraction || !state.liveVerified) throw Error('Analyze evidence with live Gemini first');
  const next = {...state, supplierCapacity: capacity, evidenceReviewed: true, confirmedAt: new Date().toISOString(), proof: null};
  if (issues(next).length) throw Error(issues(next).join('; '));
  next.phase = 'PLAN_READY';
  next.audit = [...state.audit, {event: 'OPERATOR_EVIDENCE_CONFIRMED', capacity, at: next.confirmedAt}];
  return next;
}
export const plansFor = state => strategies(state.supplierCapacity, state.extraction?.affected_routes ?? null);
export function nextQuestion(state) {
  const spread = values => Math.max(...values) - Math.min(...values);
  const candidates = [];
  const route = state.extraction?.affected_routes === null || !state.extraction ? 90 : routeLimit(state.extraction.affected_routes);
  if (state.supplierCapacity === null) candidates.push({key: 'supplier_b_thursday_capacity',
    score: spread([0, 60, 120, 180].map(cap => solve(cap, route, 2500, 80, 420).expected_stockout_cases)),
    question: 'Supplier B: what maximum number of cases is confirmed for delivery by Thursday?'});
  if (state.extraction?.affected_routes == null) candidates.push({key: 'affected_routes',
    score: spread([0, 30, 60, 90].map(r => solve(state.supplierCapacity ?? 120, r, 2500, 80, 420).expected_stockout_cases)),
    question: 'How many delivery routes are currently affected?'});
  candidates.sort((a, b) => b.score - a.score);
  return {top: candidates[0] ?? null, candidates, assumption: 'Controlled one-variable sensitivity; other unknown uses route cap 90 or supplier capacity 120. Not an empirical information-value benchmark.'};
}
export async function prove(plan, state) {
  const checks = [], add = (name, ok, detail) => checks.push({name, status: ok ? 'PASS' : 'BLOCK', detail});
  const unknown = issues(state);
  checks.push({name: 'Reviewed live evidence', status: unknown.length ? 'HOLD' : 'PASS', detail: unknown.join('; ') || 'Evidence reviewed by operator'});
  const fields = ['transfer_cases', 'supplier_b_cases', 'emergency_cases', 'shortage_cases', 'cash_required_bdt'];
  const valid = fields.every(k => integer(plan[k], 10000000));
  add('Nonnegative integer quantities', valid, 'All quantities and cash must be finite nonnegative integers');
  add('Cash recomputation and ceiling', valid && cost(plan) === plan.cash_required_bdt && cost(plan) <= POLICY.cash, 'Recomputed cash must match the plan and be at most BDT 240000');
  add('Supplier capacity', valid && plan.supplier_b_cases <= (state.supplierCapacity ?? 0), 'Cannot exceed operator-confirmed capacity');
  add('Donor safety stock', valid && plan.transfer_cases <= POLICY.donor, 'Maximum 90 cases');
  add('Route capacity', valid && plan.transfer_cases <= routeLimit(state.extraction?.affected_routes ?? null), 'Controlled route policy applied to extracted route count');
  add('Emergency supplier capacity', valid && plan.emergency_cases <= POLICY.emergency, 'Maximum 100 cases');
  add('MOQ and pack size', valid && (plan.supplier_b_cases === 0 || plan.supplier_b_cases >= POLICY.moq) && fields.slice(0, 3).every(k => plan[k] % POLICY.pack === 0), 'Supplier MOQ 50; pack size 10');
  const status = checks.some(c => c.status === 'BLOCK') ? 'BLOCK' : unknown.length ? 'HOLD' : 'PASS';
  const payload = {policy: POLICY, runId: state.runId, plan, source: state.source,
    extraction: state.extraction, confirmedCapacity: state.supplierCapacity,
    evidenceReviewed: state.evidenceReviewed, liveVerified: state.liveVerified, checks};
  return {status, checks, strategy_id: plan.id, receipt_hash: await digest(payload), payload, created_at: new Date().toISOString()};
}
export function recordProof(state, proof) {
  return {...state, proof, phase:proof.status, audit:[...state.audit, {
    event:'PROOF_GENERATED', status:proof.status, strategy_id:proof.strategy_id,
    receipt_hash:proof.receipt_hash, at:proof.created_at
  }]};
}
export function unsafePlan() {
  const p = {id: 'unverified-aggressive', name: 'Unsafe proposal', transfer_cases: 130, supplier_b_cases: 200, emergency_cases: 110, shortage_cases: 0};
  return {...p, cash_required_bdt: cost(p), ...metrics(130, 200, 110)};
}
export async function prepareApproval(state) {
  const plan = plansFor(state).find(p => p.id === 'balanced'), proof = await prove(plan, state);
  if (proof.status !== 'PASS') throw Error('Approval blocked: ' + proof.status);
  if (state.actions.some(a => a.receipt_hash === proof.receipt_hash)) throw Error('This exact decision has already been recorded');
  const actions = [], add = (type, payload) => actions.push({id: proof.receipt_hash.slice(0, 20) + '-' + actions.length,
    type, payload, receipt_hash: proof.receipt_hash, status: 'APPROVED_SANDBOX', created_at: proof.created_at});
  if (plan.transfer_cases) add('TRANSFER_ORDER', {cases: plan.transfer_cases});
  if (plan.supplier_b_cases) add('PURCHASE_ORDER_DRAFT', {supplier: 'Supplier B', cases: plan.supplier_b_cases});
  if (plan.emergency_cases) add('PURCHASE_ORDER_DRAFT', {supplier: 'Emergency Supplier C', cases: plan.emergency_cases});
  add('SUPPLIER_ESCALATION', {supplier: 'Supplier B', delay_hours: state.extraction.delay_hours});
  add('MANAGER_TASK', {task: 'Review sandbox action records; no external order has been sent'});
  return {...state, proof, receipts: {...state.receipts, [proof.receipt_hash]: proof}, phase: 'APPROVED_SANDBOX', actions: [...state.actions, ...actions],
    audit: [...state.audit, {event: 'APPROVAL_PREPARED', receipt_hash: proof.receipt_hash, at: proof.created_at}]};
}
export function restore(payload) {
  const s = JSON.parse(payload);
  if (!s || s.schemaVersion !== 2 || typeof s.runId !== 'string' || !Array.isArray(s.actions) || !Array.isArray(s.audit) || !Array.isArray(s.archive)) throw Error('Stored session is invalid; do not overwrite it');
  if (!s.receipts || typeof s.receipts !== 'object' || Array.isArray(s.receipts)) throw Error('Stored receipt archive is invalid');
  // Preserve access to historical sessions validated by the previous release.
  // Every newly analyzed extraction uses the stricter field/unit contract.
  if (s.extraction) s.extraction = validateExtraction(s.extraction, s.source, {checkFieldUnits: s.extractionValidationVersion === 1});
  if (s.supplierCapacity !== null && !integer(s.supplierCapacity)) throw Error('Stored capacity is invalid');
  if (typeof s.liveVerified !== 'boolean' || typeof s.evidenceReviewed !== 'boolean') throw Error('Stored evidence flags are invalid');
  return s;
}
