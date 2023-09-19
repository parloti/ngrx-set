import type { ActionCreator, Creator } from '@ngrx/store';

/**
 * Intercepts the creation of actions by a creator for debugging purposes.
 * @template TCreator The type of creator to be intercepted.
 * @param creator - The creator whose innovations should be intercepted.
 * @returns A creator of the same type as the intercepted.
 */
export function debugCreator<TArgs, TCreator extends ActionCreator>(
  creator: TCreator,
): TCreator {
  const delegate = (...args: TArgs[]) => {
    // debugger;
    const action = creator(...args);
    return action;
  };
  const typedDelegate = Object.defineProperty(delegate, 'type', {
    value: creator.type,
  }) as ActionCreator<string, Creator<TArgs[], object>>;
  return typedDelegate as TCreator;
}
