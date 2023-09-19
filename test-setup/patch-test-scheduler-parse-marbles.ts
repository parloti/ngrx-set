/* eslint-disable rxjs/no-internal -- Members are not exported */
import type { ObservableNotification } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import type { TestMessage } from 'rxjs/internal/testing/TestMessage';
import { TestScheduler } from 'rxjs/testing';
import {
  completeNotification,
  errorNotification,
  nextNotification,
} from 'testing/notification-factories';

const parseMarbles = <TValue, TError>(
  marbles: string,
  values?: TValue | Record<string, TValue>,
  errorValue?: TError,
  materializeInnerObservables: boolean = false,
  runMode = false,
): TestMessage[] => {
  const frameTimeFactor = TestScheduler.frameTimeFactor;

  if (marbles.indexOf('!') !== -1) {
    throw new Error(
      'conventional marble diagrams cannot have the ' +
        'unsubscription marker "!"',
    );
  }
  const characters = [...marbles];
  const len = characters.length;
  const testMessages: TestMessage[] = [];
  const subIndex = runMode
    ? marbles.replace(/^[ ]+/, '').indexOf('^')
    : marbles.indexOf('^');
  let frame = subIndex === -1 ? 0 : subIndex * -frameTimeFactor;
  const getValue = (x: string) => {
    if (typeof values === 'object' && values !== null && x in values) {
      // Support Observable-of-Observables
      const inner = (values as Record<string, TValue>)[x];
      if (materializeInnerObservables && inner instanceof ColdObservable) {
        return inner.messages;
      } else {
        return inner as TValue;
      }
    } else {
      return x as TValue;
    }
  };
  let groupStart = -1;

  for (let i = 0; i < len; i++) {
    let nextFrame = frame;
    const advanceFrameBy = (count: number) => {
      /** PATCH START. */
      if (groupStart === -1) {
        // Advance time only on the first character of the group.
        nextFrame += count * frameTimeFactor;
      } else {
        // Do not advance time in other characters of the group.
      }
      /** PATCH END. */
    };

    let notification:
      | ObservableNotification<TValue | TestMessage[]>
      | undefined;
    const c = characters[i];
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
        notification = errorNotification(errorValue);
        advanceFrameBy(1);
        break;
      default:
        if (c === void 0) {
          throw new Error(
            `Invalid caractere (${c}, type: ${typeof c}) at position ${i}.`,
          );
        }
        // Might be time progression syntax, or a value literal
        if (runMode && /^[0-9]$/.test(c)) {
          // Time progression must be preceeded by at least one space
          // if it's not at the beginning of the diagram
          if (i === 0 || characters[i - 1] === ' ') {
            const buffer = characters.slice(i).join('');
            const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
            if (match !== null) {
              const firstGroup = match[0];
              const secondGroup = match[1];
              if (secondGroup === void 0) {
                throw new Error(`Invalid matcher.`);
              }
              i += firstGroup.length - 1;
              const duration = parseFloat(secondGroup);
              const unit = match[2];
              let durationInMs: number;

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
                  throw new Error(`Invalid duration unit (${unit}).`);
              }

              advanceFrameBy(durationInMs / frameTimeFactor);
              break;
            }
          }
        }
        notification = nextNotification(getValue(c));
        advanceFrameBy(1);
        break;
    }

    if (notification !== void 0) {
      testMessages.push({
        frame: groupStart > -1 ? groupStart : frame,
        notification,
      });
    }

    frame = nextFrame;
  }
  return testMessages;
};

TestScheduler.parseMarbles = parseMarbles;
