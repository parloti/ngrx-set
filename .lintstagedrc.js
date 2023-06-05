const { ESLint } = require('eslint');
const { chunk } = require('lodash');
const { relative, dirname } = require('path');
const glob = require('glob');

const removeIgnoredFiles = async files => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map(file => eslint.isPathIgnored(file)),
  );
  return files.filter((_, i) => !isIgnored[i]);
};

const chunkFileSize = 15;

const runChunks = (files, cmd) => {
  const chunkArrays = chunk(files, chunkFileSize);
  let commands = [];
  for (const arr of chunkArrays) {
    commands = commands.concat([`${cmd} ${arr.join(' ')}`]);
  }
  return commands;
};

module.exports = {
  'src/**/*.*': files => {
    return runChunks(files, `prettier --ignore-unknown --write`);
  },
  'src/**/*.{css,scss}': files => {
    return runChunks(files, `stylelint -f verbose --fix`);
  },
  'src/**/*.html': files => {
    const relativeFiles = files.map(x => relative(__dirname, x));
    return runChunks(relativeFiles, `linthtml`);
  },
  'src/**/*.{ts,tsx,js,jsx}': async files => {
    const filesToLint = await removeIgnoredFiles(files);
    return runChunks(filesToLint, `eslint --max-warnings=0 --fix`);
  },
  'src/**/*.**': async files => {
    const dirs = [
      ...new Set(
        files.map(file =>
          relative(__dirname, dirname(file)).replace(/\\/g, '/'),
        ),
      ),
    ];

    const specsToFind = [...dirs].map(dir => dir + '/*.spec.ts');
    const specs$ = specsToFind.map(
      spec =>
        new Promise((resolve, reject) => {
          glob(spec, { cwd: __dirname }, (err, matches) =>
            err ? reject(err) : resolve(matches),
          );
        }),
    );
    const specs = (await Promise.all(specs$)).flat(Infinity);

    if (specs.length < 1) {
      return [];
    }
    const includes = specs.map(spec => '--include=' + spec);
    return runChunks(includes, `npm run test:ci -- --watch=false`);
  },
};
