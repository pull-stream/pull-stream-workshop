
module.exports = function () {
  var args = [].slice.call(arguments)

  var stream = args.shift()
  while(args.length)
    stream = args.shift()(stream)

  return stream
}


if(!module.parent)
  require('../helpers/pull')(module.exports)
