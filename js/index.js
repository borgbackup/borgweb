var $ = require('jquery')
var env = require('./src/env')
var borg = require('./src/borg')
var util = require('./src/util')
var log = require('./src/util').log
var logViewer = require('./src/logViewer')

/**
  ~~ UI callables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  All globally available variables should be declared here.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
window.startBackup = borg.startBackup
window.switchToLog = logViewer.switchToLog
window.nextPage = logViewer.nextPage
window.previousPage = logViewer.previousPage
window.firstPage = logViewer.firstPage

/**
  ~~ Site init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
logViewer.updateLogFileList()
logViewer.render()

/**
  ~~ Event listeners ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
$(window).resize(function () {
  if (Date.now() - env['lastRendering'] >= env['reRenderCoolDown']) {
    log('Re-rendering')
    env['lastRendering'] = Date.now()
    setTimeout(logViewer.render, env['reRenderCoolDown'] / 2) } })
