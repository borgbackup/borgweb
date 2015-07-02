let $ = require('jquery')
let dateformat = require('dateformat')

/**
  ~~ Utility ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var ex = {}

ex.log = function(){
  var args = Array.prototype.slice.call(arguments)
  var time = '[' + dateformat(new Date(), 'HH:MM:ss') + ']'
  args.unshift(time)
  console.log.apply(console, args);
  return this
}

ex.isInt = function (n) {
  return n % 1 === 0
}

ex.success = function (data) {
  logFiles = data.log_files
}

ex.parseAnchor = function () {
  var url = window.location.href.toString()
  var idx = url.indexOf("#")
  var anchor = (idx !== -1) ? url.substring(idx+1) : ""
  if (anchor) {
    var parts = anchor.split(';')
    var partsParsed = {}
    parts.forEach(function (e) {
      var pair = e.split(':')
      partsParsed[pair[0]] = pair[1]
    })
    return partsParsed
  } else {
    ex.log('Anchor not available')
    return {'log': 0}
  }
}

ex.determineLineCount = function () {
  let availableLines = Math.floor($('#log-text').height() / 18)
  return availableLines
}

module.exports = ex
