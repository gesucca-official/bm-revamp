param([ValidateSet('Install','Build','Verify','Measure','Size','Serve','Test','Physical')][string]$Task='Build',[switch]$Offline)
$ErrorActionPreference='Stop'
$repo=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$runtime=Join-Path $repo '.tools/client-c0/node-v24.13.0-win-x64'
if(!(Test-Path -LiteralPath "$runtime/node.exe")){throw 'Prima predisporre Node: ./client-c0/run.ps1 -Task Bootstrap'}
$savedTablePath=$env:Path
$env:Path="$runtime;$savedTablePath"
Push-Location $PSScriptRoot
try {
 if($Task -eq 'Install'){$argsTable=@('ci','--cache',"$repo/.tools/client-c0/npm-cache",'--no-audit','--no-fund');if($Offline){$argsTable+='--offline'};& "$runtime/npm.cmd" @argsTable}
 else {& "$runtime/npm.cmd" run (@{Build='build';Verify='verify';Measure='measure';Size='size';Serve='serve';Test='test';Physical='physical'}[$Task])}
 if($LASTEXITCODE -ne 0){throw "C0 tavolo: $Task fallito"}
}finally{Pop-Location;$env:Path=$savedTablePath}
