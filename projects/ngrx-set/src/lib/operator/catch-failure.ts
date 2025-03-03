import { HttpErrorResponse } from '@angular/common/http';
import type { Observable, OperatorFunction } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { IAction, IFailureCreator } from '../icreator-set';
import type { IFailureProp } from './../properties';

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
 * Catches errors on the observable to be handled by returning a new observable that emits a failure action.
 * @template TValue Type emited by the source observable.
 * @template TErrorType Unique name identifying the type of action to be used when the request fails.
 * @param creator - The originator that will generate the failure action to be issued, in case of failure.
 * @returns A function that returns an Observable that originates from either
 * the source or the Observable that emits a failure action.
 */
export function catchFailure<TValue, TErrorType extends string = string>(
  creator: IFailureCreator<TErrorType>,
): OperatorFunction<TValue, TValue | IAction<IFailureProp, TErrorType>> {
  type ISelector = (
    error: IStringable,
    caught: Observable<TValue>,
  ) => Observable<IAction<IFailureProp, TErrorType>>;

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
