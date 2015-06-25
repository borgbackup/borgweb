var dateformat = require('dateformat')

/**
  ~~ Environment ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var env = {
  lastSelectedLog: NaN,
  pollFrequency: 300,
  transitionTime: 170,
  lastRun: 0,
  coolDownTime: 1000,
  icon: {
    success: ['ok-circle', '#5cb85c'],
    warning: ['ban-circle', '#f0ad4e'],
    danger: ['remove-circle', '#c9302c']
  },
  
  logFilesList: [],
  logFilesListHTML: "",
  shownLog: {
    id: 0, offset: 0, lines: 75, data: [], nextOffset: 0, previousOffset: 0 }
}

/**
  ~~ BorgBackup interaction ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var noBackupRunning = function (callback) {
  $.getJSON('backup/status', function (resp) {
    var backupRunning = resp.rc === null
    if (backupRunning) log("▶ Backup in progress")
    else log("✖ No backup in progress")
    callback(!backupRunning)
  })
}
var pollBackupStatus = function (endpoint, ms, callback) {
  noBackupRunning(function (notRunning) {
    if (notRunning) {
      $('.navbar button[type=submit]').toggleClass('btn-success')
      $('.navbar button[type=submit]').toggleClass('btn-warning')
      $('.navbar button[type=submit]').text("▶ Start Backup")
      $.getJSON('logs', updateLogFileList)
    } else {
      log("Polling backup status")
      $.getJSON('backup/status', callback)
      setTimeout(function () { pollBackupStatus(endpoint, ms, callback) }, ms)
    }
  })
}
var stopBackup = function () {
  log("Terminating (eventually killing) the backup process")
  $.post('backup/stop', {}, function (res) {
    log("Message: '" + res.msg + "', RC: '" + res.rc + "'") })
}
var startBackup = function (force) {
  if (force) {
    log("Sending backup start request")
    if (Date.now() - env['lastRun'] >= env['coolDownTime']) {
      env['lastRun'] = Date.now()
      $.post('backup/start', {}, function () {
        $('.navbar button[type=submit]').toggleClass('btn-success')
        $('.navbar button[type=submit]').toggleClass('btn-warning')
        $('.navbar button[type=submit]').text("✖ Stop Backup")
        pollBackupStatus('backup/status', env['pollFrequency'],
          function (res) {
            log("Received status update")
          }) })
    } else log('Restarting backup too fast, ignoring')
  } else if (force === undefined) noBackupRunning(startBackup)
    else {
    stopBackup()
  }
}

/**
  ~~ Utility ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var log = function(){
  var args = Array.prototype.slice.call(arguments)
  var time = '[' + dateformat(new Date(), 'HH:MM:ss') + ']'
  args.unshift(time)
  console.log.apply(console, args);
  return this
}
var isInt = function (n) {
  return n % 1 === 0
}
var success = function (data) {
  logFiles = data.log_files
}
var parseAnchor = function () {
  var url = window.location.href.toString()
  var idx = url.indexOf("#")
  var anchor = (idx != -1) ? url.substring(idx+1) : ""
  if (anchor) {
    var parts = anchor.split(';')
    var partsParsed = {}
    parts.forEach(function (e) {
      var pair = e.split(':')
      partsParsed[pair[0]] = pair[1]
    })
    return partsParsed
  } else return {'log': 0}
}
var determineLineCount = function () {
  return Math.floor($('#log-text').height() / 18)
}

/**
  ~~ UI updaters ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var updateLogFileList = function (logFiles) {
  log("Updating log file list")
  env.logFilesListHTML = []
  $.each(logFiles.files, function (key, value) {
    env.logFilesListHTML += '<li><a href="#log:' + value[0] + '" id="log-' + value[0]
      + '" onClick="window.showLog('
      + value[0] + ')">' + value[1] + '</a></li>' })
  $('#log-files').html(env.logFilesListHTML)
  log("Highlighting log # " + parseInt(env['shownLog']['id']))
  $('#log-' + parseInt(env['shownLog']['id'])).focus()
}
var appendLog = function (data, overwrite) {
  // set status icon:
  $.getJSON('logs/' + env['shownLog']['id'], function (res) {
    $('#log-path').html('<!-- js generated --><span class="glyphicon glyphicon-' 
      + env['icon'][res.status][0]
      + '" aria-hidden="true" style="font-size: 34px; color: ' + env['icon'][res.status][1]
      + '; width: 42px; margin-right: 4px; vertical-align: middle;"></span>'
      + '<input class="form-control" type="text" value="' + res.filename
      + '" readonly onClick="this.select();"><!-- /js generated -->' )
  })
  
  // append log text:
  var logText = $('#log-text')
  if (env['shownLog']['offset'] === 0 || overwrite) logText.html('')
  data.lines.forEach(function (val, index) { logText.append(val[1] + '\n') })
  $('#loadMore').remove()
  env['shownLog']['offset'] = data.offset
}
var overwriteLog = function (data) { appendLog(data, true) }
var showLog = function (id, offset, lines) {
  var newLog = false
  if (id !== env['shownLog']['id'] || ! isInt(offset)) {
    log("Displaying different log than before")
    $('#log-text').fadeOut(env['transitionTime'] * 0.5)
    var args = parseAnchor()
    env['shownLog']['id'] = args['log'] || 0
    env['shownLog']['offset'] = 0
    newLog = true }
  if (isInt(id)) env['shownLog']['id'] =  id
  else env['shownLog']['offset'] = 0
  if (isInt(offset)) env['shownLog']['offset'] = offset
  if (isInt(lines)) env['shownLog']['lines'] = lines
  log("Now displaying log: " + env['shownLog']['id'])
  var url = 'logs/' + env['shownLog']['id'] + '/' + env['shownLog']['offset']
    + ':' + env['shownLog']['lines']
  log("Fetching log (" + env['shownLog']['id'] + ', '
    + env['shownLog']['offset'] + ', ' + env['shownLog']['lines'] + ')')
  setTimeout(function () { 
    if (newLog) $.getJSON(url, overwriteLog)
    else $.getJSON(url, appendLog)
    $('#log-text').fadeIn(env['transitionTime'] * 0.5)
  }, env['transitionTime'] * 0.5)
}
var changePage = function (offset) {
  showLog(env['shownLog']['id'], offset)
}
var nextPage = function () {
  log('Opening next log page')
  changePage(env['shownLog']['nextOffset'])
}
var previousPage = function () {
  log('Opening previous log page')
  changePage(env['shownLog']['previousOffset'])
}

/**
  ~~ UI callables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
window.showLog = function (id, offset, lines) { showLog(id, offset, lines) }
window.startBackup = startBackup
window.nextPage = nextPage
window.previousPage = previousPage

/**
  ~~ Site init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
env['shownLog']['lines'] = determineLineCount()
$(window).resize(function () { log('Windows resized')
  env['shownLog']['lines'] = determineLineCount()
  log('New line count: ' + env['shownLog']['lines']) })
$.getJSON('logs', updateLogFileList)
showLog()





