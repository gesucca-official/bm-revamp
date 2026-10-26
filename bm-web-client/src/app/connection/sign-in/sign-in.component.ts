import {Component} from '@angular/core';
import {GameService} from '../../service/game.service';
import {WebsocketService} from '../../service/websocket.service';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import {LogService} from '../../service/log.service';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-server-connection',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  isLoading: boolean;

  playerId: string;
  password: string;

  constructor(public websocketService: WebsocketService,
              public gameService: GameService,
              private http: HttpClient,
              private log: LogService) {
  }

  // tslint:disable-next-line:typedef
  async logIn() {
    if (this.isLoading) { return; }
    this.isLoading = true;
    try {
      this.log.info('User \"' + this.playerId + '\" is trying to log in...');
      const areCredentialsValid = await this.checkCredentials(this.playerId, this.password);
      if (!areCredentialsValid) {
        this.log.info('Credentials for User \"' + this.playerId + '\" were not valid: Log In Failed!');
        this.isLoading = false;
        Swal.fire(
          'Log In Failed',
          'Please check your credentials and ensure you are not already logged from somewhere else.',
          'error'
        ).then();
      } else {
        this.log.info('Credential Check Passed: attempting WS connection...');
        this.gameService.playerId = this.playerId;
        this.websocketService.connect(this.playerId, this.password, () => this.loginCallback(), () => {
          this.isLoading = false;
          Swal.fire('Log In Failed', 'Connection failed. Please try again.', 'error').then();
        });
      }
    } catch (_) {
      this.isLoading = false;
      Swal.fire('Log In Failed', 'Unable to contact the server. Please try again.', 'error').then();
    }
  }

  private loginCallback(): void {
    this.isLoading = false;
  }

  private async checkCredentials(username: string, password: string): Promise<boolean> {
    return this.http.post<boolean>('/rest/sign-in/validate', {
      username,
      password
    }).pipe(timeout(10000)).toPromise();
  }
}
