/**
  ~~ Environment ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
module.exports = {
  lastSelectedLog: null,
  pollFrequency: 300,
  transitionTime: 170,
  coolDownTime: 1000,
  icon: {
    success: ['ok-circle', '#5cb85c'],
    warning: ['ban-circle', '#f0ad4e'],
    danger: ['remove-circle', '#c9302c']
  },
  
  lastRun: 0,
  lastLogID: null,
  lastDirection: null,
  nextOffset: null
}
