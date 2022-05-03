//Renders boxes which will receive a set of options from function generateCheckBoxes
function createClassifierButton(outerClass, whereAppend){
    html = '';
    html += '<button class="' + outerClass + '" id="SelectDimension">Select dimension</button>';
    document.getElementById(whereAppend).innerHTML = html
}

//Changes style of checkBox container. Now it appears in front of everything
function showBoxSelector(id){
  var boxTop = document.getElementById(id)
  if(boxTop.style.display == '') {
    boxTop.style.display = 'block';
  } else {
    boxTop.style.display = '';
  }
}

//Generates checkbox for a single parameter
function generateCheckBoxes(optionID, optionNames, whereAppend){
  for(let l = 0; l < optionID.length; l++){
    html = '<label>' + optionID[l] + '</label>'
    html += '<ul>'
    for(let x = 0; x < optionNames.length; x++){
      html += '<li><input type="checkbox" id="' + optionNames[x] + '">' + optionNames[x] + '</li>'
    }
    html += '</ul>'
  }
  document.getElementById(whereAppend).innerHTML += html
}

//Checks what values were selected by the ID of the selector
//Append this function to button which closes boxTop
function checkSelected(optionID){
  //Implement
}

//generates object with checked boxes
function genObjectClassifiers(optionIDS) {
  //implement
}
