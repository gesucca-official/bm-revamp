from pathlib import Path
import subprocess, json, os
root=Path('E:/bm')
mvn=root/'.tools/apache-maven-3.6.3/bin/mvn.cmd'
env=os.environ.copy();env['JAVA_HOME']=str(root/'.tools/zulu11.84.17-ca-jdk11.0.29-win_x64');env['PATH']=env['JAVA_HOME']+'/bin;'+env['PATH']
mutants=[
 ('end-of-turn', 'server/src/main/java/com/gsc/bm/model/game/Game.java','if (satisfied.contains(r)) s.expended();','if (false) s.expended();','VulnerabilitaD69Test'),
 ('exit-delay', 'server/src/main/java/com/gsc/bm/model/game/status/Status.java','lastCopyGone() { this.lastsForTurns = 1; }','lastCopyGone() { this.lastsForTurns = 0; }','VulnerabilitaD69Test'),
 ('outcome-gains', 'server/src/main/java/com/gsc/bm/model/game/Game.java','takeSearchGains(found != null)','takeSearchGains(true)','VulnerabilitaD69Test'),
 ('health-under-cost','server/src/main/java/com/gsc/bm/model/game/Move.java','game.getRuleset().playground() && playedCard.isLastBlow() && cost.getKey() == Resource.HEALTH','false','RegoleD50Test'),
 ('self-search','server/src/main/java/com/gsc/bm/model/game/Game.java','if (searched) m.recordSearch(search, found, copy);','if (copy != null && card.getName().equals(found.getName())) satisfied.add(self.getRevealed().get(self.getRevealed().size()-1));\n            if (searched) m.recordSearch(search, found, copy);','VulnerabilitaD69Test'),
 ('hold-policy','server/src/main/java/com/gsc/bm/model/game/bot/SoughtHitPolicy.java','timing == Timing.HOLD_IF_DEFENDED && !defended','timing == Timing.HOLD_IF_DEFENDED','SoughtHitPolicyTest'),
 ('exposed-target','server/src/main/java/com/gsc/bm/model/game/bot/SoughtHitPolicy.java','if (f > factor)','if (false)','SoughtHitPolicyTest'),
 ('discard-warning','client-web/src/model.ts','if(this.discardWarning&&!acceptWarning)','if(false)','client'),
]
results=[]
for name,file,old,new,test in mutants:
 p=root/file;original=p.read_bytes();text=original.decode('utf8');assert text.count(old)==1,(name,text.count(old))
 try:
  p.write_text(text.replace(old,new),encoding='utf8')
  if test=='client':
   command=[str(root/'.tools/client-c0/node-v24.13.0-win-x64/node.exe'),'--experimental-strip-types','--test','tests/model.test.ts'];cwd=root/'client-web'
  else:
   command=[str(mvn),'-s',str(root/'scripts/maven-settings.xml'),'-Dmaven.repo.local=E:/bm/.tools/m2','-B','-o','-q','test','-Dtest='+test];cwd=root/'server'
  r=subprocess.run(command,cwd=cwd,env=env,capture_output=True,timeout=180)
  log=r.stdout+r.stderr;(root/'tmp/sb16g2b1'/('mutation-'+name+'.log')).write_bytes(log)
  failures=(b'Failures: ' in log and b'<<< FAILURE!' in log) if test!='client' else b'AssertionError [ERR_ASSERTION]' in log
  results.append({'name':name,'test':test,'exit':r.returncode,'detectedByAssertion':failures,'compileError':b'COMPILATION ERROR' in log})
  print(results[-1],flush=True)
 finally:p.write_bytes(original)
(root/'tmp/sb16g2b1/mutations.json').write_text(json.dumps(results,indent=2))
assert all(r['exit'] and r['detectedByAssertion'] and not r['compileError'] for r in results)
