param(
    [Parameter(Mandatory)][ValidateSet('live','step0')][string]$Kind,
    [Parameter(Mandatory)][ValidateSet('base','new','final')][string]$Build,
    [string]$Draft = '',
    [string]$Tag = '',
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb21h-b')
)
# SB-21h Fase B (D160 (4)): identity runs for the bot change, outside the bench budget.
# live : ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft, rules 1.13, 480,000 games, fixture base-draft.json of d701089 (CRLF,
#        SHA-256 faf265fa...) in $env:TEMP\bm-sb21h-live; output final-live.json/.md copied to live-<Build>.json/.md.
# step0: ChargeMeasureTest#measure, d50, arm B, 4 seeds per cell, 8,640 games, deckObserve and sb16iCounters, on a previous draft
#        (-Draft path, -Tag short name); output folder step0-<Tag>-<Build>. Compare base and new byte for byte (seconds.txt excluded).
# base: before the bot change; new: after; final: with the last code of the delivery. No automatic rerun. Exclusive: refused if a Java process is active.
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$manifest=Get-Content (Join-Path $root 'scripts/toolchain.json') -Raw | ConvertFrom-Json
$java=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'java').directory)
$mvn=Join-Path $root ('.tools/'+($manifest.tools | Where-Object name -eq 'maven').directory+'/bin/mvn.cmd')
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
if($Kind -eq 'live'){
    $ref=Join-Path $env:TEMP 'bm-sb21h-live'
    $name="live-$Build"
    $props=@('-Dsim.rules=1.13',"-Dsim.liveReference=$ref")
    $test='ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft'
} else {
    if(-not $Tag -or -not (Test-Path -LiteralPath $Draft)){throw 'STOP: step0 needs -Draft (existing file) and -Tag'}
    $name="step0-$Tag-$Build"
    $out=Join-Path $OutputRoot $name
    $props=@('-Dsim.rules=d50','-Dsim.arm=B','-Dsim.threads=8',"-Dsim.draft=$Draft",'-Dsim.chargeGames=4',
        "-Dsim.chargeOut=$out",'-Dsim.sb16iCounters=true','-Dsim.deckObserve=true')
    $test='ChargeMeasureTest#measure'
}
$attemptFile=Join-Path $OutputRoot "$name-attempt.json"
if(Test-Path -LiteralPath $attemptFile){throw 'STOP: phase already attempted; no automatic rerun'}
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test',"-Dtest=$test")+$props
$attempt=[ordered]@{phase=$name;draft=$Draft;startedUtc=[DateTime]::UtcNow.ToString('o')}
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
if($Kind -eq 'live'){
    Copy-Item (Join-Path $ref 'final-live.json') (Join-Path $OutputRoot "live-$Build.json")
    Copy-Item (Join-Path $ref 'final-live.md') (Join-Path $OutputRoot "live-$Build.md")
}
Write-Output "$name finished in $($timer.Elapsed.TotalSeconds) wall seconds"
