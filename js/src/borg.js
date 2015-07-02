var $ = require('jquery')
var env = require('./env')
var util = require('./util')
var logViewer = require('./logViewer')

/**
  ~~ BorgBackup interaction ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var ex = {}

ex.noBackupRunning = function (callback) {
  $.getJSON('backup/status', function (resp) {
    var backupRunning = resp.rc === null
    if (backupRunning) util.log("▶ Backup in progress")
    else util.log("✖ No backup in progress")
    callback(!backupRunning)
  })
}

ex.pollBackupStatus = function (endpoint, ms, callback) {
  ex.noBackupRunning(function (notRunning) {
    if (notRunning) {
      $('.navbar button[type=submit]').toggleClass('btn-success')
      $('.navbar button[type=submit]').toggleClass('btn-warning')
      $('.navbar button[type=submit]').text("▶ Start Backup")
      $.getJSON('logs', logViewer.updateLogFileList)
    } else {
      util.log("Polling backup status")
      $.getJSON('backup/status', callback)
      setTimeout(function () { ex.pollBackupStatus(endpoint, ms, callback) }, ms)
    }
  })
}

ex.stopBackup = function () {
  util.log("Terminating (eventually killing) the backup process")
  $.post('backup/stop', {}, function (res) {
    util.log("Message: '" + res.msg + "', RC: '" + res.rc + "'") })
}

ex.startBackup = function (force) {
  if (force) {
    util.log("Sending backup start request")
    if (Date.now() - env['lastRun'] >= env['coolDownTime']) {
      env['lastRun'] = Date.now()
      $.post('backup/start', {}, function () {
        $('.navbar button[type=submit]').toggleClass('btn-success')
        $('.navbar button[type=submit]').toggleClass('btn-warning')
        $('.navbar button[type=submit]').text("✖ Stop Backup")
        ex.pollBackupStatus('backup/status', env['pollFrequency'],
          function (res) {
            util.log("Received status update")
          }) })
    } else util.log('Restarting backup too fast, ignoring')
  } else if (force === undefined) ex.noBackupRunning(startBackup)
    else {
    ex.stopBackup()
  }
}

module.exports = ex
