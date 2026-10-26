import {Component, ViewChild} from '@angular/core';
import {WebsocketService} from '../service/websocket.service';
import {GameService} from '../service/game.service';
import {DebugClientComponent} from '../client-debug/debug-client.component';
import {SessionService} from '../service/session.service';
import {Deck} from '../model/deck';

@Component({
  selector: 'app-user-hub',
  templateUrl: './user-hub.component.html',
  styleUrls: ['./user-hub.component.css']
})
export class UserHubComponent {

  @ViewChild(DebugClientComponent) debugClient: DebugClientComponent;

  constructor(public websocketService: WebsocketService,
              public gameService: GameService,
              public sessionService: SessionService) {
  }

  bounceJoinGameEvent($event: { game: string, deck?: Deck }): void {
    this.sessionService.isLoadingGame = true;
    this.debugClient.joinGame($event);
  }
}
