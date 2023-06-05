import { cold } from 'jasmine-marbles';
import { Subject } from 'rxjs';
import { marblesWork } from './marbles-work';

describe(marblesWork.name, () => {
  it(`should schedule the actions`, () => {
    const collector$ = new Subject<string>();
    marblesWork(v => collector$.next(v), 'abc', { a: 'v1', b: 'v2', c: 'v3' });

    const expected$ = cold('abc', { a: 'v1', b: 'v2', c: 'v3' });
    expect(collector$).toBeObservable(expected$);
  });
});
