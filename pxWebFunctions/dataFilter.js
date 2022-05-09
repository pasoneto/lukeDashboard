//Function receives checked values (checkboxes), allData (in list format), and all categories
//Returned value is only the checked boxes which were selected by users
function filterDataByCheckBoxSelector(categories, allData, checkedValues){
  for(k in categories){
    var selectedCategories = window.checkedValues[categories[k]]
    allData = allData.filter(i=> selectedCategories.indexOf(i[categories[k]]) !== -1)
  }
  return(allData)
}

function separateDataInGroups(filteredData, groupSelected, checkedValues){
  var yAxis = []
  var labels = []
  for(k in window.checkedValues[groupSelected]){
    var group = filteredData.filter(i => i[groupSelected] == window.checkedValues[groupSelected][k])
    var y = [group.map(i => Number(i.value))]
    yAxis.push(y)
    labels.push(window.checkedValues[groupSelected][k])
  }
  return [yAxis, labels];
}

//Also change selector to allow for 2 multidimension checkboxes, instead of 1
