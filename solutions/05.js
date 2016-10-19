
module.exports = function (n) {
  return function (read) {
    return function (abort, cb) {
      //once we have read n items, abort the stream!
      read(n-- ? abort : true, cb)
    }
  }
}

//is your source stream compatible with abort?


if(!module.parent)
  require('../helpers/take')(module.exports)
