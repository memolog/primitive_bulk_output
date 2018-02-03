# Bulk output of primitive images

Simple wrapper module of [primitive](https://github.com/fogleman/primitive)

## Prequisite

### Go

primitive works on Go lang, so you have to install Go before installing primitive

You can install with [Homebrew](https://brew.sh)

```
brew update
brew install go
```

### Primitive

[primitive](https://github.com/fogleman/primitive)

```
go get -u github.com/fogleman/primitive
```

Primitive would be installed your $GOPATH directory, which is under the your home directory as a default.

You might need add PATH in your .bash_profile (something like that), like the following

```
export PATH=$PATH:/Users/USERNAME/go/bin
```

## Install

```
npm install primitive_bulk -g
```

## Usage

```
primitive_bulk -i sample.jpg
```

As a default, this tool generate all mode (0 to 8) primitive images **_concurrently_**. It's faster but might be a heavy process for your machine.

If you want to generate them one by one, pass `--sync` option

```
primitive_bulk -i sample.jpg --sync
```

The output files are the following in the same directory

* sample_m0_n300.jpg
* sample_m1_n300.jpg
* sample_m2_n300.jpg
* sample_m3_n300.jpg
* sample_m4_n300.jpg
* sample_m5_n300.jpg
* sample_m6_n300.jpg
* sample_m7_n300.jpg
* sample_m8_n300.jpg

### Options

* --format: You can set output format like `svg`, `png`, `jpg`, `gif`. The details of output format support, see [Primitive](https://github.com/fogleman/primitive#output-formats). You can set multiple fomarts like `--format svg,jpg`.
* -d, --dist <dist>: the directory to distribute the output images. If the directory is not existed, make it automatically.
* --fname: enable to change the output file name like the following: `${name}_m6_n300.jpg`
* --output: pass primitive CLI as an output path. **_if you want to generate multiple images, don't use this option. otherwise generate images to the same file name (overriden)_**

The other options are passed to primitive CLI, so please referer to [Primitive](https://github.com/fogleman/primitive#command-line-usage) Usage.

```
  Usage: bin [options]


  Options:

    -V, --version           output the version number
    -i, --input <file
    -o, --output <file>
    -n, --num <string>
    -m, --mode <string>
    --rep <number>
    --nth <number>
    -r, --resize <number>
    -s, --size <number>
    -a, --alpha <number>
    --bg <string>
    -v, --verbose <string>
    --vv <string>
    -e, --ext <string>
    -d, --dist <dist>
    --sync
    -h, --help              output usage information
```
