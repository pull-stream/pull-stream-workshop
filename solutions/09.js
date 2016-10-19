
var pull = require('pull-stream')
var Split = require('pull-split')
var toPull = require('stream-to-pull-stream')

var pattern = new RegExp(process.argv[2])

pull(
  toPull.source(process.stdin),
  Split(),
  pull.filter(function (line) {
    return pattern.exec(line)
  }),
  pull.log()
)
