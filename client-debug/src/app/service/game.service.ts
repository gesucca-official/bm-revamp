import {Injectable} from '@angular/core';
import {GameState} from '../model/game-state';
import {Opponent, Player} from '../model/player';
import {Card} from '../model/card';
import {Character} from '../model/character';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // tslint:disable:variable-name
  private _gameId: string;
  private _playerId: string;
  private _gameState: GameState;

  clearGame(): void {
    this._gameId = null;
    this._gameState = null;
  }

  get playerState(): Player {
    return this.gameState.players[this.playerId];
  }

  get opponents(): Opponent[] {
    const players = JSON.parse(JSON.stringify(this.gameState.players));
    const opp = [];
    Object.keys(players).forEach(k => {
      if (k !== this.playerId) {
        opp.push(players[k]);
      }
    });
    return opp.filter(o => !o.character.dead && !(this.gameState.forfeits || {})[o.playerId]);
  }

  get cardsInHand(): Card[] {
    if (this.gameState) {
      return this.gameState.players[this.playerId].cardsInHand;
    }
  }

  get playerId(): string {
    return this._playerId;
  }

  set playerId(value: string) {
    this._playerId = value;
  }

  get gameState(): GameState {
    return this._gameState;
  }

  set gameState(value: GameState) {
    this._gameState = value;
  }

  get gameId(): string {
    return this._gameId;
  }

  set gameId(value: string) {
    this._gameId = value;
  }

  isPlayable(card: Card, character: Character): boolean {
    if (this.gameState && (this.gameState.over || this.gameState.pendingMove ||
        (this.gameState.forfeits || {})[this.playerId])) { return false; }
    if (this.getTargets(card).length <= 0) {
      return false;
    }
    for (const key in card.cost) {
      if (!character.resources[key] || character.resources[key] < card.cost[key]) {
        return false;
      }
    }
    return true;
  }

  getTargets(card: Card): string[] {
    const targets = [];
    if (card.canTarget.includes('SELF')) {
      targets.push('SELF');
    }
    if (card.canTarget.includes('OPPONENT')) {
      this.opponents.map(o => o.playerId)
        .forEach(o => targets.push(o));
    }
    if (JSON.stringify(card.canTarget).includes('NEAR_ITEM')) {
      this.playerState.character.items.map(i => 'SELF.' + i.name)
        .forEach(o => targets.push(o));
    }
    if (JSON.stringify(card.canTarget).includes('FAR_ITEM')) {
      this.opponents.forEach(
        o => o.character.items.map(i => o.playerId + '.' + i.name)
          .forEach(oppItems => targets.push(oppItems))
      );
    }
    return targets;
  }

}
