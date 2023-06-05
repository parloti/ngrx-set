import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

export function withTestScheduler(callback: () => void): void {
  const testScheduler = getTestScheduler();
  const originalFrameTimeFactor = TestScheduler.frameTimeFactor;
  const originalMaxFrames = testScheduler.maxFrames;
  testScheduler.run(() => {
    TestScheduler.frameTimeFactor = originalFrameTimeFactor;
    testScheduler.maxFrames = originalMaxFrames;
    callback();
  });
}
