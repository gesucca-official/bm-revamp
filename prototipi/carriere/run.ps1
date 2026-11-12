param([ValidateSet('Install','Lock','Test','Convert','Check','Build','Dev','Phone','Shots','Misura','Registra','Banco')][string]$Task='Build',[switch]$Offline,[string]$Out)
# CA-0a, prototipo delle carriere: usa e getta, fuori da client-web (docs/design/carriere/prototipo.md).
$ErrorActionPreference='Stop'
$repo=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
# Same isolated Node runtime and npm cache as client-web (./client-c0/run.ps1 -Task Bootstrap); separate dependencies.
$runtime=Join-Path $repo '.tools/client-c0/node-v24.13.0-win-x64'
$cache=Join-Path $repo '.tools/client-c0/npm-cache'
if(!(Test-Path -LiteralPath "$runtime/node.exe")){throw 'Prima predisporre Node: ./client-c0/run.ps1 -Task Bootstrap'}
$savedPath=$env:Path
$env:Path="$runtime;$savedPath"
Push-Location $PSScriptRoot
try {
  switch($Task){
    'Install' {$a=@('ci','--cache',$cache,'--no-audit','--no-fund');if($Offline){$a+='--offline'};& npm @a}
    'Lock' {& npm run lock}
    'Test' {& npm run test}
    'Convert' {& npm run convert}
    'Check' {& npm run convert;if($LASTEXITCODE -eq 0){& npm run check}}
    'Build' {& npm run convert;if($LASTEXITCODE -eq 0){& npm run build}}
    'Dev' {& npm run convert;if($LASTEXITCODE -eq 0){& npm run start}}
    # Phone: only on request (T5). Serves the prototype and the repository assets on one private LAN address, no access code.
    'Phone' {& npm run convert;if($LASTEXITCODE -eq 0){$saved=$env:BM_LAN;if(!$env:BM_LAN){$env:BM_LAN='lan'};try{& npm run start}finally{$env:BM_LAN=$saved}}}
    # Misura: apertura della mappa a 390x844 con la CPU 4 e 6 volte più lenta (Fase D, prestazioni sul telefono).
    'Misura' {& npm run convert;if($LASTEXITCODE -eq 0){& npm run build};if($LASTEXITCODE -eq 0){& node strumenti/misura.mjs 4 5};if($LASTEXITCODE -eq 0){& node strumenti/misura.mjs 6 5}}
    # Registra: due brevi video webm e un foglio di fotogrammi dei ritratti animati (Fase E, movimento e maglia).
    'Registra' {& npm run convert;if($LASTEXITCODE -eq 0){& npm run build};if($LASTEXITCODE -eq 0){$saved=$env:BM_OUT;if($Out){$env:BM_OUT=$Out};try{& node strumenti/registra.mjs}finally{$env:BM_OUT=$saved}}}
    # Banco: il banco della fluidità (Fase H): scene e bacheca registrate e controllate fotogramma per fotogramma, rapporto in -Out.
    'Banco' {& npm run convert;if($LASTEXITCODE -eq 0){& npm run build};if($LASTEXITCODE -eq 0){$saved=$env:BM_OUT;if($Out){$env:BM_OUT=$Out};try{& node strumenti/banco.mjs}finally{$env:BM_OUT=$saved}}}
    'Shots' {& npm run convert;if($LASTEXITCODE -eq 0){& npm run build};if($LASTEXITCODE -eq 0){$saved=$env:BM_OUT;if($Out){$env:BM_OUT=$Out};try{& npm run shots}finally{$env:BM_OUT=$saved}}}
  }
  if($LASTEXITCODE -ne 0){throw "prototipo carriere $Task exited with code $LASTEXITCODE"}
} finally {Pop-Location;$env:Path=$savedPath}
