package com.gsc.bm.service.factories;

import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.repo.internal.CardKeywordsRepository;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.sim.DraftSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * The cards of the live game. SB-28: every card comes from the live set file ({@link LiveSet}), with the numbers, the logic and
 * the texts of the Set Base 1.0, as the profile bozza already did with the draft (SB-8): the text gets the keyword paragraphs of
 * {@code CRD002_KEYWORDS}, a missing image becomes the catalog's {@code no-img.png}, and a basic is reserved to the character
 * whose fixed basic it is (R02).
 */
@Service
public class CardFactoryServiceImpl implements CardFactoryService {

    static final String NO_IMAGE = "no-img.png";

    private final DraftSource set;
    private final CardKeywordsRepository keywordsRepo;
    private final Map<String, String> basicOwner = new HashMap<>();

    @Autowired
    public CardFactoryServiceImpl(LiveSet live, CardKeywordsRepository keywordsRepo) {
        this(live.set(), keywordsRepo);
    }

    /** The cards of another set source: the profile bozza builds its factory on the draft. */
    protected CardFactoryServiceImpl(DraftSource set, CardKeywordsRepository keywordsRepo) {
        this.set = set;
        this.keywordsRepo = keywordsRepo;
        for (String character : set.characterIds()) {
            String basic = set.characterBasic(character);
            if (basic != null) basicOwner.putIfAbsent(basic, character);
        }
    }

    @Override
    public Card craftCard(String binding) {
        if (binding == null || !set.cardBindings().contains(binding))
            throw new IllegalArgumentException("Cannot load card binding: " + binding);
        LoadableCard card = set.card(binding);
        String text = card.getEffect();
        card.setGuiEffectDescription(buildHtml(card, text == null ? "" : text));
        if (card instanceof AbstractCard && ((AbstractCard) card).getImage() == null) card.setGuiImage(NO_IMAGE);
        String exclusive = set.exclusiveTo(binding);
        card.setGuiExclusiveTo(exclusive != null ? exclusive : card.isBasicAction() ? basicOwner.get(binding) : null);
        return card;
    }

    private String buildHtml(Card c, String d) {
        StringBuilder description = new StringBuilder();
        if (c.isBasicAction())
            appendHtml(description, "basicAction");
        if (c.isCharacterBound())
            appendHtml(description, "fallbackMove");
        if (c.getPriority() > 1)
            appendHtml(description, "firstStrike");
        if (c.getPriority() < 1)
            appendHtml(description, "lastStrike");
        return description.append("<p>").append(HtmlUtils.htmlEscape(d, "UTF-8")).append("</p>").toString();
    }

    private void appendHtml(StringBuilder description, String keyword) {
        description
                .append("<p>")
                .append(keywordsRepo.findById(keyword)
                        .orElseThrow(() -> new IllegalArgumentException("No such Keyword in DB: " + keyword))
                        .getHtml())
                .append("</p>");
    }
}
