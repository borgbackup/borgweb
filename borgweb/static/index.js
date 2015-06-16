var logFilesList = []
var logFilesListHTML = ""
var lastSelectedLog = NaN

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
var updateLogFileList = function (logFiles) {
  $.each(logFiles.log_files, function (key, value) {
    logFilesListHTML += '<li><a href="#log:' + value[0] + '" onClick="displayThatLog('
      + value[0] + ')">' + value[1] + '</a></li>'})
  $('#log-files').html(logFilesListHTML)
}
var renderLogFile = function (text) {
  console.log("Rendering: " + text.log_file)
  $('#log-text').html(text.log_content)
}
var updateShownLogFile = function (that) {
  console.log("updateShownLogFile")
  var logNumber = NaN
  if (!isInt(that)) {
    var anchor = parseAnchor()
    logNumber = anchor['log']
  } else logNumber = that
  
  if (isInt(lastSelectedLog))
    $('#log-files li:nth-child('
      + (lastSelectedLog + 1) + ')').toggleClass('active')
  $(document).ready(function() {
    $('#log-files li:nth-child('
      + (logNumber + 1) + ')').toggleClass('active') })
  lastSelectedLog = logNumber
  var url = '/logs/' + logNumber + '/0::'
  console.log("Fetching " + url)
  $.getJSON(url, renderLogFile)
}
var displayThatLog = function (that) {
  updateShownLogFile(that)
}
var isBackupRunning = function () {
  $.getJSON('/backup/status', function (resp) {
    if (resp.rc === -1) {
      console.log('No backup in progress')
      startBackup(true)
    } else console.log('Backup in progress') })
}
var startBackup = function (force) {
  if (force) {
    console.log("Sending backup start request")
    $.post('/backup/start', {}, function () {})
  } else isBackupRunning()
}

$.getJSON('/logs', updateLogFileList)
updateShownLogFile()
