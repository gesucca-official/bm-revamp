param(
    [ValidateSet('identity','step0','round','fix-step0','fix-round')][string]$Phase,
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb16i'),
    [string]$Draft = 'classpath:/set-base/bozza.json'
)
# SB-16i Fase B (D97): one phase per call, never two at once, never with other measures. A phase already attempted is refused.
# identity: new code + 1.5 (arm B, 20/2 lists of SB-16h), 4 seeds per cell, to compare with step0-20-2 of SB-16h.
# step0 / round: the 1.6 in bozza.json (arm B already inside), 4 or 300 seeds per cell, SB-16h and SB-16i counters.
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$java=Join-Path $root '.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
$mvn=Join-Path $root '.tools/apache-maven-3.6.3/bin/mvn.cmd'
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$out=Join-Path $OutputRoot $Phase
if(Test-Path -LiteralPath (Join-Path $OutputRoot "$Phase-attempt.json")){throw 'STOP: phase already attempted; no automatic rerun'}
$games= if($Phase -in @('round','fix-round')){300}else{4}
$props=@("-Dsim.rules=d50","-Dsim.arm=B","-Dsim.threads=8","-Dsim.draft=$Draft","-Dsim.chargeGames=$games",
    "-Dsim.chargeOut=$out","-Dsim.sb16iCounters=true")
if($Phase -eq 'identity'){$props+='-Dsim.deckVariant=20-2'}else{$props+='-Dsim.deckObserve=true'}
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test',
    '-Dtest=ChargeMeasureTest#measure')+$props
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
