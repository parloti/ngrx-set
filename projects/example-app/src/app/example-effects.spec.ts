import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import type { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { MockProvider } from 'ng-mocks';
import { NEVER, skip, type Observable } from 'rxjs';
import { ExampleEffects, ExampleService } from './example-effects';
import { creators, type IState } from './store';

describe(ExampleEffects.name, () => {
  let effects: ExampleEffects;
  let service: jasmine.SpyObj<ExampleService>;
  let actions$: Observable<Action> = NEVER;
  let initialState: IState;
  let mockStore$: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExampleEffects,
        MockProvider(ExampleService),
        provideMockStore({ initialState }),
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
        a: creators.full2.dispatch({ query: { body: '1' } }),
        b: creators.full2.dispatch({ query: { body: '2' } }),
      });

      spyOn(service, 'get').and.callFake(((outer: string) =>
        cold('-(c|)', {
          c: { data: 'value' + outer },
        })) as any);

      // -ab
      //  -C
      //   -C
      // ---m
      const expected$ = cold('---m', {
        m: creators.full2.success({ payload: { data: 'value2' } }),
      });

      expect(effects.example1_dispatch_switch$).toBeObservable(expected$);
    });

    it(`should dispatch 'failure'`, () => {
      actions$ = hot('-a', {
        a: creators.full2.dispatch({ query: { body: '1' } }),
      });

      spyOn(service, 'get').and.callFake((() =>
        cold('-#', void 0, 'http-error')) as any);

      // -a
      //  -#
      // --m
      const expected$ = cold('--m', {
        m: creators.full2.failure({ error: 'http-error' }),
      });

      expect(effects.example1_dispatch_switch$).toBeObservable(expected$);
    });

    it(`should dispatch 'abort'`, () => {
      actions$ = hot('-ab', {
        a: creators.full2.dispatch({ query: { body: '1' } }),
        b: creators.full2.dispatch({ query: { body: '2' } }),
      });

      spyOn(service, 'get').and.callFake(((outer: string) =>
        cold('-(c|)', {
          c: { data: 'value' + outer },
        })) as any);

      // -ab
      //  -C
      //   -C
      // --m
      const expected$ = cold('--m', {
        m: creators.full2.abort({ reason: 'switched' }),
      });
      effects.example1_dispatch_switch$.subscribe();
      expect(mockStore$.scannedActions$.pipe(skip(1))).toBeObservable(
        expected$,
      );
    });
  });
});
