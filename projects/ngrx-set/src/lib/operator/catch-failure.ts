import { HttpErrorResponse } from '@angular/common/http';
import type { ActionType } from '@ngrx/store';
import type { Observable, OperatorFunction } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { IFailureCreator } from '../icreator-set';

type IFailureAction = ActionType<IFailureCreator>;

interface IStringable {
  toString(): string;
}

/**
 * Parses a error.
 * @param error - The error to be parsed.
 * @returns The error parsed into a string.
 */
function parseError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return `${String(error)}`;
  }
}

/**
 * Catches errors on the observable to be handled by returning a new observable that issues a failure action.
 * @template TValue Type emited by the source observable.
 * @param creator - The originator that will generate the failure action to be issued, in case of failure.
 * @returns A RxJs operator function.
 */
export function catchFailure<TValue>(
  creator: IFailureCreator,
): OperatorFunction<TValue, TValue | IFailureAction> {
  type ISelector = (
    error: IStringable,
    caught: Observable<TValue>,
  ) => Observable<IFailureAction>;

  const selector: ISelector = error => {
    let failure: string;
    if (error instanceof Error) {
      failure = error.message;
    } else if (error instanceof HttpErrorResponse) {
      failure = parseError(error.error);
    } else {
      failure = parseError(error);
    }
    return of(creator({ error: failure }));
  };
  return catchError(selector);
}
