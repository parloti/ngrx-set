import { cold, hot } from 'jasmine-marbles';
import { createSet } from 'ngrx-set';
import { actionSetRequest } from './action-set-request';

type IDispatch = string;
type ISuccess = boolean;
const creatorSet = createSet<IDispatch, ISuccess>()('source', 'full');

describe(actionSetRequest.name, () => {
  it(`should throw error if 'extraData$' is empty`, () => {
    const actions$ = hot('-a', {
      a: creatorSet.dispatch({
        query: 'query',
      }),
    });

    const empty$ = cold('-|');
    const extraData$ = {
      empty: empty$,
    };

    const project = jasmine.createSpy('project');
    const result$ = actionSetRequest({
      actions$,
      creatorSet,
      extraData$,
      project,
    });

    // -a           // actions$
    // -^!          // extraData$
    // --a          // expected$(abort)

    const expected$ = cold(
      '--#',
      void 0,
      jasmine.objectContaining({
        message: 'no elements in sequence',
        name: 'EmptyError',
      }),
    );

    expect(result$).toBeObservable(expected$);
    expect(empty$).toHaveSubscriptions('-^!');
    expect(project).toHaveBeenCalledTimes(0);
  });

  it(`should handle 'extraData$' abortion`, () => {
    const actions$ = hot('-aa', {
      a: creatorSet.dispatch({
        query: 'query',
      }),
    });

    const neverEmits$ = cold('');
    const extraData$ = {
      never: neverEmits$,
    };

    const project = jasmine.createSpy('project');
    const result$ = actionSetRequest({
      actions$,
      creatorSet,
      extraData$,
      project,
    });

    // -aa           // actions$
    // -^!           // extraData$ (a')
    // --^           // extraData$ (a'')
    // --a           // expected$ (abort)

    const expected$ = cold('--a', {
      a: creatorSet.abort({
        reason: 'extraData$ switched',
      }),
    });

    expect(result$).toBeObservable(expected$);
    expect(neverEmits$).toHaveSubscriptions(['-^!', '--^']);
    expect(project).toHaveBeenCalledTimes(0);
  });

  it(`should call 'request' with 'query' and 'extraData'`, () => {
    const query = 'query';
    const actions$ = hot('-a', {
      a: creatorSet.dispatch({ query }),
    });

    const extraData = {
      data: 'some-data',
    };
    const extraData$ = {
      data: cold('e', { e: extraData.data }),
    };

    const response = true;
    const response$ = cold('-s|', { s: response });
    const project = jasmine.createSpy('project').and.returnValue(response$);

    const result$ = actionSetRequest({
      actions$,
      creatorSet,
      extraData$,
      project,
    });

    // -a---     // actions$
    //  e        // extraData$
    //  -s|      // project => response$
    // -^-!      // response$
    // --s-     // expected$

    const expected$ = cold('--s-', {
      s: creatorSet.success({ payload: response }),
    });

    expect(result$).toBeObservable(expected$);
    expect(response$).toHaveSubscriptions('-^-!');
    expect(project).toHaveBeenCalledOnceWith(query, extraData);
  });

  it(`should handle 'request' abortion`, () => {
    const query1 = 'query1';
    const query2 = 'query2';
    const actions$ = hot('-ab', {
      a: creatorSet.dispatch({ query: query1 }),
      b: creatorSet.dispatch({ query: query2 }),
    });

    const extraData = { data: 'some-data' };
    const extraData$ = {
      data: cold('e', { e: extraData.data }),
    };

    const response$ = cold('');
    const project = jasmine.createSpy('project').and.returnValue(response$);

    const result$ = actionSetRequest({
      actions$,
      creatorSet,
      extraData$,
      project,
    });

    // -ab--     // actions$
    //  e        // extraData$ (a)
    //   e       // extraData$ (b)
    //  ----     // project => response$ (a) (switched)
    //   ---     // project => response$ (b)
    // -^!       // response$ (a)
    // --^--     // response$ (b)
    // --x--     // expected$

    const expected$ = cold('--x--', {
      x: creatorSet.abort({ reason: 'Request switched' }),
    });

    expect(result$).toBeObservable(expected$);
    expect(response$).toHaveSubscriptions(['-^!', '--^--']);
    expect(project).toHaveBeenCalledWith(query1, extraData);
    expect(project).toHaveBeenCalledWith(query2, extraData);
    expect(project).toHaveBeenCalledTimes(2);
  });

  it(`should handle 'request' success`, () => {
    const query = 'query';
    const actions$ = hot('-a', {
      a: creatorSet.dispatch({ query }),
    });

    const extraData = {
      data: 'some-data',
    };
    const extraData$ = {
      data: cold('e', { e: extraData.data }),
    };

    const response = true;
    const response$ = cold('-s|', { s: response });
    const project = jasmine.createSpy('project').and.returnValue(response$);

    const result$ = actionSetRequest({
      actions$,
      creatorSet,
      extraData$,
      project,
    });

    // -a--     // actions$
    //  e       // extraData$
    //  -s|     // project => response$
    // -^-!     // response$
    // --r-     // expected$

    const expected$ = cold('--r-', {
      r: creatorSet.success({ payload: response }),
    });

    expect(result$).toBeObservable(expected$);
    expect(response$).toHaveSubscriptions('-^-!');
    expect(project).toHaveBeenCalledOnceWith(query, extraData);
  });

  it(`should handle 'request' without query`, () => {
    const payloadSet = createSet<undefined, ISuccess>()('source', 'payload');
    const actions$ = hot('-a', {
      a: payloadSet.dispatch(),
    });

    const extraData = {
      data: 'some-data',
    };
    const extraData$ = {
      data: cold('e', { e: extraData.data }),
    };

    const response = true;
    const response$ = cold('-s|', { s: response });
    const project = jasmine.createSpy('project').and.returnValue(response$);

    const result$ = actionSetRequest({
      actions$,
      creatorSet: payloadSet,
      extraData$,
      project,
    });

    // -a--     // actions$
    //  e       // extraData$
    //  -s|     // project => response$
    // -^-!     // response$
    // --r-     // expected$

    const expected$ = cold('--r-', {
      r: payloadSet.success({ payload: response }),
    });

    expect(result$).toBeObservable(expected$);
    expect(response$).toHaveSubscriptions('-^-!');
    expect(project).toHaveBeenCalledOnceWith(void 0, extraData);
  });

  it(`should handle 'request' without extra data`, () => {
    const payloadSet = createSet<undefined, ISuccess>()('source', 'payload');
    const actions$ = hot('-a', {
      a: payloadSet.dispatch(),
    });

    const response = true;
    const response$ = cold('-s|', { s: response });
    const project = jasmine.createSpy('project').and.returnValue(response$);

    const result$ = actionSetRequest({
      actions$,
      creatorSet: payloadSet,
      project,
    });

    // -a--     // actions$
    //  -s|     // project => response$
    // -^-!     // response$
    // --r-     // expected$

    const expected$ = cold('--r-', {
      r: payloadSet.success({ payload: response }),
    });

    expect(result$).toBeObservable(expected$);
    expect(response$).toHaveSubscriptions('-^-!');
    expect(project).toHaveBeenCalledOnceWith(void 0, void 0);
  });

  it(`should handle 'request' failure`, () => {
    const query = 'query1';
    const actions$ = hot('-a', {
      a: creatorSet.dispatch({ query }),
    });

    const extraData = { data: 'some-data' };
    const extraData$ = {
      data: cold('e', { e: extraData.data }),
    };

    const response$ = cold('-#', void 0, 'some-error');
    const project = jasmine.createSpy('project').and.returnValue(response$);

    const result$ = actionSetRequest({
      actions$,
      creatorSet,
      extraData$,
      project,
    });

    // -a--     // actions$
    //  e       // extraData$
    //  -#      // project => response$
    // -^!      // response$
    // --r-     // expected$

    const expected$ = cold('--r-', {
      r: creatorSet.failure({ error: 'some-error' }),
    });

    expect(result$).toBeObservable(expected$);
    expect(response$).toHaveSubscriptions('-^!');
  });
});
