import type { ActionCreator, Creator } from '@ngrx/store';

export function debugCreator<TArgs, TCreator extends ActionCreator>(
  creator: TCreator,
): TCreator {
  const delegate = (...args: TArgs[]) => {
    // eslint-disable-next-line no-debugger
    // debugger;
    const action = creator(...args);
    return action;
  };
  const typedDelegate = Object.defineProperty(delegate, 'type', {
    value: creator.type,
  }) as ActionCreator<string, Creator<TArgs[], object>>;
  return typedDelegate as TCreator;
}
