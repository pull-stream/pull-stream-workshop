
module.exports = function (cb) {
  return function (read) {
    read(null, function more (end, data) {
      if(end) return cb()
      console.log(data)
      read(null, more)
    })
  }
}

//to test: node verify.js 1 solutions/01.js
if(!module.parent)
  module.exports(require('../helpers/random')())
