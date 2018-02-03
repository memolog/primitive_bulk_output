var childProcess = require('child_process');
module.exports = function spawnPrimitive(i, o, n, options) {
    return new Promise(function (fulfill, reject) {
        var args = [];
        if (!i || !o || !n) {
            throw new Error('Input, Output, number of shapes paramters are required');
        }
        args.push('-i', i);
        if (typeof o === 'string') {
            args.push('-o', o);
        }
        else {
            o.forEach(function (output) { return args.push('-o', output); });
        }
        args.push('-n', n);
        for (var key in options) {
            args.push('-' + key, options[key]);
        }
        var logStr = "primitive " + args.join(' ');
        console.log(logStr);
        var cp = childProcess.spawn('primitive', args);
        cp.stdout.on('data', function (data) {
            console.log("stdout: " + data);
        });
        cp.stderr.on('data', function (data) {
            console.log("stderr: " + data);
            reject(data);
        });
        cp.on('close', function (code) {
            console.log("Finished: " + logStr);
            fulfill();
        });
    });
};
