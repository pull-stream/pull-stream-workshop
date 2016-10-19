
var File = require('pull-file')
var Cat = require('pull-cat')
var toPull = require('stream-to-pull-stream')
var pull = require('pull-stream')

pull(
  Cat(process.argv.slice(2).map(File)),
  toPull.sink(process.stdout)
)
