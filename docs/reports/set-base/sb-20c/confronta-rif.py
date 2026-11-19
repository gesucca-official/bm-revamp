"""Confronta le uscite «Rif» di SB-19 per SB-20c, al netto dei metadati di provenienza."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys


def byte_misura(run, riepilogo):
    matrice = (run / "matrix.json").read_bytes()
    rapporto = json.loads(matrice)
    intestazione = rapporto["intestazione"]
    # Conserva tutti i byte, salvo i due valori che dipendono dal file in ingresso.
    for campo in ("bozza", "sha256"):
        inizio = b'"' + campo.encode("ascii") + b'":'
        pattern = re.compile(inizio + rb'"(?:\\.|[^"\\])*"')
        matrice, n = pattern.subn(inizio + b'""', matrice, count=1)
        if n != 1:
            raise ValueError(f"{run}: campo di provenienza mancante in matrix.json: {campo}")

    tabella = (run / "matrix.md").read_bytes()
    righe_provenienza = (
        (f"# Banco SB-7 — {Path(intestazione['bozza']).name}\n", "# Banco SB-7\n"),
        (f"| Bozza | `{intestazione['bozza']}` |\n", "| Bozza | |\n"),
        (f"| SHA-256 | `{intestazione['sha256']}` |\n", "| SHA-256 | |\n"),
    )
    for prima, dopo in righe_provenienza:
        riga = prima.encode("utf-8")
        if tabella.count(riga) != 1:
            raise ValueError(f"{run}: riga di provenienza mancante o duplicata in matrix.md")
        tabella = tabella.replace(riga, dopo.encode("utf-8"), 1)

    file = {
        "matrix.json": matrice,
        "matrix.md": tabella,
        "deck-observations.json": (run / "deck-observations.json").read_bytes(),
        "in-play.json": (run / "in-play.json").read_bytes(),
        "rif.json": riepilogo.with_suffix(".json").read_bytes(),
        "rif.md": riepilogo.with_suffix(".md").read_bytes(),
    }
    return file, {
        "celle": len(rapporto["celle"]),
        "partite": rapporto["invarianti"]["partite"],
        "violazioni": sum(rapporto["invarianti"]["violazioni"].values()),
        "sha256Bozza": intestazione["sha256"],
    }


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("giro_a", type=Path)
    cli.add_argument("riepilogo_a", type=Path, help="prefisso dei file prodotti da analyze.py rif")
    cli.add_argument("giro_b", type=Path)
    cli.add_argument("riepilogo_b", type=Path)
    args = cli.parse_args()
    a, info_a = byte_misura(args.giro_a, args.riepilogo_a)
    b, info_b = byte_misura(args.giro_b, args.riepilogo_b)
    uguali = {nome: a[nome] == b[nome] for nome in a}
    esito = {
        "giri": {args.giro_a.name: info_a, args.giro_b.name: info_b},
        "file-identici": uguali,
        "sha256": {nome: hashlib.sha256(contenuto).hexdigest() for nome, contenuto in a.items()},
    }
    print(json.dumps(esito, separators=(",", ":")))
    return 0 if all(uguali.values()) and not info_a["violazioni"] and not info_b["violazioni"] else 1


if __name__ == "__main__":
    sys.exit(main())
