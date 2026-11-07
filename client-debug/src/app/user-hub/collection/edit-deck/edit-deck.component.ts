import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Deck} from '../../../model/deck';
import {SessionService} from '../../../service/session.service';
import {Collection} from '../../../model/user-account-data';
import {Card} from '../../../model/card';
import {Character} from '../../../model/character';

export const DeckRules = {REGULAR_CARDS: 20, MAX_COPIES: 2, BOUND_CARDS: 2};

@Component({
  selector: 'app-edit-deck',
  templateUrl: './edit-deck.component.html',
  styleUrls: ['./edit-deck.component.css']
})
export class EditDeckComponent implements OnInit {

  collection: Collection = this.sessionService.userAccountData.collection;

  showDeckToggle = false;
  collectionSearchTerm = '';
  collectionCardsShown: Card[];

  @Input() deck: Deck;
  @Input() existing = false;
  @Output() saveDeck: EventEmitter<Deck> = new EventEmitter<Deck>();
  @Output() exit: EventEmitter<void> = new EventEmitter<void>();

  constructor(public sessionService: SessionService) {
  }

  // Regulation 1.12 R02: the character's own basic, two different own bound cards, a generic or own last resort.
  private owner(): string | null {
    return this.deck && this.deck.character ? this.deck.character.bindingName : null;
  }

  filterBasicActionCards(): Card[] {
    return this.collection.cards.filter(c => c.basicAction && !!this.owner() && c.exclusiveToCharacter === this.owner());
  }

  filterLastResortCards(): Card[] {
    return this.collection.cards.filter(c => c.lastResort && (!c.exclusiveToCharacter || c.exclusiveToCharacter === this.owner()));
  }

  filterCharacterBoundCards(): Card[] {
    return this.collection.cards.filter(c => c.characterBound && !!this.owner() && c.boundToCharacter === this.owner());
  }

  /** Choosing the character sets its fixed basic and drops bound cards or a last resort of another character. */
  selectCharacter(character: Character): void {
    this.deck.character = character;
    const basics = this.filterBasicActionCards();
    this.deck.basicActionCard = basics.length === 1 ? basics[0] : null;
    this.deck.characterBoundCards = this.deck.characterBoundCards.filter(c => c.boundToCharacter === character.bindingName);
    const last = this.deck.lastResortCard;
    if (last && last.exclusiveToCharacter && last.exclusiveToCharacter !== character.bindingName) { this.deck.lastResortCard = null; }
  }

  searchCollectionCards(): void {
    this.collectionCardsShown = [];
    (this.showDeckToggle ? this.deck.regularCards : this.collection.cards).forEach(c => {
      if (!c.characterBound && !c.lastResort && !c.basicAction &&
          JSON.stringify(c).toUpperCase().includes(this.collectionSearchTerm.toUpperCase())) {
        this.collectionCardsShown.push(c);
      }
    });
  }

  changeCardShownByToggle(): void {
    this.collectionCardsShown = [];
    if (this.showDeckToggle) {
      this.collectionCardsShown = this.deck.regularCards;
    } else {
      this.collection.cards.forEach(c => {
        if (!c.characterBound && !c.lastResort && !c.basicAction) {
          this.collectionCardsShown.push(c);
        }
      });
    }
  }

  ngOnInit(): void {
    this.changeCardShownByToggle();
  }

  addOrRemoveFromDeck(card: Card): void {
    if (this.showDeckToggle) {
      // delete one from deck
      const index = this.deck.regularCards.findIndex(obj => obj.name === card.name);
      if (index > -1) {
        this.deck.regularCards.splice(index, 1);
      }
    } else if (this.deck.regularCards.length < DeckRules.REGULAR_CARDS
      && this.deck.regularCards.filter(c => c.name === card.name).length < DeckRules.MAX_COPIES) {
      this.deck.regularCards.push(card);
    }
  }

  saveDeckAction(): void {
    if (this.isDeckValid()) { this.saveDeck.emit(this.deck); }
  }

  exitAction(): void {
    this.exit.emit();
  }

  /** Every broken rule of R02 1.12 (also for a deck saved under older rules); empty means the deck can be saved. */
  deckProblems(): string[] {
    const d = this.deck, out: string[] = [];
    if (!d.deckId || d.deckId.trim().length === 0) { out.push('Name required'); }
    if (!d.character) { out.push('Character required'); }
    const owner = this.owner();
    if (!d.basicActionCard) { out.push('Basic required'); }
    else if (owner && d.basicActionCard.exclusiveToCharacter !== owner) { out.push('Basic of another character: ' + d.basicActionCard.name); }
    if (!d.lastResortCard) { out.push('Last resort required'); }
    else if (d.lastResortCard.exclusiveToCharacter && d.lastResortCard.exclusiveToCharacter !== owner) {
      out.push('Last resort reserved to another character: ' + d.lastResortCard.name);
    }
    const bound = d.characterBoundCards || [];
    bound.forEach((c, i) => {
      if (owner && c.boundToCharacter !== owner) { out.push('Bound card of another character: ' + c.name); }
      if (bound.findIndex(x => x.name === c.name) !== i) { out.push('Bound cards must be different: ' + c.name); }
    });
    if (bound.length !== DeckRules.BOUND_CARDS) { out.push('Two different bound cards required, found ' + bound.length); }
    const regular = d.regularCards || [];
    if (regular.length !== DeckRules.REGULAR_CARDS) { out.push('Exactly 20 regular cards required, found ' + regular.length); }
    const counts = new Map<string, number>();
    regular.forEach(c => counts.set(c.name, (counts.get(c.name) || 0) + 1));
    counts.forEach((n, name) => { if (n > DeckRules.MAX_COPIES) { out.push('At most 2 copies per card: ' + name + ' has ' + n); } });
    return out;
  }

  isDeckValid(): boolean {
    return this.deckProblems().length === 0;
  }

  /** A bound is taken or left with a click; never a repeat, never more than two. */
  addCharacterBoundCard(card: Card): void {
    const i = this.deck.characterBoundCards.findIndex(c => c.name === card.name);
    if (i > -1) { this.deck.characterBoundCards.splice(i, 1); }
    else if (this.deck.characterBoundCards.length < DeckRules.BOUND_CARDS) { this.deck.characterBoundCards.push(card); }
  }

  getCharBoundCardsNames(): string {
    if (this.deck.characterBoundCards.length === 0) {
      return 'Not Chosen';
    } else {
      return this.deck.characterBoundCards.map(c => c.name).join(', ');
    }
  }
}
