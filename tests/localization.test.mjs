import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {translations,translate,ui} from '../public/i18n.mjs';
const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
const keys=[...new Set([...html.matchAll(/data-i18n(?:-aria|-title)?="([^"]+)"/g)].map(match=>match[1]))];
for(const [locale,script] of [['bn',/[\u0980-\u09ff]/],['km',/[\u1780-\u17ff]/]]){
  test(locale+' covers every static label and accessible name with native text',()=>{
    for(const key of keys){assert.ok(translations[locale][key],key);assert.match(translate(key,locale),script,key);}
  });
  test(locale+' translates variable statuses and nested save failures without losing details',()=>{
    assert.match(ui('FIREBASE SAVE VERIFIED — revision 7.',locale),script);
    assert.match(ui('FIREBASE SAVE VERIFIED — revision 7.',locale),/7/);
    const error=ui('SAVE NOT VERIFIED — Firebase save NOT VERIFIED. Reload before retrying. Firebase HTTP 403; check Auth, App Check and database rules',locale);
    assert.match(error,script);assert.match(error,/403/);assert.doesNotMatch(error,/NOT VERIFIED|Reload before|check Auth/);
    for(const text of ['48 hours','2 routes','90 cases','95% confidence','Proof generated · BLOCK','Receipt 0123456789abcdef…'])assert.match(ui(text,locale),script,text);
    assert.match(ui('HOLD — A successful live Gemini analysis is required; Confirmed supplier capacity is missing',locale),/^HOLD — /);
    assert.doesNotMatch(ui('HOLD — A successful live Gemini analysis is required; Confirmed supplier capacity is missing',locale),/is required|is missing/);
  });
}
test('English presentation and unknown external diagnostics remain verbatim',()=>{
  const source='Supplier B: unexplained provider error X123';
  assert.equal(ui(source,'en'),source);assert.equal(ui(source,'bn'),source);assert.equal(ui(source,'km'),source);
  assert.equal(translate('incidentCompact','bn',{hours:48,routes:2}),'48 ঘণ্টা বিলম্ব · 2টি রুট');
});
