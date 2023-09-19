import type {
  CompleteNotification,
  ErrorNotification,
  NextNotification,
  ObservableNotification,
} from 'rxjs';

/**
 * Creates a "complete" notification of an observable.
 * @returns A "complete" observable notification.
 */
export function completeNotification(): CompleteNotification {
  return createNotification('C', undefined, undefined);
}

/**
 * Creates an "error" notification of an observable.
 * @template TError The type of error that occurred.
 * @param error - The error of the notification being created.
 * @returns An "error" observable notification.
 */
export function errorNotification<TError>(error: TError): ErrorNotification {
  return createNotification('E', undefined, error);
}

/**
 * Creates a "next" notification of an observable.
 * @template TValue The type of value emitted.
 * @param value - The value of the notification being created.
 * @returns A "value" observable notification.
 */
export function nextNotification<TValue>(
  value: TValue,
): NextNotification<TValue> {
  return createNotification('N', value, undefined);
}

/**
 * Creates a "complete" notification of an observable.
 * @param kind - The kind of notification being created. Always "C".
 * @param value - The value of the notification being created. Always "undefined".
 * @param error - The error of the notification being created. Always "undefined".
 * @returns A "complete" observable notification.
 */
function createNotification(
  kind: 'C',
  value: undefined,
  error: undefined,
): CompleteNotification;

/**
 * Creates a "error" notification of an observable.
 * @template TError The type of error that occurred.
 * @param kind - The kind of notification being created. Always "E".
 * @param value - The value of the notification being created. Always "undefined".
 * @param error - The error of the notification being created.
 * @returns An "error" observable notification.
 */
function createNotification<TError>(
  kind: 'E',
  value: undefined,
  error: TError,
): ErrorNotification;

/**
 * Creates a "next" notification of an observable.
 * @template TValue The type of value emitted.
 * @param kind - The kind of notification being created. Always "N".
 * @param value - The value of the notification being created. Always "undefined".
 * @param error - The error of the notification being created. Always "undefined".
 * @returns A "next" observable notification.
 */
function createNotification<TValue>(
  kind: 'N',
  value: TValue,
  error: undefined,
): NextNotification<TValue>;

/**
 * Ensures that all created notifications have the same "shape".
 * @template TValue The type of value emitted.
 * @template TError The type of error that occurred.
 * @param kind - The kind of notification being created.
 * @param value - The value of the notification being created.
 * @param error - The error of the notification being created.
 * @returns An observable notification.
 */
function createNotification<TValue, TError>(
  kind: 'N' | 'E' | 'C',
  value: TValue,
  error: TError,
): ObservableNotification<TValue> {
  return { error, kind, value };
}
