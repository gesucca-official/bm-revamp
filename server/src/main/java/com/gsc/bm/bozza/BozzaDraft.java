package com.gsc.bm.bozza;

import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import com.gsc.bm.service.session.MatchVersions;
import com.gsc.bm.sim.DraftSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import static com.gsc.bm.repo.external.MatchEventRepository.sha256;

/**
 * SB-8: the set draft played by the development server. Exists only with the profile {@code bozza}, which requires
 * {@code local} (or {@code test}) and never {@code heroku}. A draft that is not valid stops the start with the loader's message.
 * Properties: {@code app.bozza.sources} (as {@code -Dsim.draft}), {@code app.bozza.pool} (starters for quick and FFA, empty =
 * every deck), {@code app.bozza.com} (the computer's deck, {@code pool} = at random from the pool) and {@code app.bozza.bot}
 * ({@code casuale} = the live ComPlayer, or a heuristic style of SB-4).
 */
@Component
@Profile("bozza")
public class BozzaDraft implements MatchVersions.DraftIdentity {

    public static final String PROFILE = "bozza", FROM_POOL = "pool", RANDOM_BOT = "casuale";

    private static final Map<String, Supplier<BotPolicy>> STYLES = new LinkedHashMap<>();

    static {
        STYLES.put(RANDOM_BOT, null);
        STYLES.put("aggressivo", AggressivePolicy::new);
        STYLES.put("prudente", PrudentPolicy::new);
        STYLES.put("risorse", ResourceAwarePolicy::new);
    }

    private final DraftSource draft;
    private final List<String> pool;
    private final String com, bot;
    private final Map<String, Object> identity;

    public BozzaDraft(Environment env,
                      @Value("${app.bozza.sources}") String sources,
                      @Value("${app.bozza.pool:}") String pool,
                      @Value("${app.bozza.com:" + FROM_POOL + "}") String com,
                      @Value("${app.bozza.bot:risorse}") String bot) throws Exception {
        requireDevelopment(env);
        this.draft = DraftSource.load(sources);
        List<String> chosen = new ArrayList<>();
        for (String deck : pool.split(",")) if (!deck.isBlank()) chosen.add(deck.trim());
        if (chosen.isEmpty()) chosen.addAll(draft.deckIds());
        for (String deck : chosen)
            if (!draft.deckIds().contains(deck))
                throw new IllegalStateException("app.bozza.pool: mazzo assente nella bozza: " + deck + " (mazzi: " + draft.deckIds() + ")");
        this.pool = Collections.unmodifiableList(chosen);
        this.com = com.trim();
        if (!this.com.equals(FROM_POOL) && !draft.deckIds().contains(this.com))
            throw new IllegalStateException("app.bozza.com: «" + FROM_POOL + "» o un mazzo della bozza " + draft.deckIds() + ", non " + this.com);
        this.bot = bot.trim();
        if (!STYLES.containsKey(this.bot))
            throw new IllegalStateException("app.bozza.bot: uno fra " + STYLES.keySet() + ", non " + this.bot);
        List<Map<String, Object>> files = new ArrayList<>();
        for (String source : sources.split(";")) {
            if (source.isBlank()) continue;
            Map<String, Object> file = new LinkedHashMap<>();
            file.put("source", source.trim());
            file.put("sha256", sha256(read(source.trim())));
            files.add(Collections.unmodifiableMap(file));
        }
        Map<String, Object> described = new LinkedHashMap<>();
        described.put("sources", Collections.unmodifiableList(files));
        described.put("sets", draft.sets());
        described.put("pool", this.pool);
        described.put("com", this.com);
        described.put("bot", this.bot);
        this.identity = Collections.unmodifiableMap(described);
    }

    /** The profile is for development only: never alone, never with the deployment profile. */
    static void requireDevelopment(Environment env) {
        boolean development = env.acceptsProfiles(Profiles.of("local")) || env.acceptsProfiles(Profiles.of("test"));
        if (!development || env.acceptsProfiles(Profiles.of("heroku")))
            throw new IllegalStateException("Il profilo bozza richiede il profilo local (o test) e mai heroku: profili attivi "
                    + List.of(env.getActiveProfiles()));
    }

    private static byte[] read(String source) throws Exception {
        if (!source.startsWith("classpath:")) return Files.readAllBytes(Path.of(source));
        try (InputStream input = BozzaDraft.class.getResourceAsStream(source.substring("classpath:".length()))) {
            if (input == null) throw new IllegalStateException(source + ": file assente");
            return input.readAllBytes();
        }
    }

    public DraftSource draft() { return draft; }

    /** The starters dealt in quick and FFA. */
    public List<String> pool() { return pool; }

    /** The computer's deck: a deck id, or {@link #FROM_POOL}. */
    public String com() { return com; }

    /** A new heuristic policy for one computer player, or null for the live random ComPlayer. */
    public BotPolicy newPolicy() {
        Supplier<BotPolicy> style = STYLES.get(bot);
        return style == null ? null : style.get();
    }

    @Override
    public Map<String, Object> describe() { return identity; }
}
