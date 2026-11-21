param([ValidateSet('Test','Check','Package')][string]$Task='Check')
# CA-0c, strumento delle carriere (docs/carriere/formato.md): stesso Node isolato e senza dipendenze proprie (solo Node: le sue tipizzazioni le controlla `tsc` del prototipo, che lo importa).
$ErrorActionPreference='Stop'
$repo=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$runtime=Join-Path $repo '.tools/client-c0/node-v24.13.0-win-x64'
if(!(Test-Path -LiteralPath "$runtime/node.exe")){throw 'Prima predisporre Node: ./client-c0/run.ps1 -Task Bootstrap'}
$savedPath=$env:Path
$env:Path="$runtime;$savedPath"
Push-Location $PSScriptRoot
try {
  switch($Task){
    'Test' {& npm run test}
    'Check' {& npm run check}
    'Package' {& npm run pacchetti}
  }
  if($LASTEXITCODE -ne 0){throw "strumento carriere $Task exited with code $LASTEXITCODE"}
} finally {Pop-Location;$env:Path=$savedPath}
