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
function generateCheckBoxes(categories, options, whereAppend){
  html = ''
  for(category in categories){
    console.log(categories[category])
    html += '<label>' + categories[category] + '</label>'
    html += '<ul id="' + categories[category] + '">'
    for(option in options[category]){
      console.log(options[category][option])
      html += '<li><input type="checkbox" id="'
      html += options[category][option] + '">' + options[category][option] + '</li>'
    }
    html += '</ul>'
  }
  document.getElementById(whereAppend).innerHTML += html
}


//Checks what values were selected by the ID of the selector
//Append this function to button which closes boxTop
function verifyCheckedBoxes(category){
  var json = {}
  var ul = document.getElementById(category)
  var items = ul.getElementsByTagName("input") 
  var checkedValues = []
  for(k in items){
    if(items[k].checked){
      checkedValues.push(items[k].id)
    }
  }
  json[category] = checkedValues
  return(json)
}

function mergeVerifyCheckedBoxes(categories){
  var allChecks = {}
  for(k in categories){
    var a = verifyCheckedBoxes(categories[k])
    Object.assign(allChecks, a)
  }
  console.log(allChecks)
  return(allChecks)
}








//generates object with checked boxes
//function genObjectClassifiers(optionIDS) {
  //implement
  //}
