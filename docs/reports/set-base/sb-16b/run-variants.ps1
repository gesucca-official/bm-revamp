$ErrorActionPreference = 'Stop'
$scratch = 'C:\Users\gesucca\AppData\Local\Temp\claude\ef3b51c91f4c71f8\5913106b-2d92-4794-a3d8-ceda9b7d7b24\scratchpad'
$copy = Join-Path $scratch 'bmcopy'
$env:JAVA_HOME = 'E:\bm\.tools\zulu11.84.17-ca-jdk11.0.29-win_x64'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$mvn = 'E:\bm\.tools\apache-maven-3.6.3\bin\mvn.cmd'
$draft = Join-Path $copy 'server\src\test\resources\set-base\bozza.json'
$games = if ($args.Count -ge 1) { $args[0] } else { '1000' }
$variants = [ordered]@{
    'base'      = @()
    'morto'     = @('-Dsim.rule.deadNoHit=true')
    'spareggio' = @('-Dsim.rule.tiebreak=true')
    'entrambe'  = @('-Dsim.rule.deadNoHit=true', '-Dsim.rule.tiebreak=true')
}
Push-Location (Join-Path $copy 'server')
try {
    foreach ($name in $variants.Keys) {
        $start = Get-Date
        $log = Join-Path $scratch "run-$name.log"
        $mvnArgs = @('-s', 'E:\bm\scripts\maven-settings.xml', '-Dmaven.repo.local=E:\bm\.tools\m2', '-B', '-o', '-q', 'test',
            '-Dtest=BenchMeasureTest#matrix', "-Dsim.bench=$games", "-Dsim.draft=$draft",
            '-Dsim.styles=aggressivo,prudente,risorse,com', "-Dsim.note=SB-16b variante $name") + $variants[$name]
        & $mvn @mvnArgs *> $log
        if ($LASTEXITCODE -ne 0) { throw "variante ${name}: maven $LASTEXITCODE (vedi $log)" }
        $out = Join-Path $scratch "out-$name"
        New-Item -ItemType Directory -Force $out | Out-Null
        Copy-Item (Join-Path $copy "tmp\sim\sb7-bozza-$games.*") $out -Force
        "$name finita in $([int]((Get-Date) - $start).TotalSeconds) s"
    }
} finally { Pop-Location }
