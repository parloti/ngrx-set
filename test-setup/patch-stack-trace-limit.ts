/**
 * Patches Error.stackTraceLimit to contain a more complete stack trace of the error.
 */
(function patchStackTraceLimit(): void {
  type IError = ErrorConstructor & { stackTraceLimit: number };
  (Error as IError).stackTraceLimit = 50;
})();
