import { cold } from 'jasmine-marbles';
import { createSet } from '../create-set';
import { pluckError } from './pluck-error';

const failure = createSet('Test', 'Pluck error').failure;

describe(pluckError.name, () => {
  it(`should pluck 'error'`, () => {
    const source$ = cold('-a', {
      a: failure({ error: 'failed' }),
    });
    expect(source$.pipe(pluckError())).toBeObservable(
      cold('-a', { a: 'failed' }),
    );
  });
});
