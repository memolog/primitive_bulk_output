#!/usr/bin/env node

import { Command, OptionValues } from 'commander';
import * as path from 'path';
import { spawnPrimitive, type primitiveOptions, type spawnPrimitiveParams } from './index.js';
import * as fs from 'fs/promises';
import imagemin from 'imagemin';
import imageminSvgo from 'imagemin-svgo';

async function executePrimitive(filePath: string, options: OptionValues) {
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

  const tasks: spawnPrimitiveParams[] = [];

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

      tasks.push({ i: filePath, o: outputs, n: num, options: opts });
    });
  });

  let promises;
  if (options.sync === undefined) {
    promises = tasks.map(t => spawnPrimitive(t));
  } else {
    promises = [];
    for (const t of tasks) {
      await spawnPrimitive(t);
    }
  }

  try {
    await Promise.all(promises);
  } catch (err) {
    process.stderr.write(err + '\n');
    process.exit(1);
  }

  if (options.optimize) {
    console.log('optimizing images...');
    await imagemin([`${dist}/*.{${formats.join(',')}}`], {
      destination: dist,
      plugins: [
        imageminSvgo({
          plugins: [{ name: 'preset-default' }]
        })
      ]
    });
  }
}

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
    .option('--sync')
    .option('--no-suffix-name')
    .option('--no-optimize');

  await program.parseAsync(args);
  const options = program.opts();
  const filePath = path.resolve(process.cwd(), options.input);

  const stats = await fs.stat(filePath);
  if (stats.isDirectory()) {
    const files = (await fs.readdir(filePath))
      .filter((file: string) => {
        const filePath = path.parse(file);
        return filePath.ext && /\.(png|gif|jpe?g)/i.test(filePath.ext);
      })
      .forEach(async (file: string) => {
        const filePath = path.resolve(process.cwd(), options.input, file);
        const { name, dir } = path.parse(file);
        // Append file name into the output directory
        if (options.dist) {
          options.dist = path.resolve(process.cwd(), options.dist, name);
        } else {
          options.dist = path.resolve(process.cwd(), dir, name);
        }
        if (!options.output && !options.suffixName) {
          options.output = name;
        }
        await executePrimitive(filePath, options);
      });
  } else {
    await executePrimitive(filePath, options);
  }
}

main(process.argv);
