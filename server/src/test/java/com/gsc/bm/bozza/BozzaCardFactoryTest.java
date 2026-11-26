package com.gsc.bm.bozza;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Damage.DamageType;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.base.sergio.Countermove;
import com.gsc.bm.model.cards.base.sergio.GoodOldBlackmail;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.repo.internal.CardKeywordsRecord;
import com.gsc.bm.repo.internal.CardKeywordsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class BozzaCardFactoryTest {
    private static final String DATA = "bruiser.SuperImpact";
    private static final String JAVA = "base.cesira.Ricatto";
    private static final String ROC_AR5 = "base.rocco.TeLoSpiegoIo";
    private static final long SEED = 7_000_000L;

    @Test
    void escapesOnlyTheDescriptionOfBothCardFamilies(@TempDir Path temp) throws Exception {
        var mapper = new ObjectMapper();
        var json = mapper.readTree(Path.of(BozzaDraftTest.DRAFT).toFile());
        String description = "Costo < 30 & > 0: [[V]] [[A]] [[X]]";
        for (var node : json.path("cards"))
            if (List.of(DATA, JAVA).contains(node.path("binding").asText()))
                ((ObjectNode) node.path("gui")).put("description", description);
        Path source = temp.resolve("bozza.json");
        mapper.writeValue(source.toFile(), json);
        var draft = bozza(source.toString());
        var factory = new BozzaCardFactory(draft, keywords());
        String escaped = "<p>Costo &lt; 30 &amp; &gt; 0: [[V]] [[A]] [[X]]</p>";

        assertEquals(description, draft.draft().card(DATA).getEffect());
        assertEquals(description, draft.draft().card(JAVA).getEffect());
        assertFalse(factory.craftCard(DATA) instanceof GoodOldBlackmail);
        assertTrue(factory.craftCard(JAVA) instanceof GoodOldBlackmail);
        assertEquals("<p><b>lastStrike</b></p>" + escaped, factory.craftCard(DATA).getEffect());
        assertEquals("<p><b>firstStrike</b></p>" + escaped, factory.craftCard(JAVA).getEffect());
    }

    @Test
    void summariesAndTheirReadersAgreeBeforeAndAfterFormatting() throws Exception {
        var draft = bozza(BozzaDraftTest.DRAFT);
        var factory = new BozzaCardFactory(draft, keywords());
        for (String binding : draft.draft().cardBindings()) {
            var raw = (AbstractCard) draft.draft().card(binding);
            var formatted = (AbstractCard) factory.craftCard(binding);
            assertEquals(raw.getGains(), formatted.getGains(), binding);
            assertEquals(raw.getDamage(), formatted.getDamage(), binding);
            assertEquals(raw.getDamageAmount(), formatted.getDamageAmount(), binding);
            assertEquals(raw.getInPlay(), formatted.getInPlay(), binding);
            assertEquals(BotView.publicText(raw).nominalDamage(), BotView.publicText(formatted).nominalDamage(), binding);
        }

        Class<?> gainsReader = Class.forName("com.gsc.bm.model.game.bot.StyleSupport");
        var roc = (AbstractCard) factory.craftCard(ROC_AR5);
        Map<Resource, Double> health = Map.of(Resource.HEALTH, 6.0);
        assertEquals(health, ReflectionTestUtils.invokeMethod(gainsReader, "parseGains", "+6 HEALTH"));
        assertEquals(health, ReflectionTestUtils.invokeMethod(gainsReader, "parseGains", roc.getGains()));
        String fallback = "bruiser.BadEducation";
        assertEquals(8, BotView.publicText(factory.craftCard(fallback)).nominalDamage());
        Map<DamageType, Integer> hit = Map.of(DamageType.HIT, 8);
        assertEquals(hit, ReflectionTestUtils.invokeMethod(Countermove.class, "baseDamage", draft.draft().card(fallback)));
        assertEquals(hit, ReflectionTestUtils.invokeMethod(Countermove.class, "baseDamage", factory.craftCard(fallback)));
    }

    @Test
    void formattingDoesNotChangeTheFixedSeedDraftMatch() throws Exception {
        var draft = bozza(BozzaDraftTest.DRAFT);
        var factory = new BozzaCardFactory(draft, keywords());
        assertEquals(play(draft, draft.draft()::card), play(draft, factory::craftCard));
    }

    private static List<Object> play(BozzaDraft draft, Function<String, Card> card) {
        Random random = new Random(SEED);
        var game = new Game(List.of(player(draft, card, "prova-duccio", new Random(random.nextLong())),
                player(draft, card, "prova-sergio", new Random(random.nextLong()))), "bozza-test", false);
        game.useRuleset(draft.ruleset());
        List<Object> trace = new ArrayList<>();
        game.resolveMoves(g -> {}, (turn, events) -> events.clear(), (stage, g) -> {
            if (!stage.equals("ROUND_COMMITTED")) return;
            assertTrue(g.getTurn() <= 200, "The fixed-seed match must finish in 200 turns");
            trace.add(g.getResolvedMoves().stream()
                    .map(m -> Arrays.asList(m.getPlayerId(), m.getPlayedCardName(), m.getTargetId(), m.isVoid()))
                    .collect(Collectors.toList()));
            g.getPlayers().values().forEach(p -> trace.add(Map.copyOf(p.getCharacter().getResources())));
        });
        assertTrue(game.isOver());
        trace.add(game.getWinner());
        return trace;
    }

    private static BotPlayer player(BozzaDraft bozza, Function<String, Card> card, String deck, Random random) {
        var draft = bozza.draft();
        return new BotPlayer(deck, draft.character(draft.characterOf(deck)), card.apply(draft.basicOf(deck)),
                draft.boundOf(deck).stream().map(card).collect(Collectors.toList()), card.apply(draft.lastResortOf(deck)),
                draft.regularOf(deck).stream().map(card).collect(Collectors.toList()), random, bozza.newPolicy());
    }

    private static BozzaDraft bozza(String source) throws Exception {
        return new BozzaDraft(new MockEnvironment().withProperty("spring.profiles.active", "test,bozza"),
                source, "", "pool", "risorse");
    }

    private static CardKeywordsRepository keywords() {
        var repository = mock(CardKeywordsRepository.class);
        when(repository.findById(anyString())).thenAnswer(call -> {
            var keyword = mock(CardKeywordsRecord.class);
            when(keyword.getHtml()).thenReturn("<b>" + call.getArgument(0) + "</b>");
            return Optional.of(keyword);
        });
        return repository;
    }
}
