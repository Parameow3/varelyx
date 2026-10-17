import test from 'node:test';
import assert from 'node:assert/strict';
import {convertBdt,money,validRates,REFERENCE_RATES} from '../public/currency.mjs';
import {translations} from '../public/i18n.mjs';
import {khmerPhrases} from '../public/khmer.mjs';
test('currency conversion uses the BDT source amount and explicit cross rates',()=>{
 const rates={bdtPerUsd:120,khrPerUsd:4000};
 assert.equal(convertBdt(186000,'BDT',rates),186000);
 assert.equal(convertBdt(186000,'USD',rates),1550);
 assert.equal(convertBdt(186000,'KHR',rates),6200000);
 assert.equal(money(186000,{code:'USD',fx:rates}),'USD 1,550.00');
 assert.equal(money(186000,{code:'KHR',fx:rates}),'KHR 6,200,000');
 assert.equal(money(0,{code:'USD',fx:rates}),'USD 0.00');
 assert.deepEqual(rates,{bdtPerUsd:120,khrPerUsd:4000});
});
test('malformed or nonpositive rates cannot produce misleading display amounts',()=>{
 for(const value of [null,{}, {bdtPerUsd:0,khrPerUsd:4000},{bdtPerUsd:-1,khrPerUsd:4000},{bdtPerUsd:Infinity,khrPerUsd:4000},{bdtPerUsd:'120',khrPerUsd:4000},{bdtPerUsd:120,khrPerUsd:1e9}])assert.equal(Boolean(validRates(value)),false);
 assert.throws(()=>convertBdt(100,'EUR',REFERENCE_RATES));assert.throws(()=>convertBdt(NaN,'USD',REFERENCE_RATES));
});
test('Khmer covers all active keyed workflow messages and interpolated ceilings',()=>{
 for(const key of ['language','analyze','reanalyze','reviewCapacityTitle','confirmCapacity','approveDecisionTitle','confirmApproval','stateWaiting','stateReview','stateProof','stateApproval','stateApproved','approvalBlocked','capacityUnknown','proofHelp','savedHelp','cashCeiling'])assert.match(translations.km[key],/[\u1780-\u17ff]/);
 assert.match(khmerPhrases['Display conversion only. Proof and saved amounts remain in BDT.'],/[\u1780-\u17ff]/);
});
