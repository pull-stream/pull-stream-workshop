var tape = require('tape')
var pull = require('pull-stream')

module.exports = function (take) {

  tape('take 5 items from an infinite stream', function (t) {
    var aborted, n = 0
    pull(
      function (end, cb) {
        if(end) {
          t.ok(aborted = end, 'source stream is aborted')
          cb(end)
        }
        else cb(null, ++n)
      },
      take(5),
      pull.collect(function (err, ary) {
        if(err) throw err
        t.ok(aborted)
        t.deepEqual(ary, [1,2,3,4,5])
        t.end()
      })
    )
  })

}


