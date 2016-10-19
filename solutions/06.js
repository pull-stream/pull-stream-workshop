var defer = require('pull-defer')
var pull = require('pull-stream')
var fs = require('fs')

module.exports = function ls (dir) {

  var source = defer.source()

  fs.readdir(dir, function (err, ls) {

    if(err) source.resolve(pull.error(err))
    else source.resolve(pull.values(ls))

  })

  return source

}

if(!module.parent) {
  pull(
    module.exports(process.argv[2]),
    pull.log()
  )
}
