let $ = require('jquery')
let env = require('./env')
let util = require('./util')

/**
  ~~ Log viewer frontend ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
let logText = $('#log-text')
let noLogsError = $('#no-logs-error')

function highlightListEntry (id) {
  $('.shown-log').toggleClass('shown-log')
  $(`#log-${ id }`).toggleClass('shown-log')
}

function setListItemStatus () {
  for (let i = 0; i < env.fetchRecentLogsStatus; i++) {
    $.getJSON('logs/' + i, res => {
      let search = `#log-${i} .glyphicon`
      let elem = $(search)
      elem.css('color', env.icon[res.status][1])
      elem.removeClass('glyphicon-time')
      elem.addClass(`glyphicon-${ env.icon[res.status][0]}`)
    })
  }
}

function updateLogFileList () {
  let logFilesListHTML = []
  $.getJSON('logs', res => {
    let i = 0
    $.each(res.files, (key, value) => {
      let insert = (i < env.fetchRecentLogsStatus)
      let indicatorHTML = insert ? `
        <span class="glyphicon glyphicon-time list-status-indicator"
          aria-hidden="true"></span>` : ''
      logFilesListHTML += `
        <li>
          <a onClick="window.switchToLog(${ value[0] + 1 })" id="log-${ value[0] }">
            ${ indicatorHTML }
            ${ value[1] }
          </a>
        </li>`
      i++
    })
    setListItemStatus()
    $('#log-files').html(logFilesListHTML)
    highlightListEntry(0)
    updatePathAndStatus(0)
  })
}

function getSetState (state) {
  state = state || {}
  let anchor = util.parseAnchor()
  anchor = {
    log: state.log || anchor.log || 1,
    offset: state.offset || anchor.offset || 1
  }
  document.location.hash =
    `#log:${ anchor.log };offset:${ anchor.offset }`
  return anchor
}

function updatePathAndStatus (id) {
  if ((id + 1) === env.lastLogID) ;
  else {
    $.getJSON('logs/' + id, function (res) {
      $('#log-path').html(`
        <!-- js generated -->
          <span class="glyphicon glyphicon-${ env.icon[res.status][0] }"
            aria-hidden="true" style="font-size: 34px;
            color: ${ env.icon[res.status][1] }; width: 42px;
            margin-right: 4px; vertical-align: middle;"></span
          ><input class="form-control" type="text"
            value="${ res.filename }" readonly onClick="this.select();">
        <!-- /js generated -->`)
      highlightListEntry(id)
    })
  }
}

function insertLogData (linesArray) {
  let [html, lineStatus] = [``, ``]
  linesArray.forEach((val, index) => {
    lineStatus = env.logLine[val[0]]
    html = lineStatus ? `<mark class="${ env.logLine[val[0]][0] }"
      style="background-color: ${ env.logLine[val[0]][1] };">` : ``
    html += val[1] + '\n'
    html += lineStatus ? `</mark>` : ``
    logText.append(html)
  })
}

function clearLog () { logText.html('') }

let fadeLog = {
  out: x => {
    setTimeout(clearLog, env.transitionTime * 0.5)
    logText.fadeOut(env.transitionTime * 0.5)
  },
  in: x => {
    logText.fadeIn(env.transitionTime * 0.5)
  }
}

function displayLogSection (state, availableLines) {
  let url = `logs/${ state.log - 1 }/${ state.offset - 1 }:${ availableLines }:1`
  $.get(url, res => {
    noLogsError.hide()
    if (state.log === env.lastLogID) {
      clearLog()
      insertLogData(res.lines)
    } else {
      env.lastLogID = state.log
      fadeLog.out()
      setTimeout(x => {
        insertLogData(res.lines)
        fadeLog.in()
      }, env.transitionTime * 0.5)
    }
  }).fail(err => {
    noLogsError.show()
    logText.hide()
  })
}

function render (availableLines) {
  availableLines = availableLines || util.determineLineCount()
  let state = getSetState()
  updatePathAndStatus(state.log - 1)
  displayLogSection(state, availableLines)
}

function switchToLog (id) {
  getSetState({ log: id, offset: 1 })
  render()
}

function getNextOffset (state, direction, availableLines, callback) {
  let url = `logs/${ state.log - 1 }/${ state.offset - 1 }` +
    `:${ availableLines }:${ direction }`
  $.get(url, res => {
    let subsequentUrl = `logs/${ state.log - 1 }/${ res.offset + 1 }` +
      `:${ availableLines }:${ direction }`
    $.get(subsequentUrl, subsequentRes => {
      if (subsequentRes.lines.length === 0) getSetState(state)
      else callback(state, res, availableLines)
    })
  })
}

function switchPage (direction) {
  var availableLines = util.determineLineCount()
  getNextOffset(getSetState(), direction, availableLines,
    (state, res, availableLines) => {
      getSetState({ log: state.log, offset: res.offset + 1 })
      render(availableLines)
    }
  )
}

function lastPage () {
  let state = getSetState()
  let url = `logs/${ state.log - 1 }`
  $.get(url, res => {
    let logLength = res.length
    state.offset = logLength
    getSetState(state)
    switchPage(-1)
  })
}

function nextPage () { switchPage(1) }

function previousPage () { switchPage(-1) }

function firstPage () {
  let state = getSetState()
  state.offset = 1
  setTimeout(x => { getSetState(state) }, 1) // prevent anchor loss
  switchToLog(state.log)
}

module.exports = {
  render: render,
  switchToLog: switchToLog,
  nextPage: nextPage,
  previousPage: previousPage,
  updateLogFileList: updateLogFileList,
  firstPage: firstPage,
  lastPage: lastPage
}
