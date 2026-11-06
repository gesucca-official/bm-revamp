package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** SB-7: il rapporto del banco in due forme, testo per il proprietario e dati, dagli stessi conteggi e nello stesso ordine. */
final class BenchReport {
    private BenchReport() { }

    private static final class Pair {
        final String a, b;
        final Bench.Tally tally = new Bench.Tally();
        final Map<String, Bench.Tally> byStyles = new LinkedHashMap<>();

        Pair(String a, String b) {
            this.a = a;
            this.b = b;
        }
    }

    private static Map<String, Pair> pairs(Bench.Report r) {
        Map<String, Pair> pairs = new LinkedHashMap<>();
        for (Bench.Cell c : r.cells) {
            Pair pair = pairs.computeIfAbsent(c.deckA + "\u0000" + c.deckB, k -> new Pair(c.deckA, c.deckB));
            pair.tally.add(c.tally);
            pair.byStyles.computeIfAbsent(c.styleA + "\u0000" + c.styleB, k -> new Bench.Tally()).add(c.tally);
        }
        return pairs;
    }

    private static Map<String, Bench.Side> decks(Bench.Report r) {
        Map<String, Bench.Side> decks = new LinkedHashMap<>();
        for (String deck : r.settings.decks) decks.put(deck, new Bench.Side());
        for (Bench.Cell c : r.cells) {
            decks.get(c.deckA).add(c.a);
            decks.get(c.deckB).add(c.b);
        }
        return decks;
    }

    private static Map<String, Bench.Side> deckStyles(Bench.Report r) {
        Map<String, Bench.Side> sides = new LinkedHashMap<>();
        for (String deck : r.settings.decks) for (String style : r.settings.styles.keySet()) sides.put(deck + "\u0000" + style, new Bench.Side());
        for (Bench.Cell c : r.cells) {
            sides.get(c.deckA + "\u0000" + c.styleA).add(c.a);
            sides.get(c.deckB + "\u0000" + c.styleB).add(c.b);
        }
        return sides;
    }

    private static int maxCost(Bench.Report r, String deck, Resource resource) {
        List<String> cards = new ArrayList<>(r.draft.cardsOf(deck).keySet());
        cards.add(r.draft.basicOf(deck));
        cards.addAll(r.draft.boundOf(deck));
        cards.add(r.draft.lastResortOf(deck));
        int max = 0;
        for (String binding : cards) max = Math.max(max, r.draft.card(binding).getCost().getOrDefault(resource, 0));
        return max;
    }

    private static String share(long k, long n) {
        double[] ci = Bench.wilson(k, n);
        return Bench.decimal(Bench.ratio(k, n), 3) + " [" + Bench.decimal(ci[0], 3) + "–" + Bench.decimal(ci[1], 3) + "]";
    }

    private static String percent(long k, long n) { return Bench.decimal(100.0 * Bench.ratio(k, n), 1) + "%"; }

    private static String meanTurns(Bench.Tally t) {
        if (t.games == 0) return "—";
        double mean = (double) t.turnSum / t.games;
        double variance = Math.max(0, t.turnSquares / t.games - mean * mean) * t.games / Math.max(1, t.games - 1);
        double half = 1.959963984540054 * Math.sqrt(variance / t.games);
        return Bench.decimal(mean, 2) + " [" + Bench.decimal(mean - half, 2) + "–" + Bench.decimal(mean + half, 2) + "]";
    }

    static String markdown(Bench.Report r) {
        Bench.Settings s = r.settings;
        StringBuilder o = new StringBuilder();
        String name = Bench.draftName(r.draft);
        o.append("# Banco SB-7 — ").append(name).append("\n\n");
        if (s.note != null) o.append("> ").append(s.note).append("\n\n");
        int styles = s.styles.size();
        o.append("| Voce | Valore |\n|---|---|\n");
        o.append("| Bozza | `").append(Bench.shownSource(r.draft)).append("` |\n");
        o.append("| SHA-256 | `").append(r.sha256).append("` |\n");
        o.append("| Formato | ").append(Draft.FORMAT).append(": ").append(r.draft.rules.deckSize).append(" carte, al massimo ")
                .append(r.draft.rules.maxCopies).append(" copie, ").append(r.draft.rules.boundChoices).append(" bound |\n");
        o.append("| Banco | ").append(Bench.VERSION).append(" |\n");
        o.append("| Mazzi | ").append(String.join(", ", s.decks)).append(" |\n");
        o.append("| Stili | ").append(String.join(", ", s.styles.keySet())).append(": ").append(styles * styles).append(" coppie |\n");
        o.append("| Semi | ").append(s.firstSeed).append("–").append(s.firstSeed + s.games - 1)
                .append(", posti alternati (semi pari: A gioca per primo) |\n");
        o.append("| Partite | ").append(s.games).append(" per cella, ").append(r.cells.size()).append(" celle, ").append(r.games())
                .append(" in tutto |\n");
        o.append("| Tetto delle bound | ").append(s.cap.describe()).append("; ").append(BoundCap.USES).append(" usi contro un manichino |\n");
        o.append("| Tempi | non qui: nel file `.tempi.txt` accanto, perché questo testo resti uguale a ogni esecuzione |\n\n");
        o.append("Quota = vittorie / (vittorie + sconfitte), patte e limite esclusi. Intervalli di Wilson al 95%: coprono solo l'errore ")
                .append("di campionamento, **non i limiti dei bot**. Con molte celle, circa una su venti cade fuori per caso.\n\n");

        o.append("## Invarianti\n\n");
        o.append(r.checks.games).append(" partite, ").append(r.checks.seatTurns).append(" turni di giocatore controllati.\n\n");
        o.append("| Invariante | Cosa controlla | Violazioni |\n|---|---|---:|\n");
        for (String inv : Bench.INVARIANTS)
            o.append("| ").append(inv).append(" | ").append(Bench.INVARIANT_TEXT.get(inv)).append(" | ").append(r.checks.counts.get(inv)).append(" |\n");
        o.append("| tetto-bound | ").append("valore per uso entro il tetto, nessun accumulo, nulla che resti sull'avversario")
                .append(" | ").append(r.boundViolations()).append(" bound su ").append(r.bounds.size()).append(" |\n\n");
        boolean any = false;
        for (String inv : Bench.INVARIANTS) for (Bench.Violation v : r.checks.examples.get(inv)) {
            if (!any) o.append("Primi esempi:\n\n");
            any = true;
            o.append("- ").append(v.message(name)).append('\n');
        }
        if (any) o.append('\n');

        Map<String, Pair> pairs = pairs(r);
        o.append("## Matrice dei mazzi\n\nSomma delle ").append(styles * styles).append(" coppie di stili, a pari peso.\n\n");
        o.append("| A | B | partite | vittorie A | vittorie B | patte | limite | quota A [IC 95%] | quota del primo posto |\n");
        o.append("|---|---|---:|---:|---:|---:|---:|---|---|\n");
        for (Pair p : pairs.values()) {
            Bench.Tally t = p.tally;
            o.append("| ").append(p.a).append(" | ").append(p.b).append(" | ").append(t.games).append(" | ").append(t.aWins).append(" | ")
                    .append(t.bWins).append(" | ").append(t.draws).append(" | ").append(t.limits).append(" | ")
                    .append(share(t.aWins, t.aWins + t.bWins)).append(" | ").append(share(t.firstWins, t.decisive)).append(" |\n");
        }
        o.append("\n### Per coppia di stili\n\nQuota di A, con lo stile di A in riga e quello di B in colonna.\n");
        for (Pair p : pairs.values()) {
            o.append("\n**").append(p.a).append(" contro ").append(p.b).append("**\n\n| A \\ B |");
            for (String sb : s.styles.keySet()) o.append(' ').append(sb).append(" |");
            o.append("\n|---|");
            for (int i = 0; i < styles; i++) o.append("---|");
            o.append('\n');
            for (String sa : s.styles.keySet()) {
                o.append("| ").append(sa).append(" |");
                for (String sb : s.styles.keySet()) {
                    Bench.Tally t = p.byStyles.get(sa + "\u0000" + sb);
                    o.append(' ').append(share(t.aWins, t.aWins + t.bWins)).append(" |");
                }
                o.append('\n');
            }
        }

        o.append("\n## Durata, patte e limite\n\nTurni risolti fino alla fine della partita.\n\n");
        o.append("| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |\n");
        o.append("|---|---|---|---:|---|---|---|---:|\n");
        for (Pair p : pairs.values()) {
            Bench.Tally t = p.tally;
            o.append("| ").append(p.a).append(" | ").append(p.b).append(" | ").append(meanTurns(t)).append(" | ")
                    .append(Bench.percentile(t.turns, t.games, 0.5)).append(" | ").append(Bench.percentile(t.turns, t.games, 0.1)).append("–")
                    .append(Bench.percentile(t.turns, t.games, 0.9)).append(" | ").append(Bench.min(t.turns)).append("–").append(Bench.max(t.turns))
                    .append(" | ").append(share(t.draws, t.games)).append(" | ").append(t.limits).append(" |\n");
        }

        Map<String, Bench.Side> decks = decks(r);
        o.append("\n## Mazzi esauriti e last resort\n\nPer mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.\n\n");
        o.append("| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |\n");
        o.append("|---|---:|---|---:|---:|---:|---:|\n");
        for (Map.Entry<String, Bench.Side> e : decks.entrySet()) {
            Bench.Side d = e.getValue();
            o.append("| ").append(e.getKey()).append(" | ").append(d.games).append(" | ").append(share(d.wins, d.wins + d.losses)).append(" | ")
                    .append(percent(d.exhausted, d.games)).append(" | ").append(percent(d.lrArrived, d.games)).append(" | ")
                    .append(d.lrArrived == 0 ? "—" : Bench.decimal(Bench.ratio(d.lrTurnSum, d.lrArrived), 2)).append(" | ")
                    .append(d.lrArrived == 0 ? "—" : String.valueOf(Bench.percentile(d.lrHist, d.lrArrived, 0.5))).append(" |\n");
        }

        o.append("\n## Risorse inutilizzate a fine partita\n\nMedia a fine partita, per chi vince e per chi perde (patte e limite esclusi). ")
                .append("Il costo più alto nel mazzo serve da riferimento.\n\n");
        o.append("| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |\n|---|---|---:|---:|---:|\n");
        for (Map.Entry<String, Bench.Side> e : decks.entrySet()) {
            Bench.Side d = e.getValue();
            for (int i = 0; i < Bench.SPENDABLE.size(); i++) {
                Resource res = Bench.SPENDABLE.get(i);
                o.append("| ").append(e.getKey()).append(" | ").append(BoundCap.letter(res)).append(" | ")
                        .append(d.endWonGames == 0 ? "—" : Bench.decimal(Bench.ratio(d.endWon[i], d.endWonGames), 1)).append(" | ")
                        .append(d.endLostGames == 0 ? "—" : Bench.decimal(Bench.ratio(d.endLost[i], d.endLostGames), 1)).append(" | ")
                        .append(maxCost(r, e.getKey(), res)).append(" |\n");
            }
        }

        Map<String, Bench.Side> byStyle = deckStyles(r);
        o.append("\n## Costo pagato in HEALTH\n\nMorte pagando: il costo in HEALTH della mossa scelta è almeno pari alla salute del giocatore (R04: ")
                .append("muore, e la mossa prosegue). «Senza uccidere»: l'avversario è ancora vivo a fine turno.\n\n");
        o.append("| mazzo | stile | partite | HEALTH spesa per partita | morti pagando | senza uccidere | sconfitte | patte |\n");
        o.append("|---|---|---:|---:|---:|---:|---:|---:|\n");
        for (Map.Entry<String, Bench.Side> e : byStyle.entrySet()) {
            Bench.Side d = e.getValue();
            String[] key = e.getKey().split("\u0000");
            o.append("| ").append(key[0]).append(" | ").append(key[1]).append(" | ").append(d.games).append(" | ")
                    .append(Bench.decimal(Bench.ratio(d.healthSpent, d.games), 2)).append(" | ").append(d.healthDeaths).append(" | ")
                    .append(d.healthDeathsNoKill).append(" | ").append(d.healthDeathsLost).append(" | ").append(d.healthDeathsDraw).append(" |\n");
        }

        o.append("\n## Carte\n\nPer mazzo, su tutti gli stili. *Giocate*: scelte e pagate, anche se poi annullate. *Quota se giocata*: nelle partite in ")
                .append("cui il mazzo la gioca almeno una volta, con lo scarto dalla quota del mazzo. *Morta*: turni in mano senza essere ")
                .append("una mossa legale; *ferma*: turni in mano, legale ma non scelta; entrambe per partita in cui la carta è stata in mano.\n");
        for (Map.Entry<String, Bench.Side> e : decks.entrySet()) {
            Bench.Side d = e.getValue();
            double base = Bench.ratio(d.wins, d.wins + d.losses);
            o.append("\n**").append(e.getKey()).append("**\n\n");
            o.append("| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |\n");
            o.append("|---|---:|---:|---|---:|---:|\n");
            for (Map.Entry<String, Bench.CardStat> c : d.cards.entrySet()) {
                Bench.CardStat cs = c.getValue();
                long decided = cs.playedWon + cs.playedLost;
                double q = Bench.ratio(cs.playedWon, decided);
                o.append("| ").append(c.getKey()).append(" | ").append(Bench.decimal(Bench.ratio(cs.plays, d.games), 2)).append(" | ")
                        .append(percent(cs.gamesPlayed, d.games)).append(" | ")
                        .append(decided == 0 ? "—" : Bench.decimal(q, 3) + " (" + (q - base >= 0 ? "+" : "−") + Bench.decimal(Math.abs(q - base), 3) + ")")
                        .append(" | ").append(Bench.decimal(Bench.ratio(cs.dead, cs.gamesInHand), 2)).append(" | ")
                        .append(Bench.decimal(Bench.ratio(cs.idle, cs.gamesInHand), 2)).append(" |\n");
            }
        }

        o.append("\n## Tetto delle bound\n\n").append(BoundCap.USES).append(" usi di fila contro un manichino da ").append(BoundCap.HEALTH)
                .append(" HEALTH; salute di tutti alzata a ").append(BoundCap.HEALTH).append(". Valore per uso = danno inflitto (anche periodico) + ")
                .append("danno parato su un colpo di prova da ").append(BoundCap.HIT).append(" HIT + salute propria + guadagni immediati pesati. ")
                .append("Tetto: ").append(s.cap.describe()).append(".\n\n");
        o.append("| bound | personaggio | valore massimo | valore medio | danno 1° → ultimo uso | parato massimo | guadagni (somma) | esito | note |\n");
        o.append("|---|---|---:|---:|---|---:|---|---|---|\n");
        for (BoundCap.Result b : r.bounds) {
            StringBuilder gains = new StringBuilder();
            b.gains.forEach((res, amount) -> {
                if (amount != 0) gains.append(gains.length() == 0 ? "" : ", ").append(BoundCap.letter(res)).append(' ')
                        .append(amount > 0 ? "+" : "").append(Bench.plain(amount).replace('.', ','));
            });
            double maxPrevented = 0;
            for (double v : b.prevented) maxPrevented = Math.max(maxPrevented, v);
            o.append("| ").append(b.bound).append(" | ").append(b.character).append(" | ").append(Bench.decimal(b.max(), 2)).append(" | ")
                    .append(Bench.decimal(b.mean(), 2)).append(" | ")
                    .append(b.uses == 0 ? "—" : Bench.decimal(b.damage[0], 2) + " → " + Bench.decimal(b.damage[b.uses - 1], 2)).append(" | ")
                    .append(Bench.decimal(maxPrevented, 2)).append(" | ").append(gains.length() == 0 ? "—" : gains).append(" | ")
                    .append(b.violates() ? "**viola**: " + b.reasons(s.cap) : "entro il tetto").append(" | ")
                    .append(b.notes.isEmpty() ? "—" : String.join(", ", b.notes)).append(" |\n");
        }
        o.append("\n## Limiti\n\n- I numeri dicono come giocano **questi bot**: un intervallo di confidenza non corregge un bot che gioca male.\n")
                .append("- Nessuno stile tiene conto del costo in HEALTH; le contromosse hanno un valore fisso o legato alla propria salute.\n")
                .append("- Il «+x» del catalogo è stimato 5 dai bot.\n");
        return o.toString();
    }

    private static Map<String, Object> tally(Bench.Tally t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("partite", t.games);
        m.put("vittorieA", t.aWins);
        m.put("vittorieB", t.bWins);
        m.put("patte", t.draws);
        m.put("limite", t.limits);
        m.put("vittoriePrimoPosto", t.firstWins);
        double[] ci = Bench.wilson(t.aWins, t.aWins + t.bWins);
        m.put("quotaA", Bench.round(Bench.ratio(t.aWins, t.aWins + t.bWins)));
        m.put("quotaAIC95", List.of(Bench.round(ci[0]), Bench.round(ci[1])));
        m.put("turniTotali", t.turnSum);
        m.put("turniMediana", Bench.percentile(t.turns, t.games, 0.5));
        m.put("turniP10", Bench.percentile(t.turns, t.games, 0.1));
        m.put("turniP90", Bench.percentile(t.turns, t.games, 0.9));
        m.put("turniMin", Bench.min(t.turns));
        m.put("turniMax", Bench.max(t.turns));
        return m;
    }

    private static Map<String, Object> side(Bench.Side d) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("partite", d.games);
        m.put("vittorie", d.wins);
        m.put("sconfitte", d.losses);
        m.put("patte", d.draws);
        m.put("limite", d.limits);
        m.put("mazzoEsaurito", d.exhausted);
        m.put("lastResortArrivata", d.lrArrived);
        m.put("lastResortTurniTotali", d.lrTurnSum);
        m.put("lastResortMediana", Bench.percentile(d.lrHist, d.lrArrived, 0.5));
        m.put("healthSpesa", d.healthSpent);
        m.put("mortiPagando", d.healthDeaths);
        m.put("mortiPagandoSenzaUccidere", d.healthDeathsNoKill);
        m.put("mortiPagandoSconfitte", d.healthDeathsLost);
        m.put("mortiPagandoPatte", d.healthDeathsDraw);
        Map<String, Object> won = new LinkedHashMap<>(), lost = new LinkedHashMap<>();
        for (int i = 0; i < Bench.SPENDABLE.size(); i++) {
            won.put(BoundCap.letter(Bench.SPENDABLE.get(i)), d.endWon[i]);
            lost.put(BoundCap.letter(Bench.SPENDABLE.get(i)), d.endLost[i]);
        }
        m.put("partiteVinteConRisorse", d.endWonGames);
        m.put("risorseFinaliVincitoreTotali", won);
        m.put("partitePerseConRisorse", d.endLostGames);
        m.put("risorseFinaliPerdenteTotali", lost);
        Map<String, Object> cards = new LinkedHashMap<>();
        d.cards.forEach((binding, c) -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("giocate", c.plays);
            row.put("partiteGiocata", c.gamesPlayed);
            row.put("vinteGiocata", c.playedWon);
            row.put("perseGiocata", c.playedLost);
            row.put("partiteInMano", c.gamesInHand);
            row.put("turniInMano", c.inHand);
            row.put("turniMorta", c.dead);
            row.put("turniFerma", c.idle);
            cards.put(binding, row);
        });
        m.put("carte", cards);
        return m;
    }

    static String json(Bench.Report r) {
        Bench.Settings s = r.settings;
        Map<String, Object> root = new LinkedHashMap<>();
        Map<String, Object> head = new LinkedHashMap<>();
        head.put("banco", Bench.VERSION);
        head.put("bozza", Bench.shownSource(r.draft));
        head.put("sha256", r.sha256);
        head.put("formato", Draft.FORMAT);
        head.put("mazzi", s.decks);
        head.put("stili", new ArrayList<>(s.styles.keySet()));
        head.put("primoSeme", s.firstSeed);
        head.put("partitePerCella", s.games);
        head.put("celle", r.cells.size());
        head.put("partite", r.games());
        head.put("postiAlternati", "semi pari: A gioca per primo");
        Map<String, Object> cap = new LinkedHashMap<>();
        cap.put("tetto", Bench.round(s.cap.cap));
        cap.put("tolleranza", Bench.round(s.cap.tolerance));
        Map<String, Object> weights = new LinkedHashMap<>();
        s.cap.weights.forEach((res, w) -> weights.put(BoundCap.letter(res), Bench.round(w)));
        cap.put("pesi", weights);
        cap.put("usi", BoundCap.USES);
        cap.put("colpoDiProva", BoundCap.HIT);
        head.put("tettoBound", cap);
        if (s.note != null) head.put("nota", s.note);
        root.put("intestazione", head);

        Map<String, Object> inv = new LinkedHashMap<>();
        inv.put("partite", r.checks.games);
        inv.put("turniDiGiocatore", r.checks.seatTurns);
        inv.put("violazioni", r.checks.counts);
        List<String> examples = new ArrayList<>();
        String name = Bench.draftName(r.draft);
        for (String i : Bench.INVARIANTS) for (Bench.Violation v : r.checks.examples.get(i)) examples.add(v.message(name));
        inv.put("esempi", examples);
        root.put("invarianti", inv);

        List<Object> pairs = new ArrayList<>();
        for (Pair p : pairs(r).values()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("A", p.a);
            m.put("B", p.b);
            m.putAll(tally(p.tally));
            pairs.add(m);
        }
        root.put("coppie", pairs);
        List<Object> cells = new ArrayList<>();
        for (Bench.Cell c : r.cells) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("A", c.deckA);
            m.put("stileA", c.styleA);
            m.put("B", c.deckB);
            m.put("stileB", c.styleB);
            m.putAll(tally(c.tally));
            cells.add(m);
        }
        root.put("celle", cells);
        Map<String, Object> decks = new LinkedHashMap<>();
        decks(r).forEach((deck, side) -> decks.put(deck, side(side)));
        root.put("mazzi", decks);
        Map<String, Object> styles = new LinkedHashMap<>();
        deckStyles(r).forEach((key, side) -> styles.put(key.replace("\u0000", " / "), side(side)));
        root.put("mazziPerStile", styles);
        List<Object> bounds = new ArrayList<>();
        for (BoundCap.Result b : r.bounds) bounds.add(BoundCap.json(b, s.cap));
        root.put("tettoBound", bounds);
        try {
            return Bench.pretty(root);
        } catch (Exception error) {
            throw new IllegalStateException(error);
        }
    }
}
