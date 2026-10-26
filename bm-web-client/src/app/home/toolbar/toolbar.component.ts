import Swal from 'sweetalert2';
import {Component} from '@angular/core';
import {WebsocketService} from '../../service/websocket.service';
import {GameService} from '../../service/game.service';
import {SessionService} from '../../service/session.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  constructor(public sessionService: SessionService, private websocket: WebsocketService, private game: GameService) {
  }

  showTitle(): boolean {
    return this.sessionService.isWaitingForUserAccountData || this.sessionService.userAccountData.username == null;
  }

  async logOut(): Promise<void> {
    const answer = await Swal.fire({title: 'Log Out?', text: 'Close this session?', icon: 'question', showCancelButton: true, confirmButtonText: 'Log Out'});
    if (answer.isConfirmed) {
      await this.websocket.disconnect();
      this.game.clearGame();
      this.game.playerId = null;
    }
  }
}
