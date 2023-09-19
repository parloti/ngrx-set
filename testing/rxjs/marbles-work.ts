/* eslint-disable rxjs/no-internal -- Internal is needed*/
import { getTestScheduler } from 'jasmine-marbles';
import { observeNotification } from 'rxjs/internal/Notification';
import { type PartialObserver } from 'rxjs/internal/types';
import { TestScheduler } from 'rxjs/testing';

/**
 * Schedules a job using the marbles diagrams.
 * @param work - Work to be performed.
 * @param marbles - The marbles diagrams to schedule the work.
 * @param values - Values of next type notifications.
 * @param errorValue - Value of a possible error notification.
 */
export function marblesWork<T>(
  work: ((v: T) => void) | PartialObserver<T>,
  marbles: string,
  values:
    | {
        [key: string]: T;
      }
    | undefined,
  errorValue?: unknown,
): void {
  const scheduler = getTestScheduler();
  scheduler.schedule(() => {
    const messages = TestScheduler.parseMarbles(
      marbles,
      values,
      errorValue,
      void 0,
      true,
    );
    const observer = typeof work === 'function' ? { next: work } : work;

    messages.forEach(({ notification, frame }) => {
      scheduler.schedule(
        () => observeNotification(notification, observer),
        frame,
      );
    });
  });
}
