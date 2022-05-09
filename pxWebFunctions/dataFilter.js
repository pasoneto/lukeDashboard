//Function receives checked values (checkboxes), allData (in list format), and all categories
//Returned value is only the checked boxes which were selected by users
function filterDataByCheckBoxSelector(categories, allData, checkedValues){
  for(k in categories){
    var selectedCategories = window.checkedValues[categories[k]]
    allData = allData.filter(i=> selectedCategories.indexOf(i[categories[k]]) !== -1)
  }
  return(allData)
}

async function getData(groupsSelected, checkedValues){
  // Implement
}

//Also change selector to allow for 2 multidimension checkboxes, instead of 1
