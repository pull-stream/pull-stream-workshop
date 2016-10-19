
var File = require('pull-file')
var pull = require('pull-stream')
var toPull = require('stream-to-pull-stream')

// easy!

pull(
  File(process.argv[2], {live: true, encoding: 'utf8'}),
  toPull.sink(process.stdout)
)
