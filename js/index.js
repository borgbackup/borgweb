var $ = require('jquery')
var env = require('./src/env')
var borg = require('./src/borg')
var util = require('./src/util')
var log = require('./src/util').log
var logViewer = require('./src/logViewer')

/**
  ~~ UI callables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
window.startBackup = borg.startBackup
window.switchToLog = logViewer.switchToLog
window.nextPage = logViewer.nextPage
window.previousPage = logViewer.previousPage

/**
  ~~ Site init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/


logViewer.updateLogFileList()
logViewer.render()


$(window).resize(function () { log('Windows resized') })
