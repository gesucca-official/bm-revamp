import {strict as assert} from 'assert';
import {EditDeckComponent} from '../src/app/user-hub/collection/edit-deck/edit-deck.component';
import {CollectionComponent} from '../src/app/user-hub/collection/collection.component';
export const tests = [{name:'I15 editing cancellation preserves saved data; variable sizes and initial count', run:() => {
  const session:any = {userAccountData:{collection:{cards:[],characters:[]}}};
  const original:any = {deckId:'fixture',character:{},basicActionCard:{},lastResortCard:{},regularCards:[{}],characterBoundCards:[]};
  const collection = new CollectionComponent(session, {} as any);
  collection.editDeck(original); collection.targetDeck.regularCards.push({} as any);
  assert.equal(original.regularCards.length,1);
  const editor = new EditDeckComponent(session); editor.deck = original;
  assert(editor.isDeckValid());
  editor.deck.characterBoundCards = Array(5).fill({} as any); assert(editor.isDeckValid());
  editor.deck.characterBoundCards.push({} as any); assert(!editor.isDeckValid());
  editor.deck.characterBoundCards=[]; editor.deck.regularCards=[]; assert(!editor.isDeckValid());
  editor.deck.regularCards=Array(21).fill({} as any); assert(editor.isDeckValid());
  editor.deck.deckId=' '; assert(!editor.isDeckValid());
}}];
