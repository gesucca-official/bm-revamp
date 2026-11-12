# SB-16c: banco SB-7 a 2000 partite per cella, quattro stili, bozza del Set Base. Uso: bench.ps1 <nome> <nota> [opzioni maven in più]
param([string]$Name, [string]$Note, [string[]]$Extra = @())
$ErrorActionPreference = 'Stop'
$scratch = 'C:\Users\gesucca\AppData\Local\Temp\claude\70455c4622fd24de\077f50d0-e49c-43ff-b389-1dc26932335c\scratchpad'
$mvnArgs = @('-q', 'test', '-Dtest=BenchMeasureTest#matrix', '-Dsim.bench=2000', '-Dsim.draft=src/test/resources/set-base/bozza.json',
    '-Dsim.styles=aggressivo,prudente,risorse,com', "-Dsim.note=$Note") + $Extra
$log = Join-Path $scratch "bench-$Name.log"
& (Join-Path $scratch 'mvn.ps1') @mvnArgs *> $log
$code = $LASTEXITCODE
$out = Join-Path $scratch "bench-$Name"
New-Item -ItemType Directory -Force $out | Out-Null
Copy-Item 'E:\bm\tmp\sim\sb7-bozza-2000.*' $out -Force
"$Name exit $code"
