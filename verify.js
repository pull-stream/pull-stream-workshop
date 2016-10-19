var path = require('path')
var tests = [
  require('./helpers/sink'),
  require('./helpers/source'),
  require('./helpers/map'),
  require('./helpers/pull'),
  require('./helpers/take')
]

if(process.argv.length !== 4) {
  console.error('usage: verify.js [1-5] script.js')
  process.exit(1)
}

var i = +process.argv[2] - 1

if(isNaN(i)) throw new Error('first argument must be integer, 1 - 5')
if(!tests[i])
  throw new Error('there are no tests for that exercise, expected')

var test = tests[i]
console.log('', i, test)
console.log(path.resolve(process.argv[3]))
test(require(path.resolve(process.argv[3])))
