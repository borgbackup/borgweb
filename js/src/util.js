let $ = require('jquery')
let dateformat = require('dateformat')

/**
  ~~ Utility ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

function log () {
  var args = Array.prototype.slice.call(arguments)
  var time = '[' + dateformat(new Date(), 'HH:MM:ss') + ']'
  args.unshift(time)
  console.log.apply(console, args);
  return this }

function isInt (n) {
  return n % 1 === 0 }

function success (data) {
  logFiles = data.log_files }

function parseAnchor () {
  var anchor = window.location.hash.slice(1)
  if (anchor) {
    var parts = anchor.split(';')
    var partsParsed = {}
    parts.forEach(function (e) {
      var pair = e.split(':')
      partsParsed[pair[0]] = pair[1] })
    return partsParsed }
  else {
    log('Anchor not available')
    return {'log': 0} } }

function determineLineCount () {
  let availableLines = Math.floor($('#log-text').height() / 18)
  return availableLines }

module.exports = {
  log: log,
  isInt: isInt,
  success: success,
  parseAnchor: parseAnchor,
  determineLineCount: determineLineCount
}
