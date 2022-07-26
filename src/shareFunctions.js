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
