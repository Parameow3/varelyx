import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, stat, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {startLocalServer} from '../scripts/local-server.mjs';

async function fixture(t,options={}){
  const temp=await mkdtemp(path.join(tmpdir(),'varelyx-local-')),publicDirectory=path.join(temp,'public'),tokenFile=path.join(temp,'.local','appcheck-debug-token');
  await mkdir(publicDirectory);
  const html='<html><script type="module" src="/app.js"></script></html>';
  await writeFile(path.join(publicDirectory,'index.html'),html);await writeFile(path.join(publicDirectory,'app.js'),'export const app=true;');
  const local=await startLocalServer({port:0,publicDirectory,tokenFile,...options});
  t.after(async()=>{local.server.closeAllConnections();await new Promise(resolve=>local.server.close(resolve));await rm(temp,{recursive:true,force:true});});
  return {...local,publicDirectory,html,configuredTokenFile:tokenFile};
}
test('local server injects private App Check setup before the app without editing the production entry',async t=>{
  const local=await fixture(t),html=await(await fetch(local.url)).text();
  assert.ok(html.indexOf('/__local/appcheck.js')<html.indexOf('/app.js'));
  assert.equal(await readFile(path.join(local.publicDirectory,'index.html'),'utf8'),local.html);
  const script=await fetch(local.url+'/__local/appcheck.js');
  assert.equal(script.headers.get('cache-control'),'no-store');assert.equal(script.headers.get('cross-origin-resource-policy'),'same-origin');
  assert.ok((await script.text()).includes((await readFile(local.tokenFile,'utf8')).trim()));
  assert.equal((await stat(local.tokenFile)).mode&0o777,0o600);
  assert.equal(local.server.address().address,'127.0.0.1');
});
test('local token is stable across server restarts',async t=>{
  const local=await fixture(t),token=await readFile(local.tokenFile,'utf8');
  const second=await startLocalServer({port:0,publicDirectory:local.publicDirectory,tokenFile:local.tokenFile});
  try{assert.equal(await readFile(local.tokenFile,'utf8'),token);}finally{await new Promise(resolve=>second.server.close(resolve));}
});
test('local files and debug token cannot be requested from another host or site',async t=>{
  const local=await fixture(t);
  assert.equal((await fetch(local.url+'/__local/appcheck.js',{headers:{Origin:'https://unrelated.example'}})).status,403);
  assert.equal((await fetch(local.url+'/__local/appcheck.js',{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
  assert.equal((await fetch(local.url+'/.local/appcheck-debug-token')).status,404);
  assert.equal((await fetch(local.url+'/..%2f.local/appcheck-debug-token')).status,403);
  assert.equal((await fetch(local.url,{method:'POST',body:'no writes'})).status,405);
  const status=await new Promise((resolve,reject)=>{http.get(local.url+'/__local/appcheck.js',{headers:{host:'attacker.example'}},response=>{response.resume();resolve(response.statusCode);}).on('error',reject);});
  assert.equal(status,403);
});
test('invalid token configuration fails without disclosing its contents',async t=>{
  const local=await fixture(t);await writeFile(local.tokenFile,'not-a-valid-private-token');
  await assert.rejects(()=>startLocalServer({port:0,publicDirectory:local.publicDirectory,tokenFile:local.tokenFile}),error=>!error.message.includes('not-a-valid-private-token'));
});
test('local SVG branding is served as an image with nosniff protection retained',async t=>{
 const local=await fixture(t);await mkdir(path.join(local.publicDirectory,'assets'));
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"/>';
 await writeFile(path.join(local.publicDirectory,'assets','mark.svg'),svg);
 const result=await fetch(local.url+'/assets/mark.svg');assert.equal(result.status,200);assert.equal(result.headers.get('content-type'),'image/svg+xml');assert.equal(result.headers.get('x-content-type-options'),'nosniff');assert.equal(await result.text(),svg);
});

test('CI static mode serves the production entry without creating or exposing a device token',async t=>{
 const local=await fixture(t,{appCheckDebug:false});
 assert.equal(await(await fetch(local.url)).text(),local.html);
 assert.equal(local.tokenFile,null);
 await assert.rejects(stat(local.configuredTokenFile),{code:'ENOENT'});
 assert.equal((await fetch(local.url+'/__local/appcheck.js')).status,404);
 await writeFile(path.join(local.publicDirectory,'dependency.mjs'),'export const ready=true;');
 const module=await fetch(local.url+'/dependency.mjs');
 assert.equal(module.headers.get('content-type'),'text/javascript; charset=utf-8');
 assert.equal(module.headers.get('x-content-type-options'),'nosniff');
 assert.equal(module.headers.get('cache-control'),'no-store');
});
