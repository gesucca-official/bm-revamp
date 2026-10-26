import {Component} from '@angular/core';
import {WebsocketService} from '../service/websocket.service';
import {MatDialog} from '@angular/material/dialog';
import {CodeDialogComponent} from './code-dialog/code-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GameService} from '../service/game.service';
import {Move} from '../model/move';
import {Deck} from '../model/deck';
import {SessionService} from '../service/session.service';

@Component({
  selector: 'app-debug-client',
  templateUrl: './debug-client.component.html',
  styleUrls: ['./debug-client.component.css']
})
export class DebugClientComponent {

  constructor(protected websocketService: WebsocketService,
              public gameService: GameService,
              public sessionService: SessionService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
  }

  private resumeSubscription: any;
  private shownOutcome: string;
  private attachedGame: string;
  private alive = true;

  ngOnInit(): void {
    const resume = state => {
      if (!state || state.status === 'none') { this.gameService.clearGame(); return; }
      if (state.archived && state.outcome) {
        if (this.attachedGame && this.attachedGame !== state.gameId) { return; }
        this.gameService.clearGame();
        if (this.shownOutcome === state.gameId) { return; }
        this.shownOutcome = state.gameId;
        this.dialog.closeAll();
        this.dialog.open(CodeDialogComponent, {
          width: 'fit-content',
          data: {title: 'Pareggio — ' + state.outcome.reason,
            html: '<p>La partita è terminata in draw per riavvio server.</p><p>Puoi iniziare una nuova partita.</p>',
            jsonTextData: {gameId: state.gameId, outcome: state.outcome}}
        }).afterClosed().subscribe(() => { if (this.alive) { this.sessionService.resumeState = null; } });
        return;
      }
      this.snackBar.open(state.status === 'resumed' ? 'Rientro nella stessa partita. ' +
        (state.view.pendingMove ? 'La mossa già inviata resta in attesa.' : 'Puoi scegliere la mossa del turno corrente.') :
        'Rientro tardivo o partita conclusa: esito disponibile.', 'ok', {duration: 6000});
      if (state.status === 'resumed') { this.attachGame(state.gameId); }
      else { this.gameService.gameId = state.gameId; }
      this.onGameUpdate(JSON.stringify(state.view));
    };
    this.resumeSubscription = this.sessionService.resumeEvents.subscribe(resume);
    if (this.sessionService.resumeState) { resume(this.sessionService.resumeState); }
  }

  ngOnDestroy(): void {
    this.alive = false;
    if (this.resumeSubscription) { this.resumeSubscription.unsubscribe(); }
    this.dialog.closeAll();
  }

  dropConnection(): void { this.websocketService.dropConnection(); }

  private attachGame(gameId: string): void {
    this.attachedGame = gameId;
    this.gameService.gameId = gameId;
    this.websocketService.subToGame(gameId, this.gameService.playerId,
      event => this.snackBar.open(event.body, 'ok', {duration: 3000}),
      event => this.snackBar.open(event.body, 'ok', {duration: 3000}),
      event => { this.sessionService.isLoadingGame = false; this.onGameUpdate(event.body); });
  }

  leaveGame(): void {
    this.websocketService.unsubToGame(this.gameService.gameId, this.gameService.playerId, () => {
      this.gameService.clearGame();
      this.sessionService.resumeState = null;
      this.snackBar.open('Partita abbandonata: forfait. Sei tornato all’hub.', 'ok', {duration: 5000});
    });
  }

  get clockMessage(): string {
    const state = this.gameService.gameState;
    if (!state) { return ''; }
    if (state.over) { return 'Partita conclusa: ' + state.winner + ' (' + state.outcomeReason + ').'; }
    if (state.pendingMove) { return 'Mossa ricevuta: in attesa degli altri giocatori.'; }
    const deadline = (state.moveDeadlines || {})[this.gameService.playerId];
    return deadline ? 'Invia la mossa entro ' + new Date(deadline).toLocaleTimeString() +
      '. Il clock continua anche se perdi la connessione; alla scadenza forfait.' : 'Nessun timeout mossa contro computer.';
  }

  joinGame(whichGame: { game: string, deck?: Deck }): void {
    this.websocketService.joinGame(this.gameService.playerId, whichGame.game, (sdkEvent => {
      this.attachGame(sdkEvent.body);
      this.websocketService.requestGameView(this.gameService.gameId, this.gameService.playerId);
    }), whichGame.deck);
  }

  playCard(event: Move): void {
    if (!this.gameService.gameState.pendingMove) { this.websocketService.submitMove(event); }
  }

  onGameUpdate(gameStateRaw: any): void {
    const previous = this.gameService.gameState;
    this.gameService.gameState = JSON.parse(gameStateRaw);

    const forfeited = (this.gameService.gameState.forfeits || {})[this.gameService.playerId];
    if (forfeited && !this.gameService.gameState.over) {
      this.snackBar.open('Forfait: ' + forfeited + '. Gli altri continuano. Ritorno all’hub.', 'ok', {duration: 6000});
      this.websocketService.unsubToGame(this.gameService.gameId, this.gameService.playerId);
      this.gameService.clearGame(); this.sessionService.resumeState = null; return;
    }
    if (!this.gameService.gameState.over && previous && previous.gameId === this.gameService.gameState.gameId &&
        previous.turn === this.gameService.gameState.turn) { return; }
    if (!this.gameService.gameState.over) {
      this.dialog.open(CodeDialogComponent, {
        width: 'fit-content',
        data: {
          title: this.getDialogTitle(),
          html: this.getDialogHtml(),
          jsonTextData: this.getDialogRawJsonTest()
        }
      }).afterClosed().subscribe(
        () => {
          if (!this.alive || !this.gameService.gameState || this.gameService.gameState.over) { return; }
          if (this.getDialogTitle() !== 'Begin') {
            this.showEotEffects();
          }
        }
      );
    }

    if (this.gameService.gameState.over) {
      if (this.shownOutcome === this.gameService.gameId) { return; }
      this.shownOutcome = this.gameService.gameId;
      this.dialog.closeAll();
      this.dialog.open(CodeDialogComponent, {
        width: 'fit-content',
        data: {
          title: 'WINNER: ' + this.gameService.gameState.winner + ' — ' + (this.gameService.gameState.outcomeReason || 'combat'),
          html: this.getDialogHtml(),
          jsonTextData: this.gameService.gameState.resolvedMoves
        }
      }).afterClosed().subscribe(
        () => {
          if (!this.alive || !this.gameService.gameState) { return; }
          const effects = this.gameService.gameState.timeBasedEffects || {};
          if (Object.keys(effects).some(player => effects[player] && effects[player].length)) { this.showEotEffects(); }
          this.gameService.clearGame();
          this.sessionService.resumeState = null;
        }
      );
      this.websocketService.unsubToGame(this.gameService.gameId, this.gameService.playerId);
    }
  }

  getDiscardableCards(): string[] {
    return this.gameService.cardsInHand
      .filter(card =>
        !card.characterBound && !card.basicAction && !card.lastResort)
      .map(card => card.name);
  }

  private getDialogTitle(): string {
    // if there are no last resolved moves, game is just begun
    return this.gameService.gameState.resolvedMoves.length === 0 ? 'Begin' : 'Turn Resolution';
  }

  private getDialogRawJsonTest(): any {
    return this.gameService.gameState.resolvedMoves.length === 0 ?
      this.getPlayersRawJsonText() : this.gameService.gameState.resolvedMoves;
  }

  private getPlayersRawJsonText(): any {
    return {
      you: this.gameService.playerId,
      opponents: this.gameService.opponents.map(o => o.playerId)
    };
  }

  private getDialogHtml(): string {
    return this.gameService.gameState.resolvedMoves.length === 0 ?
      this.getBeginGameHtml()
      : this.getMovesHtml();
  }

  private getBeginGameHtml(): string {
    return '<p><b>Player</b>: ' + this.gameService.playerId + '</p><p><b>Opponent</b>(s): <ul><li>'
      + this.gameService.opponents.map(o => o.playerId).join('</li><li>') + '</li></ul></p>';
  }

  private getMovesHtml(): string {
    return this.gameService.gameState.resolvedMoves.map(m => {
      return '<p><b>' + m.playerId + '</b> ---> <b>' + m.targetId + '</b></p>'
        + '<p><b>' + m.playedCardName + '</b></p>'
        + ((!m.moveReport.SELF || m.moveReport.SELF.length === 0) ? ''
          : '<p>SELF: <ul><li>' + m.moveReport.SELF.join('</li><li>') + '</li></ul>')
        + '</p>'
        + ((!m.moveReport.OPPONENT || m.moveReport.OPPONENT.length === 0) ? ''
          : '<p>TARGET: <ul><li>' + m.moveReport.OPPONENT.join('</li><li>') + '</li></ul>')
        + '</p>';
    }).join('<br>');
  }

  private getEotHtml(): string {
    const eot = this.gameService.gameState.timeBasedEffects; // shorten this name
    let html = '';
    Object.keys(eot).forEach(
      k => {
        if ((!eot[k] || eot[k].length === 0)) {
          return;
        } // no eot fx for that player
        html += '<p>';
        html += '<b>' + k + '</b>';
        html += '<ul><li>' + eot[k].join('</li><li>') + '</li></ul>';
        html += '</p>';
      }
    );
    return html;
  }

  private showEotEffects(): void {
    this.dialog.open(CodeDialogComponent, {
      width: 'fit-content',
      data: {
        title: 'End of Turn Effects',
        html: this.getEotHtml(),
        jsonTextData: this.gameService.gameState.timeBasedEffects
      }
    });
  }
}
