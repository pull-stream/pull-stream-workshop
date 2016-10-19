
var tape = require('tape')
var pull = require('pull-stream')

module.exports = function (Log) {
  tape('log sink is correct inteface', function (t) {
    t.equal(typeof Log, 'function', 'log is a function')
    var ended = false
    var sink = Log(function () {
      t.ok(ended)
      t.end()
    })
    t.equal(typeof sink, 'function', 'log() returns a sink stream')
    t.equal(sink.length, 1, 'sink has a single argument')
    //test sink with a function that aborts immediately.
    sink(function (abort, cb) {
      t.equal(typeof cb, 'function', 'sink is called with a cb function')
      cb(ended = true)
    })
  })

  tape('sink source function', function (t) {
    var n = 0
    pull(
      pull.values([1,2,3]),
      pull.through(function (d) {
        n++
      }),
      Log(function (err) {
        t.equal(n, 3)
        t.end()
      })
    )

  })

  tape('waits for async call', function (t) {
    var n = 0, async = false
    pull(
      function (abort, cb) {
        if(async) throw new Error('did not wait until after read called back')
        async = true
        setTimeout(function () {
          async = false
          if(abort) cb(abort)
          else if(++n>3) cb(true)
          else cb(null, n)
        }, 10)
      },
      Log(function (err) {
        t.equal(n, 4)
        t.end()
      })
    )


  })

}




