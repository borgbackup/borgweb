let $ = require('jquery')
let log = require('./util').log

let lang = navigator.language || navigator.userLanguage
let notEnglish = (lang.indexOf('en') !== 0)

function translateAttribute (i18nElements, attr, translations) {
  for (let i = 0; i18nElements[i]; i++) {
    let elem = i18nElements[i]
    let key = elem[attr]
    if (translations[key]) elem[attr] = translations[key]
  }
}

function replaceMarkedTexts (translations) {
  // replace text marked by `<x-i18n>` tags
  let i18nElements = document.getElementsByTagName('x-i18n')
  translateAttribute(i18nElements, 'innerHTML', translations)
}

function replaceAttrTexts (attr, translations) {
  // replace `title` attribute texts
  let i18nElements = document.getElementsByClassName('i18n')
  translateAttribute(i18nElements, attr, translations)
}

function translate () {
  let url = 'static/i18n/' + lang + '.json'
  if (notEnglish) {
    $.get(url, translations => {
      replaceMarkedTexts(translations)
      replaceAttrTexts('title', translations)
      replaceAttrTexts('aria-label', translations)
    }).fail(() => {
      log(`Translation missing for '${ lang }',
        help out on Github!`)
    })
  }
}

module.exports = {
  'translate': translate
}
