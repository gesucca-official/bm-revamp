package com.gsc.bm.service.catalog;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.sim.DraftSource;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * SB-28: the set of the live game, read from the set file packaged with the server ({@value #RESOURCE}, docs/formato-file-set.md):
 * cards, characters and starters of the Set Base 1.0, with the numbers and texts of the file (regulation 2.0, R07). The file is
 * written by {@code tools/set-catalog/set_catalog.py --vivo} from the set draft, together with the SQLite catalog that the
 * collection reads; {@code scripts/check-rules.py} checks that they agree.
 * <p>
 * «Ultimo colpo» is not in regulation 2.0 (D183 (3)): the engine keeps it for the historical drafts, and the live set is refused
 * if one of its cards has it, so no live card can reach it.
 */
@Component
public class LiveSet {

    /** The live set file, on the classpath. */
    public static final String RESOURCE = "classpath:/sets/base.json";

    private final DraftSource set;

    public LiveSet() throws Exception {
        this(RESOURCE);
    }

    /** The live set from other sources (the same syntax as the profile bozza): for the tests. */
    public LiveSet(String sources) throws Exception {
        this.set = DraftSource.load(sources);
        for (String binding : set.cardBindings()) {
            Card card = set.card(binding);
            if (card.isLastBlow())
                throw new IllegalStateException("Il set vivo non ammette «Ultimo colpo» (regolamento 2.0, D183 (3)): " + binding);
        }
        if (set.starters().isEmpty()) throw new IllegalStateException("Il set vivo non ha starter (D182)");
    }

    public DraftSource set() { return set; }

    /** The starters dealt by quick and to the computer, base and advanced (D182 (1)), in the file's order. */
    public List<String> starters() { return set.starters(); }
}
