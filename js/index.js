var $ = require('jquery')
var env = require('./src/env')
var backup = require('./src/backup')
var util = require('./src/util')
var log = require('./src/util').log
var logViewer = require('./src/logViewer')
var i18n = require('./src/i18n')

/**
  ~~ UI callables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  All globally available variables should be declared here.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
window.startBackup = backup.startBackup
window.switchToLog = logViewer.switchToLog
window.nextPage = logViewer.nextPage
window.previousPage = logViewer.previousPage
window.firstPage = logViewer.firstPage
window.lastPage = logViewer.lastPage

/**
  ~~ Site init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
logViewer.updateLogFileList()
logViewer.render()
i18n.translate()

/**
  ~~ Event listeners ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
$(window).resize(function () {
  if (Date.now() - env['lastRendering'] >= env['reRenderCoolDown']) {
    log('Re-rendering')
    env['lastRendering'] = Date.now()
    setTimeout(logViewer.render, env['reRenderCoolDown'] / 2) } })
