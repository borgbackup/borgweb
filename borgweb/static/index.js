var dateformat = require('dateformat')

/**
  ~~ Config ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var cfg = {
  'logFilesList': [],
  'logFilesListHTML': "",
  'lastSelectedLog': NaN
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

/**
  ~~ UI updaters ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var updateLogFileList = function (logFiles) {
  $.each(logFiles.log_files, function (key, value) {
    cfg.logFilesListHTML += '<li><a href="#log:' + value[0]
      + '" onClick="window.displayThatLog('
      + value[0] + ')">' + value[1] + '</a></li>'})
  $('#log-files').html(cfg.logFilesListHTML)
}
var renderLogFile = function (text) {
  log("Rendering: " + text.log_file)
  $('#log-text').html(text.log_content)
}
var highlightLogFile = function (logNumber) {
  if (isInt(cfg.lastSelectedLog))
    $('#log-files li:nth-child('
      + (cfg.lastSelectedLog + 1) + ')').toggleClass('active')
  $(document).ready(function() {
    $('#log-files li:nth-child('
      + (logNumber + 1) + ')').toggleClass('active') })
  cfg.lastSelectedLog = logNumber
}
var updateShownLogFile = function (that) {
  log("updateShownLogFile")
  var logNumber = NaN
  if (!isInt(that)) {
    var anchor = parseAnchor()
    logNumber = anchor['log']
  } else logNumber = that
  
  highlightLogFile(logNumber)
  var url = '/logs/' + logNumber + '/0::'
  log("Fetching " + url)
  $.getJSON(url, renderLogFile)
}

/**
  ~~ BorgBackup interaction ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var isBackupRunning = function () {
  $.getJSON('/backup/status', function (resp) {
    if (resp.rc === null) log('Backup in progress')
    else {
      log('No backup in progress')
      startBackup(true)
    }
  })
}
var startBackup = function (force) {
  if (force) {
    log("Sending backup start request")
    $.post('/backup/start', {}, function () {})
  } else isBackupRunning()
}

/**
  ~~ UI callables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
window.displayThatLog = function (that) {
  updateShownLogFile(that)
}

/**
  ~~ Site init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
$.getJSON('/logs', updateLogFileList)
updateShownLogFile()





