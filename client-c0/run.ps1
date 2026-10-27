param([ValidateSet('Bootstrap','Install','Build','Verify','Measure','Size','Serve')][string]$Task = 'Build', [switch]$Offline)
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$runtime = Join-Path $repo '.tools/client-c0/node-v24.13.0-win-x64'
$cache = Join-Path $repo '.tools/client-c0/npm-cache'
if ($Task -eq 'Bootstrap') {
    $base = Join-Path $repo '.tools/client-c0'
    New-Item -ItemType Directory -Force $base | Out-Null
    $url = 'https://nodejs.org/dist/v24.13.0'
    $zipName = 'node-v24.13.0-win-x64.zip'
    $zip = Join-Path $base $zipName
    Invoke-WebRequest "$url/$zipName" -OutFile $zip
    $checks = (Invoke-WebRequest "$url/SHASUMS256.txt").Content
    $expected = (($checks -split "`n" | Where-Object { $_ -match " $zipName`$" }) -split '\s+')[0]
    if (!$expected -or (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) { throw 'Checksum Node diverso' }
    Set-Content -LiteralPath (Join-Path $base 'SHASUMS256.txt') -Value $checks
    Expand-Archive -LiteralPath $zip -DestinationPath $base -Force
    Write-Output "Node verificato: $expected"
    exit
}
if (!(Test-Path -LiteralPath "$runtime/node.exe")) { throw 'Eseguire prima ./client-c0/run.ps1 -Task Bootstrap' }
$savedC0Path = $env:Path
$savedC0Analytics = $env:NG_CLI_ANALYTICS
$env:Path = "$runtime;$savedC0Path"
$env:NG_CLI_ANALYTICS = 'false'
Push-Location $PSScriptRoot
try {
    if ($Task -eq 'Install') {
        $argsC0 = @('ci', '--cache', $cache, '--no-audit', '--no-fund')
        if ($Offline) { $argsC0 += '--offline' }
        & "$runtime/npm.cmd" @argsC0
    } else {
        & "$runtime/npm.cmd" run (@{Build='build';Verify='verify';Measure='measure';Size='size';Serve='start'}[$Task])
    }
    if ($LASTEXITCODE -ne 0) { throw "C0 $Task fallito: $LASTEXITCODE" }
} finally { Pop-Location; $env:Path = $savedC0Path; $env:NG_CLI_ANALYTICS = $savedC0Analytics }
