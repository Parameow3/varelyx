import http from 'node:http';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {readFile, writeFile, mkdir, chmod} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokenPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const types = {'.svg':'image/svg+xml','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};

async function deviceToken(filename) {
  await mkdir(path.dirname(filename), {recursive:true, mode:0o700});
  try {
    await writeFile(filename, randomUUID()+'\n', {flag:'wx', mode:0o600});
  } catch (error) { if(error.code !== 'EEXIST') throw error; }
  await chmod(filename, 0o600);
  const token = (await readFile(filename,'utf8')).trim();
  if(!tokenPattern.test(token)) throw Error('Invalid local App Check token file. Expected a Firebase UUID debug token.');
  return token;
}

export async function startLocalServer({port=4174, publicDirectory=path.join(repository,'public'), tokenFile=path.join(repository,'.local','appcheck-debug-token'), appCheckDebug=true}={}) {
  if(!Number.isInteger(port)||port<0||port>65535) throw Error('Invalid local port');
  const root=path.resolve(publicDirectory), token=appCheckDebug?await deviceToken(tokenFile):null;
  const server=http.createServer(async(request,response)=>{
    const reply=(code,body,type='text/plain; charset=utf-8')=>{
      response.writeHead(code,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin','Referrer-Policy':'no-referrer'});
      response.end(body);
    };
    const host=request.headers.host;
    const allowedHosts=new Set(['127.0.0.1:'+server.address().port,'localhost:'+server.address().port]);
    if(!allowedHosts.has(host)) return reply(403,'Local host required');
    if(request.headers['sec-fetch-site']==='cross-site'||(request.headers.origin&&request.headers.origin!=='http://'+host)) return reply(403,'Same-origin local requests only');
    if(!['GET','HEAD'].includes(request.method)) return reply(405,'Read-only development server');
    try {
      const pathname=decodeURIComponent(new URL(request.url,'http://'+host).pathname);
      if(pathname==='/__local/appcheck.js'&&!appCheckDebug)return reply(404,'Not found');
      if(pathname==='/__local/appcheck.js') return reply(200,request.method==='HEAD'?'':'globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = '+JSON.stringify(token)+';\nglobalThis.__VARELYX_LOCAL_DEV__ = true;\n','text/javascript; charset=utf-8');
      const filename=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if(!filename.startsWith(root+path.sep)) return reply(403,'Forbidden');
      let data=await readFile(filename);
      if(appCheckDebug&&filename===path.join(root,'index.html')) {
        const html=data.toString();
        const marker='<script type="module" src="/app.js"></script>';
        if(!html.includes(marker)) return reply(500,'Local entry point not found');
        data=html.replace(marker,'<script src="/__local/appcheck.js"></script>\n'+marker);
      }
      reply(200,request.method==='HEAD'?'':data,types[path.extname(filename)]??'application/octet-stream');
    } catch { reply(404,'Not found'); }
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
  return {server,url:'http://127.0.0.1:'+server.address().port,tokenFile:appCheckDebug?tokenFile:null};
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url) {
  const local=await startLocalServer({port:Number(process.env.PORT??4174),appCheckDebug:process.env.STATIC_ONLY!=='1'});
  console.log('Varelyx local development: '+local.url);
  if(local.tokenFile){
    console.log('Private App Check token file: '+local.tokenFile);
    console.log('Register this device token in Firebase App Check before using live AI and saving. See docs/LOCAL_DEVELOPMENT.md.');
  }else console.log('Static UI test mode: no App Check token is created or served.');
}
