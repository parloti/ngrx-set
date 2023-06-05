import { Subject } from 'rxjs';

export function collectEmissions(
  from: jasmine.Spy,
): Subject<Parameters<typeof from>> {
  const collector$ = new Subject<Parameters<typeof from>>();
  from.and.callFake(args => collector$.next(args));
  return collector$;
}
