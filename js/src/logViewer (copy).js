var $ = require('jquery')
var env = require('./env')
var util = require('./util')
var log = require('./util').log

/**
  ~~ UI updaters ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var ex = {}

ex.updateLogFileList = function (logFiles) {
  log("Updating log file list")
  env.logFilesListHTML = []
  $.each(logFiles.files, function (key, value) {
    env.logFilesListHTML += '<li><a href="#log:' + value[0] + '" id="log-' + value[0]
      + '" onClick="window.showLog('
      + value[0] + ')">' + value[1] + '</a></li>' })
  $('#log-files').html(env.logFilesListHTML)
  log("Highlighting log # " + env['shownLog']['id'])
  $('#log-' + env['shownLog']['id']).focus()
}

ex.appendLog = function (data, overwrite) {
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
  env['shownLog']['offset'] = data.offset
}

ex.overwriteLog = function (data) {
  ex.appendLog(data, true)
}

ex.showLog = function (id, offset, lines, direction) {
  var newLog = false
  
  if (id !== env['shownLog']['id'] || ! util.isInt(offset)) {
    log("Displaying different log than before")
    $('#log-text').fadeOut(env['transitionTime'] * 0.5)
    var args = util.parseAnchor()
    env['shownLog']['id'] = args['log'] || 0
    env['shownLog']['offset'] = 0
    newLog = true }
  if (util.isInt(id)) env['shownLog']['id'] =  id
  else env['shownLog']['offset'] = 0
  if (util.isInt(offset)) env['shownLog']['offset'] = offset
  if (util.isInt(lines)) env['shownLog']['lines'] = lines
  
  log("Fetching log (" + env['shownLog']['id'] + ', '
    + env['shownLog']['offset'] + ', ' + env['shownLog']['lines'] + ')')
  var url = 'logs/' + env['shownLog']['id'] + '/' + env['shownLog']['offset']
    + ':' + env['shownLog']['lines'] + ':' + direction
  setTimeout(function () { 
    if (newLog) $.getJSON(url, ex.overwriteLog)
    else $.getJSON(url, ex.appendLog)
    $('#log-text').fadeIn(env['transitionTime'] * 0.5)
  }, env['transitionTime'] * 0.5)
}

ex.changePage = function (offset, direction) {
  log(env['shownLog']['id'], offset, env['shownLog']['lines'], direction)
  ex.showLog(env['shownLog']['id'], offset, env['shownLog']['lines'], direction)
}

ex.nextPage = function () {
  log('Opening next log page')
  ex.changePage(env['shownLog']['offset'], 1)
}

ex.previousPage = function () {
  log('Opening previous log page')
  ex.changePage(env['shownLog']['offset'], -1)
}

module.exports = ex
