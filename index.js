var headers =  {"user-agent": "find-npm-by-github module"}
var request = require('request').defaults({json: true, headers: headers})
var parallel = require('run-parallel')
var api = 'https://api.github.com/'

module.exports = function (token, githubname, cb) {
  if(arguments.length === 2) {
    cb = githubname
    githubname = token
    token = false
  }
  if(token) headers['Authorization'] = 'token ' + token
  // no pagination yet, hopefully one request would be enough
  request(api + 'users/' + githubname + '/repos?type=owner', function (err, res, body) {
    if(err) return cb(err)
    if(body.message) return cb(new Error(body.message))
    var moduleInfos = body
                    .filter(function (repo) {
                      return !repo.fork && repo.language == 'JavaScript'
                    })
                    .map(function (repo) {
                      return 'https://raw.githubusercontent.com/' + repo.full_name + 
                          '/' + repo.default_branch + '/package.json'
                    })
                    .map(function (url) {
                      return function (cb) {
                        request(url, function (err, res, pkg) {
                          if(err || !pkg.name) return cb() // skip
                          request('http://registry.npmjs.org/' + pkg.name, function (err, res, modu) {
                            cb(null, modu)
                          })
                        })
                      }
                    })
    
    parallel(moduleInfos, function (err, packages) {
      var candidates = {}
      if(packages.length === 0) return cb(new Error('No packages for this user'))
      packages
        .filter(function (pkg) {
          return !!pkg && pkg.maintainers && pkg.maintainers.length > 0
        })
        .map(function (pkg) {
          return pkg.maintainers
        })
        .forEach(function (maintainers) {
          maintainers.forEach(function (maintainer) {
            if(candidates[maintainer.name])
              candidates[maintainer.name]++
            else
              candidates[maintainer.name] = 1
          })
        })
      cb(null, Object.keys(candidates)
        .sort(function(a,b) { return candidates[a] - candidates[b] })
        .pop()
      )
    })
    
    // default_branch? instead of master
    //
  })
}