import { getTestScheduler } from 'jasmine-marbles';
import { observeNotification } from 'rxjs/internal/Notification';
import { type PartialObserver } from 'rxjs/internal/types';
import { TestScheduler } from 'rxjs/testing';

export function marblesWork<T>(
  action: ((v: T) => void) | PartialObserver<T>,
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
    const observer = typeof action === 'function' ? { next: action } : action;

    messages.forEach(({ notification, frame }) => {
      scheduler.schedule(
        () => observeNotification(notification, observer),
        frame,
      );
    });
  });
}
