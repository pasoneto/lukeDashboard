//Generates checkbox for classifier selection
function generateCheckBoxes(categories, options, whereAppend){
  html = ''
  html += '<div id="checkBoxListContainer">'
  for(category in categories){
    html += '<label>' + categories[category] + '</label>'
    html += '<ul id="' + categories[category] + '">'
    for(option in options[category]){
      console.log(options[category][option])
      html += '<li><input type="checkbox" id="'
      html += options[category][option] + '">' + options[category][option] + '</li>'
    }
    html += '</ul>'
  }
  html +=  '<button id="buttonDimensionSelector">Done</button>'
  html += '</div>'
  document.getElementById(whereAppend).innerHTML += html
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

//Generates object with keys corresponding to the categories. Values are empty list, and will receive values when checkboxes are clicked
function checkedValuesObjectGenerator(categories){
  var checkedValues = {} //Creates empty object with category keys
  for(k in categories){
    checkedValues[categories[k]] = []
  }
  return(checkedValues)
}

//Checks what values were selected by the ID of the selector
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

//Runs function verifyCheckedBoxes across all categories, and returns a single object with selections
function mergeVerifyCheckedBoxes(categories){
  var allChecks = {}
  for(k in categories){
    var a = verifyCheckedBoxes(categories[k])
    Object.assign(allChecks, a)
  }
  window.checkedValues = allChecks
  return(allChecks)
}

//Function prevents the selection of more than one category with more than one value
function removeChecksExceptCurrent(checkBoxes, current) {
  for(k in checkBoxes){
    if(checkBoxes[k].id !== current.id){
      checkBoxes[k].checked = false
    }
  }
}

//Functions applies the onlyOne function to all elements of a category ID
function onlyOne(category, checkedValues, categories){
  var a = document.getElementById(category)
  var b = a.getElementsByTagName('input')
  for(j in b){
    b[j].onclick = function(){
      removeChecksExceptCurrent(b, this)
      checkedValues = mergeVerifyCheckedBoxes(categories)
      console.log(checkedValues)
    }
  }
}

//Checks number of selected boxes per category. If one category has more than 1 checks, 
//applies onlyOne to all except that category.
function onlyOneEnforcer(categories, checkedValues){
  for(k in categories){
    var nCheckedByCategory = checkedValues[categories[k]].length
    if(nCheckedByCategory > 1){
      for(l in categories){
        if(categories[l] != categories[k]){
          onlyOne(categories[l], checkedValues, categories)
        }
      }
    }
  }
}

//Function returns true if ALL categories have up to 1 checkbox selected
function allOK(categories, checkedValues){
  var nChecked = []
  for(k in categories){
    var nCheckedByCategory = checkedValues[categories[k]].length
    nChecked.push(nCheckedByCategory) 
  }
  var notManyChecked = nChecked.every(function(e) {return e <= 1} )
  console.log(notManyChecked)
  return(notManyChecked)
}

function establishInitial(allCheckBoxes, categories, checkedValues){
  var notMany = allOK(categories, checkedValues)
  if(notMany){ //Removes OnlyOne
    for(j in allCheckBoxes){
      allCheckBoxes[j].onclick = function(){
        checkedValues = mergeVerifyCheckedBoxes(categories)
        onlyOneEnforcer(categories, checkedValues)
        establishInitial(allCheckBoxes, categories, checkedValues)
        console.log(checkedValues)
      }
    }
  }
};