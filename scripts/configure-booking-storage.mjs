// One-time, narrowly scoped setup. Never prints credential values.
import {readFile,writeFile,access} from 'node:fs/promises';
import {randomBytes,scryptSync} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const secretsPath='.env.booking-secrets.local',accessPath='.env.admin-access.local';
let values;
try{await access(secretsPath);values=Object.fromEntries((await readFile(secretsPath,'utf8')).trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1)];}));}
catch(error){if(error.code!=='ENOENT')throw error;const password=randomBytes(24).toString('base64url'),salt=randomBytes(16).toString('hex');values={BOOKING_DATA_KEY:randomBytes(32).toString('hex'),BOOKING_ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex')};await writeFile(secretsPath,Object.entries(values).map(([k,v])=>`${k}=${v}`).join('\n')+'\n',{flag:'wx',mode:0o600});await writeFile(accessPath,`ADMIN_URL=https://melnourdi.fr/administration-reservations\nADMIN_PASSWORD=${password}\n`,{flag:'wx',mode:0o600});}
for(const[name,value]of Object.entries({...values,BOOKING_DATA_DIR:'/data/booking'})){const result=spawnSync('railway.exe',['variable','set',name,'--stdin','--skip-deploys','--project','739f3350-45be-4bf7-87f1-a84d0bcfef12','--service','c294c0e8-b287-4a8e-884f-baf00ebc85c2','--environment','production'],{input:value,encoding:'utf8',windowsHide:true});if(result.status!==0)throw Error('Configuration Railway échouée pour '+name+' (sortie masquée pour protéger les secrets).');console.log(name+' configured.');}
console.log('Credentials saved only in ignored local files. No email or payment enabled.');
