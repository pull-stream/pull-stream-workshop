var source = require('./source')

module.exports = function (n) {
  return source(function (abort, cb) {
    if(abort) cb(abort)
    else if(Math.random() < 0.1)
      cb(true)
    else cb(null, Math.random())
  })
}

