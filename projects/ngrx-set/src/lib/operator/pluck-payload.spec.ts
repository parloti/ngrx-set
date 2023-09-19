import { cold } from 'jasmine-marbles';
import { createSet } from '../create-set';
import { pluckPayload } from './pluck-payload';

const success = createSet<undefined, { key: string }>(
  'Test',
  'Pluck payload',
).success;

describe(pluckPayload.name, () => {
  it(`should pluck 'payload'`, () => {
    const source$ = cold('-a', {
      a: success({ payload: { key: 'value' } }),
    });

    expect(source$.pipe(pluckPayload())).toBeObservable(
      cold('-a', { a: { key: 'value' } }),
    );
  });
});
