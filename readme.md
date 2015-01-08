# find-npm-by-github

Windows | Mac/Linux
------- | ---------
[![Windows Build status](http://img.shields.io/appveyor/ci/finnp/find-npm-by-github.svg)](https://ci.appveyor.com/project/finnp/find-npm-by-github/branch/master) | [![Build Status](https://travis-ci.org/finnp/find-npm-by-github.svg?branch=master)](https://travis-ci.org/finnp/find-npm-by-github)

Find the npm user name of a github name.

```js
var find = require('find-npm-by-github')

find([githubtoken,] githubname, function (err, name) {
  if(err) throw(err)
  console.log(name) // likely name
})
```

It does so right now by fetching the javascript repos of the user, looking at the
`package.json` files for the module name. Going to npm to look up the collaborators
for those packages. Return the most often found collaborator.

The `githubtoken` can be crated [here](https://github.com/settings/applications) and 
allows you to not reach the rate limit that fast.

## Possibilities to improve this module:

1. Most people have the same name on npm, look this up first
2. Compare npm email to github email, if this matches we found the right person
3. Paginate through all the repos of the users in case there is no `package.json` found