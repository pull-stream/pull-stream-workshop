var toPull = require('stream-to-pull-stream')
var Split = require('pull-split')
var pull = require('pull-stream')

pull(
  toPull.source(process.stdin),
  Split(),
  pull.reduce(function (acc, line) {
    //ignore empty lines
    return line ? acc + 1 : acc
  }, 0, function (err, acc) {
    console.log(acc)
  })
)
