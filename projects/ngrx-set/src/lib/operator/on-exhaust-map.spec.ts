import { cold } from 'jasmine-marbles';
import { Subject, catchError } from 'rxjs';
import { collectEmissions } from 'testing';
import { marblesWork } from 'testing/rxjs';
import { onExhaustMap } from './on-exhaust-map';

describe(onExhaustMap.name, () => {
  it(`should notify before inner completion`, () => {
    const source$ = new Subject();
    marblesWork(source$, '-a-b', { a: 'a', b: 'b' });

    const notifier = jasmine.createSpy('notifier');
    source$
      .pipe(onExhaustMap(outer => cold('-d-|', { d: 'd' + outer }), notifier))
      .subscribe();
    const result$ = collectEmissions(notifier);
    // -a-b-
    //  -d-|
    //    -d-|
    // ---*---
    const expected$ = cold('---n---', { n: 'b' });
    expect(result$).toBeObservable(expected$);
  });

  it(`should NOT notify after inner completion`, () => {
    const source$ = new Subject();
    marblesWork(source$, '-a---b', { a: 'a', b: 'b' });

    const notifier = jasmine.createSpy('notifier');
    source$
      .pipe(onExhaustMap(outer => cold('-d-|', { d: 'd' + outer }), notifier))
      .subscribe();
    const result$ = collectEmissions(notifier);
    // -a---b
    //  -d-|
    //      -d-|
    // ---------
    const expected$ = cold('---------');
    expect(result$).toBeObservable(expected$);
  });

  it(`should NOT notify after inner error`, () => {
    const source$ = new Subject();
    marblesWork(source$, '-a---b', { a: 'a', b: 'b' });

    const notifier = jasmine.createSpy('notifier');
    source$
      .pipe(
        onExhaustMap(
          outer => cold('-d-#', { d: 'd' + outer }, 'anyError'),
          notifier,
        ),
        catchError((_err, c) => c),
      )
      .subscribe();
    const result$ = collectEmissions(notifier);
    // -a---b
    //  -d-#
    //      -d-#
    // ---------
    const expected$ = cold('---------');
    expect(result$).toBeObservable(expected$);
  });

  it(`should behave like exhaustMap`, () => {
    const source$ = cold('-a-b---c', { a: 'a', b: 'b', c: 'c' });

    const result$ = source$.pipe(
      onExhaustMap(
        outer => cold('-d-(e|)', { d: outer + 'd', e: outer + 'e' }),
        () => void 0,
      ),
    );
    // -a-b---c
    //  -d-e
    //    -d-e
    //       -d-e
    // --m-n--p-q
    const expected$ = cold('--m-n---p-q', {
      m: 'ad',
      n: 'ae',
      p: 'cd',
      q: 'ce',
    });
    expect(result$).toBeObservable(expected$);
  });
});
