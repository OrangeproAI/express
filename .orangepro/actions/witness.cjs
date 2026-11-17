'use strict'
// Witness for the A2 oracle on res.cookie (written by the host agent, assisted; approved with the oracle).
// Runs inside the container with the checkout as the working folder. One request, one input:
// res.cookie('name', 'tobi', { maxAge: 1500 }). Prints one JSON line with only what the oracle is
// about: the Max-Age value and whether an Expires date is present. No clock values are printed,
// so the original and the faulty copy can be compared byte for byte.
var express = require(process.cwd())
var http = require('http')

var app = express()
app.get('/', function (req, res) {
  res.cookie('name', 'tobi', { maxAge: 1500 })
  res.end()
})

var server = app.listen(0, '127.0.0.1', function () {
  http.get({ host: '127.0.0.1', port: server.address().port, path: '/' }, function (res) {
    var header = (res.headers['set-cookie'] || [])[0] || ''
    var maxAge = /(?:^|;\s*)Max-Age=([^;]*)/.exec(header)
    process.stdout.write(JSON.stringify({ max_age: maxAge ? maxAge[1] : null, has_expires: /(?:^|;\s*)Expires=/.test(header) }) + '\n')
    res.resume()
    server.close()
  })
})
