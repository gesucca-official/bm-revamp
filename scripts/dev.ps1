param([ValidateSet('Server', 'Client')][string]$Task = 'Client', [switch]$SeedAccounts)
$ErrorActionPreference = 'Stop'
$workspace = Split-Path $PSScriptRoot -Parent
$manifest = Get-Content "$PSScriptRoot/toolchain.json" -Raw | ConvertFrom-Json
$node = $manifest.tools | Where-Object name -eq 'node'
$java = $manifest.tools | Where-Object name -eq 'java'
$savedPath = $env:Path
$savedAnalytics = $env:NG_CLI_ANALYTICS
try {
    if ($Task -eq 'Server') {
        Push-Location "$workspace/bm-server"
        try {
            $serverArgs = @('--spring.profiles.active=local')
            if ($SeedAccounts) { $serverArgs += '--app.dev.seed-accounts=true' }
            & "$workspace/.tools/$($java.directory)/bin/java.exe" -jar target/bm-server-0.0.1-SNAPSHOT.jar @serverArgs
        } finally { Pop-Location }
    } else {
        $env:Path = "$workspace/.tools/$($node.directory);$savedPath"
        $env:NG_CLI_ANALYTICS = 'false'
        Push-Location "$workspace/bm-web-client"
        try {
            & "$workspace/.tools/$($node.directory)/node.exe" node_modules/@angular/cli/bin/ng serve --host 127.0.0.1 --port 4200 --proxy-config proxy.config.json
        } finally { Pop-Location }
    }
    if ($LASTEXITCODE -ne 0) { throw "Local $Task exited with code $LASTEXITCODE" }
} finally {
    $env:Path = $savedPath
    $env:NG_CLI_ANALYTICS = $savedAnalytics
}
