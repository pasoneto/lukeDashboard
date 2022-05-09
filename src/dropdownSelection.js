//Renders boxes with a set of options
function dropDownSelection(outerClass, options, optionNames, selectorTitle, whereAppend, nRuns = 1){
    html = '';
    for (let i = 0; i < nRuns; i++) {
      html += '<select class="' + outerClass + '"} id="' + selectorTitle[i] + '">';
      html += '<option value="' + selectorTitle[i] + '">' + selectorTitle[i] + '</option>';
      for(k in options){
        html += '<option value=' + options[k] + '>' + optionNames[k] + '</option>'
      }
      html += '</select>';
    }
    document.getElementById(whereAppend).innerHTML += html
}

//Checks what values were selected by the ID of the selector
function checkSelected(optionID){
  var selectionBox = document.getElementById(optionID)
  var selected = selectionBox.options[selectionBox.selectedIndex].value;
  return selected
}
