var tape = require('tape')

module.exports = function (Source) {

  tape('source is correct interface', function (t) {

    t.equal(typeof Source, 'function', 'Source is a function')
    var read = Source([1,2,3])
    t.equal(typeof read, 'function', 'read is a source stream')
    t.equal(read.length, 2, 'source streams take 2 arguments')
    read(null, function (err, item) {
      t.notOk(err, 'did not cb error')
      t.equal(item, 1, 'returned first item')
      read(null, function (err, item) {
        t.notOk(err, 'did not cb error')
        t.equal(item, 2, 'returned first item')
        read(null, function (err, item) {
          t.notOk(err, 'did not cb error')
          t.equal(item, 3, 'returned first item')
          read(null, function (end, item) {
            t.equal(end, true, 'stream ended')
            t.end()
          })
        })
      })
    })
  })

}


