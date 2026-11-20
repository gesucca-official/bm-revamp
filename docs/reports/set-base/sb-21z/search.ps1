# SB-21z: copy of the SB-21h search launcher with -Generations (25 by default).
# SB-21h Fase B: copy of the SB-19 search launcher (root one folder deeper), unchanged otherwise.
param(
    [Parameter(Mandatory)][ValidatePattern('^[a-z0-9-]+$')][string]$Label,
    [Parameter(Mandatory)][string]$Draft,
    [Parameter(Mandatory)][string]$Characters,
    [int]$Generations = 25,
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb19-b1')
)
# SB-19 Fase B1 (D130 (4)): diagnostic SB-7 mutation search «before» on the seven characters, on the draft of today (the file of 2896896,
# a path without the «file:» prefix), no change. The tool and the parameters are those of SB-17 Fase A2 (../../sb-17/a2-search/run.ps1),
# extended from five characters to seven (Sergio and Duccio added): rules d50, 8 threads, the three heuristic styles, at most 25 generations,
# starter (or test deck) and random start; the gauntlet is every deck of the draft. Wall-clock budget 1.200 s for the two calls together, fixed before the run (D130 (4)).
# Exclusive measure: refused if a Java process is active; refused if already attempted (no automatic rerun). Reports go to tmp/sim/.
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$manifest=Get-Content (Join-Path $root 'scripts/toolchain.json') -Raw | ConvertFrom-Json
$java=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'java').directory)
$mvn=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'maven').directory+'/bin/mvn.cmd')
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$marker=Join-Path $OutputRoot "search-$Label-attempt.json"
if(Test-Path -LiteralPath $marker){throw 'STOP: search already attempted; no automatic rerun'}
$chars=$Characters # in two calls so that a budget that runs out keeps the first part: Spazienzio,Mara,Celestina,Piera then Beppe,Sergio,Duccio (bruiser.character.BigBadBruiser, base.character.Mara, junkie.character.ToxicJunkie, base.character.Pino, base.character.Gigi, base.character.Cesira, base.character.Rocco)
$props=@("-Dsim.rules=d50","-Dsim.threads=8","-Dsim.draft=$Draft","-Dsim.search=$chars","-Dsim.searchGenerations=$Generations","-Dsim.note=SB-19 Fase B1, ricerca di diagnosi $Label")
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test','-Dtest=BenchMeasureTest#search')+$props
$attempt=[ordered]@{phase='b1-search';label=$Label;draft=$Draft;characters=$chars;budgetSeconds=1200;startedUtc=[DateTime]::UtcNow.ToString('o')}
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 $marker
$timer=[Diagnostics.Stopwatch]::StartNew()
Push-Location (Join-Path $root 'server')
try {
    & $mvn @argsMvn 2>&1 | Tee-Object -FilePath (Join-Path $OutputRoot "search-$Label.log") | Out-Null
    $code=$LASTEXITCODE
} finally {Pop-Location;$timer.Stop()}
$attempt.wallSeconds=$timer.Elapsed.TotalSeconds
$attempt.exit=$code
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 $marker
if($code -ne 0){throw "STOP: search failed; see $OutputRoot/search-$Label.log"}
Write-Output "search finished in $($timer.Elapsed.TotalSeconds) wall seconds"
