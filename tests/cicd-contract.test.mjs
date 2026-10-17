import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

async function read(path){ return readFile(new URL('../'+path, import.meta.url),'utf8'); }

test('Playwright covers required viewports and safety checks', async()=>{
  const config=await read('playwright.config.mjs');
  const smoke=await read('tests/e2e/smoke.spec.mjs');
  for(const size of ['1440','1280','390']) assert.match(config,new RegExp(size));
  for(const text of ['Review supplier evidence','workflow-tabs','capacityInput','Controlled simulation']) assert.match(smoke,new RegExp(text,'i'));
  assert.match(smoke,/scrollWidth/);
  assert.match(smoke,/pageerror/);
  assert.match(smoke,/console/);
});

test('CI runs complete Node Python and browser verification', async()=>{
  const ci=await read('.github/workflows/ci.yml');
  assert.match(ci,/npm run check:js/);
  assert.match(ci,/npm run test:node/);
  assert.match(ci,/pytest -q/);
  assert.match(ci,/playwright install.*chromium/);
  assert.match(ci,/test:e2e/);
  assert.match(ci,/STATIC_ONLY=1 node scripts\/local-server\.mjs/);
});