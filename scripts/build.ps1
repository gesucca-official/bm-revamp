param(
    [ValidateSet('Install', 'Server', 'Client', 'TestServer', 'TestClient', 'Test', 'TestServerContext', 'All')]
    [string]$Task = 'All',
    [switch]$Offline
)
$ErrorActionPreference = 'Stop'
$workspace = Split-Path $PSScriptRoot -Parent
New-Item -ItemType Directory -Path (Join-Path $workspace '.build-logs') -Force | Out-Null
$manifest = Get-Content (Join-Path $PSScriptRoot 'toolchain.json') -Raw | ConvertFrom-Json
$javaTool = $manifest.tools | Where-Object name -eq 'java'
$nodeTool = $manifest.tools | Where-Object name -eq 'node'
$mavenTool = $manifest.tools | Where-Object name -eq 'maven'
$javaDir = Join-Path "$workspace/.tools" $javaTool.directory
$nodeDir = Join-Path "$workspace/.tools" $nodeTool.directory
$maven = Join-Path "$workspace/.tools/$($mavenTool.directory)" 'bin/mvn.cmd'
foreach ($path in @("$javaDir/bin/java.exe", "$nodeDir/node.exe", $maven)) {
    if (!(Test-Path -LiteralPath $path)) { throw "Missing tool: $path. Run python scripts/bootstrap.py first." }
}
$savedPath = $env:Path
$savedJava = $env:JAVA_HOME
$savedAnalytics = $env:NG_CLI_ANALYTICS
$lock = Join-Path $workspace 'client-debug/package-lock.json'
$lockHash = (Get-FileHash -LiteralPath $lock -Algorithm SHA256).Hash
$npm = Join-Path $nodeDir 'npm.cmd'
$mavenArgs = @('-s', "$PSScriptRoot/maven-settings.xml", "-Dmaven.repo.local=$workspace/.tools/m2", '-B')
$npmArgs = @("--userconfig=$PSScriptRoot/npmrc", "--cache=$workspace/.tools/npm-cache")
if ($Offline) { $mavenArgs += '-o'; $npmArgs += '--offline' }
try {
    if ($Task -in @('Test', 'TestServer', 'TestClient')) {
        & python "$PSScriptRoot/check-rules.py"
        if ($LASTEXITCODE -ne 0) { throw 'Regulation/catalog consistency check failed.' }
    }
    $env:JAVA_HOME = $javaDir
    $env:Path = "$nodeDir;$javaDir/bin;$savedPath"
    $env:NG_CLI_ANALYTICS = 'false'
    if ($Task -in @('Install', 'All')) {
        Push-Location "$workspace/client-debug"
        try {
            & $npm ci @npmArgs
            if ($LASTEXITCODE -ne 0) { throw "npm ci failed: $LASTEXITCODE" }
        } finally { Pop-Location }
    }
    if ($Task -in @('Server', 'TestServer', 'TestServerContext', 'Test', 'All')) {
        Push-Location "$workspace/server"
        try {
            if ($Task -eq 'TestServerContext') { & $maven @mavenArgs -Pcontext-tests test }
            elseif ($Task -in @('TestServer', 'Test')) { & $maven @mavenArgs test }
            else { & $maven @mavenArgs -DskipTests clean package }
            if ($LASTEXITCODE -ne 0) { throw "Maven failed: $LASTEXITCODE" }
        } finally { Pop-Location }
    }
    if ($Task -in @('TestClient', 'Test')) {
        Push-Location "$workspace/client-debug"
        try {
            & $npm test @npmArgs
            if ($LASTEXITCODE -ne 0) { throw "Client tests failed: $LASTEXITCODE" }
        } finally { Pop-Location }
    }
    if ($Task -in @('Client', 'All')) {
        Push-Location "$workspace/client-debug"
        try {
            & $npm run build @npmArgs
            if ($LASTEXITCODE -ne 0) { throw "Client build failed: $LASTEXITCODE" }
        } finally { Pop-Location }
    }
} finally {
    $env:Path = $savedPath
    $env:JAVA_HOME = $savedJava
    $env:NG_CLI_ANALYTICS = $savedAnalytics
    if ((Get-FileHash -LiteralPath $lock -Algorithm SHA256).Hash -ne $lockHash) {
        throw 'package-lock.json changed unexpectedly; inspect the diff before proceeding.'
    }
}
