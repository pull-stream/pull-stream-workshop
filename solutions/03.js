
module.exports = function (map) {
  return function (read) {
    return function (abort, cb) {
      read(abort, function (end, data) {
        if(end) return cb(end)
        else cb(null, map(data))
      })
    }
  }
}

if(!module.parent)
  require('../helpers/map')(module.exports)
