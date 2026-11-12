param([ValidateSet('1','2','3','listino','listino-7','observe-1','observe-2')][string]$Round,
    [string]$OutputDirectory = $PSScriptRoot,
    [string]$DraftPath = 'src/test/resources/set-base/bozza.json')
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path "$PSScriptRoot/../../../..").Path
$evidence = $OutputDirectory
New-Item -ItemType Directory -Force $evidence | Out-Null
$ledger = Join-Path $evidence 'compute.json'
$entries = @()
if (Test-Path $ledger) { $entries = @(Get-Content $ledger -Raw | ConvertFrom-Json) }
if ($entries | Where-Object name -eq $Round) { throw "Batch $Round already attempted; no automatic reruns." }
$used = ($entries | Measure-Object -Property seconds -Sum).Sum
$remaining = [int][Math]::Floor(7200 - $used)
if ($remaining -le 0) { throw 'Compute budget exhausted.' }
$scratch = Join-Path $env:TEMP 'bm-sb16e'
New-Item -ItemType Directory -Force $scratch | Out-Null
$env:JAVA_HOME = Join-Path $root '.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
$env:Path = "$env:JAVA_HOME/bin;$env:Path"
$argsMvn = @('-s', "$root/scripts/maven-settings.xml", "-Dmaven.repo.local=$root/.tools/m2", '-B', '-o', '-q', 'test',
    '-Dsim.rules=d50', '-Dsim.styles=aggressivo,prudente,risorse,com', '-Dsim.threads=8')
if ($Round.StartsWith('observe-')) {
    $number = $Round.Substring(8)
    $out = Join-Path $evidence "round-$number"
    $argsMvn += @('-Dtest=StarterBalanceMeasureTest#observations', "-Dsim.sb16eObserve=$out", "-Dsim.draft=$out/draft.json")
} elseif ($Round.StartsWith('listino')) {
    $argsMvn += @('-Dtest=ListinoMeasureTest', '-Dsim.listino=priorita,allerta', '-Dsim.listinoBase=set-base',
        '-Dsim.sb16eTiming=true', '-Dsim.note=SB-16e_rules_d50_five_starters', '-Dsim.listinoBisect=400', '-Dsim.listinoGrid=2000', '-Dsim.listinoCurve=2000')
    $argsMvn += '-Dsim.listinoAnchor=7'
    if ($Round -eq 'listino-7') {
        $pilot = Join-Path $scratch 'listino-10'
        New-Item -ItemType Directory -Force $pilot | Out-Null
        Copy-Item "$root/tmp/sim/sb11b-listino-priorita+allerta.*" $pilot
    }
} else {
    $out = Join-Path $evidence "round-$Round"
    $argsMvn += @('-Dtest=StarterBalanceMeasureTest#round', "-Dsim.sb16e=$Round", "-Dsim.sb16eOut=$out",
        "-Dsim.sb16eReference=$PSScriptRoot/reference-before-d.json", "-Dsim.draft=$DraftPath")
}
$watch = [Diagnostics.Stopwatch]::StartNew()
$process = Start-Process -FilePath "$root/.tools/apache-maven-3.6.3/bin/mvn.cmd" -ArgumentList $argsMvn -WorkingDirectory "$root/server" -WindowStyle Hidden -PassThru -RedirectStandardOutput "$scratch/$Round.log" -RedirectStandardError "$scratch/$Round.err.log"
$timedOut = -not $process.WaitForExit($remaining * 1000)
if ($timedOut) { & taskkill.exe /PID $process.Id /T /F | Out-Null }
$watch.Stop()
$exitCode = if ($timedOut) { 124 } else { $process.ExitCode }
$entries += [PSCustomObject]@{name=$Round; seconds=[Math]::Round($watch.Elapsed.TotalSeconds,3); exit=$exitCode; timeout=$timedOut}
ConvertTo-Json -InputObject @($entries) -Compress | Set-Content -Encoding utf8 $ledger
Get-Content "$scratch/$Round.log" -Tail 14
if ($exitCode -ne 0) { throw "Batch $Round failed ($exitCode), inspect $scratch." }
if ($Round.StartsWith('listino')) {
    Copy-Item "$root/tmp/sim/sb11b-listino-priorita+allerta.*" $evidence
}
Get-Content $ledger
