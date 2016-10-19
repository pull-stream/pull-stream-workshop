

module.exports = function (array) {
  var i = 0
  return function (abort, cb) {
    if(abort)
      cb(abort)
    else if(i >= array.length)
      cb(true)
    else
      cb(null, array[i++])
  }

}

