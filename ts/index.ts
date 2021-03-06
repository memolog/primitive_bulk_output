const childProcess = require('child_process');

interface primitiveOptions {
  m: string;
  rep: number;
  nth: number;
  r: number;
  s: number;
  a: number;
  bg: string;
  j: number;
  v: string;
  vv: string;
}

module.exports = function spawnPrimitive(
  i: string,
  o: string | string[],
  n: number,
  options: primitiveOptions
): Promise<void> {
  return new Promise<void>((fulfill, reject) => {
    const args = [];
    if (!i || !o || !n) {
      throw new Error('Input, Output, number of shapes paramters are required');
    }

    args.push('-i', i);
    if (typeof o === 'string') {
      args.push('-o', o);
    } else {
      o.forEach(output => args.push('-o', output));
    }
    args.push('-n', n);
    for (const key in options) {
      args.push('-' + key, options[key]);
    }

    const logStr = `primitive ${args.join(' ')}`;
    console.log(logStr);

    const cp = childProcess.spawn('primitive', args);

    cp.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });

    cp.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
      reject(data);
    });

    cp.on('close', code => {
      console.log(`Finished: ${logStr}`);
      fulfill();
    });
  });
};
