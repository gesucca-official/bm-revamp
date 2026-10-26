import {ErrorHandler, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {timeout} from 'rxjs/operators';

/** Report Angular errors without intercepting console or reporting transport failures again. */
@Injectable()
export class ClientErrorHandler implements ErrorHandler {
  private reporting = false;

  constructor(private http: HttpClient) {}

  handleError(error: any): void {
    console.error(error);
    if (this.reporting) { return; }
    this.reporting = true;
    try {
      this.http.post<void>('/rest/logs/client/web/', {
        timestamp: new Date().toISOString(),
        message: String(error),
        additional: []
      }).pipe(timeout(5000)).subscribe({
        complete: () => this.reporting = false,
        error: () => this.reporting = false
      });
    } catch (_) {
      this.reporting = false;
    }
  }
}
