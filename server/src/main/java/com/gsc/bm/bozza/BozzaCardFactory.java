package com.gsc.bm.bozza;

import com.gsc.bm.repo.internal.CardKeywordsRepository;
import com.gsc.bm.service.factories.CardFactoryServiceImpl;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * SB-8: cards of the set draft, with the draft's numbers and texts. SB-28: shaped exactly like the live ones, which come from the
 * live set file in the same way ({@link CardFactoryServiceImpl}); only the source differs.
 */
@Service
@Primary
@Profile("bozza")
public class BozzaCardFactory extends CardFactoryServiceImpl {

    public BozzaCardFactory(BozzaDraft bozza, CardKeywordsRepository keywords) {
        super(bozza.draft(), keywords);
    }
}
