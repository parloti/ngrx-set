import { Subject } from 'rxjs';

/**
 * Projects calls of a spy to a subject.
 * @param from - The spy to collect calls from.
 * @returns A subject that will emit when the spy is called.
 */
export function collectCalls(
  from: jasmine.Spy,
): Subject<Parameters<typeof from>> {
  const collector$ = new Subject<Parameters<typeof from>>();
  from.and.callFake(args => collector$.next(args));
  return collector$;
}
