import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import type { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockProvider, ngMocks } from 'ng-mocks';
import { NEVER, skip, type Observable } from 'rxjs';
import { ExampleEffects, ExampleService } from './example-effects';
import { creators } from './store';

ngMocks.autoSpy('jasmine');

describe(ExampleEffects.name, () => {
  let effects: ExampleEffects;
  let service: jasmine.SpyObj<ExampleService>;
  let actions$: Observable<Action> = NEVER;
  let mockStore$: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExampleEffects,
        MockProvider(ExampleService),
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    effects = TestBed.inject(ExampleEffects);
    service = TestBed.inject(ExampleService) as jasmine.SpyObj<ExampleService>;
    mockStore$ = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('example1_dispatch_switch$', () => {
    it(`should dispatch 'success'`, () => {
      actions$ = hot('-ab', {
        a: creators.fullStrong.dispatch({ query: { body: '1' } }),
        b: creators.fullStrong.dispatch({ query: { body: '2' } }),
      });

      service.get.and.callFake((outer: string) =>
        cold('-(c|)', {
          c: { data: 'value' + outer },
        }),
      );

      // -ab
      //  -C
      //   -C
      // ---m
      const expected$ = cold('---m', {
        m: creators.fullStrong.success({ payload: { data: 'value2' } }),
      });

      expect(effects.example1_dispatch_switch$).toBeObservable(expected$);
    });

    it(`should dispatch 'failure'`, () => {
      actions$ = hot('-a', {
        a: creators.fullStrong.dispatch({ query: { body: '1' } }),
      });

      service.get.and.callFake(() => cold('-#', void 0, 'http-error'));

      // -a
      //  -#
      // --m
      const expected$ = cold('--m', {
        m: creators.fullStrong.failure({ error: 'http-error' }),
      });

      expect(effects.example1_dispatch_switch$).toBeObservable(expected$);
    });

    it(`should dispatch 'abort'`, () => {
      actions$ = hot('-ab', {
        a: creators.fullStrong.dispatch({ query: { body: '1' } }),
        b: creators.fullStrong.dispatch({ query: { body: '2' } }),
      });

      service.get.and.callFake((outer: string) =>
        cold('-(c|)', {
          c: { data: 'value' + outer },
        }),
      );

      // -ab
      //  -C
      //   -C
      // --m
      const expected$ = cold('--m', {
        m: creators.fullStrong.abort({ reason: 'switched' }),
      });
      effects.example1_dispatch_switch$.subscribe();

      expect(mockStore$.scannedActions$.pipe(skip(1))).toBeObservable(
        expected$,
      );
    });
  });
});
