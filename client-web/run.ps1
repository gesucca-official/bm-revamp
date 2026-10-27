param([ValidateSet('Install','Test','Build','Dev','Serve','Physical','Verify','VerifyModes','Size','Atlas')][string]$Task='Build',[switch]$Offline)
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
    # Build, then serve on the private LAN address with an access code (iPhone test).
    'Physical' {& npm run build;if($LASTEXITCODE -eq 0){$saved=$env:BM_LAN;if(!$env:BM_LAN){$env:BM_LAN='lan'};try{& npm run serve}finally{$env:BM_LAN=$saved}}}
    'Verify' {& npm run verify}
    'VerifyModes' {& npm run verify:modes}
    'Size' {& npm run size}
    'Atlas' {& npm run atlas}
  }
  if($LASTEXITCODE -ne 0){throw "client-web $Task exited with code $LASTEXITCODE"}
} finally { Pop-Location; $env:Path=$savedWebPath }
