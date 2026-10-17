import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp,writeFile,mkdir,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publicAssets,verifyPublicRelease} from '../scripts/verify-public-release.mjs';
const asset=(path,body)=>({path,sha256:createHash('sha256').update(body).digest('hex')});
const assets=[asset('index.html','new page'),asset('app.js','new script')];
test('an old page and rewritten missing module cannot pass release verification despite HTTP 200',async()=>{
 const result=await verifyPublicRelease({url:'https://example.com/',assets,fetchImpl:async()=>new Response('old page')});
 assert.equal(result.exactAssetMatch,false);assert.deepEqual(result.results.map(x=>x.status),['mismatch','mismatch']);
});
test('a matching entry page with a stale module still blocks the release',async()=>{
 const result=await verifyPublicRelease({url:'https://example.com/',assets,fetchImpl:async url=>new Response(url.pathname==='/'?'new page':'old script')});
 assert.equal(result.exactAssetMatch,false);assert.equal(result.results[1].status,'mismatch');
});
test('matching assets verify bytes without claiming live AI or database verification',async()=>{
 const result=await verifyPublicRelease({url:'http://127.0.0.1:4185',assets,fetchImpl:async url=>new Response(url.pathname==='/'?'new page':'new script')});
 assert.equal(result.exactAssetMatch,true);assert.equal(result.liveServicesVerified,false);
});
test('HTTP failures, network failures and an empty inventory cannot pass',async()=>{
 for(const fetchImpl of [async()=>new Response('unavailable',{status:503}),async()=>{throw Error('private internal network diagnostic');}]){
  const result=await verifyPublicRelease({url:'https://example.com',assets,fetchImpl});assert.equal(result.exactAssetMatch,false);assert.doesNotMatch(JSON.stringify(result),/private internal/);
 }
 assert.equal((await verifyPublicRelease({url:'https://example.com',assets:[]})).exactAssetMatch,false);
});
test('unsafe URLs and traversal cannot make a release check target credentials or other hosts',async()=>{
 for(const url of ['http://example.com','https://user:password@example.com','https://example.com/?token=private'])await assert.rejects(verifyPublicRelease({url,assets}));
 await assert.rejects(verifyPublicRelease({url:'https://example.com',assets:[asset('../private','x')]}));
});
test('the asset inventory includes nested modules and excludes private dot files',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'varelyx-release-'));
 try{
  await writeFile(join(directory,'index.html'),'entry');await mkdir(join(directory,'assets'));await writeFile(join(directory,'assets','mark.svg'),'svg');await writeFile(join(directory,'.private'),'never publish');
  assert.deepEqual((await publicAssets(directory)).map(x=>x.path),['assets/mark.svg','index.html']);
  await symlink(join(directory,'.private'),join(directory,'leak'));
  await assert.rejects(publicAssets(directory),/Unsupported public asset/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
