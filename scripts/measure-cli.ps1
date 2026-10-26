param([int]$Samples = 5)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
1..$Samples | ForEach-Object {
    $startup = [Diagnostics.Stopwatch]::StartNew()
    & "$root/.tools/node-v12.22.12-win-x64/node.exe" "$PSScriptRoot/bm-cli.cjs" --help | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'CLI startup failed' }
    $startup.Stop()
    $watch = [Diagnostics.Stopwatch]::StartNew()
    $record = & "$root/.tools/node-v12.22.12-win-x64/node.exe" "$PSScriptRoot/cli-baseline.cjs"
    if ($LASTEXITCODE -ne 0) { throw 'CLI baseline failed' }
    $watch.Stop()
    $data = $record | ConvertFrom-Json
    $data | Add-Member -NotePropertyName processWallMs -NotePropertyValue $watch.Elapsed.TotalMilliseconds
    $data | Add-Member -NotePropertyName startupToHelpExitMs -NotePropertyValue $startup.Elapsed.TotalMilliseconds
    $data | Add-Member -NotePropertyName sample -NotePropertyValue $_
    $data | ConvertTo-Json -Depth 8 -Compress
}
