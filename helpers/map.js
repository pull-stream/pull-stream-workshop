var tape = require('tape')
var pull = require('pull-stream')

module.exports = function (mapper) {

  tape('mapper returns source stream', function (t) {
    if(typeof mapper !== 'function')
      throw new Error('mapper should be a function')

    var map = mapper(function (e) { return e * -1 })

    t.equal(typeof mapper, 'function', 'map returns a sink stream')
    t.equal(map.length, 1, 'mapper returns a sink stream - 1 arg')

    var source = function (abort, cb) {}
    var sink = map(source)
    t.equal(sink.length, 2, 'when given a source, mapper returns a sink')

    t.end()
  })

  tape('pull through', function (t) {
    var map = mapper(function (e) { return e * -1 })
    pull(
      pull.values([1,2,3]),
      map,
      pull.collect(function (err, ary) {
        t.notOk(err, 'should not error')
        if(err) throw err
        t.deepEqual(ary, [-1,-2,-3])
        t.end()
      })
    )
  })
}

