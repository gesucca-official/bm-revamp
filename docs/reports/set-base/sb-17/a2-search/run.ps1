param(
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb17-a2'),
    [string]$Draft = 'classpath:/set-base/bozza.json'
)
# SB-17 Fase A2, D109 (2): diagnostic SB-7 mutation search on the characters of the five starters, current draft, no change.
# Same parameters as the Fase B search (../run.ps1 -Phase search): rules d50, 8 threads, the three heuristic styles, at most
# 25 generations, starter and random start; the gauntlet is every deck of the draft. Wall-clock budget 900 s, fixed before the run.
# Exclusive measure: refused if a Java process is active; refused if already attempted (no automatic rerun). Reports go to tmp/sim/.
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$manifest=Get-Content (Join-Path $root 'scripts/toolchain.json') -Raw | ConvertFrom-Json
$java=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'java').directory)
$mvn=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'maven').directory+'/bin/mvn.cmd')
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$marker=Join-Path $OutputRoot 'search-attempt.json'
if(Test-Path -LiteralPath $marker){throw 'STOP: search already attempted; no automatic rerun'}
$chars='bruiser.character.BigBadBruiser,base.character.Mara,junkie.character.ToxicJunkie,base.character.Pino,base.character.Gigi'
$props=@("-Dsim.rules=d50","-Dsim.threads=8","-Dsim.draft=$Draft","-Dsim.search=$chars","-Dsim.searchGenerations=25","-Dsim.note=SB-17 Fase A2, ricerca di diagnosi")
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test','-Dtest=BenchMeasureTest#search')+$props
$attempt=[ordered]@{phase='a2-search';draft=$Draft;characters=$chars;budgetSeconds=900;startedUtc=[DateTime]::UtcNow.ToString('o')}
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 $marker
$timer=[Diagnostics.Stopwatch]::StartNew()
Push-Location (Join-Path $root 'server')
try {
    & $mvn @argsMvn 2>&1 | Tee-Object -FilePath (Join-Path $OutputRoot 'search.log') | Out-Null
    $code=$LASTEXITCODE
} finally {Pop-Location;$timer.Stop()}
$attempt.wallSeconds=$timer.Elapsed.TotalSeconds
$attempt.exit=$code
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 $marker
if($code -ne 0){throw "STOP: search failed; see $OutputRoot/search.log"}
Write-Output "search finished in $($timer.Elapsed.TotalSeconds) wall seconds"
