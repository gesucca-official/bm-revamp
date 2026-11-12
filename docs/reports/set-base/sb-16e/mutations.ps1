param([switch]$IdentityOnly, [switch]$TimingOnly)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path "$PSScriptRoot/../../../..").Path
$file = Join-Path $root 'server/src/test/java/com/gsc/bm/sim/StarterBalanceMeasureTest.java'
if ($TimingOnly) { $file = Join-Path $root 'server/src/test/java/com/gsc/bm/sim/Listino.java' }
$original = [IO.File]::ReadAllText($file)
$scratch = Join-Path $env:TEMP 'bm-sb16e'
$env:JAVA_HOME = Join-Path $root '.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
$env:Path = "$env:JAVA_HOME/bin;$env:Path"
$argsMvn = @('-s', "$root/scripts/maven-settings.xml", "-Dmaven.repo.local=$root/.tools/m2", '-B', '-o', '-q', 'test', '-Dtest=StarterBalanceMeasureTest#damageCountersSeparateExposureDefenseArmorAndOverkill')
$cases = @(
    @('M1-defense', 'if (omitDefense && s.getType() == StatusType.GOOD) continue;', 'if (false) continue;'),
    @('M2-source', 'SOURCE.set(this);', 'SOURCE.remove();'),
    @('M3-window', 'if (punishedWindow != window)', 'if (true)'),
    @('M4-copy', 'chosen.putIfAbsent(m.getPlayerId(), card)', 'chosen.put(m.getPlayerId(), card)', 'duplicateCopiesFollowTheSameFirstMatchAsTheEngine'),
    @('M5-voided-bound', 'if (leftHand && found.get(id).remove(discard) != null)', 'if (discard != null && found.get(id).remove(discard) != null)', 'aVoidedBoundKeepsTheFoundCopyTracked')
)
$results = @()
if ($IdentityOnly) {
    $cases = @($cases | Where-Object { $_[0] -in @('M4-copy','M5-voided-bound') })
    $results = @(Get-Content "$PSScriptRoot/mutations.json" -Raw | ConvertFrom-Json)
}
if ($TimingOnly) {
    $cases = @(,@('M6-timing-styles', 'List<String> measured = Boolean.getBoolean("sim.sb16eTiming") ? new ArrayList<>(styles.keySet()) : STYLES;', 'List<String> measured = STYLES;', 'timingListCanCoverAllFiveStartersWithoutChangingHistoricalDefaults'))
    $results = @(Get-Content "$PSScriptRoot/mutations.json" -Raw | ConvertFrom-Json)
}
Push-Location "$root/server"
try {
    foreach ($case in $cases) {
        if (!$original.Contains($case[1])) { throw "Mutation anchor absent: $($case[0])" }
        [IO.File]::WriteAllText($file, $original.Replace($case[1], $case[2]))
        $method = if ($case.Count -ge 4) { $case[3] } else { 'damageCountersSeparateExposureDefenseArmorAndOverkill' }
        $runArgs = @($argsMvn | Where-Object { !$_.StartsWith('-Dtest=') }) + "-Dtest=StarterBalanceMeasureTest#$method"
        & "$root/.tools/apache-maven-3.6.3/bin/mvn.cmd" @runArgs *> "$scratch/$($case[0]).log"
        $code = $LASTEXITCODE
        $log = [IO.File]::ReadAllText("$scratch/$($case[0]).log")
        $killed = $code -ne 0 -and $log.Contains('Tests run: 1, Failures: 1, Errors: 0')
        $results += [PSCustomObject]@{mutation=$case[0]; exit=$code; killed=$killed; test=$method}
        if (!$killed) { throw "Mutation not killed by the intended test: $($case[0])" }
    }
} finally {
    [IO.File]::WriteAllText($file, $original)
    Pop-Location
    ConvertTo-Json -InputObject @($results) -Compress | Set-Content -Encoding utf8 "$PSScriptRoot/mutations.json"
}
