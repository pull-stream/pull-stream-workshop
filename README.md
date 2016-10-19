# pull-stream-worshop

`pull-streams` are a simple streaming pattern.
You do not need to depend on a module to create a pull-stream,
you just use functions in a certian way.

pull-stream can do everything node streams can do, but they also
propogate errors, and tidy themselves up after use.
Node streams don't even do that!

This workshop will first take you through the basic internals of pull-streams,
you'll implement the main patterns in just a few lines.
The official pull-stream module uses a few more to optimize, but not many more.

Part 2 is a walk around the pull-stream ecosystem. We'll demonstrate some of the most useful
pull-stream modules, to recreate some familiar UNIX tools, such as `ls`, `wc`, `grep`, `tail -f` and `less`

Part 1 is probably more challenging, and because it needs to be exactly right, there are tests
to check your implementation is correct.
To run a test, run `node verify {exercise_number} {your_script.js}`

There are no tests provided by Part 2, but you should run it them on your
local file system and see what they do.


## contents

### part 1 - introduction

* sink stream to console.log

* source stream of an array

* map stream

* pull (combine pull-streams)

* take N elements from infinite source

### part 2 - unix

* ls (pull-defer)

* ls -l (..., pull-paramap

* wc (stream-to-pull-stream, pull-split, pull.reduce)

* grep (pull-file, pull.filter)

* cat (pull-cat)

* tail -f (pull-file)

* less (pull-group)

### part 3 - challenges

the following section is

* trees: pull-traverse (recursively read all node_modules folders and output the current version)

* fan in: pull-many (take many streams and read from each of them in parallel, as fast as possible)

* fan out: split one stream into many, and read as fast as the slowest stream.

* multiplexing: create a stream that multiplexes multiple streams through a single duplex stream.

## part 1

### exercise 1 - a logging sink

A pull-stream is just an async function that is called repeatedly,
until it says "stop!".

Write a function that is takes a callback,
and returns a function that is passed a `read` function,
and then calls it with a callback `cb(end, data)`.
and if `end` is truthy then stop.

Otherwise,
print out `data` with `console.log(data)`,
and then read again.

(`cb` must be in the second position.
The first argument is `abort`
but we will come back to that later.)

to get a pull stream, use `helpers/random.js`

you can start with this code:

``` js

module.exports = function (cb) {
  returnfunction (read) {
    //your pull-stream reader...
    read(null, function cb (err, data) {
      ...

    })
  }
}
```

to test, run `node verify 1 exercise01.js`

Congratulations, you have just written a pull-stream sink!

---


### exercise 2 - source an array

a stream is like an array in time.
write a function that takes an array,
and returns an async function named `read` that callsback each item in the array in turn.

``` js
module.exports = function (array) {
  return function read (abort, cb) {
    // read the next item
  }
}

```

#### rules

1. the `read` function must take two arguments. `abort` and `cb`.
   you can ignore abort for now, but we will come back to it.

2. when there is no more data, callback `cb(true)` to indicate the end of the stream.

when all the items are read, cb(true) to indicate the end of the stream.

to run test `node verify.fs 2 exercise02.js`

---

transform streams represent _throughput_.

a transform stream takes a source, and returns a sink.

### exersice 3 - map a source stream

implement a stream that takes a map function,

a sink stream is a function that takes a source stream and calls it.

``` js
function sink (read) {
  ...
}
```

a source stream is an async function to be called repeatedly.


``` js
function source (abort, cb) {
  ...
}
```

a _through_ stream is a sink stream that returns a source stream.


``` js
function sink (read) {
  return function source (abort, cb) {
    ...
  }
}
```

Implement a through stream that takes a map function, and applies it to the source stream...

``` js
module.exports = function (map) {
  return function (read) {
    return function (abort, cb) {
      ...
    }
  }
}
```

---

### exercise 4 - pull it all together.

a sink takes a source, you can just pass it directly.

`sink(source)` and that is a valid way to connect a pull-stream.

a map returns a source too, so you can connect a pipeline like that.

`sink(map(source))` but that reads right to left, and we are used to left to write.

implement a function, `pull()` that takes streams, and passes one to another.

`pull(source, map, sink)`


``` js
module.exports = function pull () {
  var args = [].slice.call(arguments)
  ...
}
```

to test, run `node verify.js 4 exercise04.js`

---

### exercise 5 - take some items from a stream and then stop.

sometimes we don't want to read the entire stream.

when calling a source stream, the first argument is called `abort`.
If that argument is true, it tells the stream to end.

write a through stream that reads N items, then calls `read(true, cb)` instead, terminating the stream.

``` js
module.exports = function (n) {
  return function (read) {
    return function (abort, cb) {
      //how many times called?
      read(abort, cb)
    }
  }
}
```

to test `node verify.js 5 exercise05.js`

this allows us to read from infinite streams!

---

## part 2 - unix tools

### exercise 6 - ls

`ls` lists a directory. given a directory, it outputs the files in that directory.

use node's fs module to read create a stream of filenames in a directory.

create a function that returns a pull-stream:

``` js
var pull = require('pull-stream')

pull(
  LS(dir),
  pull.log()
)

```

use `fs.readdir` to read a directory (which takes a callback)
but we also want to return a stream immediately. How to do this?
one way is to use [pull-defer](https://www.npmjs.com/package/pull-defer)

also see solution in solutions/06.js

---

### exercise 7 - list directory, long output.

the `ls -l` option outputs extra information about files.
this comes from the `fs.stat` system call.

we want to do lots of async calls to `fs.stat` so lets do them in parallel.
How do we do that? well, the answer to any pull-stream question is: there is a module for that!

[pull-paramap](https://npm.im/pull-paramap)

also see solution in solutions/07.js

### exercise 8 - word count

the `wc` command counts characters, words, and lines in an input stream.

split the input stream into lines, and then count them. (you'll need [pull-split](https://www.npmjs.com/package/pull-split))
output the total number of lines. (for extra points, also output characters and words)

to convert standard input into a pull-stream, use [stream-to-pull-stream](https://www.npmjs.com/package/stream-to-pull-stream)

``` js
var toPull = require('stream-to-pull-stream')
var pull = require('pull-stream')

pull(
  toPull.source(process.stdin),
  //your wc implementation
)
```

---

### exercise 9 - grep

`grep` _filters_ lines that patch patterns inside streams.

take a string or regular expression as the first argument, read stdin an output lines
that match the pattern.

```
SOURCE | node 09.js PATTERN
```
where `SOURCE` is a stream, i.e. `cat {file}` or the output of another streaming program.

also see solution is solutions/09.js

---

### exercise 10 - concatenating streams

the `cat` command takes multiple input streams and concatenates them into a single stream.

`cat foo.txt bar.js baz.html` should concatenate those files. read each input with [pull-file](https://npm.im/pull-file),
and output a stream that is all of each stream in sequence.

hint: there is a pull-stream module that implements cat, but for a learning challenge,
you may implement it yourself!

---

### exercise 11 - real time streams with `tail -f`

with `tail -f` you can appends to an open file as they come.

```
> tail -f log
...
```

then in another terminal:

``` 
> date >> log
> date >> log
> date >> log
```
and see the date show up in the terminal in which `tail -f log` is running in.

implement `tail -f` a pull-stream using [pull-file](https://www.npmjs.com/package/pull-file)


---

### exercise 12 - human powered back pressure

`more` is a "pager". taking a long input file, it displays one page worth at a time,
and no more until the next user input. so a human is able to read it.
`more` is a way to get less data, it provides "back pressure".

create a pull-stream that reads standard input, and outputs one page and no more,
until the user presses a key (hint: read data on process.stdin)

``` js
pull(
  File(process.argv[2]),
  //Read a N line page and output it when user reads more.
  Page(40),
  toPull.sink(process.stdout)
)
```

## part 3 - extra challenges

### exercise 13 - traversing trees

take your code for exercise 7, and extend it to read directories recursively.
if a file is a node_modules directory, it should expand it, and stream inside of it.

there are different ways you can traverse a tree, choose the way that seems most appropiate!

see also [pull-traverse](https://npm.im/pull-traverse) and [pull-glob](https://npm.im/pull-glob)

---

### exercise 14 - fan in - read from many streams

take an array of pull-streams, and read them into one stream.
read the streams as fast as possible, but you must still respect back pressure.
if the sink stops, you must wait, but if they are reading, give them the fastest stream that responds.

also see [pull-many](https://npm.im/pull-many)

---

### exercise 15 - fan out - split one stream out to many

the opposite of exercise 14, make one stream that expands out.

write an essay about what makes this more difficult to implement,
and are there situations where you genuinely need this?

should a fan out stream go as fast as the slowest stream, or as fast as the fastest stream?

If you read as the fastest stream, what happens to the data the slower stream was waiting for?

---

### exercise 16 - multiplexing

pull-stream all the things! pull-streams are great! make all your apis pull-streams.
but does that mean you need one connection per pull-stream? no, use multiplexing!

[muxrpc](https://npm.im/muxrpc) allows you to expose many pull-stream apis over one tcp or web socket connection.

but there is one problem, to my shame I got stumped when I tried to implement correct back pressure on it.

Solve the problem of multiplexed back pressure and make a pull request to muxrpc.

if you complete this exercise, you get an instant A, and are not required to complete the other tasks

## License

MIT




