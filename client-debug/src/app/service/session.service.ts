import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {QueuedUser, User} from '../model/user';
import {UserAccountData} from '../model/user-account-data';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  connectionMessage = '';
  resumeState: any = null;
  readonly resumeEvents = new Subject<any>();
  accountError = '';
  gameJoinError = '';
  /** SB-29 (R01 2.1, D190): starter category sent with the quick joins (`base`, `avanzato`); null sends none, any starter. */
  starterCategory: string | null = null;
  /** SB-30a (D203): null omits the header (Facile); only quick/open 1vCom send it. */
  computerLevel: 'FACILE' | 'NORMALE' | null = null;


  // tslint:disable:variable-name
  private _queued: boolean;
  private _queuedFor: string;

  private _usersConnected: User[] = [];
  private _usersInCurrentQueue: QueuedUser[] = [];

  private _userAccountData: UserAccountData = {
    username: null,
    email: null,
    role: null,
    decks: [],
    collection: {
      characters: [],
      cards: []
    }
  };

  private _isWaitingForUserAccountData = false;
  private _isLoadingGame = false;

  reset(): void {
    this.resumeState = null;
    this.gameJoinError = '';
    this._queued = false;
    this._queuedFor = null;
    this._usersConnected = [];
    this._usersInCurrentQueue = [];
    this._isWaitingForUserAccountData = false;
    this._isLoadingGame = false;
    this._userAccountData = {username: null, email: null, role: null, decks: [], collection: {characters: [], cards: []}};
  }

  get queued(): boolean {
    return this._queued;
  }

  set queued(value: boolean) {
    this._queued = value;
  }

  get queuedFor(): string {
    return this._queuedFor;
  }

  set queuedFor(value: string) {
    this._queuedFor = value;
  }

  get usersInCurrentQueue(): QueuedUser[] {
    return this._usersInCurrentQueue;
  }

  set usersInCurrentQueue(value: QueuedUser[]) {
    this._usersInCurrentQueue = value;
  }

  get howManyUsersConnected(): number {
    return this._usersConnected.length;
  }

  get usersConnected(): User[] {
    return this._usersConnected;
  }

  set usersConnected(value: User[]) {
    this._usersConnected = value;
  }

  get userAccountData(): UserAccountData {
    return this._userAccountData;
  }

  set userAccountData(value: UserAccountData) {
    this._isWaitingForUserAccountData = false;
    this._userAccountData = value;
  }

  get isWaitingForUserAccountData(): boolean {
    return this._isWaitingForUserAccountData;
  }

  set isWaitingForUserAccountData(value: boolean) {
    this._isWaitingForUserAccountData = value;
  }

  get isLoadingGame(): boolean {
    return this._isLoadingGame;
  }

  set isLoadingGame(value: boolean) {
    this._isLoadingGame = value;
  }

}
