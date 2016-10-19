
var LS = require('./06') //load previous solution!
var Paramap = require('pull-paramap')
var pull = require('pull-stream')

var fs = require('fs')
var path = require('path')

//implement ls -l (long listing format)
function Ls_l (dir) {
  return pull(
    LS(dir),
    Paramap(function (file, cb) {
      var filename = path.join(dir, file)
      fs.stat(filename, function (err, stat) {
        if(err) return cb(err)
        stat.filename = filename
        cb(null, stat)
      })
    }, 10) //10 things in parallel
  )

}

pull(
  Ls_l(process.argv[2]),
  pull.log()
)

