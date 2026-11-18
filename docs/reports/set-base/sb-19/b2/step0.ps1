param(
    [Parameter(Mandatory)][ValidateSet('base','new')][string]$Build,
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb19-b2')
)
# SB-19 Fase B2 (D130): step-0 identity on the draft of 6630ebf (end of B1b, extracted to a file), d50, arm B, 4 seeds per cell,
# 8,640 games, the same settings as the B1 step 0 (ChargeMeasureTest#measure with deckObserve and sb16iCounters).
# base: run before RP-27 (engine, loader, bots) and the draft change; new: after. Compare the two folders byte for byte (seconds.txt excluded).
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$manifest=Get-Content (Join-Path $root 'scripts/toolchain.json') -Raw | ConvertFrom-Json
$java=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'java').directory)
$mvn=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'maven').directory+'/bin/mvn.cmd')
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$draft=Join-Path $OutputRoot 'bozza-6630ebf.json'
# extracted beforehand, bytes as in git: git show 6630ebf:server/src/test/resources/set-base/bozza.json > $draft
if(-not (Test-Path -LiteralPath $draft)){throw "STOP: extract the draft of 6630ebf to $draft first"}
$out=Join-Path $OutputRoot "step0-$Build"
if(Test-Path -LiteralPath (Join-Path $OutputRoot "step0-$Build-attempt.json")){throw 'STOP: phase already attempted; no automatic rerun'}
$props=@("-Dsim.rules=d50","-Dsim.arm=B","-Dsim.threads=8","-Dsim.draft=$draft","-Dsim.chargeGames=4",
    "-Dsim.chargeOut=$out","-Dsim.sb16iCounters=true","-Dsim.deckObserve=true")
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test',
    '-Dtest=ChargeMeasureTest#measure')+$props
$attempt=[ordered]@{phase="step0-$Build";draft=$draft;gamesPerCell=4;startedUtc=[DateTime]::UtcNow.ToString('o')}
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 (Join-Path $OutputRoot "step0-$Build-attempt.json")
$timer=[Diagnostics.Stopwatch]::StartNew()
Push-Location (Join-Path $root 'server')
try {
    & $mvn @argsMvn 2>&1 | Tee-Object -FilePath (Join-Path $OutputRoot "step0-$Build.log")
    $code=$LASTEXITCODE
} finally {Pop-Location;$timer.Stop()}
$attempt.wallSeconds=$timer.Elapsed.TotalSeconds
$attempt.exit=$code
$attempt | ConvertTo-Json -Compress | Set-Content -Encoding utf8 (Join-Path $OutputRoot "step0-$Build-attempt.json")
if($code -ne 0){throw "STOP: step0-$Build failed; see $OutputRoot/step0-$Build.log"}
Write-Output "step0-$Build finished in $($timer.Elapsed.TotalSeconds) wall seconds"
