// Read-only release check: a reachable old page is not the reviewed candidate.
import {createHash} from 'node:crypto';
import {readdir, readFile} from 'node:fs/promises';
import {resolve, relative, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export async function publicAssets(directory) {
  const result=[];
  async function visit(path) {
    for(const entry of await readdir(path,{withFileTypes:true})) {
      if(entry.name.startsWith('.'))continue;
      const full=resolve(path,entry.name);
      if(entry.isDirectory())await visit(full);
      else if(entry.isFile())result.push({path:relative(directory,full).split(sep).join('/'),sha256:sha256(await readFile(full))});
      else throw Error('Unsupported public asset: '+entry.name);
    }
  }
  await visit(directory);
  if(!result.some(asset=>asset.path==='index.html'))throw Error('Public index.html is missing');
  return result.sort((a,b)=>a.path.localeCompare(b.path));
}
export async function verifyPublicRelease({url,assets,fetchImpl=fetch,timeoutMs=15000}) {
  const base=new URL(url);
  if(base.username||base.password||base.search||base.hash)throw Error('Use a base URL without credentials, query or fragment');
  if(base.protocol!=='https:'&&!(base.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(base.hostname)))throw Error('HTTPS is required outside loopback');
  if(!base.pathname.endsWith('/'))base.pathname+='/';
  const results=[];
  for(let i=0;i<assets.length;i+=4) {
    results.push(...await Promise.all(assets.slice(i,i+4).map(async asset=>{
      if(asset.path.startsWith('/')||asset.path.split('/').some(part=>part==='..'||part==='.')||asset.path.includes('\\'))throw Error('Invalid public asset path');
      const target=new URL(asset.path==='index.html'?'./':asset.path.split('/').map(encodeURIComponent).join('/'),base);
      try {
        const response=await fetchImpl(target,{cache:'no-store',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(timeoutMs)});
        if(!response.ok)return {path:asset.path,status:'http-error',httpStatus:response.status};
        const actual=sha256(Buffer.from(await response.arrayBuffer()));
        return {path:asset.path,status:actual===asset.sha256?'match':'mismatch',httpStatus:response.status,expected:asset.sha256,actual};
      }catch(error){return {path:asset.path,status:'unreachable',error:error.name==='TimeoutError'?'Request timed out':'Request failed'};}
    })));
  }
  return {url:base.href,checkedAt:new Date().toISOString(),assetCount:assets.length,
    exactAssetMatch:assets.length>0&&results.every(result=>result.status==='match'),
    liveServicesVerified:false,
    scope:'Static bytes only. Separately verify normal-browser App Check, live Gemini, approval, Firebase read-back and reload.',results};
}
async function main() {
  const args=process.argv.slice(2),index=args.indexOf('--url');
  const url=index>=0?args[index+1]:process.env.PRODUCTION_URL||'https://varelyx-ai-builder-cup.web.app';
  if(!url||(args.length!==0&&(args.length!==2||args[0]!=='--url')))throw Error('Usage: node scripts/verify-public-release.mjs [--url BASE_URL]');
  const assets=await publicAssets(fileURLToPath(new URL('../public/',import.meta.url)));
  const report=await verifyPublicRelease({url,assets});
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
  if(!report.exactAssetMatch)process.exitCode=1;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main().catch(error=>{console.error(error.message);process.exitCode=1;});
