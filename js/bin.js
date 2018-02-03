#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var program = require('commander');
var path = require('path');
var pkg = require('../package.json');
var spawnPrimitive = require('./index');
var mkdirp = require('mkdirp');
function main(args) {
    var _this = this;
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
        .option('-f, --format <string>')
        .option('-d, --dist <dist>')
        .option('--fname <string>')
        .option('--sync')
        .parse(args);
    var filePath = path.resolve(process.cwd(), program.input);
    var dist;
    if (program.dist) {
        dist = path.resolve(process.cwd(), program.dist);
    }
    else if (program.output) {
        var output = path.parse(program.output);
        dist = path.resolve(process.cwd(), output.dir);
    }
    else {
        dist = path.parse(filePath).dir;
    }
    var outputModes;
    if (program.mode) {
        outputModes = program.mode.split(',');
    }
    else {
        outputModes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    }
    var nums;
    if (program.num) {
        nums = program.num.split(',');
    }
    else {
        nums = ['300'];
    }
    var _a = path.parse(filePath), name = _a.name, ext = _a.ext;
    name = program.fname || name;
    if (program.output) {
        var output = path.parse(program.output);
        name = output.name;
        ext = output.ext;
    }
    var formats = (program.format || ext).replace(/^\./, '').split(',');
    var tasks = [];
    var optionMap = {
        rep: 'rep',
        nth: 'nth',
        resize: 'r',
        size: 's',
        alpha: 'a',
        bg: 'bg',
        verbose: 'v',
        vv: 'vv'
    };
    mkdirp(dist, function (err) { return __awaiter(_this, void 0, void 0, function () {
        var promises, _i, tasks_1, t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        process.stderr.write(err + '\n');
                        process.exit(1);
                    }
                    outputModes.forEach(function (mode) {
                        nums.forEach(function (num) {
                            var output = dist + "/" + name + "_m" + mode + "_n" + num;
                            var options = {
                                m: mode
                            };
                            for (var _i = 0, _a = ['rep', 'nth', 'resize', 'size', 'alpha', 'bg', 'verbose', 'vv']; _i < _a.length; _i++) {
                                var key = _a[_i];
                                if (!program[key]) {
                                    continue;
                                }
                                var optionName = optionMap[key];
                                if (key === 'bg') {
                                    var bg = program.bg.replace(/^#/, '').toLowerCase();
                                    output += "_bg" + bg;
                                    options[optionName] = bg;
                                    continue;
                                }
                                if (/^(rep|nth|r|s|a|bg)$/.test(optionName)) {
                                    output += "_" + key + program[key];
                                }
                                options[optionName] = program[key];
                            }
                            var outputs = [];
                            formats.forEach(function (format) {
                                var o = output;
                                o += "." + format;
                                if (program.output) {
                                    o = dist + "/" + name + "." + format;
                                }
                                outputs.push(o);
                            });
                            tasks.push([filePath, outputs, num, options]);
                        });
                    });
                    if (!(program.sync === undefined)) return [3, 1];
                    promises = tasks.map(function (t) { return spawnPrimitive.apply(void 0, t); });
                    return [3, 5];
                case 1:
                    promises = [];
                    _i = 0, tasks_1 = tasks;
                    _a.label = 2;
                case 2:
                    if (!(_i < tasks_1.length)) return [3, 5];
                    t = tasks_1[_i];
                    return [4, spawnPrimitive.apply(void 0, t)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5:
                    Promise.all(promises)
                        .then(function () {
                        process.exit(0);
                    })
                        .catch(function (err) {
                        process.exit(1);
                    });
                    return [2];
            }
        });
    }); });
}
if (require.main === module) {
    main(process.argv);
}
module.exports = main;
