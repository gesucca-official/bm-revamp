"""SB-16i, client step: mutations on the new branching logic (contract: 3-8, each must fail at least one test).

Each mutation replaces one exact snippet, runs the tests that cover it, restores the file and records the outcome.
Run from the repository root: python docs/reports/set-base/sb-16i-client/mutations.py [out.json]
"""
from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / ".tools"
MANIFEST = json.loads((ROOT / "scripts" / "toolchain.json").read_text(encoding="utf-8"))
JAVA = TOOLS / next(t for t in MANIFEST["tools"] if t["name"] == "java")["directory"]
MAVEN = TOOLS / next(t for t in MANIFEST["tools"] if t["name"] == "maven")["directory"] / "bin" / "mvn.cmd"
NODE = TOOLS / "client-c0" / "node-v24.13.0-win-x64" / "node.exe"

SERVER_TESTS = "Sb16iClientFieldsTest,Sb16iRulesTest,RegoleD50Test,MoveCommandTest"
CLIENT_TESTS = ["tests/sb16i-client.test.ts", "tests/search-void.test.ts", "tests/hand-choice.test.ts"]

V = "server/src/main/java/com/gsc/bm/service/view/ViewExtractorServiceImpl.java"
MUTATIONS = [
    ("S1 validator drops the choice", "server/src/main/java/com/gsc/bm/api/ws/MoveCommandValidator.java",
     "if (searchChoice != null) move.setSearchChoice(searchChoice.asText());", "", "server"),
    ("S2 searchable ignores the deck", V,
     "if (p.getDeck().stream().anyMatch(c -> name.equals(c.getBindingName()))) available.add(name);", "available.add(name);", "server"),
    ("S3 searchable also for one-name cards", V,
     "if (names.size() < 2 || searchable.containsKey(card.getBindingName())) continue;",
     "if (names.isEmpty() || searchable.containsKey(card.getBindingName())) continue;", "server"),
    ("S4 counter also with the live rules", V,
     ".plays(ruleset.playground() ? new TreeMap<>(c.playCounts()) : null)", ".plays(new TreeMap<>(c.playCounts()))", "server"),
    ("C1 two names do not wait for a choice", "client-web/src/model.ts",
     "choosing=options.length===2;", "choosing=false;", "client"),
    ("C2 the single name is sent as a choice", "client-web/src/model.ts",
     "choosing=options.length===2;if(choosing&&!(searchChoice&&options.includes(searchChoice)))",
     "choosing=options.length>=1;if(options.length===2&&!(searchChoice&&options.includes(searchChoice)))", "client"),
    ("C3 ahead always yes", "client-web/src/resolution.ts",
     "lines.push(m.ahead ? `Gioca d’anticipo: sì", "lines.push(true ? `Gioca d’anticipo: sì", "client"),
    ("C4 counter on every card", "client-web/src/readability.ts",
     "if(!card.lastResort||!c.plays)return null;", "if(!c.plays)return null;", "client"),
]


def run_server() -> tuple[bool, str]:
    env = {**__import__("os").environ, "JAVA_HOME": str(JAVA), "Path": f"{JAVA / 'bin'};" + __import__("os").environ.get("Path", "")}
    cmd = [str(MAVEN), "-s", str(ROOT / "scripts" / "maven-settings.xml"), f"-Dmaven.repo.local={TOOLS / 'm2'}", "-B", "-o", "-q",
           "test", f"-Dtest={SERVER_TESTS}", "-DfailIfNoTests=false"]
    p = subprocess.run(cmd, cwd=ROOT / "server", env=env, capture_output=True, text=True, shell=False)
    failed = [l.strip() for l in p.stdout.splitlines() if "FAIL" in l or "Tests run:" in l and "Failures: 0, Errors: 0" not in l]
    return p.returncode == 0, " | ".join(failed[:4])


def run_client() -> tuple[bool, str]:
    p = subprocess.run([str(NODE), "--experimental-strip-types", "--test", *CLIENT_TESTS], cwd=ROOT / "client-web",
                       capture_output=True, text=True, encoding="utf-8")
    failed = [l.strip() for l in p.stdout.splitlines() if l.strip().startswith("✖")]
    return p.returncode == 0, " | ".join(failed[:4])


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    results = []
    for name, rel, old, new, side in MUTATIONS:
        path = ROOT / rel
        original = path.read_bytes()
        text = original.decode("utf-8")
        assert text.count(old) == 1, f"{name}: snippet not unique"
        path.write_bytes(text.replace(old, new).encode("utf-8"))
        start = time.time()
        try:
            green, detail = run_server() if side == "server" else run_client()
        finally:
            path.write_bytes(original)
        results.append({"mutation": name, "file": rel, "detected": not green, "failing": detail, "seconds": round(time.time() - start, 1)})
        print(f"{name}: {'detected' if not green else 'NOT DETECTED'} {detail}", flush=True)
    restored = {"server": run_server()[0], "client": run_client()[0]}
    summary = {"mutations": results, "detected": sum(r["detected"] for r in results), "total": len(results), "greenAfterRestore": restored}
    print(json.dumps({k: v for k, v in summary.items() if k != "mutations"}))
    if out:
        out.write_text(json.dumps(summary, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main()
