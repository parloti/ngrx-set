import { HttpErrorResponse } from '@angular/common/http';
import { cold } from 'jasmine-marbles';
import { createSet } from '../create-set';
import { catchFailure } from './catch-failure';

const failure = createSet('Test', 'Catch failure').failure;
describe(catchFailure.name, () => {
  it(`should emit 'Error.message'`, () => {
    expect(
      cold('-#', {}, new Error('some error')).pipe(catchFailure(failure)),
    ).toBeObservable(cold('-(a|)', { a: failure({ error: 'some error' }) }));
  });

  it(`should emit 'HttpErrorResponse.error'`, () => {
    expect(
      cold('-#', {}, new HttpErrorResponse({ error: 'some error' })).pipe(
        catchFailure(failure),
      ),
    ).toBeObservable(cold('-(a|)', { a: failure({ error: 'some error' }) }));
  });

  it(`should emit 'error' message`, () => {
    expect(
      cold('-#', {}, 'some error').pipe(catchFailure(failure)),
    ).toBeObservable(cold('-(a|)', { a: failure({ error: 'some error' }) }));
  });

  it(`should emit 'error' stringified`, () => {
    expect(
      cold('-#', {}, { key: 'some error' }).pipe(catchFailure(failure)),
    ).toBeObservable(
      cold('-(a|)', {
        a: failure({ error: JSON.stringify({ key: 'some error' }) }),
      }),
    );
  });

  it(`should emit 'error.toString()'`, () => {
    const error: Record<string, unknown> = {};
    error['error'] = error;

    expect(cold('-#', {}, error).pipe(catchFailure(failure))).toBeObservable(
      cold('-(a|)', { a: failure({ error: String(error) }) }),
    );
  });
});
