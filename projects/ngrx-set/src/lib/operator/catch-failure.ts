import { HttpErrorResponse } from '@angular/common/http';
import type { ActionType } from '@ngrx/store';
import { Observable, of, type OperatorFunction } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { IFailureCreator } from '../creators';

type IFailureAction = ActionType<IFailureCreator>;

interface IStringable {
  toString(): string;
}

function parseError(error: unknown | string): string {
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return `${error}`;
  }
}

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
