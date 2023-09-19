/**
 * Fix the path of the error stack trace files so they open in the console itself.
 * @param log - The message to be loged.
 * @returns The fixed message.
 */
function patchKarmaReporterResult(log: string): string {
  const fixed = log.replace(
    /http:\/\/localhost:\d{4}\/_karma_webpack_\/webpack:/g,
    'webpack://',
  );
  return fixed;
}

/**
 * Patches the `__karma__.result` function so that it correctly prints the path of the error stack trace files.
 */
(function patchKarmaResult(): void {
  type IWindow = typeof window & {
    __karma__: {
      result: (result: { log: string[] }) => void;
    };
  };

  const originalResult = (window as IWindow).__karma__.result;
  (window as IWindow).__karma__.result = result => {
    result.log = result.log.map(patchKarmaReporterResult);
    originalResult(result);
    return void 0;
  };
})();
