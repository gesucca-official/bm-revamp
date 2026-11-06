package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.service.factories.CardFactoryService;

import java.io.InputStream;
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

/** Catalogo JDBC indipendente dai servizi e dai repository Spring. */
final class SimulationCatalog implements PlayerSource {
    static final String BRUISER = "bruiser.character.BigBadBruiser";
    static final String JUNKIE = "junkie.character.ToxicJunkie";
    private final Map<String, String[]> gui = new LinkedHashMap<>();
    private final Map<String, String[]> special = new LinkedHashMap<>();
    private final Map<String, List<String>> decks = new LinkedHashMap<>();
    private final DataCards dataCards;

    SimulationCatalog() throws Exception {
        this(null);
    }

    /** Con carte a dati (SB-5), quelle carte sostituiscono le classi Java omonime. */
    SimulationCatalog(DataCards dataCards) throws Exception {
        this.dataCards = dataCards;
        Path database = Files.createTempFile(outputDirectory(), "catalog-", ".sqlite");
        try {
            try (InputStream input = SimulationCatalog.class.getResourceAsStream("/cards.sqlite")) {
                if (input == null) throw new IllegalStateException("Catalogo cards.sqlite assente");
                Files.copy(input, database, StandardCopyOption.REPLACE_EXISTING);
            }
            try (Connection connection = DriverManager.getConnection(
                    "jdbc:sqlite:" + database.toUri() + "?mode=ro");
                 Statement statement = connection.createStatement()) {
                try (ResultSet rows = statement.executeQuery("SELECT C_REF_CLASS, T_GUI_NAME, T_GUI_DESCRIPTION, "
                        + "T_GUI_IMAGE, T_GUI_SPRITE, T_GUI_ROLE, T_GUI_GAINS, T_GUI_DAMAGE, T_GUI_DAMAGE_AMOUNT "
                        + "FROM CRD001_GUI ORDER BY C_REF_CLASS")) {
                    while (rows.next()) {
                        String[] fields = new String[8];
                        for (int i = 0; i < fields.length; i++) fields[i] = rows.getString(i + 2);
                        gui.put(rows.getString(1), fields);
                    }
                }
                try (ResultSet rows = statement.executeQuery("SELECT C_PG_REF_CLASS, T_BASIC_REF_CLASS, "
                        + "T_CH_BOUND_1_REF_CLASS, T_CH_BOUND_2_REF_CLASS, T_LAST_RESORT_REF_CLASS "
                        + "FROM DCK002_STARTERS_CH ORDER BY C_PG_REF_CLASS")) {
                    while (rows.next()) special.put(rows.getString(1), new String[] {
                            rows.getString(2), rows.getString(3), rows.getString(4), rows.getString(5)});
                }
                try (ResultSet rows = statement.executeQuery("SELECT C_PG_REF_CLASS, C_CRD_REF_CLASS, N_QTY "
                        + "FROM DCK001_STARTERS ORDER BY C_PG_REF_CLASS, C_CRD_REF_CLASS")) {
                    while (rows.next()) {
                        List<String> deck = decks.computeIfAbsent(rows.getString(1), key -> new ArrayList<>());
                        for (int i = 0; i < rows.getInt(3); i++) deck.add(rows.getString(2));
                    }
                }
            }
        } finally {
            Files.deleteIfExists(database);
        }
    }

    static Path outputDirectory() throws Exception {
        Path root = Path.of("").toAbsolutePath().normalize();
        if (!Files.isDirectory(root.resolve("server"))) root = root.getParent();
        if (root == null || !Files.isRegularFile(root.resolve("server/pom.xml")))
            throw new IllegalStateException("Eseguire dalla radice del worktree o da server/");
        return Files.createDirectories(root.resolve("tmp/sim"));
    }

    Object instantiate(String binding) throws Exception {
        return Class.forName(CardFactoryService.BASE_CARDS_PKG + binding).getConstructor().newInstance();
    }

    Card card(String binding) throws Exception {
        return dress(binding, dataCards != null && dataCards.bindings().contains(binding)
                ? dataCards.create(binding) : (LoadableCard) instantiate(binding));
    }

    java.util.Set<String> bindings() { return gui.keySet(); }

    /** Aggiunge alla carta i testi del catalogo. */
    LoadableCard dress(String binding, LoadableCard card) {
        String[] fields = gui.get(binding);
        if (fields == null) throw new IllegalArgumentException("Carta fuori catalogo: " + binding);
        card.setGuiName(fields[0]);
        card.setGuiEffectDescription(fields[1]);
        card.setGuiImage(fields[2]);
        card.setGuiSprite(fields[3]);
        card.setGuiRole(fields[4], fields[5]);
        card.setGuiDamage(fields[6]);
        card.setGuiDamageAmount(fields[7]);
        return card;
    }

    List<String> starterDeck(String binding) {
        List<String> deck = new ArrayList<>(decks.get(binding));
        java.util.Collections.sort(deck);
        return deck;
    }

    ComPlayer player(String binding, String id, Random random) throws Exception {
        return player(binding, id, random, null);
    }

    /** Senza policy gioca l'attuale ComPlayer casuale, il metro di SB-4. Il mazzo è lo starter del personaggio. */
    @Override
    public ComPlayer player(String binding, String id, Random random, BotPolicy policy) throws Exception {
        String[] fields = special.get(binding);
        if (fields == null || !decks.containsKey(binding))
            throw new IllegalArgumentException("Starter assente: " + binding);
        List<Card> deck = new ArrayList<>();
        for (String name : decks.get(binding)) deck.add(card(name));
        Character character = (Character) instantiate(binding);
        List<Card> bound = List.of(card(fields[1]), card(fields[2]));
        if (policy != null)
            return new BotPlayer(id, character, card(fields[0]), bound, card(fields[3]), deck, random, policy);
        return new ComPlayer(id, character, card(fields[0]), bound, card(fields[3]), deck, random);
    }
}
