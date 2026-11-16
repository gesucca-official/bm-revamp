param(
    [ValidateSet('feasibility','round-1','round-2','round-3','search')][string]$Phase,
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb17'),
    [string]$Draft = 'classpath:/set-base/bozza.json'
)
# SB-17 Fase B (D106 (5)): the round of Sergio, one phase per call, never two at once, never with other measures.
# feasibility: 4 seeds per cell; round-N: 300 seeds per cell. 864 cells: prova-sergio against the five starters and the mirror.
# search: SB-7 mutation search for Sergio (BenchMeasureTest#search, the three heuristic styles, standard params but at most 25
# generations, to fit the 450 s cap); the gauntlet is every deck of the draft, mirror included. Reports go to tmp/sim/.
# A phase already attempted is refused (no automatic rerun).
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$manifest=Get-Content (Join-Path $root 'scripts/toolchain.json') -Raw | ConvertFrom-Json
$java=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'java').directory)
$mvn=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'maven').directory+'/bin/mvn.cmd')
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$out=Join-Path $OutputRoot $Phase
if(Test-Path -LiteralPath (Join-Path $OutputRoot "$Phase-attempt.json")){throw 'STOP: phase already attempted; no automatic rerun'}
$games= if($Phase -eq 'feasibility'){4}else{300}
if($Phase -eq 'search'){
    $games=0
    $props=@("-Dsim.rules=d50","-Dsim.threads=8","-Dsim.draft=$Draft","-Dsim.search=base.character.Cesira","-Dsim.searchGenerations=25","-Dsim.note=SB-17 Fase B")
    $test='BenchMeasureTest#search'
} else {
    $props=@("-Dsim.rules=d50","-Dsim.threads=8","-Dsim.draft=$Draft","-Dsim.sb17Games=$games","-Dsim.sb17Out=$out")
    $test='Sb17MeasureTest#round'
}
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test',"-Dtest=$test")+$props
$attempt=[ordered]@{phase=$Phase;draft=$Draft;gamesPerCell=$games;startedUtc=[DateTime]::UtcNow.ToString('o');javaProcessesBefore=0}
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 (Join-Path $OutputRoot "$Phase-attempt.json")
$timer=[Diagnostics.Stopwatch]::StartNew()
Push-Location (Join-Path $root 'server')
try {
    & $mvn @argsMvn 2>&1 | Tee-Object -FilePath (Join-Path $OutputRoot "$Phase.log")
    $code=$LASTEXITCODE
} finally {Pop-Location;$timer.Stop()}
$attempt.wallSeconds=$timer.Elapsed.TotalSeconds
$attempt.exit=$code
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 (Join-Path $OutputRoot "$Phase-attempt.json")
if($code -ne 0){throw "STOP: $Phase failed; see $OutputRoot/$Phase.log"}
Write-Output "$Phase finished in $($timer.Elapsed.TotalSeconds) wall seconds"
