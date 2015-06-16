var logFilesList = []
var logFilesListHTML = ""

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
  }
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
var updateShownLogFile = function () {
  console.log('updateShownLogFile')
  var anchor = parseAnchor()
  if (anchor) {
    var url = '/logs/' + anchor['log'] + '/0::'
    console.log("Fetching " + url)
    $.getJSON(url, renderLogFile)
    console.log(anchor['log'])
    /* Not working:
    $(document).ready(function () {
      $('#log-files li:nth-child('
        + anchor['log'] + ')').toggleClass('active') })
    */
  } else {
    var url = '/logs/0/0::'
    console.log("Fetching " + url)
    $.getJSON(url, renderLogFile)
    $(document).ready(function () {
      $('#log-files li').first().toggleClass('active') })
  }
}
var displayThatLog = function (that) {
  var url = '/logs/' + that + '/0::'
  console.log("Fetching " + url)
  $.getJSON(url, renderLogFile)
}

$.getJSON('/logs', updateLogFileList)
updateShownLogFile()
