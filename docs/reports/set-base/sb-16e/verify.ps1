param([string]$Python = 'python')
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path "$PSScriptRoot/../../../..").Path
$scratch = Join-Path $env:TEMP 'bm-sb16e'
New-Item -ItemType Directory -Force $scratch | Out-Null
$oldPath = $env:Path
$pythonCommand = Get-Command $Python
$env:Path = "$(Split-Path $pythonCommand.Source -Parent);$env:Path"
$results = [Collections.Generic.List[object]]::new()
function Check([string]$name, [scriptblock]$command) {
    $watch = [Diagnostics.Stopwatch]::StartNew()
    $global:LASTEXITCODE = 0
    $code = 0
    try { & $command *> "$scratch/$name.log"; $code = $LASTEXITCODE }
    catch { $_ | Out-String | Add-Content "$scratch/$name.log"; $code = 1 }
    $watch.Stop()
    $results.Add([PSCustomObject]@{check=$name; exit=$code; seconds=[Math]::Round($watch.Elapsed.TotalSeconds,3); log="$scratch/$name.log"})
    "$name exit $code"
    Get-Content "$scratch/$name.log" -Tail 5
}
Push-Location $root
try {
    Check 'unit-tests' { ./scripts/build.ps1 -Task Test -Offline }
    Check 'rules' { & $Python scripts/check-rules.py }
    Check 'web-test' { ./client-web/run.ps1 -Task Test }
    Check 'web-build' { ./client-web/run.ps1 -Task Build }
    $oldOut = $env:BM_OUT
    try { $env:BM_OUT = "$scratch/size.json"; Check 'web-size' { ./client-web/run.ps1 -Task Size } }
    finally { $env:BM_OUT = $oldOut }
    Check 'links' { & $Python scripts/check-links.py }
    Check 'diff' { git diff --check }
} finally {
    Pop-Location
    $env:Path = $oldPath
    ConvertTo-Json -InputObject @($results.ToArray()) -Compress | Set-Content -Encoding utf8 "$PSScriptRoot/checks.json"
}
if ($results | Where-Object exit -ne 0) { throw 'Checks failed: inspect the individual logs; do not rerun automatically.' }
