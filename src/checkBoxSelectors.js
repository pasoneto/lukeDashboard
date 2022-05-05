//Generates checkbox for classifier selection
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
  console.log(allChecks)
  return(allChecks)
}

//Function prevents the selection of more than one category with more than one value
function onlyOne(checkBoxes, current) {
  for(k in checkBoxes){
    if(checkBoxes[k].id !== current.id){
      checkBoxes[k].checked = false
    }
  }
}

//Functions applies the onlyOne function to all elements of a category ID
function applyOnlyOneToCategory(category){
  var a = document.getElementById(category)
  var b = a.getElementsByTagName('input')
  for(j in b){
    b[j].onclick = function(){onlyOne(b, this)}
  }
}

//Function decides which category will receive the applyOnlyOnetToCategory function
function onlyOneEnforcer(categories, checkedValues){
  for(k in categories){
    var nCheckedByCategory = checkedValues[categories[k]].length
    if(nCheckedByCategory > 1){
      for(l in categories){
        if(categories[l] != categories[k]){
          applyOnlyOneToCategory(categories[l])
        }
      }
    }
  }
}

function onlyOneReverter(allCheckBoxes, categories, checkedValues){
  var nChecked = []
  for(k in categories){
    var nCheckedByCategory = checkedValues[categories[k]].length
    nChecked.push(nCheckedByCategory) 
  }
  var notManyChecked = nChecked.every(function(e) {return e <= 1} )
  console.log(notManyChecked)
  if(notManyChecked){
    var b = document.getElementsByTagName('input')
    for(j in b){
      b[j].onclick = function(){
        onlyOneWrap(allCheckBoxes, categories, checkedValues)  
      }
    }
  }
};

function onlyOneWrap(allCheckBoxes, categories, checkedValues){
  for(k in allCheckBoxes){
    allCheckBoxes[k].onclick = function(){
      var a = mergeVerifyCheckedBoxes(categories)
      checkedValues = a
      onlyOneEnforcer(categories, checkedValues)//Verifies if a category received more than one check, and disables this in other categories
      onlyOneReverter(allCheckBoxes, categories, checkedValues)
    }
  }
};
