//Function receives checked values (checkboxes), allData (in list format), and all categories
//Returned value is only the checked boxes which were selected by users
function filterDataByCheckBoxSelector(categories, allData, checkedValues){
  for(k in categories){
    var selectedCategories = window.checkedValues[categories[k]]
    allData = allData.filter(i=> selectedCategories.indexOf(i[categories[k]]) !== -1)
  }
  return(allData)
}

//Receives filtered (by checkbox selector) data and returns list of lists
//where each list contains values of yAxis separated. Group selected
//determines what category will be used to separate yAxis
function separateDataInGroups(filteredData, groupSelected, checkedValues){
  var yAxis = []
  var labels = []
  for(k in window.checkedValues[groupSelected]){
    var group = filteredData.filter(i => i[groupSelected] == window.checkedValues[groupSelected][k])
    var y = [group.map(i => Number(i.value))]
    yAxis.push(y[0])
    labels.push(window.checkedValues[groupSelected][k])
  }
  return [yAxis, labels];
}

//Selects only categories which received 2 or more checks in checkboxes
function pickMultiClassCategories(checkedValues, categories){
  window.dropdownCategories = []
  for(k in categories){
    var nChecks = window.checkedValues[categories[k]].length
    if(nChecks > 1){
      window.dropdownCategories.push(categories[k])
    }
  }
}
