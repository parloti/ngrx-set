import { cold } from 'jasmine-marbles';
import { createSet } from '../create-set';
import { pluckReason } from './pluck-reason';

const abort = createSet('Test', 'Pluck reason').abort;

describe(pluckReason.name, () => {
  it(`should pluck 'reason'`, () => {
    const source$ = cold('-a', {
      a: abort({ reason: 'aborted' }),
    });

    expect(source$.pipe(pluckReason())).toBeObservable(
      cold('-a', { a: 'aborted' }),
    );
  });
});
