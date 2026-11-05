package com.gsc.bm.sim;

import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.RandomPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

/** Gli stili euristici di SB-4: partite complete, riproducibilita', differenza reale e niente nomi di carte. */
class BotStylesTest {
    private static SimulationRunner runner;
    private static final List<String> CHARACTERS = List.of(SimulationCatalog.BRUISER, SimulationCatalog.JUNKIE);
    private static final Map<String, BotPolicy> STYLES = new LinkedHashMap<>();
    private static final List<String> SOURCES = List.of("StyleSupport", "AggressivePolicy", "PrudentPolicy", "ResourceAwarePolicy");

    static {
        STYLES.put("aggressivo", new AggressivePolicy());
        STYLES.put("prudente", new PrudentPolicy());
        STYLES.put("risorse", new ResourceAwarePolicy());
    }

    @BeforeAll static void catalog() throws Exception { runner = new SimulationRunner(new SimulationCatalog()); }

    /** 4 abbinamenti x 50 partite = 200 per stile, semi fissi, posti alternati, contro il casuale del gioco. */
    @Test void everyStylePlaysCompleteGames() throws Exception {
        for (Map.Entry<String, BotPolicy> style : STYLES.entrySet()) {
            int games = 0;
            for (String mine : CHARACTERS)
                for (String theirs : CHARACTERS)
                    for (long seed = 0; seed < 50; seed++) {
                        boolean first = seed % 2 == 0;
                        SimulationRunner.Contender bot = new SimulationRunner.Contender(mine, style.getValue());
                        SimulationRunner.Contender random = new SimulationRunner.Contender(theirs, null);
                        SimulationRunner.Result result = runner.run(seed, first ? bot : random, first ? random : bot);
                        assertNotEquals(SimulationRunner.Outcome.TURN_LIMIT, result.outcome,
                                style.getKey() + " " + mine + "/" + theirs + " seme " + seed);
                        games++;
                    }
            assertEquals(200, games);
        }
    }

    /** Stili uno contro l'altro, che e' il caso in cui ognuno usa davvero la propria vista. */
    @Test void stylesPlayEachOtherToTheEnd() throws Exception {
        List<BotPolicy> all = new ArrayList<>(STYLES.values());
        for (BotPolicy a : all)
            for (BotPolicy b : all)
                for (String mine : CHARACTERS)
                    for (String theirs : CHARACTERS)
                        for (long seed = 0; seed < 4; seed++)
                            assertNotEquals(SimulationRunner.Outcome.TURN_LIMIT, runner.run(seed,
                                    new SimulationRunner.Contender(mine, a), new SimulationRunner.Contender(theirs, b)).outcome);
    }

    @Test void stylesHoldNoState() {
        for (BotPolicy style : STYLES.values())
            for (Field field : style.getClass().getDeclaredFields())
                assertTrue(Modifier.isStatic(field.getModifiers()) && Modifier.isFinal(field.getModifiers()),
                        style.getClass().getSimpleName() + " ha il campo " + field.getName());
    }

    /** Stesso seme, stessa partita; e dopo una copia per serializzazione a meta' partita, stesso seguito. */
    @Test void gamesAreReproducibleAndSurviveACopy() throws Exception {
        for (Map.Entry<String, BotPolicy> style : STYLES.entrySet()) {
            for (long seed = 0; seed < 20; seed++) {
                final long fixed = seed;
                SimulationRunner.Contender a = new SimulationRunner.Contender(SimulationCatalog.BRUISER, style.getValue());
                SimulationRunner.Contender b = new SimulationRunner.Contender(SimulationCatalog.JUNKIE,
                        seed % 2 == 0 ? style.getValue() : null);
                assertEquals(runner.continueGame(runner.newGame(seed, a, b), seed, true, g -> {}).jsonl(),
                        runner.continueGame(runner.newGame(seed, a, b), seed, true, g -> {}).jsonl(),
                        style.getKey() + " seme " + seed);
                int midpoint = Math.max(1, runner.run(seed, a, b).turns / 2);
                Game[] snapshot = new Game[1];
                SimulationRunner.Result original = runner.continueGame(runner.newGame(seed, a, b), seed, true, state -> {
                    if (state.getTurn() == midpoint) {
                        try { snapshot[0] = copy(state); } catch (Exception e) { throw new IllegalStateException(e); }
                    }
                });
                SimulationRunner.Result resumed = runner.continueGame(snapshot[0], fixed, true, state -> {});
                assertEquals(original.trace.subList(midpoint, original.trace.size()), resumed.trace,
                        style.getKey() + " seme " + seed);
            }
        }
    }

    private static Game copy(Game game) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(game); }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            return (Game) in.readObject();
        }
    }

    /** Ogni coppia di stili, sulle stesse viste e con lo stesso Random, sceglie mosse diverse in almeno il 15% dei casi. */
    @Test void stylesChooseDifferently() throws Exception {
        List<BotView> views = new ArrayList<>();
        BotPolicy collector = (view, legal, random) -> {
            if (legal.size() > 1) views.add(view);
            return new RandomPolicy().choose(view, legal, random);
        };
        for (long seed = 0; seed < 60; seed++)
            runner.run(seed, new SimulationRunner.Contender(CHARACTERS.get((int) (seed % 2)), collector),
                    new SimulationRunner.Contender(CHARACTERS.get((int) (seed / 2 % 2)), collector));
        assertTrue(views.size() > 500, "Viste raccolte: " + views.size());

        List<String> names = new ArrayList<>(STYLES.keySet());
        for (int i = 0; i < names.size(); i++)
            for (int j = i + 1; j < names.size(); j++) {
                int different = 0;
                for (int v = 0; v < views.size(); v++) {
                    BotView view = views.get(v);
                    List<LegalMove> legal = view.legalMoves();
                    LegalMove one = STYLES.get(names.get(i)).choose(view, legal, new Random(v));
                    LegalMove two = STYLES.get(names.get(j)).choose(view, legal, new Random(v));
                    if (!one.equals(two)) different++;
                }
                double share = (double) different / views.size();
                assertTrue(share >= 0.15, names.get(i) + " / " + names.get(j) + ": scelte diverse " + share);
            }
    }

    /** Il nome deve corrispondere al gioco: nelle proprie partite il prudente si difende, l'aggressivo colpisce. */
    @Test void prudentReallyDefendsMoreThanAggressive() throws Exception {
        double prudent = defenseShare(new PrudentPolicy()), aggressive = defenseShare(new AggressivePolicy());
        assertTrue(prudent >= aggressive + 0.20, "Quota di difese: prudente " + prudent + ", aggressivo " + aggressive);
    }

    private double defenseShare(BotPolicy style) throws Exception {
        int[] played = {0, 0};
        Map<String, String> roles = new java.util.HashMap<>();
        for (long seed = 0; seed < 100; seed++) {
            Game game = runner.newGame(seed, new SimulationRunner.Contender(SimulationCatalog.BRUISER, style),
                    new SimulationRunner.Contender(SimulationCatalog.BRUISER, null));
            game.getPlayers().get("seat-1").getCardsInHand().forEach(c -> roles.put(c.getName(), BotView.of(game, "seat-1").getSelf().getHand().stream()
                    .filter(seen -> seen.getName().equals(c.getName())).findFirst().get().getRole()));
            runner.continueGame(game, seed, false, state -> {
                BotView.of(state, "seat-1").getSelf().getHand().forEach(seen -> roles.put(seen.getName(), seen.getRole()));
                state.getResolvedMoves().stream().filter(move -> move.getPlayerId().equals("seat-1") && !move.isVoid()).forEach(move -> {
                    played[0]++;
                    if ("DEFENSE".equals(roles.get(move.getPlayedCardName()))) played[1]++;
                });
            });
        }
        assertTrue(played[0] > 500, "Mosse contate: " + played[0]);
        return (double) played[1] / played[0];
    }

    /** Nessun nome o binding di carta o personaggio nei sorgenti degli stili, con l'elenco preso dal catalogo. */
    @Test void sourcesNeverNameCardsOrCharacters() throws Exception {
        Set<String> forbidden = catalogNames();
        assertTrue(forbidden.size() > 80, "Nomi nel catalogo: " + forbidden.size());
        Path root = SimulationCatalog.outputDirectory().getParent().getParent();
        for (String source : SOURCES) {
            String text = Files.readString(root.resolve("server/src/main/java/com/gsc/bm/model/game/bot/" + source + ".java"),
                    StandardCharsets.UTF_8);
            assertEquals(Set.of(), found(forbidden, text), "Nomi di carte o personaggi in " + source);
        }
        // Il controllo deve davvero fallire quando il nome c'e'.
        String planted = "if (card.getName().equals(\"" + forbidden.iterator().next() + "\")) return 1;";
        assertFalse(found(forbidden, planted).isEmpty());
    }

    private static Set<String> found(Set<String> forbidden, String text) {
        Set<String> found = new TreeSet<>();
        for (String name : forbidden)
            if (Pattern.compile("(?<![\\p{L}\\p{N}_])" + Pattern.quote(name) + "(?![\\p{L}\\p{N}_])",
                    Pattern.CASE_INSENSITIVE).matcher(text).find()) found.add(name);
        return found;
    }

    /** Binding completi, nomi di classe, nomi visualizzati di carte e personaggi, letti da cards.sqlite. */
    private static Set<String> catalogNames() throws Exception {
        Set<String> names = new TreeSet<>();
        Path database = Files.createTempFile(SimulationCatalog.outputDirectory(), "names-", ".sqlite");
        try {
            try (InputStream input = BotStylesTest.class.getResourceAsStream("/cards.sqlite")) {
                assertNotNull(input);
                Files.copy(input, database, StandardCopyOption.REPLACE_EXISTING);
            }
            try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + database.toUri() + "?mode=ro");
                 Statement statement = connection.createStatement()) {
                for (String query : List.of("SELECT C_REF_CLASS, T_GUI_NAME FROM CRD001_GUI",
                        "SELECT C_REF_CLASS, T_GUI_NAME FROM CRD003_CHARACTERS"))
                    try (ResultSet rows = statement.executeQuery(query)) {
                        while (rows.next()) {
                            String binding = rows.getString(1);
                            names.add(binding);
                            names.add(binding.substring(binding.lastIndexOf('.') + 1));
                            if (rows.getString(2) != null && !rows.getString(2).isBlank()) names.add(rows.getString(2));
                        }
                    }
            }
        } finally {
            Files.deleteIfExists(database);
        }
        return names;
    }
}
