function copyText(text){
  const cb = navigator.clipboard;
  cb.writeText(text).then(() => alert('Copied to clipboard'));
}

function shareDashboard(which){
  var url = new URL(location.href)
  var checkedString = '?set=' + JSON.stringify(checkedValues)
  var url = url + checkedString
  if(which === 'embed'){
    var embedURL = '<iframe type="text/html" style="resize: both" src=' + url + '></iframe>'
    copyText(embedURL)
  } else {
    copyText(url)
  }
}

function checkBoxesFromUrl(){
  var urlParameters = window.location.search
  var searchObject = new URLSearchParams(urlParameters);
  var hasParameters = searchObject.has('set')
  if(hasParameters){
    var checkedValues = searchObject.get('set')
    return JSON.parse(checkedValues)
  } else {
    return false
  }
}

checkBoxesFromUrl()
