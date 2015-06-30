/**
  ~~ Environment ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
module.exports = {
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
