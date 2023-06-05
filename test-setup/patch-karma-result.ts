export function patchKarmaResult() {
  function fixWebpackPath(log: string): string {
    const fixed = log.replace(
      /http:\/\/localhost:\d{4}\/_karma_webpack_\/webpack:/g,
      'webpack://',
    );
    return fixed;
  }
  type IResult = {
    log: string[];
  };
  type IKarma = {
    result: (result: IResult) => void;
  };
  type IWindow = Window & typeof globalThis & { __karma__: IKarma };

  const originalResult = (window as IWindow).__karma__.result;
  (window as IWindow).__karma__.result = result => {
    result.log = result.log.map(fixWebpackPath);
    originalResult(result);
    return void 0;
  };

  type IError = ErrorConstructor & { stackTraceLimit: number };
  (Error as IError).stackTraceLimit = 50;
}
