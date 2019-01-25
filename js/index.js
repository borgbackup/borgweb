var $ = require('jquery')
var backup = require('./src/backup')
var env = require('./src/env')
var i18n = require('./src/i18n')
var log = require('./src/util').log
var viewer = require('./src/viewer')

/**
  ~~ UI callables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  All globally available variables should be declared here.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
window.startBackup = backup.startBackup
window.switchToLog = viewer.switchToLog
window.getLogFiles = viewer.getLogFiles
window.nextPage = viewer.nextPage
window.previousPage = viewer.previousPage
window.firstPage = viewer.firstPage
window.lastPage = viewer.lastPage

/**
  ~~ Site init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
viewer.updateRepoList()
i18n.translate()

/**
  ~~ Event listeners ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
$(window).resize(function () {
  if (Date.now() - env['lastRendering'] >= env['reRenderCoolDown']) {
    log('Re-rendering')
    env['lastRendering'] = Date.now()
    setTimeout(viewer.render, env['reRenderCoolDown'] / 2)
  }
})
