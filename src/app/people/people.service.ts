import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  EMPTY,
  map,
  mapTo,
  merge,
  Observable,
  startWith,
  Subject,
  switchMap,
  timer,
} from 'rxjs';
import { Person } from './people.model';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private _stop = new Subject<void>();
  private _start = new Subject<void>();

  _stop$ = this._stop.pipe(mapTo(false));
  _start$ = this._start.pipe(mapTo(true));

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(error);
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      }

      const message = `server returned code ${error.status} with body "${error.error}"`;
      throw new Error(`${operation} failed: ${message}`);
    };
  }

  constructor(private http: HttpClient) {}

  readonly apiUrl: string = 'https://randomuser.me/api/';

  getPerson(): Observable<Person> {
    return this.http.get<{ results: Person[] }>(this.apiUrl).pipe(
      map((user) => user.results[0]),
      catchError(this.handleError<Person>('getPerson'))
    );
  }

  interval$ = timer(0, 3000).pipe(switchMap(() => this.getPerson()));

  timer() {
    return merge(this._stop$, this._start$).pipe(
      startWith(true),
      switchMap((val) => (val ? this.interval$ : EMPTY))
    );
  }

  start(): void {
    this._start.next();
  }
  stop(): void {
    this._stop.next();
  }
}
