package com.gsc.bm.repo.external;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserDecksRecord {

    private String username;

    private String deckId;

    private UserStoredDeck deck;

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @ToString
    @EqualsAndHashCode
    public static class UserStoredDeck {
        String characterClazz;
        String basicActionCardClazz;
        String lastResortCardClazz;
        List<String> characterBoundCardsClazz;
        List<String> regularCardsClazz;
    }
}
