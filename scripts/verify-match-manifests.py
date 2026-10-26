"""Independent I19c audit of saved CLI exports and I24 SQLite evidence."""
from __future__ import annotations

import hashlib
import json
import sqlite3
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOGS = ROOT / ".build-logs"
MODES = {"quick1vCom", "open1vCom", "quick1v1", "quickFFA"}
SECRET_KEYS = {"password", "passwordhash", "saltedhash", "token", "accesstoken", "refreshtoken", "sessionid", "authorization"}


def read(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def audit_export(export: dict, expected: list[str] | None = None) -> list[dict]:
    assert export["schemaVersion"] == 1
    game_id = export["gameId"]
    events = export["events"]
    assert export["unpersistedEvents"] == []
    assert export["recording"] == {"status": "OK", "failureAt": None,
                                    "observedEvents": len(events), "complete": True}
    assert export["integrity"]["verified"] is True
    assert export["integrity"]["persistedEvents"] == len(events)
    previous = ""
    parsed = []
    for seq, entry in enumerate(events):
        assert entry["sequence"] == seq, (game_id, seq, entry["sequence"])
        assert entry["previousHash"] == previous
        digest = hashlib.sha256(f"{game_id}\n{seq}\n{previous}\n{entry['json']}".encode("utf-8")).hexdigest()
        assert entry["hash"] == digest, (game_id, seq, "hash")
        previous = digest
        event = json.loads(entry["json"])
        if isinstance(event["data"], dict):
            assert event["data"].get("gameId", game_id) == game_id
        parsed.append(event)
        assert_no_secrets(event)
    assert export["integrity"]["headHash"] == previous
    kinds = [event["kind"] for event in parsed]
    assert kinds.count("INITIAL") == 1 and kinds[0] == "INITIAL"
    assert kinds.count("OUTCOME") == 1 and kinds[-1] == "OUTCOME"
    if expected is not None:
        assert kinds == expected, (game_id, kinds, expected)
    initial = parsed[0]["data"]["state"]
    assert initial["gameId"] == game_id
    assert initial["mode"] in MODES
    assert initial["players"] and initial["outcome"]["over"] is False
    versions = parsed[0]["data"]["versions"]
    assert versions["rulesVersion"] == "1.6"
    assert all(len(versions[k]) == 64 for k in ("codeSha256", "rulesSha256", "catalogSha256", "rulesCatalogSha256"))
    # State-bearing records must form the exact persisted chronology; round snapshots
    # carry the report and resolved moves, while command/lifecycle/outcome carry state.
    for index, event in enumerate(parsed):
        if event["kind"] in {"ROUND_READY", "ROUND_COMMITTED", "COMMAND_COMMITTED", "LIFECYCLE_COMMITTED"}:
            assert event["data"]["gameId"] == game_id
            assert isinstance(event["data"].get("players"), list)
        if event["kind"] == "ROUND_COMMITTED":
            assert "resolvedMoves" in event["data"] and "engineReport" in event["data"]
            assert index >= 2 and parsed[index-2]["kind"] == "ROUND_READY"
            ready = parsed[index-2]["data"]
            assert event["data"]["turn"] == ready["turn"] + 1
            forfeited = set(ready.get("forfeits", {}))
            expected_resolved = [m for m in ready["pendingMoves"] if m["playerId"] not in forfeited]
            signature = lambda move: (move["playerId"], move.get("card"), move.get("targetId"), json.dumps(move.get("choices"), sort_keys=True))
            actual = Counter(signature(m) for m in event["data"]["resolvedMoves"])
            pending = Counter(signature(m) for m in expected_resolved)
            if expected is not None:
                assert actual == pending
            else:
                assert not (actual - pending)
            assert all(n == 1 for n in actual.values())
            assert all(isinstance(m.get("report"), dict) for m in event["data"]["resolvedMoves"])
        if event["kind"] == "ENGINE_REPORT":
            assert isinstance(event["data"], list)
        if event["kind"] in {"DISCONNECTED", "RECONNECTED"}:
            assert isinstance(event["data"].get("playerId"), str)
        if event["kind"] == "FORFEIT":
            assert event["data"].get("reason") == "leave" or bool(event["data"].get("players"))
    terminal = parsed[-1]["data"]
    assert terminal["outcome"]["over"] is True
    return parsed


def assert_no_secrets(value):
    if isinstance(value, dict):
        for key, child in value.items():
            assert key.lower().replace("_", "") not in SECRET_KEYS, key
            assert_no_secrets(child)
    elif isinstance(value, list):
        for child in value:
            assert_no_secrets(child)


def audit_i19b():
    # The full current matrix below is authoritative; no historical manifest is required.
    seen, count, cases = set(), 0, []
    for mode in sorted(MODES):
      for scenario in ("leave", "timeout", "recover"):
        transcript = read(LOGS / f"i19b-{mode}-{scenario}.json")
        assert "synthetic" not in json.dumps(transcript, ensure_ascii=False)
        export = transcript["exported"]
        assert transcript["ok"] is True and transcript["mode"] == mode and transcript["scenario"] == scenario
        events = audit_export(export, transcript["expected"])
        assert events[0]["data"]["state"]["mode"] == mode
        game_id = export["gameId"]
        db_path = LOGS / f"i19b-{mode}-{scenario}-evidence" / f"{game_id}.sqlite"
        with sqlite3.connect(f"file:{db_path.as_posix()}?mode=ro", uri=True) as db:
            assert db.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
            assert not db.execute("PRAGMA foreign_key_check").fetchall()
            rows = db.execute("SELECT N_SEQUENCE,T_PREVIOUS_HASH,T_HASH,J_EVENT FROM LOG003_MATCH_EVENTS WHERE C_GAME_ID=? ORDER BY N_SEQUENCE", (game_id,)).fetchall()
            assert rows == [(e["sequence"], e["previousHash"], e["hash"], e["json"]) for e in export["events"]]
            registry = db.execute("SELECT T_MODE,N_OUTCOME_SEQUENCE,T_OUTCOME_HASH FROM LOG004_MATCH_REGISTRY WHERE C_GAME_ID=?", (game_id,)).fetchone()
            assert registry == (mode, len(events)-1, export["events"][-1]["hash"])
        assert game_id not in seen
        seen.add(game_id)
        count += len(events)
        cases.append({"mode": mode, "scenario": scenario, "gameId": game_id,
                      "events": len(events), "headHash": export["integrity"]["headHash"],
                      "expectedKinds": transcript["expected"],
                      "database": db_path.relative_to(ROOT).as_posix(),
                      "databaseSha256": hashlib.sha256(db_path.read_bytes()).hexdigest()})
    assert len(seen) == len(MODES) * 3
    return len(seen), count, cases


def audit_i24():
    total, count = 0, 0
    for scenario in ("clean", "crash", "interrupted"):
        directory = LOGS / f"i24-{scenario}-evidence"
        fixture, latest = read(directory / "fixture.json"), read(directory / "inspect-2.json")
        assert len(fixture["active"]) == 4
        db_path = directory / "application.sqlite"
        with sqlite3.connect(f"file:{db_path.as_posix()}?mode=ro", uri=True) as db:
            assert db.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
            assert not db.execute("PRAGMA foreign_key_check").fetchall()
            assert db.execute("SELECT J_FULL_LOG FROM LOG001_GAMES WHERE C_GAME_ID='historical-log'").fetchone() == ('{"preserve":true}',)
            assert db.execute("SELECT T_MESSAGE FROM LOG002_WEB_CLIENT WHERE C_TIMESTAMP='historical-time'").fetchone() == ("preserve web log",)
            for match in fixture["active"]:
                game_id = match["id"]
                export = latest["exports"][game_id]
                parsed = audit_export(export)
                assert parsed[-1]["data"]["outcomeReason"] == "riavvio server"
                assert parsed[-1]["data"]["outcome"] == {"over": True, "result": "draw", "winner": None}
                rows = db.execute("SELECT N_SEQUENCE,T_PREVIOUS_HASH,T_HASH,J_EVENT FROM LOG003_MATCH_EVENTS WHERE C_GAME_ID=? ORDER BY N_SEQUENCE", (game_id,)).fetchall()
                assert rows == [(e["sequence"], e["previousHash"], e["hash"], e["json"]) for e in export["events"]]
                registry = db.execute("SELECT T_MODE,N_OUTCOME_SEQUENCE,T_OUTCOME_HASH FROM LOG004_MATCH_REGISTRY WHERE C_GAME_ID=?", (game_id,)).fetchone()
                assert registry == (parsed[0]["data"]["state"]["mode"], len(parsed)-1, export["events"][-1]["hash"])
                total += 1
                count += len(parsed)
            # One naturally completed match predates restart and must remain byte-identical.
            done = fixture["done"]
            old = done["exported"]
            rows = db.execute("SELECT J_EVENT FROM LOG003_MATCH_EVENTS WHERE C_GAME_ID=? ORDER BY N_SEQUENCE", (done["id"],)).fetchall()
            assert rows == [(event["json"],) for event in old["events"]]
            audit_export(old)
        for i in range(3):
            assert read(directory / f"inspect-{i}.json")["exports"] == latest["exports"]
    return total, count


def audit_ordinary():
    sources = {
        "quick1vCom": "i13-i13Bruiser-exports.json",
        "open1vCom": "i16-exports.json",
        "quick1v1": "i17a-complete-exports.json",
        "quickFFA": "i17b-full-exports.json",
    }
    matches, events = 0, 0
    details = []
    for mode, filename in sources.items():
        document = read(LOGS / filename)
        exports = document["exports"]
        matching = 0
        for export in exports:
            parsed = audit_export(export)
            assert parsed[0]["data"]["state"]["mode"] == mode
            outcome = parsed[-1]["data"]["outcome"]
            assert outcome["result"] in {"win", "draw"}
            if parsed[-1]["data"].get("outcomeReason") == "combat":
                matching += 1
                events += len(parsed)
        assert matching > 0
        matches += matching
        details.append({"mode": mode, "matches": matching, "source": filename})
    return matches, events, details


def main():
    lifecycle_matches, lifecycle_events, cases = audit_i19b()
    restart_matches, restart_events = audit_i24()
    ordinary_matches, ordinary_events, ordinary = audit_ordinary()
    result = {"increment": "I19c", "rulesVersion": "1.6", "lifecycleMatches": lifecycle_matches,
              "lifecycleEvents": lifecycle_events, "restartActiveMatches": restart_matches,
              "restartEvents": restart_events, "ordinaryMatches": ordinary_matches,
              "ordinaryEvents": ordinary_events, "ordinaryByMode": ordinary,
              "lifecycleCases": cases, "allChecks": "PASS"}
    (LOGS / "i19c-manifest.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in result.items() if key != "lifecycleCases"}, indent=2))


if __name__ == "__main__":
    main()
