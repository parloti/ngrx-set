// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

import * as ngKarma from '@angular-devkit/build-angular/src/tools/webpack/plugins/karma/karma';
import karmaJasmineHtmlReporter from 'karma-jasmine-html-reporter';
import karmaChromeLauncher from 'karma-chrome-launcher';
import customLaunchers from './karma-custom-launchers';
import karmaCoverage from 'karma-coverage';
import karmaJasmine from 'karma-jasmine';
import type { Config } from 'karma';
import { join } from 'path';

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
    plugins: [
      karmaChromeLauncher,
      karmaCoverage,
      karmaJasmine,
      karmaJasmineHtmlReporter,
      ngKarma,
    ],
    jasmineHtmlReporter: {
      suppressAll: false, // removes the duplicated traces // TODO: retornar para true
    },
    coverageReporter: {
      dir: join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeDebugging'],
    restartOnFileChange: true,
    retryLimit: 10,
  });
}
