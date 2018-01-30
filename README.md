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
