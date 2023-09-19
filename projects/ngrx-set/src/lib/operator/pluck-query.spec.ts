import { cold } from 'jasmine-marbles';
import { createSet } from '../create-set';
import { pluckQuery } from './pluck-query';

const dispatch = createSet<{ key: string }>('Test', 'Pluck query').dispatch;

describe(pluckQuery.name, () => {
  it(`should pluck 'query'`, () => {
    const source$ = cold('-a', {
      a: dispatch({ query: { key: 'value' } }),
    });

    expect(source$.pipe(pluckQuery())).toBeObservable(
      cold('-a', { a: { key: 'value' } }),
    );
  });
});
