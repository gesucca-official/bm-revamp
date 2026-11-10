// Windows job cleanup. A port alone is never authority to stop a process: require
// ancestry from the launched PID, creation time and the exact command line too.
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
const ps=async script=>{
  const {stdout}=await exec('powershell',['-NoProfile','-Command',script],{windowsHide:true,maxBuffer:8*1024*1024});
  return stdout.trim()?JSON.parse(stdout):[];
};
export async function stopJob(pid,serverPort,startedAt,spawnArgs,log){
  const rows=[].concat(await ps('Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,CommandLine,@{n="Created";e={$_.CreationDate.ToUniversalTime().ToString("o")}} | ConvertTo-Json -Compress'));
  const root=rows.find(p=>p.ProcessId===pid),normal=s=>String(s??'').replaceAll('\\','/').toLowerCase();
  if(root&&(Math.abs(Date.parse(root.Created)-startedAt)>5000||!spawnArgs.every(a=>normal(root.CommandLine).includes(normal(a)))))
    throw new Error(`job PID ${pid} changed identity; not stopping its processes`);
  const owned=new Set([pid]);let changed=true;
  while(changed){changed=false;for(const p of rows)if(!owned.has(p.ProcessId)&&owned.has(p.ParentProcessId)&&Date.parse(p.Created)>=startedAt-1000){owned.add(p.ProcessId);changed=true;}}
  const descendants=rows.filter(p=>owned.has(p.ProcessId)&&p.ProcessId!==pid);
  const listeners=[].concat(await ps(`$ErrorActionPreference='Stop'; try { Get-NetTCPConnection -State Listen -LocalPort ${serverPort} | Select-Object OwningProcess | ConvertTo-Json -Compress } catch { if ($_.FullyQualifiedErrorId -eq 'CmdletizationQuery_NotFound,Get-NetTCPConnection') { '[]'; exit 0 }; throw }`));
  for(const {OwningProcess:owner} of listeners){
    const p=rows.find(p=>p.ProcessId===owner);
    if(!p||!owned.has(owner)||!/(?:^|[\\/])java(?:\.exe)?"?\s+-jar\s/i.test(p.CommandLine??'')||!p.CommandLine.includes('bm-server-0.0.1-SNAPSHOT.jar')||!p.CommandLine.includes(`--server.port=${serverPort}`))
      throw new Error(`port ${serverPort}: PID ${owner} is not a verified server of job ${pid}; not stopping it`);
    log(`verified server PID ${owner}, created ${p.Created}, command: ${p.CommandLine}`);
  }
  for(const p of [...descendants.reverse(),...rows.filter(p=>p.ProcessId===pid)]){
    // Re-read immediately before stopping: protects against PID reuse.
    const current=[].concat(await ps(`Get-CimInstance Win32_Process -Filter "ProcessId=${p.ProcessId}" | Select-Object CommandLine,@{n="Created";e={$_.CreationDate.ToUniversalTime().ToString("o")}} | ConvertTo-Json -Compress`))[0];
    if(!current)continue;
    if(current.Created!==p.Created||current.CommandLine!==p.CommandLine)throw new Error(`PID ${p.ProcessId} changed identity; not stopping it`);
    log(`stopping owned PID ${p.ProcessId}: ${p.CommandLine}`);
    await exec('taskkill',['/PID',String(p.ProcessId),'/T','/F'],{windowsHide:true}).catch(()=>{});
  }
  if(descendants.length||root){
    const remaining=[].concat(await ps('Get-CimInstance Win32_Process | Select-Object ProcessId,CommandLine,@{n="Created";e={$_.CreationDate.ToUniversalTime().ToString("o")}} | ConvertTo-Json -Compress'))
      .filter(p=>rows.some(old=>owned.has(old.ProcessId)&&old.ProcessId===p.ProcessId&&old.Created===p.Created&&old.CommandLine===p.CommandLine));
    if(remaining.length)throw new Error(`owned processes still alive after cleanup: ${remaining.map(p=>p.ProcessId).join(', ')}`);
    log('all recorded owned processes stopped');
  }
}
