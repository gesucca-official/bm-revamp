# SB-21z: copy of the SB-21h launcher with -Games (games per cell, 100 by default).
param(
    [Parameter(Mandatory)][ValidateSet('feasibility','round')][string]$Phase,
    [Parameter(Mandatory)][ValidatePattern('^[a-z0-9-]+$')][string]$Label,
    [Parameter(Mandatory)][string]$Draft,
    [string]$Rows = '',
    [string]$Foes = '',
    [long]$Seed = 7000000,
    [int]$Games = 100,
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb19-b1')
)
# SB-21h Fase B: copy of the SB-19 launcher with -Seed (first seed, 7,000,000 by default). SB-19 Fase B1 (D129, D130): one round of the nine cards, one phase and one label per call, never two at once, never with other measures.
# feasibility: 4 seeds per cell (does the draft load and play?); round: 100 seeds per cell. 144 cells (twelve lethal-aware styles on each side)
# per matchup, the same seeds and styles as SB-17 and SB-18. Rows and Foes are comma-separated deck ids (empty: the seven reference decks:
# the five starters, prova-sergio, prova-duccio); a row against a foe that is also a row is played once. The arms of the proposal:
#   rif-today / rif-new  the seven reference decks among themselves (28 pairs), on the draft of 2896896 and on the new one;
#   a1                   Rows = the nine prova-b1-* decks, Foes = the seven references (63 pairs), on the new draft.
# The draft is a path without the «file:» prefix (the loader refuses it), or classpath:/set-base/bozza.json. A phase already attempted is
# refused (no automatic rerun). Exclusive measure: refused if a Java process is active.
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$manifest=Get-Content (Join-Path $root 'scripts/toolchain.json') -Raw | ConvertFrom-Json
$java=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'java').directory)
$mvn=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'maven').directory+'/bin/mvn.cmd')
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
if(($Draft -notlike 'classpath:*') -and -not (Test-Path -LiteralPath $Draft)){throw "STOP: draft not found: $Draft"}
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$name="$Phase-$Label"
$out=Join-Path $OutputRoot $name
$attemptFile=Join-Path $OutputRoot "$name-attempt.json"
if(Test-Path -LiteralPath $attemptFile){throw 'STOP: phase already attempted; no automatic rerun'}
$games= if($Phase -eq 'feasibility'){4}else{$Games}
$props=@("-Dsim.rules=d50","-Dsim.threads=8","-Dsim.draft=$Draft","-Dsim.sb19Games=$games","-Dsim.sb19Out=$out")
if($Rows){$props+="-Dsim.sb19Rows=$Rows"}
if($Foes){$props+="-Dsim.sb19Foes=$Foes"}
if($Seed -ne 7000000){$props+="-Dsim.sb19Seed=$Seed"}
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test','-Dtest=Sb19MeasureTest#round')+$props
$attempt=[ordered]@{phase=$Phase;label=$Label;draft=$Draft;rows=$Rows;foes=$Foes;gamesPerCell=$games;seed=$Seed;startedUtc=[DateTime]::UtcNow.ToString('o');javaProcessesBefore=0}
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 $attemptFile
$timer=[Diagnostics.Stopwatch]::StartNew()
Push-Location (Join-Path $root 'server')
try {
    & $mvn @argsMvn 2>&1 | Tee-Object -FilePath (Join-Path $OutputRoot "$name.log")
    $code=$LASTEXITCODE
} finally {Pop-Location;$timer.Stop()}
$attempt.wallSeconds=$timer.Elapsed.TotalSeconds
$attempt.exit=$code
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 $attemptFile
if($code -ne 0){throw "STOP: $name failed; see $OutputRoot/$name.log"}
Write-Output "$name finished in $($timer.Elapsed.TotalSeconds) wall seconds"
