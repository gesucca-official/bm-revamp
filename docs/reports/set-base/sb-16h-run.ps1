param(
    [ValidateSet('step0','round')][string]$Phase,
    [string]$OutputRoot = (Join-Path $env:TEMP 'bm-sb16h'),
    [string]$HistoricalStep0 = ''
)
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
if(Get-Process java -ErrorAction SilentlyContinue){throw 'STOP: another Java/Maven process is active'}
$java=Join-Path $root '.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
$mvn=Join-Path $root '.tools/apache-maven-3.6.3/bin/mvn.cmd'
$env:JAVA_HOME=$java
$env:Path="$java/bin;$env:Path"
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$games=4
if($Phase -eq 'round') {
    $feasibility=Get-Content -LiteralPath (Join-Path $OutputRoot 'feasibility.json') -Raw | ConvertFrom-Json
    if(!$feasibility.feasible){throw 'STOP: not feasible in D83'}
    $games=$feasibility.gamesPerCell
} elseif(!$HistoricalStep0) {
    $HistoricalStep0=Join-Path $OutputRoot 'historical-step0'
    New-Item -ItemType Directory -Force -Path $HistoricalStep0 | Out-Null
    foreach($name in @('matrix.json','matrix.md','observations.json','draft.json')) {
        $inputFile=[IO.File]::OpenRead((Join-Path $PSScriptRoot "sb-16h/historical-step0-$name.gz"))
        $gzip=[IO.Compression.GZipStream]::new($inputFile,[IO.Compression.CompressionMode]::Decompress)
        $outputFile=[IO.File]::Create((Join-Path $HistoricalStep0 $name))
        try {$gzip.CopyTo($outputFile)}finally{$outputFile.Dispose();$gzip.Dispose();$inputFile.Dispose()}
    }
}
$argsMvn=@('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o','-q','test',
    '-Dtest=DeckSizePhaseTest#measurePhase','-Dsim.rules=d50','-Dsim.arm=B','-Dsim.threads=8',
    '-Dsim.draft=classpath:/set-base/bozza.json',"-Dsim.chargeGames=$games","-Dsim.deckPhase=$Phase",
    "-Dsim.deckRoot=$OutputRoot","-Dsim.deckIdentity=$HistoricalStep0")
if(Test-Path -LiteralPath (Join-Path $OutputRoot "$Phase-attempt.json")){throw 'STOP: phase already attempted; no automatic rerun'}
$attempt=@{phase=$Phase;gamesPerCell=$games;startedUtc=[DateTime]::UtcNow.ToString('o');javaProcessesBefore=0}
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
