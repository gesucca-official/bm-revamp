package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.service.factories.CardFactoryService;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;

/**
 * SB-6a: una bozza di set in un file JSON, con carte a dati e carte Java parametriche, personaggi, mazzi e parametri del formato.
 * Tutto si controlla alla lettura; un errore indica file, voce e campo. Vive nei sorgenti di test: la partita viva non la conosce.
 * <p>
 * SB-6b: più set insieme. Un file {@value #FORMAT_SETS} è un set, con una testata ({@code set}, {@code requires}); un file
 * {@value #FORMAT} è il set {@value #BASE_SET} con versione non dichiarata e si legge come prima. Più file si compongono in una
 * vista unita ({@code sets} in testa, {@code set} su ogni voce), che {@link #json()} restituisce e {@link #derive} accetta.
 * Carte e personaggi possono avere una rarità del vocabolario di R07.
 */
final class Draft implements PlayerSource {
    /** Il formato di SB-6a: un solo set, senza testata, letto come il set {@value #BASE_SET}. */
    static final String FORMAT = "sb-6a/1";
    /** Il formato di SB-6b: un file per set, con testata, oppure la vista unita di più set. */
    static final String FORMAT_SETS = "sb-6b/1";
    /** Il set a cui appartengono i file {@value #FORMAT}; l'unico i cui id non hanno il prefisso del set. */
    static final String BASE_SET = "base";
    /** Le rarità di R07 (regolamento 1.13); assente vuol dire nessuna. scripts/check-rules.py le confronta col regolamento. */
    static final List<String> RARITIES = List.of("COMMON", "UNCOMMON", "RARE");
    private static final java.util.regex.Pattern SET_ID = java.util.regex.Pattern.compile("[a-z][a-z0-9-]*");
    /** Il set di oggi scritto come bozza. */
    static final String CURRENT = "/sb-6a/attuale.json";
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Set<Card.CardTarget> ITEM_TARGETS = EnumSet.of(Card.CardTarget.NEAR_ITEM, Card.CardTarget.FAR_ITEM);

    /** Un errore della bozza: il messaggio dice dove. */
    static final class Invalid extends IllegalArgumentException {
        Invalid(String message) { super(message); }
    }

    /** Parametri del formato. */
    static final class Rules {
        final int deckSize, maxCopies, boundChoices;
        final boolean basicFixedPerCharacter, lastResortRequired;

        Rules(int deckSize, int maxCopies, boolean basicFixedPerCharacter, int boundChoices, boolean lastResortRequired) {
            this.deckSize = deckSize;
            this.maxCopies = maxCopies;
            this.basicFixedPerCharacter = basicFixedPerCharacter;
            this.boundChoices = boundChoices;
            this.lastResortRequired = lastResortRequired;
        }
    }

    /** I testi e i dati descrittivi che i bot e la traccia leggono. */
    static final class Gui {
        final String name, description, image, sprite, role, gains, damage, damageAmount;

        Gui(String name, String description, String image, String sprite, String role, String gains, String damage, String damageAmount) {
            this.name = name;
            this.description = description;
            this.image = image;
            this.sprite = sprite;
            this.role = role;
            this.gains = gains;
            this.damage = damage;
            this.damageAmount = damageAmount;
        }
    }

    /** Una carta della bozza: a dati, oppure una classe Java con costo, priorità e parametri scritti nel file. */
    private static final class CardSpec {
        final String binding, set, rarity;
        final Gui gui;
        final String exclusiveTo;
        final DataCards.Definition data;
        final Class<? extends AbstractCard> java;
        final Map<Resource, Integer> cost;
        final Integer priority;
        final Map<String, Integer> params;

        CardSpec(String binding, String set, String rarity, Gui gui, String exclusiveTo, DataCards.Definition data,
                 Class<? extends AbstractCard> java, Map<Resource, Integer> cost, Integer priority, Map<String, Integer> params) {
            this.binding = binding;
            this.set = set;
            this.rarity = rarity;
            this.gui = gui;
            this.exclusiveTo = exclusiveTo;
            this.data = data;
            this.java = java;
            this.cost = cost;
            this.priority = priority;
            this.params = params;
        }
    }

    private static final class CharacterSpec {
        final String id, name, basic, set, rarity;
        final Map<Resource, Integer> resources;
        final int items;
        final Set<Resource> immunities;

        CharacterSpec(String id, String name, Map<Resource, Integer> resources, int items, Set<Resource> immunities, String basic,
                      String set, String rarity) {
            this.id = id;
            this.set = set;
            this.rarity = rarity;
            this.name = name;
            this.resources = resources;
            this.items = items;
            this.immunities = immunities;
            this.basic = basic;
        }
    }

    private static final class DeckSpec {
        final String id, character, basic, lastResort, set;
        final List<String> bound;
        final Map<String, Integer> cards;

        DeckSpec(String id, String character, String basic, List<String> bound, String lastResort, Map<String, Integer> cards, String set) {
            this.id = id;
            this.set = set;
            this.character = character;
            this.basic = basic;
            this.bound = bound;
            this.lastResort = lastResort;
            this.cards = cards;
        }
    }

    /** Un personaggio scritto come dati: id, risorse iniziali (assente resta assente), capacità e immunità. */
    static final class DraftCharacter extends Character {
        DraftCharacter(String id, Map<Resource, Integer> resources, int items, Collection<Resource> immunities) {
            super(id, resources.get(Resource.HEALTH), resources.get(Resource.ALERTNESS), items);
            resources.forEach((resource, value) -> getResources().put(resource, value));
            getImmunities().addAll(immunities);
        }
    }

    /** Un set caricato: id, nome e versione della testata (assenti per un file sb-6a/1), set richiesti, file. */
    static final class SetInfo {
        final String id, name, version, source;
        /** Set richiesto → versione richiesta, o null se non scritta. */
        final Map<String, String> requires;

        SetInfo(String id, String name, String version, String source, Map<String, String> requires) {
            this.id = id;
            this.name = name;
            this.version = version;
            this.source = source;
            this.requires = requires;
        }
    }

    /** Un file letto: da dove viene e il suo JSON. */
    private static final class Unit {
        final String source;
        final JsonNode root;

        Unit(String source, JsonNode root) {
            this.source = source;
            this.root = root;
        }
    }

    final String source;
    /** Il formato letto: sb-6a/1 per un file di SB-6a, sb-6b/1 per un file di set o per più set composti. */
    final String format;
    final Rules rules;
    /** Solo per le prove degli invarianti di SB-7: salta i vincoli di bound e last resort controllati alla lettura. */
    private final boolean lenient;
    private final JsonNode json;
    /** La fonte dei messaggi d'errore: il file in lettura, poi la bozza intera. */
    private String at;
    private final Map<String, SetInfo> sets = new LinkedHashMap<>();
    /** Per ogni set, sé stesso e i set che richiede, anche indirettamente. */
    private final Map<String, Set<String>> visible = new HashMap<>();
    private final Map<String, CharacterSpec> characters = new LinkedHashMap<>();
    private final Map<String, CardSpec> cards = new LinkedHashMap<>();
    private final Map<String, DeckSpec> decks = new LinkedHashMap<>();

    /**
     * La bozza scelta con -Dsim.draft, altrimenti quella del set di oggi. Più fonti, separate da «;», si compongono (SB-6b):
     * percorsi di file o {@code classpath:/risorsa.json}.
     */
    static Draft selected() throws Exception {
        String path = System.getProperty("sim.draft");
        return path == null || path.isBlank() ? fromClasspath(CURRENT) : fromProperty(path);
    }

    static Draft fromClasspath(String resource) throws Exception {
        return parse("classpath:" + resource, readClasspath(resource));
    }

    static Draft fromFile(Path path) throws Exception {
        return parse(path.toString(), readFile(path));
    }

    /**
     * SB-6b: uno o più set insieme, in qualunque ordine. Ogni fonte è un percorso o {@code classpath:/risorsa.json}. Con una fonte
     * sola è come {@link #fromFile} o {@link #fromClasspath}; con più fonti la bozza si chiama coi nomi dei file uniti da « + ».
     */
    static Draft load(List<String> sources) throws Exception {
        if (sources.isEmpty()) throw new Invalid("nessuna bozza da caricare");
        List<Unit> units = new ArrayList<>();
        List<String> names = new ArrayList<>();
        for (String source : sources) {
            if (source.startsWith("classpath:")) units.add(new Unit(source, readClasspath(source.substring("classpath:".length()))));
            else units.add(new Unit(source, readFile(Path.of(source))));
            names.add(source.substring(Math.max(source.lastIndexOf('/'), source.lastIndexOf('\\')) + 1));
        }
        return new Draft(units.size() == 1 ? units.get(0).source : String.join(" + ", names), units, false);
    }

    private static JsonNode readClasspath(String resource) throws Exception {
        try (InputStream input = Draft.class.getResourceAsStream(resource)) {
            if (input == null) throw new Invalid(resource + ": file assente");
            return read(resource, input.readAllBytes());
        }
    }

    private static JsonNode readFile(Path path) throws Exception {
        if (!Files.isRegularFile(path)) throw new Invalid(path + ": file assente");
        return read(path.toString(), Files.readAllBytes(path));
    }

    private static JsonNode read(String source, byte[] bytes) {
        try {
            return JSON.readTree(bytes);
        } catch (Exception error) {
            throw new Invalid(source + ": JSON non valido: " + error.getMessage());
        }
    }

    static Draft parse(String source, JsonNode root) {
        return new Draft(source, List.of(new Unit(source, root)), false);
    }

    /** Più set già letti, per nome di file, come {@link #load} ma senza file su disco: serve alle prove di SB-6b. */
    static Draft parse(Map<String, JsonNode> files) {
        if (files.isEmpty()) throw new Invalid("nessuna bozza da caricare");
        List<Unit> units = new ArrayList<>();
        files.forEach((name, root) -> units.add(new Unit(name, root)));
        return new Draft(units.size() == 1 ? units.get(0).source : String.join(" + ", files.keySet()), units, false);
    }

    /** Le fonti di -Dsim.draft: una o più, separate da «;». */
    static Draft fromProperty(String value) throws Exception {
        List<String> sources = new ArrayList<>();
        for (String part : value.split(";")) if (!part.isBlank()) sources.add(part.trim());
        return sources.size() == 1 && !sources.get(0).startsWith("classpath:") ? fromFile(Path.of(sources.get(0))) : load(sources);
    }

    /**
     * Lettura che salta i vincoli di bound e last resort (bersagli sugli oggetti, last resort a costo). Esiste solo perché le prove
     * di SB-7 dimostrino che i controlli in partita trovano ciò che il caricatore lascerebbe passare: non serve alle misure.
     */
    static Draft parseLenient(String source, JsonNode root) {
        return new Draft(source, List.of(new Unit(source, root)), true);
    }

    private Draft(String source, List<Unit> units, boolean lenient) {
        this.source = source;
        this.lenient = lenient;
        ObjectNode view = compose(units);
        at = source;
        this.json = units.size() == 1 ? units.get(0).root.deepCopy() : view.deepCopy();
        this.format = units.size() == 1 ? units.get(0).root.get("format").asText() : FORMAT_SETS;
        for (JsonNode node : array(view, "sets", "bozza")) {
            SetInfo set = setInfo(node);
            SetInfo previous = sets.put(set.id, set);
            if (previous != null) throw invalid("set " + set.id, "caricato due volte: " + previous.source + " e " + set.source);
        }
        if (sets.isEmpty()) throw invalid("bozza", "sets vuota: serve almeno un set");
        checkRequires();
        if (!view.has("rules")) throw invalid("bozza", "nessun set dichiara le regole del formato: manca il set di partenza");
        rules = rules(object(view.get("rules"), "rules"));
        for (JsonNode node : array(view, "characters", "bozza")) {
            CharacterSpec character = character(node);
            CharacterSpec previous = characters.put(character.id, character);
            if (previous != null) throw invalid(label("personaggio", character.id, character.set), "id ripetuto" + between(previous.set, character.set));
        }
        for (JsonNode node : array(view, "cards", "bozza")) {
            CardSpec card = card(node);
            String where = label("carta", card.binding, card.set);
            if (characters.containsKey(card.binding))
                throw invalid(where, "id già usato da un personaggio" + between(characters.get(card.binding).set, card.set));
            CardSpec previous = cards.put(card.binding, card);
            if (previous != null) throw invalid(where, "binding ripetuto" + between(previous.set, card.set));
        }
        checkCards();
        for (CharacterSpec character : characters.values()) checkCharacter(character);
        for (JsonNode node : array(view, "decks", "bozza")) {
            DeckSpec deck = deck(node);
            DeckSpec previous = decks.put(deck.id, deck);
            if (previous != null) throw invalid(label("mazzo", deck.id, deck.set), "id ripetuto" + between(previous.set, deck.set));
        }
        if (decks.isEmpty()) throw invalid("bozza", "nessun mazzo");
    }

    // ---- composizione dei set (SB-6b) ----

    /**
     * Porta i file letti alla vista unita: {@code sets} in testa, {@code set} su ogni voce. Un file sb-6a/1 diventa il set base;
     * un file di set porta la sua testata; una vista unita già fatta (da {@link #derive}) si legge da sola, così com'è.
     */
    private ObjectNode compose(List<Unit> units) {
        ObjectNode view = JSON.createObjectNode();
        view.put("format", FORMAT_SETS);
        ArrayNode setsNode = view.putArray("sets");
        JsonNode rulesNode = null;
        String rulesFrom = null;
        Map<String, ArrayNode> entries = new LinkedHashMap<>();
        for (String kind : List.of("characters", "cards", "decks")) entries.put(kind, JSON.createArrayNode());
        for (Unit unit : units) {
            at = unit.source;
            ObjectNode top = object(unit.root, "bozza");
            String format = text(top, "format", "bozza");
            ObjectNode header = JSON.createObjectNode();
            boolean legacy = FORMAT.equals(format);
            if (legacy) {
                fields(top, "bozza", Set.of("format", "rules", "characters", "cards", "decks"), Set.of());
                header.put("id", BASE_SET);
            } else if (FORMAT_SETS.equals(format)) {
                if (top.has("sets")) {
                    if (units.size() > 1)
                        throw invalid("bozza", "una vista unita (sets) si legge da sola: per comporre si caricano i file dei singoli set");
                    fields(top, "bozza", Set.of("format", "sets", "rules", "characters", "cards", "decks"), Set.of());
                    return top.deepCopy();
                }
                if (!top.has("set"))
                    throw invalid("bozza", "format " + FORMAT_SETS + ": campo set mancante (la testata del set), o sets per una vista unita");
                fields(top, "bozza", Set.of("format", "set", "characters", "cards", "decks"), Set.of("requires", "rules"));
                ObjectNode set = object(top.get("set"), "set");
                fields(set, "set", Set.of("id", "name", "version"), Set.of());
                text(set, "name", "set");
                text(set, "version", "set");
                header.setAll(set);
                if (top.has("requires")) array(top, "requires", "bozza");
                header.set("requires", top.has("requires") ? top.get("requires").deepCopy() : JSON.createArrayNode());
                boolean root = !top.has("requires") || top.get("requires").isEmpty();
                if (root && !top.has("rules"))
                    throw invalid("bozza", "campo rules mancante: il set di partenza, che non ne richiede altri, dichiara le regole del formato");
                if (!root && top.has("rules"))
                    throw invalid("bozza", "campo rules non ammesso: le regole del formato sono del set di partenza, non di un set che ne richiede altri");
            } else throw invalid("bozza", "format vale " + format + ", attesi " + FORMAT + " o " + FORMAT_SETS);
            header.put("source", unit.source);
            setsNode.add(header);
            if (top.has("rules")) {
                if (rulesNode != null)
                    throw invalid("bozza", "regole del formato già dichiarate da " + rulesFrom + ": le dichiara solo il set di partenza");
                rulesNode = top.get("rules");
                rulesFrom = unit.source;
            }
            String set = text(header, "id", "set");
            for (Map.Entry<String, ArrayNode> kind : entries.entrySet())
                for (JsonNode raw : array(top, kind.getKey(), "bozza")) {
                    String what = kind.getKey().equals("characters") ? "personaggio" : kind.getKey().equals("cards") ? "carta" : "mazzo";
                    ObjectNode entry = object(raw, what).deepCopy();
                    String where = what + " " + entry.path(what.equals("carta") ? "binding" : "id").asText("?");
                    if (legacy) {
                        // Un file sb-6a/1 resta rigido come prima: niente campi di SB-6b.
                        if (entry.has("set")) throw invalid(where, "campo sconosciuto set");
                        if (entry.has("rarity")) throw invalid(where, "campo sconosciuto rarity");
                    } else if (entry.has("set")) throw invalid(where, "campo set non ammesso: il set della voce è quello della testata");
                    entry.put("set", set);
                    kind.getValue().add(entry);
                }
        }
        // Senza regole il messaggio arriva dopo i requires: se manca il set di partenza, si dice quale.
        if (rulesNode != null) view.set("rules", rulesNode.deepCopy());
        entries.forEach(view::set);
        return view;
    }

    private SetInfo setInfo(JsonNode raw) {
        ObjectNode node = object(raw, "set");
        String id = text(node, "id", "set");
        String where = "set " + id;
        fields(node, where, Set.of("id"), Set.of("name", "version", "requires", "source"));
        if (!SET_ID.matcher(id).matches()) throw invalid(where, "id del set non valido: lettere minuscole, cifre e trattini, iniziale una lettera");
        Map<String, String> requires = new LinkedHashMap<>();
        if (node.has("requires"))
            for (JsonNode entry : array(node, "requires", where)) {
                ObjectNode requirement = object(entry, where + ": requires");
                fields(requirement, where + ": requires", Set.of("set"), Set.of("version"));
                String set = text(requirement, "set", where + ": requires");
                if (requires.containsKey(set)) throw invalid(where, "requires: " + set + " ripetuto");
                requires.put(set, optional(requirement, "version", where + ": requires"));
            }
        return new SetInfo(id, optional(node, "name", where), optional(node, "version", where), optional(node, "source", where),
                Collections.unmodifiableMap(requires));
    }

    /** Ogni set richiesto è caricato, nella versione chiesta se scritta, senza giri; poi la visibilità di ogni set. */
    private void checkRequires() {
        for (SetInfo set : sets.values())
            for (Map.Entry<String, String> requirement : set.requires.entrySet()) {
                String where = "set " + set.id;
                SetInfo required = sets.get(requirement.getKey());
                if (requirement.getKey().equals(set.id)) throw invalid(where, "richiede sé stesso");
                if (required == null)
                    throw invalid(where, "richiede il set " + requirement.getKey() + ", che non è caricato (caricati: "
                            + String.join(", ", sets.keySet()) + ")");
                if (requirement.getValue() != null && !requirement.getValue().equals(required.version))
                    throw invalid(where, "richiede " + required.id + " " + requirement.getValue() + ", caricato in versione "
                            + (required.version == null ? "non dichiarata" : required.version));
            }
        for (SetInfo set : sets.values()) {
            Set<String> reached = new LinkedHashSet<>();
            java.util.ArrayDeque<String> open = new java.util.ArrayDeque<>(set.requires.keySet());
            while (!open.isEmpty()) {
                String next = open.pop();
                if (next.equals(set.id)) throw invalid("set " + set.id, "requires circolare: attraverso altri set richiede sé stesso");
                if (reached.add(next)) open.addAll(sets.get(next).requires.keySet());
            }
            reached.add(set.id);
            visible.put(set.id, Collections.unmodifiableSet(reached));
        }
    }

    /** Dove sta una voce: col set solo se la bozza ne ha più di uno, così i messaggi di un set solo restano quelli di SB-6a. */
    private String label(String what, String id, String set) {
        return what + " " + id + (set != null && sets.size() > 1 ? " (set " + set + ")" : "");
    }

    private String between(String first, String second) {
        if (first == null || second == null || first.equals(second)) return "";
        return ": è sia nel set " + first + " (" + sets.get(first).source + ") sia nel set " + second + " (" + sets.get(second).source + ")";
    }

    /** Il set della voce, se c'è, deve essere caricato; un set diverso da base dà il prefisso agli id. */
    private String setOf(ObjectNode node, String where, String id) {
        String set = optional(node, "set", where);
        if (set == null) return null;
        if (!sets.containsKey(set)) throw invalid(where, "set " + set + " non caricato (caricati: " + String.join(", ", sets.keySet()) + ")");
        if (!BASE_SET.equals(set) && !id.startsWith(set + "."))
            throw invalid(where, "l'id deve iniziare con «" + set + ".», il prefisso del suo set");
        return set;
    }

    private String rarity(ObjectNode node, String where) {
        String rarity = optional(node, "rarity", where);
        if (rarity != null && !RARITIES.contains(rarity))
            throw invalid(where, "rarity " + rarity + " fuori vocabolario: " + String.join(", ", RARITIES) + " (R07), oppure nessuna");
        return rarity;
    }

    /**
     * Una voce di un set usa solo il proprio set e quelli che richiede. Una voce senza set (sonde del banco, mazzi costruiti)
     * vede tutti i set caricati.
     */
    private void reach(String from, String where, String what, String id, String to) {
        if (from == null) return;
        if (to == null) throw invalid(where, what + " " + id + " non appartiene a nessun set: il set " + from + " non può usarla");
        if (!visible.get(from).contains(to))
            throw invalid(where, what + " " + id + " è del set " + to + ", che il set " + from + " non richiede (richiede: "
                    + (sets.get(from).requires.isEmpty() ? "nessuno" : String.join(", ", sets.get(from).requires.keySet())) + ")");
    }

    // ---- set e rarità (SB-6b) ----

    /** I set caricati, nell'ordine di lettura. */
    Map<String, SetInfo> sets() { return Collections.unmodifiableMap(sets); }

    /** Il set della carta, o null per una carta senza set (una sonda). */
    String setOfCard(String binding) { return cards.get(binding).set; }

    String setOfCharacter(String id) { return characters.get(id).set; }

    String setOfDeck(String id) { return decks.get(id).set; }

    /** La rarità della carta (R07), o null se non ne ha. */
    String rarityOf(String binding) { return cards.get(binding).rarity; }

    String characterRarity(String id) { return characters.get(id).rarity; }

    String characterName(String id) { return characters.get(id).name; }

    /** Le bound legate al personaggio fra le carte caricate, in ordine di binding: quelle fra cui un mazzo sceglie. */
    List<String> boundsAvailable(String character) {
        List<String> out = new ArrayList<>();
        for (String binding : new java.util.TreeSet<>(cards.keySet())) {
            Card card = card(binding);
            if (card.isCharacterBound() && character.equals(card.getBoundToCharacter())) out.add(binding);
        }
        return out;
    }

    Set<String> deckIds() { return Collections.unmodifiableSet(decks.keySet()); }

    Set<String> cardBindings() { return Collections.unmodifiableSet(cards.keySet()); }

    String characterOf(String deck) { return decks.get(deck).character; }

    /** Una copia del JSON letto: la ricerca dei mazzi di SB-7 ne deriva bozze con altri mazzi. */
    JsonNode json() { return json.deepCopy(); }

    boolean isLenient() { return lenient; }

    /** Una bozza derivata da questa, letta allo stesso modo (stretto o indulgente). */
    Draft derive(String source, JsonNode root) { return new Draft(source, List.of(new Unit(source, root)), lenient); }

    Set<String> characterIds() { return Collections.unmodifiableSet(characters.keySet()); }

    String characterBasic(String character) { return characters.get(character).basic; }

    String basicOf(String deck) { return decks.get(deck).basic; }

    List<String> boundOf(String deck) { return decks.get(deck).bound; }

    String lastResortOf(String deck) { return decks.get(deck).lastResort; }

    /** Le carte regolari del mazzo, per binding, con le copie. */
    Map<String, Integer> cardsOf(String deck) { return decks.get(deck).cards; }

    /** Il personaggio a cui è riservata la last resort, o null. */
    String exclusiveTo(String binding) { return cards.get(binding).exclusiveTo; }

    /** Un nuovo personaggio come lo crea un mazzo: risorse, capacità e immunità della bozza. */
    Character character(String id) {
        CharacterSpec spec = characters.get(id);
        if (spec == null) throw new IllegalArgumentException(source + ": personaggio assente: " + id);
        return new DraftCharacter(spec.id, spec.resources, spec.items, spec.immunities);
    }

    /** Le carte che almeno un mazzo usa: basic, bound, last resort e regolari. */
    Set<String> deckCards() {
        Set<String> used = new java.util.TreeSet<>();
        for (DeckSpec deck : decks.values()) {
            used.add(deck.basic);
            used.addAll(deck.bound);
            used.add(deck.lastResort);
            used.addAll(deck.cards.keySet());
        }
        return used;
    }

    /** Una nuova istanza della carta, coi numeri e i testi della bozza. */
    Card card(String binding) {
        CardSpec spec = cards.get(binding);
        if (spec == null) throw new IllegalArgumentException(source + ": carta assente: " + binding);
        return create(spec);
    }

    @Override
    public Player player(String deckId, String id, Random random, BotPolicy policy) {
        DeckSpec deck = decks.get(deckId);
        if (deck == null) throw new IllegalArgumentException(source + ": mazzo assente: " + deckId);
        CharacterSpec spec = characters.get(deck.character);
        // Stesso ordine del catalogo SB-3: carte del mazzo per binding, poi personaggio, bound, basic e last resort.
        List<Card> regular = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : deck.cards.entrySet())
            for (int i = 0; i < entry.getValue(); i++) regular.add(card(entry.getKey()));
        Character character = new DraftCharacter(spec.id, spec.resources, spec.items, spec.immunities);
        List<Card> bound = new ArrayList<>();
        for (String binding : deck.bound) bound.add(card(binding));
        Card basic = card(deck.basic), lastResort = card(deck.lastResort);
        if (policy != null) return new BotPlayer(id, character, basic, List.copyOf(bound), lastResort, regular, random, policy);
        return new ComPlayer(id, character, basic, List.copyOf(bound), lastResort, regular, random);
    }

    // ---- lettura delle voci ----

    private Rules rules(ObjectNode node) {
        String where = "rules";
        fields(node, where, Set.of("deckSize", "maxCopies", "basicFixedPerCharacter", "boundChoices", "lastResortRequired"), Set.of());
        int deckSize = integer(node, "deckSize", where), maxCopies = integer(node, "maxCopies", where);
        int boundChoices = integer(node, "boundChoices", where);
        boolean basicFixed = bool(node, "basicFixedPerCharacter", where), lastResort = bool(node, "lastResortRequired", where);
        if (deckSize < 1) throw invalid(where, "deckSize deve essere almeno 1");
        if (maxCopies < 1) throw invalid(where, "maxCopies deve essere almeno 1");
        // La mano ha Player.CARDS_IN_HAND carte: basic e bound devono lasciare almeno un posto alle regolari.
        if (boundChoices < 0 || 1 + boundChoices > Player.CARDS_IN_HAND - 1)
            throw invalid(where, "boundChoices deve stare fra 0 e " + (Player.CARDS_IN_HAND - 2) + " (mano da " + Player.CARDS_IN_HAND + ")");
        if (!lastResort) throw invalid(where, "lastResortRequired false non è giocabile: il motore richiede una last resort (Player)");
        return new Rules(deckSize, maxCopies, basicFixed, boundChoices, true);
    }

    private CharacterSpec character(JsonNode raw) {
        ObjectNode node = object(raw, "personaggio");
        String id = text(node, "id", "personaggio");
        String where = label("personaggio", id, textOrNull(node, "set"));
        fields(node, where, Set.of("id", "name", "resources", "items", "immunities"), Set.of("basic", "rarity", "set"));
        String set = setOf(node, where, id), rarity = rarity(node, where);
        String name = text(node, "name", where);
        ObjectNode resourcesNode = object(node.get("resources"), where + ": resources");
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resourcesNode.fields().forEachRemaining(entry -> {
            Resource resource = resource(entry.getKey(), where + ": resources");
            resources.put(resource, intValue(entry.getValue(), where + ": resources." + entry.getKey()));
            if (resources.get(resource) < 0) throw invalid(where, "resources." + entry.getKey() + " non può essere negativo");
        });
        if (!resources.containsKey(Resource.HEALTH)) throw invalid(where, "resources.HEALTH mancante");
        if (!resources.containsKey(Resource.ALERTNESS)) throw invalid(where, "resources.ALERTNESS mancante");
        if (resources.get(Resource.HEALTH) < 1) throw invalid(where, "resources.HEALTH deve essere almeno 1");
        int items = integer(node, "items", where);
        if (items < 1) throw invalid(where, "items deve essere almeno 1");
        Set<Resource> immunities = new LinkedHashSet<>();
        for (JsonNode immunity : array(node, "immunities", where)) {
            if (!immunity.isTextual()) throw invalid(where, "immunities contiene un valore non testuale: " + immunity);
            if (!immunities.add(resource(immunity.asText(), where + ": immunities")))
                throw invalid(where, "immunities: " + immunity.asText() + " ripetuta");
        }
        String basic = node.has("basic") ? text(node, "basic", where) : null;
        if (rules.basicFixedPerCharacter && basic == null) throw invalid(where, "campo basic mancante: la basic è fissa per personaggio");
        return new CharacterSpec(id, name, Collections.unmodifiableMap(resources), items, Collections.unmodifiableSet(immunities), basic,
                set, rarity);
    }

    private CardSpec card(JsonNode raw) {
        ObjectNode node = object(raw, "carta");
        String binding = text(node, "binding", "carta");
        String where = label("carta", binding, textOrNull(node, "set"));
        String set = setOf(node, where, binding), rarity = rarity(node, where);
        Gui gui = gui(node.get("gui"), where);
        String exclusiveTo = node.has("exclusiveTo") ? text(node, "exclusiveTo", where) : null;
        if (node.has("java")) {
            fields(node, where, Set.of("binding", "java", "gui"), Set.of("cost", "priority", "params", "exclusiveTo", "rarity", "set"));
            if (!node.get("java").isBoolean() || !node.get("java").asBoolean()) throw invalid(where, "java, se presente, vale true");
            return javaCard(node, binding, where, gui, exclusiveTo, set, rarity);
        }
        ObjectNode definition = node.deepCopy();
        definition.remove("gui");
        definition.remove("exclusiveTo");
        definition.remove("rarity");
        definition.remove("set");
        try {
            return new CardSpec(binding, set, rarity, gui, exclusiveTo, DataCards.definition(definition), null, null, null, null);
        } catch (JsonMappingException error) {
            StringBuilder path = new StringBuilder();
            for (JsonMappingException.Reference reference : error.getPath()) {
                if (reference.getFieldName() != null) path.append(path.length() == 0 ? "" : ".").append(reference.getFieldName());
                else path.append('[').append(reference.getIndex()).append(']');
            }
            throw invalid(where, "campo " + (path.length() == 0 ? "?" : path) + ": " + error.getOriginalMessage().split("\n")[0]);
        } catch (IllegalArgumentException error) {
            throw invalid(where, error.getMessage().replace("Carta " + binding + ": ", ""));
        } catch (Exception error) {
            throw invalid(where, error.getMessage());
        }
    }

    private CardSpec javaCard(ObjectNode node, String binding, String where, Gui gui, String exclusiveTo, String set, String rarity) {
        Class<? extends AbstractCard> type;
        try {
            Class<?> found = Class.forName(CardFactoryService.BASE_CARDS_PKG + binding);
            if (!AbstractCard.class.isAssignableFrom(found) || Modifier.isAbstract(found.getModifiers()))
                throw invalid(where, "la classe non è una carta concreta");
            type = found.asSubclass(AbstractCard.class);
            type.getConstructor();
        } catch (ClassNotFoundException error) {
            throw invalid(where, "nessuna classe Java " + CardFactoryService.BASE_CARDS_PKG + binding);
        } catch (NoSuchMethodException error) {
            throw invalid(where, "la classe non ha un costruttore pubblico senza argomenti");
        }
        AbstractCard probe = instantiate(type, where);
        Map<String, Field> tunable = tunableFields(type, where);
        Map<String, Integer> params = new TreeMap<>();
        ObjectNode paramsNode = object(node.get("params"), where + ": params");
        paramsNode.fields().forEachRemaining(entry -> {
            if (!tunable.containsKey(entry.getKey()))
                throw invalid(where, "parametro sconosciuto params." + entry.getKey() + " (noti: " + new TreeMap<>(tunable).keySet() + ")");
            params.put(entry.getKey(), intValue(entry.getValue(), where + ": params." + entry.getKey()));
        });
        for (String name : tunable.keySet())
            if (!params.containsKey(name)) throw invalid(where, "parametro mancante params." + name);
        Map<Resource, Integer> cost = null;
        Integer priority = null;
        if (probe.isItem()) {
            if (node.has("cost") || node.has("priority"))
                throw invalid(where, "un oggetto ha costo e priorità fissi: cost e priority non sono ammessi");
        } else {
            if (!node.has("cost")) throw invalid(where, "campo cost mancante");
            if (!node.has("priority")) throw invalid(where, "campo priority mancante");
            cost = new EnumMap<>(Resource.class);
            Map<Resource, Integer> costs = cost;
            object(node.get("cost"), where + ": cost").fields().forEachRemaining(entry -> {
                Resource resource = resource(entry.getKey(), where + ": cost");
                int value = intValue(entry.getValue(), where + ": cost." + entry.getKey());
                if (value < 0) throw invalid(where, "cost." + entry.getKey() + " non può essere negativo");
                costs.put(resource, value);
            });
            cost = Collections.unmodifiableMap(cost);
            priority = intValue(node.get("priority"), where + ": priority");
        }
        return new CardSpec(binding, set, rarity, gui, exclusiveTo, null, type, cost, priority, Collections.unmodifiableMap(params));
    }

    private Gui gui(JsonNode raw, String where) {
        String at = where + ": gui";
        if (raw == null) throw invalid(where, "campo gui mancante");
        ObjectNode node = object(raw, at);
        fields(node, at, Set.of("name", "role", "gains", "damage", "damageAmount"), Set.of("description", "image", "sprite"));
        return new Gui(text(node, "name", at), optional(node, "description", at), optional(node, "image", at), optional(node, "sprite", at),
                text(node, "role", at), text(node, "gains", at), text(node, "damage", at), text(node, "damageAmount", at));
    }

    private DeckSpec deck(JsonNode raw) {
        ObjectNode node = object(raw, "mazzo");
        String id = text(node, "id", "mazzo");
        String where = label("mazzo", id, textOrNull(node, "set"));
        fields(node, where, Set.of("id", "character", "bound", "lastResort", "cards"), Set.of("basic", "set"));
        String set = setOf(node, where, id);
        String characterId = text(node, "character", where);
        CharacterSpec character = characters.get(characterId);
        if (character == null) throw invalid(where, "personaggio sconosciuto: " + characterId + loaded());
        reach(set, where, "il personaggio", characterId, character.set);
        String basic = node.has("basic") ? text(node, "basic", where) : null;
        if (rules.basicFixedPerCharacter) {
            if (basic != null && !basic.equals(character.basic))
                throw invalid(where, "basic " + basic + " diversa da quella fissa del personaggio, " + character.basic);
            basic = character.basic;
        } else if (basic == null) throw invalid(where, "campo basic mancante");
        Card basicCard = probe(basic, where + ": basic");
        if (!basicCard.isBasicAction()) throw invalid(where, "basic " + basic + " non è una carta basic");
        reach(set, where + ": basic", "la carta", basic, cards.get(basic).set);

        List<String> bound = new ArrayList<>();
        for (JsonNode entry : array(node, "bound", where)) {
            if (!entry.isTextual()) throw invalid(where, "bound contiene un valore non testuale: " + entry);
            String binding = entry.asText();
            Card card = probe(binding, where + ": bound");
            if (!card.isCharacterBound()) throw invalid(where, "bound " + binding + " non è una carta bound");
            if (!characterId.equals(card.getBoundToCharacter()))
                throw invalid(where, "bound " + binding + " è legata a " + card.getBoundToCharacter() + ", non a " + characterId);
            if (bound.contains(binding)) throw invalid(where, "bound " + binding + " ripetuta: servono bound diverse");
            reach(set, where + ": bound", "la carta", binding, cards.get(binding).set);
            bound.add(binding);
        }
        if (bound.size() != rules.boundChoices)
            throw invalid(where, "bound sono " + bound.size() + ", il formato ne chiede " + rules.boundChoices);

        String lastResort = text(node, "lastResort", where);
        Card lastResortCard = probe(lastResort, where + ": lastResort");
        if (!lastResortCard.isLastResort()) throw invalid(where, "lastResort " + lastResort + " non è una last resort");
        reach(set, where + ": lastResort", "la carta", lastResort, cards.get(lastResort).set);
        String exclusive = cards.get(lastResort).exclusiveTo;
        if (exclusive != null && !exclusive.equals(characterId))
            throw invalid(where, "lastResort " + lastResort + " è riservata a " + exclusive + ", non a " + characterId);

        Map<String, Integer> regular = new TreeMap<>(); // Ordine per binding, come il catalogo SB-3.
        int total = 0;
        Iterator<Map.Entry<String, JsonNode>> entries = object(node.get("cards"), where + ": cards").fields();
        while (entries.hasNext()) {
            Map.Entry<String, JsonNode> entry = entries.next();
            String binding = entry.getKey();
            Card card = probe(binding, where + ": cards");
            if (card.isBasicAction() || card.isCharacterBound() || card.isLastResort())
                throw invalid(where, "cards." + binding + ": basic, bound e last resort non vanno fra le carte regolari");
            reach(set, where + ": cards", "la carta", binding, cards.get(binding).set);
            int copies = intValue(entry.getValue(), where + ": cards." + binding);
            if (copies < 1) throw invalid(where, "cards." + binding + ": almeno una copia");
            if (copies > rules.maxCopies)
                throw invalid(where, "cards." + binding + ": " + copies + " copie, il formato ne ammette al massimo " + rules.maxCopies);
            regular.put(binding, copies);
            total += copies;
        }
        if (total != rules.deckSize)
            throw invalid(where, "le carte regolari sono " + total + ", il formato ne chiede esattamente " + rules.deckSize);
        return new DeckSpec(id, characterId, basic, List.copyOf(bound), lastResort, Collections.unmodifiableMap(regular), set);
    }

    // ---- controlli sull'insieme ----

    private void checkCards() {
        Map<String, String> names = new HashMap<>();
        for (CardSpec spec : cards.values()) {
            String where = label("carta", spec.binding, spec.set);
            String previous = names.put(spec.gui.name.toLowerCase(java.util.Locale.ROOT), spec.binding);
            if (previous != null) throw invalid(where, "gui.name «" + spec.gui.name + "» già usato da " + previous
                    + (sets.size() > 1 && cards.get(previous).set != null ? " del set " + cards.get(previous).set : "")
                    + " (la mano cerca le carte per nome)");
            Card card = probe(spec.binding, where);
            if (card.isCharacterBound()) {
                if (!characters.containsKey(card.getBoundToCharacter()))
                    throw invalid(where, "boundTo " + card.getBoundToCharacter() + " non è un personaggio della bozza" + loaded());
                reach(spec.set, where, "il personaggio", card.getBoundToCharacter(), characters.get(card.getBoundToCharacter()).set);
                if (!lenient && !Collections.disjoint(card.getCanTarget(), ITEM_TARGETS))
                    throw invalid(where, "una bound non può bersagliare oggetti: deve avere sempre un bersaglio valido");
            }
            if (card.isLastResort() && !lenient) {
                if (!card.getCost().isEmpty()) throw invalid(where, "una last resort non può avere un costo: deve essere sempre giocabile");
                if (!Collections.disjoint(card.getCanTarget(), ITEM_TARGETS))
                    throw invalid(where, "una last resort non può bersagliare oggetti: deve essere sempre giocabile");
            }
            if (spec.exclusiveTo != null) {
                if (!card.isLastResort()) throw invalid(where, "exclusiveTo vale solo per le last resort");
                if (!characters.containsKey(spec.exclusiveTo))
                    throw invalid(where, "exclusiveTo " + spec.exclusiveTo + " non è un personaggio della bozza" + loaded());
                reach(spec.set, where, "il personaggio", spec.exclusiveTo, characters.get(spec.exclusiveTo).set);
            }
        }
    }

    private void checkCharacter(CharacterSpec character) {
        if (character.basic == null) return;
        String where = label("personaggio", character.id, character.set);
        Card basic = probe(character.basic, where + ": basic");
        if (!basic.isBasicAction()) throw invalid(where, "basic " + character.basic + " non è una carta basic");
        reach(character.set, where + ": basic", "la carta", character.basic, cards.get(character.basic).set);
    }

    // ---- istanze ----

    private Card probe(String binding, String where) {
        if (!cards.containsKey(binding)) throw invalid(where, "carta sconosciuta: " + binding + loaded());
        return create(cards.get(binding));
    }

    private Card create(CardSpec spec) {
        LoadableCard card;
        if (spec.data != null) card = DataCards.instantiate(spec.data);
        else {
            AbstractCard java = instantiate(spec.java, "carta " + spec.binding);
            Map<String, Field> tunable = tunableFields(spec.java, "carta " + spec.binding);
            try {
                for (Map.Entry<String, Integer> param : spec.params.entrySet()) tunable.get(param.getKey()).setInt(java, param.getValue());
                if (spec.cost != null) {
                    COST.set(java, spec.cost);
                    PRIORITY.setInt(java, spec.priority);
                }
            } catch (IllegalAccessException error) {
                throw new IllegalStateException(error);
            }
            card = java;
        }
        Gui gui = spec.gui;
        card.setGuiName(gui.name);
        card.setGuiEffectDescription(gui.description);
        card.setGuiImage(gui.image);
        card.setGuiSprite(gui.sprite);
        card.setGuiRole(gui.role, gui.gains);
        card.setGuiDamage(gui.damage);
        card.setGuiDamageAmount(gui.damageAmount);
        return card;
    }

    private static final Field COST = abstractCardField("cost");
    private static final Field PRIORITY = abstractCardField("priority");

    private static Field abstractCardField(String name) {
        try {
            Field field = AbstractCard.class.getDeclaredField(name);
            field.setAccessible(true);
            return field;
        } catch (NoSuchFieldException error) {
            throw new IllegalStateException("AbstractCard senza il campo " + name, error);
        }
    }

    private AbstractCard instantiate(Class<? extends AbstractCard> type, String where) {
        try {
            return type.getConstructor().newInstance();
        } catch (Exception error) {
            throw invalid(where, "la classe non si istanzia: " + error);
        }
    }

    /** I campi @Tunable della classe e delle superclassi, per nome; solo int. */
    private Map<String, Field> tunableFields(Class<?> type, String where) {
        Map<String, Field> fields = new TreeMap<>();
        for (Class<?> c = type; c != null && c != Object.class; c = c.getSuperclass())
            for (Field field : c.getDeclaredFields()) {
                if (!field.isAnnotationPresent(Tunable.class)) continue;
                if (field.getType() != int.class || Modifier.isStatic(field.getModifiers()) || Modifier.isFinal(field.getModifiers()))
                    throw invalid(where, "@Tunable " + c.getSimpleName() + "." + field.getName() + " deve essere un int d'istanza non final");
                if (fields.containsKey(field.getName())) throw invalid(where, "@Tunable " + field.getName() + " ripetuto nella gerarchia");
                field.setAccessible(true);
                fields.put(field.getName(), field);
            }
        return fields;
    }

    // ---- lettura stretta ----

    private Invalid invalid(String where, String message) {
        return new Invalid(at + ": " + where + ": " + message);
    }

    /** Con più set, i set caricati: aiuta a capire se manca un set o se l'id è sbagliato. */
    private String loaded() {
        return sets.size() > 1 ? " (set caricati: " + String.join(", ", sets.keySet()) + ")" : "";
    }

    private ObjectNode object(JsonNode node, String where) {
        if (node == null || node.isNull()) throw invalid(where, "oggetto mancante");
        if (!node.isObject()) throw invalid(where, "atteso un oggetto, trovato " + node.getNodeType());
        return (ObjectNode) node;
    }

    private void fields(ObjectNode node, String where, Set<String> required, Set<String> optional) {
        Iterator<String> names = node.fieldNames();
        while (names.hasNext()) {
            String name = names.next();
            if (!required.contains(name) && !optional.contains(name)) throw invalid(where, "campo sconosciuto " + name);
        }
        for (String name : new java.util.TreeSet<>(required))
            if (!node.has(name) || node.get(name).isNull()) throw invalid(where, "campo " + name + " mancante");
    }

    private Iterable<JsonNode> array(ObjectNode node, String field, String where) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) throw invalid(where, "campo " + field + " mancante");
        if (!value.isArray()) throw invalid(where, field + " deve essere una lista");
        return value;
    }

    private String text(ObjectNode node, String field, String where) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) throw invalid(where, "campo " + field + " mancante");
        if (!value.isTextual() || value.asText().isBlank()) throw invalid(where, field + " deve essere un testo non vuoto");
        return value.asText();
    }

    /** Il testo del campo per le etichette dei messaggi, senza controlli: i controlli arrivano dopo. */
    private static String textOrNull(ObjectNode node, String field) {
        return node.has(field) && node.get(field).isTextual() ? node.get(field).asText() : null;
    }

    private String optional(ObjectNode node, String field, String where) {
        return node.has(field) ? text(node, field, where) : null;
    }

    private int integer(ObjectNode node, String field, String where) {
        if (!node.has(field) || node.get(field).isNull()) throw invalid(where, "campo " + field + " mancante");
        return intValue(node.get(field), where + ": " + field);
    }

    private int intValue(JsonNode value, String where) {
        if (value == null || !value.isIntegralNumber() || !value.canConvertToInt())
            throw new Invalid(at + ": " + where + ": atteso un intero, trovato " + value);
        return value.intValue();
    }

    private boolean bool(ObjectNode node, String field, String where) {
        JsonNode value = node.get(field);
        if (value == null || !value.isBoolean()) throw invalid(where, field + " deve essere true o false");
        return value.asBoolean();
    }

    private Resource resource(String name, String where) {
        try {
            return Resource.valueOf(name);
        } catch (IllegalArgumentException error) {
            throw new Invalid(at + ": " + where + ": risorsa sconosciuta " + name);
        }
    }
}
