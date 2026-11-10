package com.gsc.bm.bozza;

import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.repo.internal.CardKeywordsRepository;
import com.gsc.bm.service.factories.CardFactoryService;
import com.gsc.bm.sim.DraftSource;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * SB-8: cards of the set draft, with the draft's numbers and texts, shaped like the live ones so that the clients need no
 * change: the text gets the same keyword paragraphs as {@code CardFactoryServiceImpl}, a missing image becomes the catalog's
 * {@code no-img.png}, and a basic is reserved to the character whose fixed basic it is (R02).
 */
@Service
@Primary
@Profile("bozza")
public class BozzaCardFactory implements CardFactoryService {

    static final String NO_IMAGE = "no-img.png";

    private final DraftSource draft;
    private final CardKeywordsRepository keywords;
    private final Map<String, String> basicOwner = new HashMap<>();

    public BozzaCardFactory(BozzaDraft bozza, CardKeywordsRepository keywords) {
        this.draft = bozza.draft();
        this.keywords = keywords;
        for (String character : draft.characterIds()) {
            String basic = draft.characterBasic(character);
            if (basic != null) basicOwner.putIfAbsent(basic, character);
        }
    }

    @Override
    public Card craftCard(String binding) {
        if (binding == null || !draft.cardBindings().contains(binding))
            throw new IllegalArgumentException("Cannot load card binding: " + binding);
        LoadableCard card = draft.card(binding);
        String text = card.getEffect();
        card.setGuiEffectDescription(html(card, text == null ? "" : text));
        if (card instanceof AbstractCard && ((AbstractCard) card).getImage() == null) card.setGuiImage(NO_IMAGE);
        String exclusive = draft.exclusiveTo(binding);
        card.setGuiExclusiveTo(exclusive != null ? exclusive : card.isBasicAction() ? basicOwner.get(binding) : null);
        return card;
    }

    /** As CardFactoryServiceImpl.buildHtml, which stays private to the live factory. */
    private String html(Card card, String description) {
        StringBuilder out = new StringBuilder();
        if (card.isBasicAction()) keyword(out, "basicAction");
        if (card.isCharacterBound()) keyword(out, "fallbackMove");
        if (card.getPriority() > 1) keyword(out, "firstStrike");
        if (card.getPriority() < 1) keyword(out, "lastStrike");
        return out.append("<p>").append(description).append("</p>").toString();
    }

    private void keyword(StringBuilder out, String keyword) {
        out.append("<p>")
                .append(keywords.findById(keyword)
                        .orElseThrow(() -> new IllegalArgumentException("No such Keyword in DB: " + keyword))
                        .getHtml())
                .append("</p>");
    }
}
