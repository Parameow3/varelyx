import test from 'node:test';
import assert from 'node:assert/strict';
import {validateExtraction} from '../public/core.mjs';
import {DEMO_SIGNALS} from '../public/demo-signals.mjs';
function extracted(overrides={}){return {supplier:'Supplier B',delay_hours:48,affected_routes:2,capacity_confirmed:null,summary:'Synthetic delivery disruption, capacity unknown.',confidence:.95,evidence_quotes:{delay_hours:'យឺតប្រហែល 48 ម៉ោង',affected_routes:'2 ផ្លូវ',capacity_confirmed:null},...overrides};}
test('localized samples keep the same grounded delay and route count, with no confirmed capacity',()=>{
 const quotes={en:['approximately 48 hours late','2 distribution routes'],bn:['প্রায় 48 ঘণ্টা দেরি','2 রুট'],km:['យឺតប្រហែល 48 ម៉ោង','2 ផ្លូវ']};
 for(const [locale,source] of Object.entries(DEMO_SIGNALS)){
  const [delay,routes]=quotes[locale];const value=validateExtraction(extracted({evidence_quotes:{delay_hours:delay,affected_routes:routes,capacity_confirmed:null}}),source);
  assert.equal(value.delay_hours,48);assert.equal(value.affected_routes,2);assert.equal(value.capacity_confirmed,null);
 }
});
test('Khmer digits and day units are grounded without changing source quotations',()=>{
 const source='ការដឹកជញ្ជូនយឺត ២ ថ្ងៃ។ ប៉ះពាល់ដល់ ២ ផ្លូវ។ អាចផ្គត់ផ្គង់ ១២០ កេស។';
 const value=validateExtraction(extracted({capacity_confirmed:120,evidence_quotes:{delay_hours:'យឺត ២ ថ្ងៃ',affected_routes:'២ ផ្លូវ',capacity_confirmed:'អាចផ្គត់ផ្គង់ ១២០ កេស'}}),source);
 assert.equal(value.delay_hours,48);assert.equal(value.capacity_confirmed,120);assert.equal(value.evidence_quotes.capacity_confirmed,'អាចផ្គត់ផ្គង់ ១២០ កេស');
});
test('Khmer unknown, negated, approximate and conflicting capacity claims remain blocked',()=>{
 for(const quote of ['មិនអាចផ្គត់ផ្គង់ 120 កេស','មិនទាន់បញ្ជាក់បរិមាណ 120 កេស','អាចផ្គត់ផ្គង់ប្រហែល 120 កេស','អាចផ្គត់ផ្គង់ចន្លោះ 60 កេស និង 120 កេស','អាចផ្គត់ផ្គង់ 60 កេស ឬ 120 កេស']){
  assert.throws(()=>validateExtraction(extracted({capacity_confirmed:120,evidence_quotes:{delay_hours:'យឺតប្រហែល 48 ម៉ោង',affected_routes:'2 ផ្លូវ',capacity_confirmed:quote}}),DEMO_SIGNALS.km+' '+quote),/Unsupported field\/unit or ambiguous source/);
 }
});
test('Khmer numbers do not establish the wrong field or an unquoted invented fact',()=>{
 assert.throws(()=>validateExtraction(extracted({delay_hours:2,evidence_quotes:{delay_hours:'2 ផ្លូវ',affected_routes:'2 ផ្លូវ',capacity_confirmed:null}}),DEMO_SIGNALS.km),/Unsupported field/);
 assert.throws(()=>validateExtraction(extracted({delay_hours:72}),DEMO_SIGNALS.km),/Unsupported number/);
});
