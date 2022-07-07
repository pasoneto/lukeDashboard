//Function extracts options associated with each category within the data
function extractCategoriesAndOptions(data, dependentVariableName){

  var categories = Object.keys(data[0]) //Extract classifier names (e.g., year, size, etc...)
  var categories = categories.filter(i => i !== dependentVariableName) //Remove value, which is what we want to plot

  var options = []
  for(k in categories){
    var a = data.map(i=>i[categories[k]])
    var a = a.filter(onlyUnique)
    options.push(a)
  }
  var options = options.filter(i=> i[0] !== undefined)
  return [categories, options]
}

//Generates checkbox for classifier selection
function generateCheckBoxes(categories, options, whereAppend, data, labels = null){
  html = '';
  html += '<div id="categorySelectorHeader">Category selector</div>'; //Header of category selector
  html += '<div id="checkBoxListContainer">';
  for(category in categories){
    if(labels && categories[category] !== "dependentVariable"){
      html += '<label id = ' + categories[category] + 'Label' + '>' + labels[0]['classifiers'][categories[category]] + '<div id="' + categories[category] + 'Label' + 'SingleMultiple"></div></label>'
    } else {
      html += '<label id = ' + categories[category] + 'Label' + '>' + categories[category] + '<div id="' + categories[category] + 'Label' + 'SingleMultiple"></div></label>'
    }
    html += '<ul id="' + categories[category] + '">'
    for(option in options[category]){
      html += '<li><input type="checkbox" id="'
      //if labels are provided, rendered checkbox will show their names
      if(labels){
        var catItem = options[category][option].toString()
        if(labels[0]['subLabels'][categories[category]]){
          var allCats = Object.keys(labels[0]['subLabels'][categories[category]])
          var allCats = allCats.map(i=> i.toString())
        } else {
          var allCats = [{}];
        }
        if(allCats.includes(catItem)){ 
            html += options[category][option] + '">' + labels[0]['subLabels'][categories[category]][options[category][option]] + '</li>'
        } else {
            html += options[category][option] + '">' + options[category][option] + '</li>'
        }
      } else {
            html += options[category][option] + '">' + options[category][option] + '</li>'
      }
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
function onlyOne(category, checkedValues, categories, data, filterFunction){
  var a = document.getElementById(category)
  var b = a.getElementsByTagName('input')
  for(j in b){
    b[j].onclick = function(){
      removeChecksExceptCurrent(b, this)
      checkedValues = mergeVerifyCheckedBoxes(categories)
      //Filters data on every click
      window.filteredData = filterFunction(categories, data, window.checkedValues)
    }
  }
}

//Checks number of selected boxes per category. If one category has more than 1 checks, 
//applies onlyOne to all except that category.
function onlyOneEnforcer(categories, checkedValues, data, filterFunction){
  var multipleCheckCategories = []
  for(k in categories){
    var nCheckedByCategory = checkedValues[categories[k]].length
    if((nCheckedByCategory > 1) && (multipleCheckCategories.indexOf(categories[k]) == -1)){
      multipleCheckCategories.push(categories[k])
    }
  }
  if(multipleCheckCategories.length == 2){ //If there are two multiple checks
    for(k in categories){
        //document.getElementById(categories[k] + 'Label' + "SingleMultiple").innerHTML = categories[k] + '<font color="blue"> (Multiple selector)</font>' //Add text saying that this category is multiple selector
        var notMultiple = multipleCheckCategories.indexOf(categories[k]) !== -1
        if(!notMultiple){
          document.getElementById(categories[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (Single selector)</font>' //Add text saying that this category is multiple selector
          onlyOne(categories[k], checkedValues, categories, data, filterFunction)
      }
    }
  }
}

//Function returns true if ALL categories have up to 1 checkbox selected
function allOK(categories, checkedValues){
  var categoriesWithMultiple = []
  for(k in categories){
    var multipleCategoryMarked = categoriesWithMultiple.indexOf(categories[k]) !== -1 
    var multipleCategory = checkedValues[categories[k]].length > 1
    if( (!multipleCategoryMarked) && ( multipleCategory ) ){
      categoriesWithMultiple.push(categories[k]) 
    }
  }
  var notManyChecked = categoriesWithMultiple.length < 2
  return(notManyChecked)
}

//If no category has more than 1 check, initial function state is established (multiple selection allowed)
function establishInitial(allCheckBoxes, categories, checkedValues, data, filterFunction, exception = null){

  if(exception){
    onlyOne(exception, checkedValues, categories, data, filterFunction)
    //Establishes that exception category will only be single selector
    document.getElementById(exception + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (Single selector)</font>' //Add text saying that this category is multiple selector
  }

  var notMany = allOK(categories, checkedValues)
  if(notMany){ //Removes OnlyOne
    for(k in categories){
      if(categories[k] !== exception){
        document.getElementById(categories[k] + 'Label' + "SingleMultiple").innerHTML = '<font color="blue"> (Multiple selector)</font>' //Add text saying that this category is multiple selector
      }
    }
    for(j in allCheckBoxes){
      allCheckBoxes[j].onclick = function(){
        checkedValues = mergeVerifyCheckedBoxes(categories)
        onlyOneEnforcer(categories, checkedValues, data, filterFunction)
        establishInitial(allCheckBoxes, categories, checkedValues, data, filterFunction, exception)
        
        //Filters data on every click
        window.filteredData = filterFunction(categories, data, window.checkedValues)

      }
    }
  }
  if(exception){
    onlyOne(exception, checkedValues, categories, data, filterFunction) //Puts back the single check in a particular category
  }
};

function dragElement(elmnt, headerElmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    headerElmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//Simulate checkbox selection and automates generation of dashboard
function multiCheck(categoryName){
  var a = document.getElementById(categoryName)
  var a = Array.from(a.getElementsByTagName("input"))

  for(k in a){
    a[k].click()
  }
}

function singleCheck(categoryName){
  var a = document.getElementById(categoryName)
  var a = Array.from(a.getElementsByTagName("input"))
  var randomIndex = Math.floor(Math.random() * a.length);
  a[randomIndex].click()
}

async function simulateSelection(multi, single){
  while (true) {
    multi.map(i => multiCheck(i))
    single.map(i => singleCheck(i))
    
    var allNull = filteredData.filter(i=> i.value !== null)

    if(allNull.length <= 5){
      var allCheckBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      for(i in allCheckBoxes){
        if(allCheckBoxes[i].checked === true){
          allCheckBoxes[i].click()
        }
      }
    }

    if(allNull.length > 5){            
        break;
    } 
  }
}

