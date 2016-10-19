var Split = require('pull-split')
var File = require('pull-file')
var toPull = require('stream-to-pull-stream')

var pull = require('pull-stream')
var Group = require('pull-group')

function Next () {
  var ended
  var read_stdin = toPull.source(process.stdin)

  return function (read) {
    return function (abort, cb) {
      read_stdin(null, function () {
        read(abort, function (end, data) {
          if(end)
            read_stdin(true, function () {
              cb(end, data)
            })
          else
            cb(end, data)
        })
      })
    }
  }
}



function Page (lines) {
  return pull(
    Split(),
    Group(40),
    pull.map(function (e) {
      return e.join('\n')
    }),
    Next()
  )
}


pull(
  File(process.argv[2]),
  Page(40),
  toPull.sink(process.stdout)
)








