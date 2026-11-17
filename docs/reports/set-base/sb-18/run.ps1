param(
    [Parameter(Mandatory)][ValidateSet('feasibility','round')][string]$Phase,
    [Parameter(Mandatory)][ValidateSet('c','v1','v2','v3')][string]$Variant,
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb18'),
    [string]$Draft = ''
)
# SB-18 Fase B (D124): the round of Duccio, one phase and one variant per call, never two at once, never with other measures.
# feasibility: 4 seeds per cell (does the variant load and play?); round: 300 seeds per cell. 864 cells: prova-duccio against the five
# starters and the mirror, twelve lethal-aware styles, same seeds and styles as SB-17. The draft is docs/reports/set-base/sb-18/b/bozza-<variant>.json
# (the path without the «file:» prefix: the loader refuses it). A phase already attempted is refused (no automatic rerun).
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$manifest=Get-Content (Join-Path $root 'scripts/toolchain.json') -Raw | ConvertFrom-Json
$java=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'java').directory)
$mvn=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'maven').directory+'/bin/mvn.cmd')
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
if(-not $Draft){$Draft=(Join-Path $PSScriptRoot "b/bozza-$Variant.json")}
if(-not (Test-Path -LiteralPath $Draft)){throw "STOP: draft not found: $Draft"}
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$name="$Phase-$Variant"
$out=Join-Path $OutputRoot $name
$attemptFile=Join-Path $OutputRoot "$name-attempt.json"
if(Test-Path -LiteralPath $attemptFile){throw 'STOP: phase already attempted; no automatic rerun'}
$games= if($Phase -eq 'feasibility'){4}else{300}
$props=@("-Dsim.rules=d50","-Dsim.threads=8","-Dsim.draft=$Draft","-Dsim.sb18Games=$games","-Dsim.sb18Out=$out")
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test','-Dtest=Sb18MeasureTest#round')+$props
$attempt=[ordered]@{phase=$Phase;variant=$Variant;draft=$Draft;gamesPerCell=$games;startedUtc=[DateTime]::UtcNow.ToString('o');javaProcessesBefore=0}
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
