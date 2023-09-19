import { cold } from 'jasmine-marbles';
import { Subject, catchError } from 'rxjs';
import { collectCalls } from 'testing';
import { marblesWork } from 'testing/rxjs';
import { onSwitchMap } from './on-switch-map';

describe(onSwitchMap.name, () => {
  it(`should notify before inner completion`, () => {
    const source$ = new Subject();
    marblesWork(source$, '-a-b', { a: 'a', b: 'b' });

    const notifier = jasmine.createSpy('notifier');
    source$
      .pipe(onSwitchMap(outer => cold('-d-|', { d: 'd' + outer }), notifier))
      .subscribe();
    const result$ = collectCalls(notifier);
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
      .pipe(onSwitchMap(outer => cold('-d-|', { d: 'd' + outer }), notifier))
      .subscribe();
    const result$ = collectCalls(notifier);
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
        onSwitchMap(
          outer => cold('-d-#', { d: 'd' + outer }, 'anyError'),
          notifier,
        ),
        catchError((_err, c) => c),
      )
      .subscribe();
    const result$ = collectCalls(notifier);
    // -a---b
    //  -d-#
    //      -d-#
    // ---------
    const expected$ = cold('---------');

    expect(result$).toBeObservable(expected$);
  });

  it(`should behave like switchMap`, () => {
    const source$ = cold('-a-b---c', { a: 'a', b: 'b', c: 'c' });

    const result$ = source$.pipe(
      onSwitchMap(
        outer => cold('-d-e', { d: outer + 'd', e: outer + 'e' }),
        () => void 0,
      ),
    );
    // -a-b---c
    //  -d-e
    //    -d-e
    //       -d-e
    // --m-n-op-q
    const expected$ = cold('--m-n-o-p-q', {
      m: 'ad',
      n: 'bd',
      o: 'be',
      p: 'cd',
      q: 'ce',
    });

    expect(result$).toBeObservable(expected$);
  });
});
