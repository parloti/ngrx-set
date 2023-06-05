import { type ObservableNotification } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { type TestMessage } from 'rxjs/internal/testing/TestMessage';
import { TestScheduler } from 'rxjs/testing';
import {
  completeNotification,
  errorNotification,
  nextNotification,
} from 'testing/notification-factories';

export function patchParseMarbles() {
  /**
   * Copied and patched from {@link TestScheduler.parseMarbles }.
   */
  function parseMarbles(
    this: typeof TestScheduler,
    marbles: string,
    values?: Record<string, unknown> | string,
    errorValue?: object,
    materializeInnerObservables = false,
    runMode = false,
  ): TestMessage[] {
    if (marbles.indexOf('!') !== -1) {
      throw new Error(
        'conventional marble diagrams cannot have the ' +
          'unsubscription marker "!"',
      );
    }
    // Spreading the marbles into an array leverages ES2015's support for emoji
    // characters when iterating strings.
    const characters = [...marbles];
    const len = characters.length;
    const testMessages: TestMessage[] = [];
    const subIndex = runMode
      ? marbles.replace(/^[ ]+/, '').indexOf('^')
      : marbles.indexOf('^');
    let frame = subIndex === -1 ? 0 : subIndex * -this.frameTimeFactor;
    const getValue =
      typeof values !== 'object'
        ? (x: string) => x
        : (x: string) => {
            const value = values[x];

            // Support Observable-of-Observables
            if (
              materializeInnerObservables &&
              value instanceof ColdObservable
            ) {
              return value.messages;
            }
            return values[x];
          };
    let groupStart = -1;

    for (let i = 0; i < len; i++) {
      let nextFrame = frame;
      const advanceFrameBy = (count: number) => {
        /********** PATCH START **********/

        // This patch avoids advance virtual time in sync groupings
        // Ex.: (AB)C
        // Before: 'A' and 'B' will both be emitted on timeframe '1' but 'C' will be emitted on timeframe '4'.
        // After: 'A' and 'B' will both be emitted on timeframe '1' and 'C' will be emitted on timeframe '2'.

        /***** ORIGINAL CODE START *****/
        // `nextFrame += count * this.frameTimeFactor;`
        /***** ORIGINAL CODE END *****/

        /***** PATCH CODE START *****/
        if (groupStart === -1) {
          // Advance time only on the first character of the group.
          nextFrame += count * this.frameTimeFactor;
        } else {
          // Do not advance time in other characters of the group.
        }
        /***** PATCH CODE END *****/

        /********** PATCH END **********/
      };

      let notification: ObservableNotification<unknown> | undefined;
      const c = characters[i] as string;
      switch (c) {
        case ' ':
          // Whitespace no longer advances time
          if (!runMode) {
            advanceFrameBy(1);
          }
          break;
        case '-':
          advanceFrameBy(1);
          break;
        case '(':
          groupStart = frame;
          advanceFrameBy(1);
          break;
        case ')':
          groupStart = -1;
          advanceFrameBy(1);
          break;
        case '|':
          notification = completeNotification();
          advanceFrameBy(1);
          break;
        case '^':
          advanceFrameBy(1);
          break;
        case '#':
          /********** PATCH START **********/

          // This patch removes the standard error message, thus allowing for falsy messages.
          // Ex.: cold('#')
          // Before: {error: "error" kind: "E"}.
          // After: {error: undefined kind: "E"}.

          /***** ORIGINAL CODE START *****/
          // notification = errorNotification(errorValue || 'error');
          /***** ORIGINAL CODE END *****/

          /***** PATCH CODE START *****/
          notification = errorNotification(errorValue);
          /***** PATCH CODE END *****/

          /********** PATCH END **********/
          advanceFrameBy(1);
          break;
        default:
          // Might be time progression syntax, or a value literal
          if (runMode && c.match(/^[0-9]$/)) {
            // Time progression must be preceded by at least one space
            // if it's not at the beginning of the diagram
            if (i === 0 || characters[i - 1] === ' ') {
              const buffer = characters.slice(i).join('');
              const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
              if (match) {
                i += (match[0] as string).length - 1;
                const duration = parseFloat(match[1] as string);
                const unit = match[2];
                let durationInMs = 0;

                switch (unit) {
                  case 'ms':
                    durationInMs = duration;
                    break;
                  case 's':
                    durationInMs = duration * 1000;
                    break;
                  case 'm':
                    durationInMs = duration * 1000 * 60;
                    break;
                  default:
                    break;
                }

                advanceFrameBy(durationInMs / this.frameTimeFactor);
                break;
              }
            }
          }

          notification = nextNotification(getValue(c));
          advanceFrameBy(1);
          break;
      }

      if (notification) {
        testMessages.push({
          frame: groupStart > -1 ? groupStart : frame,
          notification,
        });
      }

      frame = nextFrame;
    }
    return testMessages;
  }

  TestScheduler.parseMarbles = parseMarbles;
}
