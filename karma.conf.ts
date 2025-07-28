// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

import type { Config, CustomLauncher } from 'karma';

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Karma configuration file.
 * @param config - Default confguration.
 */
export default function (config: Config) {
  config.set({
    basePath: '',
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        random: false,
      },
    },
    customLaunchers: customLaunchers,
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    jasmineHtmlReporter: {
      suppressAll: false, // removes the duplicated traces // TODO: retornar para true
    },
    coverageReporter: {
      dir: join(dirname(fileURLToPath(import.meta.url)), './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeDebugging'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-coverage',
      '@angular-devkit/build-angular/plugins/karma',
    ],
    restartOnFileChange: true,
    retryLimit: 10,
  });
}

const customLaunchers: Record<string, CustomLauncher> = {
  ChromeDebugging: {
    base: 'Chrome',
    chromeDataDir: resolve(dirname(fileURLToPath(import.meta.url)), '.chrome'),
    flags: [
      '--remote-debugging-port=9333',
      '--auto-open-devtools-for-tabs',
      '--hide-crash-restore-bubble',
      '--enable-automation',
      'http://localhost:9876/debug.html',
    ],
  },
  ChromeHeadlessCI: {
    base: 'ChromeHeadless',
    flags: ['--window-size=1024,768', '--no-sandbox'],
  },
  ChromeHeadlessLocal: {
    base: 'ChromeHeadless',
    flags: ['--window-size=1024,768'],
  },
  FirefoxHeadless: {
    base: 'Firefox',
    flags: ['-headless'],
  },
};
