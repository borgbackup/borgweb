var gulp = require('gulp')
var log = require('gulp-util').log
var lib = require('./gulpfile.lib.js')

var srcPth = './'
var src = srcPth + 'index.js'
var bndlPth = '../borgweb/static/'
var bndl =  bndlPth + 'bundle.js'
var buildID = 1

var newBuildLog = function () {
  log("Build # " + lib.log (buildID++, 1)
  + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
}

gulp.task ('watch', function () {
  newBuildLog()
  lib.generateBundle(src, bndl, true)
    
  gulp.watch([src, srcPth + 'src/**/*.js'], function (f) {
    if (f.type == 'changed') {
      newBuildLog()
      log("Changed: " + f.path)
      var ret = lib.generateBundle(src, bndl)
      return ret
    }
  })
})
