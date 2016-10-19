var tape = require('tape')
var p = require('pull-stream')

module.exports = function (pull) {

  console.error('check that pull passes the first stream to another')

  var A = function (abort, cb) {}
  var B = function (abort, cb) {}

  tape('connect the right streams', function (t) {

    var _B =
      pull(
        A,
        function (read) {
          if(read !== A)
            throw new Error('pull must pass the first stream, to the second...')
          return B
        }
      )

    if(_B !== B)
      throw new Error('pull must return the last stream')

    t.end()
  })

  tape('actually connect streams', function (t) {
    pull(
      p.values([1,2,3]),
      p.map(function (e) { return e }),
      p.collect(function (err, ary) {
        if(err) throw err
        t.deepEqual(ary, [1,2,3])
        t.end()
      })
    )

  })

}


