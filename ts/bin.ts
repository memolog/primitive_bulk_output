#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const pkg = require('../package.json');
const spawnPrimitive = require('./index');

async function main(args) {
  program
    .version(pkg.version)
    .option('-i, --input <file')
    .option('-o, --output <file>')
    .option('-n, --num <string>')
    .option('-m, --mode <string>')
    .option('--rep <number>')
    .option('--nth <number>')
    .option('-r, --resize <number>')
    .option('-s, --size <number>')
    .option('-a, --alpha <number>')
    .option('--bg <string>')
    .option('-v, --verbose <string>')
    .option('--vv <string>')
    .option('-e, --ext <string>')
    .option('-d, --dist <dist>')
    .option('--sync')
    .parse(args);

  const filePath = path.resolve(process.cwd(), program.input);

  let dist;
  if (program.dist) {
    dist = path.resolve(process.cwd(), program.dist);
  } else if (program.output) {
    dist = path.resolve(process.cwd(), program.output);
  } else {
    dist = path.parse(filePath).dir;
  }

  let outputModes;
  if (program.mode) {
    outputModes = program.mode.split(',');
  } else {
    outputModes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  let nums;
  if (program.nums) {
    nums = program.nums.split(',');
  } else {
    nums = ['300'];
  }

  const { name, ext } = path.parse(filePath);
  const fileExt = (program.ext || ext).replace(/^\./, '');

  const tasks = [];

  const optionMap = {
    rep: 'rep',
    nth: 'nth',
    resize: 'r',
    size: 's',
    alpha: 'a',
    bg: 'bg',
    verbose: 'v',
    vv: 'vv'
  };

  outputModes.forEach(mode => {
    if (program.ext) {
      ext;
    }
    nums.forEach(num => {
      let output = `${dist}/${name}_m${mode}_n${num}`;
      const options = {
        m: mode
      };

      for (const key of ['rep', 'nth', 'resize', 'size', 'alpha', 'bg', 'verbose', 'vv']) {
        if (!program[key]) {
          continue;
        }
        const optionName = optionMap[key];
        if (key === 'bg') {
          const bg = program.bg.replace(/^#/, '').toLowerCase();
          output += `_bg${bg}`;
          options[optionName] = bg;
          continue;
        }
        if (/^(rep|nth|r|s|a|bg)$/.test(optionName)) {
          output += `_${key}${program[key]}`;
        }
        options[optionName] = program[key];
      }

      output += `.${fileExt}`;
      tasks.push([filePath, output, num, options]);
    });
  });

  let promises;
  if (program.sync === undefined) {
    promises = tasks.map(t => spawnPrimitive(...t));
  } else {
    promises = [];
    for (const t of tasks) {
      await spawnPrimitive(...t);
    }
  }

  Promise.all(promises)
    .then(() => {
      process.exit(0);
    })
    .catch(err => {
      process.exit(1);
    });
}

if (require.main === module) {
  main(process.argv);
}

module.exports = main;
