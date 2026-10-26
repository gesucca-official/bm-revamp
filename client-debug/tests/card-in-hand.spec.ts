import {deepStrictEqual, strictEqual} from 'assert';
import {CardInHandComponent} from '../src/app/client-debug/card-in-hand/card-in-hand.component';
import {GameService} from '../src/app/service/game.service';
import {Card} from '../src/app/model/card';
import {Move} from '../src/app/model/move';
import {TestCase} from './test-case';

function fixture(targets: string[], bound = false): CardInHandComponent {
  const game = new GameService(); // component only reads identity; no connection
  game.playerId = 'alice';
  game.gameId = 'synthetic-game';
  const component = new CardInHandComponent(game);
  component.cardData = {
    name: 'synthetic-action', cost: {}, effect: '', priority: 1,
    canTarget: targets, basicAction: false, characterBound: bound,
    boundToCharacter: bound ? 'synthetic-character' : null,
    lastResort: false, image: null, sprite: null
  } as Card;
  return component;
}

function emittedMove(component: CardInHandComponent): Move {
  const events: Move[] = [];
  const subscription = component.cardPlayedEvent.subscribe(move => events.push(move));
  try {
    component.playThis();
    strictEqual(events.length, 1, 'one action must emit exactly one command');
    return events[0];
  } finally { subscription.unsubscribe(); }
}

export const tests: TestCase[] = [
  {
    name: 'ordinary action emits identity, opponent and no additional choice',
    run: () => {
      const component = fixture(['OPPONENT']);
      component.chosenTarget = 'bob';
      deepStrictEqual(emittedMove(component), {
        playedCardName: 'synthetic-action', playerId: 'alice',
        targetId: 'bob', gameId: 'synthetic-game', choices: null
      });
    }
  },
  {
    name: 'character-bound action sends the selected discard',
    run: () => {
      const component = fixture(['SELF'], true);
      component.chosenTarget = 'SELF';
      component.cardToDiscard = 'spare-action';
      const move = emittedMove(component);
      strictEqual(move.targetId, 'SELF');
      deepStrictEqual(move.choices, {DISCARD_ONE: 'spare-action'});
    }
  },
  {
    name: 'near item sends SELF owner separately from item choice',
    run: () => {
      const component = fixture(['NEAR_ITEM']);
      component.chosenTarget = 'SELF.synthetic-item';
      const move = emittedMove(component);
      strictEqual(move.targetId, 'SELF');
      deepStrictEqual(move.choices, {TARGET_ITEM: 'synthetic-item'});
    }
  },
  {
    name: 'far item sends opponent owner separately from item choice',
    run: () => {
      const component = fixture(['FAR_ITEM']);
      component.chosenTarget = 'bob.synthetic-item';
      const move = emittedMove(component);
      strictEqual(move.targetId, 'bob');
      deepStrictEqual(move.choices, {TARGET_ITEM: 'synthetic-item'});
    }
  }
];

for (const scenario of ['no target', 'no discard', 'no item']) {
  tests.push({name: 'incomplete card choice emits no command: ' + scenario, run: () => {
    const c = fixture(scenario === 'no item' ? ['NEAR_ITEM'] : ['SELF'], scenario === 'no discard');
    if (scenario !== 'no target') { c.chosenTarget = 'SELF'; }
    let emitted = 0;
    c.cardPlayedEvent.subscribe(() => emitted++);
    c.playThis(); strictEqual(emitted, 0);
  }});
}
