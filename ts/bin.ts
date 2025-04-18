#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { spawnPrimitive, type primitiveOptions } from './index.js';
import * as fs from 'fs/promises';

export default async function main(args) {
  const program = new Command();

  program
    .option('-i, --input <file>')
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
    .option('-f, --format <string>')
    .option('-d, --dist <dist>')
    .option('--fname <string>')
    .option('--sync');

  await program.parseAsync(args);
  const options = program.opts();
  const filePath = path.resolve(process.cwd(), options.input);

  let dist;
  if (options.dist) {
    dist = path.resolve(process.cwd(), options.dist);
  } else if (options.output) {
    const output = path.parse(options.output);
    dist = path.resolve(process.cwd(), output.dir);
  } else {
    dist = path.parse(filePath).dir;
  }

  let outputModes;
  if (options.mode) {
    outputModes = options.mode.split(',');
  } else {
    outputModes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  let nums;
  if (options.num) {
    nums = options.num.split(',');
  } else {
    nums = ['300'];
  }

  let { name, ext } = path.parse(filePath);
  name = options.fname || name;
  if (options.output) {
    const output = path.parse(options.output);
    name = output.name;
    ext = output.ext;
  }

  const formats = (options.format || ext).replace(/^\./, '').split(',');

  const tasks: Parameters<typeof spawnPrimitive>[] = [];

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

  try {
    await fs.mkdir(dist, { recursive: true });
  } catch (err) {
    process.stderr.write(err + '\n');
    process.exit(1);
  }

  outputModes.forEach(mode => {
    nums.forEach(num => {
      let output = `${dist}/${name}_m${mode}_n${num}`;

      const opts: primitiveOptions = {
        m: mode
      };

      for (const key of ['rep', 'nth', 'resize', 'size', 'alpha', 'bg', 'verbose', 'vv']) {
        if (!options[key]) {
          continue;
        }
        const optionName = optionMap[key];
        if (key === 'bg') {
          const bg = options.bg.replace(/^#/, '').toLowerCase();
          output += `_bg${bg}`;
          opts[optionName] = bg;
          continue;
        }
        if (/^(rep|nth|r|s|a|bg)$/.test(optionName)) {
          output += `_${key}${options[key]}`;
        }
        opts[optionName] = options[key];
      }

      const outputs = [];
      formats.forEach(format => {
        let o = output;
        o += `.${format}`;
        // Override output file path
        if (options.output) {
          o = `${dist}/${name}.${format}`;
        }
        outputs.push(o);
      });

      tasks.push([filePath, outputs, num, opts]);
    });
  });

  let promises;
  if (options.sync === undefined) {
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

main(process.argv);
