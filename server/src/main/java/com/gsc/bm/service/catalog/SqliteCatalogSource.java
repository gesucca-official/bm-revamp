package com.gsc.bm.service.catalog;

import com.gsc.bm.repo.internal.CardsGuiRecord;
import com.gsc.bm.repo.internal.CharactersGuiRecord;
import com.gsc.bm.repo.internal.CardsGuiRepository;
import com.gsc.bm.repo.internal.CharactersGuiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/** The live catalog: the packaged SQLite, with the same queries the services ran before SB-8. */
@Service
public class SqliteCatalogSource implements CatalogSource {

    private final CardsGuiRepository cards;
    private final CharactersGuiRepository characters;

    @Autowired
    public SqliteCatalogSource(CardsGuiRepository cards, CharactersGuiRepository characters) {
        this.cards = cards;
        this.characters = characters;
    }

    @Override
    public List<String> cardBindings() {
        return cards.findAll().stream().map(CardsGuiRecord::getClazz).collect(Collectors.toList());
    }

    @Override
    public List<String> characterBindings() {
        return characters.findAll().stream().map(CharactersGuiRecord::getClazz).collect(Collectors.toList());
    }

    @Override
    public boolean hasCard(String binding) { return cards.existsById(binding); }

    @Override
    public boolean hasCharacter(String binding) { return characters.existsById(binding); }

    @Override
    public Optional<CharacterGui> characterGui(String binding) {
        return characters.findById(binding).map(record -> new CharacterGui(record.getGuiName(), record.getGuiImage()));
    }
}
