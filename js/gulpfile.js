var gulp = require('gulp')
var log = require('gulp-util').log
var lib = require('./gulpfile.lib.js')
var browserSync = require('browser-sync').create()

var files = {
  js: './index.js',
  jsBndl: '../borgweb/static/bundle.js',
  css: '../borgweb/static/style.css',
  cssBndl: '../borgweb/static/bundle.css'
}
var buildID = 1
var newBuildLog = function () {
  log("Build # " + lib.log (buildID++, 1)
  + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~") }

gulp.task ('watch', function () {
  newBuildLog(); browserSync.init({ proxy: 'localhost:5000', open: false })
  lib.generateBundle(files.js, files.jsBndl, true)
    
  gulp.watch([files.js, 'src/**/*.js'], function (ev) {
    if (ev.type == 'changed') {
      newBuildLog()
      log("Changed: " + ev.path)
      var ret = lib.generateBundle(files.js, files.jsBndl)
      setTimeout(function () { browserSync.reload() }, 150) // todo
      return ret
    }
  })
})
