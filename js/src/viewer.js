let $ = require('jquery')
let env = require('./env')
let util = require('./util')

/**
  ~~ Log viewer frontend ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
let logText = $('#log-text')
let noLogsError = $('#no-logs-error')
let currentRepo = "";

function highlightListEntry (id) {
  $('.shown-log').toggleClass('shown-log')
  $(`#log-${ id }`).toggleClass('shown-log')
}

function setListItemStatus () {
  for (let i = 0; i < env.fetchRecentLogsStatus; i++) {
    $.getJSON('logs/' + currentRepo + "/" + i, res => {
      let search = `#log-${i} .glyphicon`
      let elem = $(search)
      elem.css('color', env.icon[res.status][1])
      elem.removeClass('glyphicon-time')
      elem.addClass(`glyphicon-${ env.icon[res.status][0]}`)
    })
  }
}

function updateLogFileList (repo) {
  let logFilesListHTML = []
  let indicatorHTML = `
    <span class="glyphicon glyphicon-time list-status-indicator"
      aria-hidden="true"></span>`;

  $.getJSON('logs/' + repo, res => {
    let i = 0
    $.each(res.files, (key, value) => {
      logFilesListHTML += `
        <li class='list-group-item'>
          <a onClick="window.switchToLog(${ value[0] + 1 })" id="log-${ value[0] }">
            ${ indicatorHTML }
            ${ value[1] }
          </a>
        </li>`
      i++
    })

    if(res.files.length > 0){
        env.fetchRecentLogsStatus = res.files.length;
        setListItemStatus()
    }else{
      logFilesListHTML = "<li><a>" + indicatorHTML + " No Log Files</a></li>";
    }

    $('#log-files').html(logFilesListHTML)

  })
}

function updateRepoList () {
  let repoListHtml = []
  $.getJSON('repos', res => {
    let i = 0
    $.each(res, (name, value) => {
      repoListHtml += `
        <li>
          <a onClick="window.getLogFiles('${ name }')" >
          <span class="glyphicon glyphicon-hdd"
          aria-hidden="true"></span>
            ${ name }
          </a>
        </li>`
      i++
    })

    $('#repo-list').html(repoListHtml)

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
  if ((id + 1) === env.lastLogID) {
      return;
  }
  $.getJSON('logs/' + currentRepo + "/" + id, function (res) {

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
  let url = `logs/` + currentRepo + "/" + `${ state.log - 1 }/${ state.offset - 1 }:${ availableLines }:1`
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
  $("#log-path").show();
  getSetState({ log: id, offset: 1 })
  render()
}

function addLogViewAdvise() {
  $("#log-files").append("<li><a>Select a respository to see logs</a></li>");
  $("#log-text").empty().text("Select a log to view its contents");
}

function getLogFiles (repo) {
    $("#log-files").empty();
    addLogViewAdvise();
    currentRepo = repo;
    updateLogFileList(repo);
}

function getNextOffset (state, direction, availableLines, callback) {

  let url = `logs/` + currentRepo + "/" + `${ state.log - 1 }/${ state.offset - 1 }` +
    `:${ availableLines }:${ direction }`
  console.log(url);
  $.get(url, res => {
    let subsequentUrl = `logs/` + currentRepo + "/" + `${ state.log - 1 }/${ res.offset + 1 }` +
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
  let url = `logs/` + currentRepo + "/" + + `${ state.log - 1 }`
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
  // switchToLog(state.log)
}

function getCurrentRepo(){
  return currentRepo;
}

function viewBackups(){
  $.getJSON("backups", (data)=>{
    let html = "";

    let x = {
      success: "",
      error: "",
      warning: "",
    }
    let jobsTemplate = "";
    $.each(data, function(repo, backups){
      $.each(backups, function(p, backup){
        let status = backup.last_result;
        let glyphicon = env.icon[status];

        jobsTemplate += `<div>
                <span class="glyphicon glyphicon-`+ glyphicon[0] +` list-status-indicator"
                aria-hidden="true" style='color: ` + glyphicon[1] + ` '></span>
                <button class='btn btn-primary pull-right'>Start</button>
              <a> ${repo} - ${backup.name} </a></div><br/>`

        let resultTemplate = `<div>
                <span class="glyphicon glyphicon-`+ glyphicon[0] +` list-status-indicator"
                aria-hidden="true" style='color: ` + glyphicon[1] + ` '></span>
              <a> ${repo} - ${backup.name} </a></div><br/>`

        x[status] += resultTemplate
      });
    });
    $.each(x, function(i, tempaltes){
      $("#" + i + "-jobs-panel").empty().append(tempaltes);
    })
    $("#job-list-panel").empty().append(jobsTemplate);
  });
  $("#backups-overview").show();
  $("#log-viewer, #pagination-row, #log-path, #repo-list-container").hide();
  $("#log-list-container").hide();
}

function viewRepositories(){
  updateRepoList();
  $("#log-files").empty();
  addLogViewAdvise();
  $("#backups-overview").hide();
  $("#log-viewer, #log-list-container, #pagination-row, #repo-list-container").show();
}

module.exports = {
  getCurrentRepo: getCurrentRepo,
  updateRepoList: updateRepoList,
  viewBackups: viewBackups,
  viewRepositories: viewRepositories,
  render: render,
  switchToLog: switchToLog,
  getLogFiles: getLogFiles,
  nextPage: nextPage,
  previousPage: previousPage,
  updateLogFileList: updateLogFileList,
  firstPage: firstPage,
  lastPage: lastPage
}
