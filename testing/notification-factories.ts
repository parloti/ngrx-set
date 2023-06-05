import type {
  CompleteNotification,
  ErrorNotification,
  NextNotification,
  ObservableNotification,
} from 'rxjs';

export function completeNotification(): CompleteNotification {
  return createNotification('C', undefined, undefined);
}

export function errorNotification<TError>(error: TError): ErrorNotification {
  return createNotification('E', undefined, error);
}

export function nextNotification<TValue>(
  value: TValue,
): NextNotification<TValue> {
  return createNotification('N', value, undefined);
}

export function createNotification<TValue>(
  kind: 'N',
  value: TValue,
  error: undefined,
): NextNotification<TValue>;
export function createNotification<TError>(
  kind: 'E',
  value: undefined,
  error: TError,
): ErrorNotification;
export function createNotification(
  kind: 'C',
  value: undefined,
  error: undefined,
): CompleteNotification;
export function createNotification<TValue, TError>(
  kind: 'N' | 'E' | 'C',
  value: TValue,
  error: TError,
): ObservableNotification<TValue> {
  return { error, kind, value };
}
