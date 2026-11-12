# SB-16e2 (D56): the single numeric lot. Derived from sb-16e/run.ps1; budget read from budget.json, no reruns.
param([string]$OutputDirectory = $PSScriptRoot,
    [string]$DraftPath = 'src/test/resources/set-base/bozza.json')
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path "$PSScriptRoot/../../../..").Path
$evidence = $OutputDirectory
$budget = Get-Content (Join-Path $PSScriptRoot 'budget.json') -Raw | ConvertFrom-Json
$ledger = Join-Path $evidence 'compute.json'
if (Test-Path $ledger) { throw 'Lot already attempted; no second lot (D56).' }
$limit = [int]$budget.computeSecondsMax
$scratch = Join-Path $env:TEMP 'bm-sb16e2'
New-Item -ItemType Directory -Force $scratch | Out-Null
$env:JAVA_HOME = Join-Path $root '.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
$env:Path = "$env:JAVA_HOME/bin;$env:Path"
$argsMvn = @('-s', "$root/scripts/maven-settings.xml", "-Dmaven.repo.local=$root/.tools/m2", '-B', '-o', '-q', 'test',
    '-Dsim.rules=d50', '-Dsim.styles=aggressivo,prudente,risorse,com', '-Dsim.threads=8',
    '-Dtest=StarterLotMeasureTest#lot', "-Dsim.sb16e2Out=$evidence", "-Dsim.draft=$DraftPath")
$watch = [Diagnostics.Stopwatch]::StartNew()
$process = Start-Process -FilePath "$root/.tools/apache-maven-3.6.3/bin/mvn.cmd" -ArgumentList $argsMvn -WorkingDirectory "$root/server" -WindowStyle Hidden -PassThru -RedirectStandardOutput "$scratch/lot.log" -RedirectStandardError "$scratch/lot.err.log"
# Without a cached handle Windows PowerShell reports ExitCode as null after WaitForExit (it happened in the SB-16e2 lot).
$null = $process.Handle
$timedOut = -not $process.WaitForExit($limit * 1000)
if ($timedOut) { & taskkill.exe /PID $process.Id /T /F | Out-Null }
$watch.Stop()
$exitCode = if ($timedOut) { 124 } else { $process.ExitCode }
$entry = [PSCustomObject]@{name='lot'; seconds=[Math]::Round($watch.Elapsed.TotalSeconds,3); limit=$limit; exit=$exitCode; timeout=$timedOut}
ConvertTo-Json -InputObject @($entry) -Compress | Set-Content -Encoding utf8 $ledger
Get-Content "$scratch/lot.log" -Tail 14
Get-Content $ledger
if ($exitCode -ne 0) { throw "Lot failed ($exitCode), inspect $scratch." }
