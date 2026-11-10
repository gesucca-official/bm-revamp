# SB-8: -Bozza starts the server with the set draft (profile bozza, database data/bm-bozza.sqlite); -Pool, -Com, -Bot and
# -Draft set app.bozza.pool, app.bozza.com, app.bozza.bot and app.bozza.sources (docs/setup.md).
param([ValidateSet('Server', 'Client')][string]$Task = 'Client', [switch]$SeedAccounts, [switch]$Bozza,
    [string]$Pool, [string]$Com, [string]$Bot, [string]$Draft)
$ErrorActionPreference = 'Stop'
$workspace = Split-Path $PSScriptRoot -Parent
$manifest = Get-Content "$PSScriptRoot/toolchain.json" -Raw | ConvertFrom-Json
$node = $manifest.tools | Where-Object name -eq 'node'
$java = $manifest.tools | Where-Object name -eq 'java'
$savedPath = $env:Path
$savedAnalytics = $env:NG_CLI_ANALYTICS
try {
    if ($Task -eq 'Server') {
        Push-Location "$workspace/server"
        try {
            $serverArgs = @('--spring.profiles.active=local')
            if ($Bozza) {
                $serverArgs = @('--spring.profiles.active=local,bozza')
                if ($Pool) { $serverArgs += "--app.bozza.pool=$Pool" }
                if ($Com) { $serverArgs += "--app.bozza.com=$Com" }
                if ($Bot) { $serverArgs += "--app.bozza.bot=$Bot" }
                if ($Draft) { $serverArgs += "--app.bozza.sources=$Draft" }
            } elseif ($Pool -or $Com -or $Bot -or $Draft) { throw '-Pool, -Com, -Bot and -Draft need -Bozza' }
            if ($SeedAccounts) { $serverArgs += '--app.dev.seed-accounts=true' }
            & "$workspace/.tools/$($java.directory)/bin/java.exe" -jar target/bm-server-0.0.1-SNAPSHOT.jar @serverArgs
        } finally { Pop-Location }
    } else {
        $env:Path = "$workspace/.tools/$($node.directory);$savedPath"
        $env:NG_CLI_ANALYTICS = 'false'
        Push-Location "$workspace/client-debug"
        try {
            & "$workspace/.tools/$($node.directory)/node.exe" node_modules/@angular/cli/bin/ng serve --host 127.0.0.1 --port 4200 --proxy-config proxy.config.json
        } finally { Pop-Location }
    }
    if ($LASTEXITCODE -ne 0) { throw "Local $Task exited with code $LASTEXITCODE" }
} finally {
    $env:Path = $savedPath
    $env:NG_CLI_ANALYTICS = $savedAnalytics
}
