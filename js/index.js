var $ = require('jquery')
var env = require('./src/env')
var borg = require('./src/borg')
var util = require('./src/util')
var log = require('./src/util').log
var logViewer = require('./src/logViewer')

/**
  ~~ UI callables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
window.showLog = function (id, offset, lines) { log(id, offset, lines) }
window.startBackup = borg.startBackup
window.nextPage = logViewer.nextPage
window.previousPage = logViewer.previousPage

/**
  ~~ Site init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
env['shownLog']['lines'] = util.determineLineCount()
$(window).resize(function () { log('Windows resized')
  env['shownLog']['lines'] = util.determineLineCount()
  log('New line count: ' + env['shownLog']['lines']) })
$.getJSON('logs', logViewer.updateLogFileList)
logViewer.showLog()

