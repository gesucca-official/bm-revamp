param([ValidateSet('Install','Test','Build','Dev','Serve','Verify','Size')][string]$Task='Build',[switch]$Offline)
$ErrorActionPreference='Stop'
$repo=Split-Path $PSScriptRoot -Parent
# Same isolated Node runtime as C0 (./client-c0/run.ps1 -Task Bootstrap); separate dependencies.
$runtime=Join-Path $repo '.tools/client-c0/node-v24.13.0-win-x64'
$cache=Join-Path $repo '.tools/client-c0/npm-cache'
if(!(Test-Path -LiteralPath "$runtime/node.exe")){throw 'Prima predisporre Node: ./client-c0/run.ps1 -Task Bootstrap'}
$savedWebPath=$env:Path
$env:Path="$runtime;$savedWebPath"
Push-Location $PSScriptRoot
try {
  switch($Task){
    'Install' {$a=@('ci','--cache',$cache,'--no-audit','--no-fund');if($Offline){$a+='--offline'};& npm @a}
    'Test' {& npm run test}
    'Build' {& npm run build}
    'Dev' {& npm run start}
    'Serve' {& npm run serve}
    'Verify' {& npm run verify}
    'Size' {& npm run size}
  }
  if($LASTEXITCODE -ne 0){throw "client-web $Task exited with code $LASTEXITCODE"}
} finally { Pop-Location; $env:Path=$savedWebPath }
