$ErrorActionPreference = 'Stop'
$scratch = 'C:\Users\gesucca\AppData\Local\Temp\claude\ef3b51c91f4c71f8\5913106b-2d92-4794-a3d8-ceda9b7d7b24\scratchpad'
$copy = Join-Path $scratch 'bmcopy'
$env:JAVA_HOME = 'E:\bm\.tools\zulu11.84.17-ca-jdk11.0.29-win_x64'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$mvn = 'E:\bm\.tools\apache-maven-3.6.3\bin\mvn.cmd'
$variants = [ordered]@{
    'base'  = @()
    'morto' = @('-Dsim.rule.deadNoHit=true')
}
Push-Location (Join-Path $copy 'server')
try {
    foreach ($name in $variants.Keys) {
        $start = Get-Date
        $log = Join-Path $scratch "listino-$name.log"
        Remove-Item (Join-Path $copy 'tmp\sim\*listino*') -ErrorAction SilentlyContinue
        $mvnArgs = @('-s', 'E:\bm\scripts\maven-settings.xml', '-Dmaven.repo.local=E:\bm\.tools\m2', '-B', '-o', '-q', 'test',
            '-Dtest=ListinoMeasureTest', '-Dsim.listino=priorita,allerta', '-Dsim.listinoBase=set-base', '-Dsim.listinoAnchor=7') + $variants[$name]
        & $mvn @mvnArgs *> $log
        if ($LASTEXITCODE -ne 0) { throw "listino ${name}: maven $LASTEXITCODE (vedi $log)" }
        $out = Join-Path $scratch "listino-$name"
        New-Item -ItemType Directory -Force $out | Out-Null
        Copy-Item (Join-Path $copy 'tmp\sim\*listino*') $out -Force
        "listino $name finito in $([int]((Get-Date) - $start).TotalSeconds) s"
    }
} finally { Pop-Location }
