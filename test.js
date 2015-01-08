var find = require('./')
var parallel = require('run-parallel')
var assert = require('assert')
var ok = require('okdone')

var testUsers = [
  {npm: 'maxogden', gh: 'maxogden'},
  {npm: 'finnpauls', gh: 'finnp'},
  {npm: 'mafintosh', gh: 'mafintosh'},
  {npm: 'sayanee', gh: 'sayanee'},
  {npm: 'prezjordan', gh: 'jdan'}
]

var tests = testUsers
  .map(function (testUser) {
    return function (cb) {
      find(testUser.gh, cb)
    }
  })

parallel(tests, function (err, users) {
  assert.ifError(err)
  ok('no error')
  users.forEach(function (user, i) {
    assert.equal(user, testUsers[i].npm)
    ok(testUsers[i].npm)
  })
  
  find('dat-irc-bot', function (err, user) {
    assert.ok(err)
    ok('no packages for this user')
    ok.done()
  })
  
})