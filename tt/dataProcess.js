function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function reshapeJSON(data, classifiers){
  var additionalClassifiers = Object.keys(data[0]).filter(i => classifiers.indexOf(i) == -1)
  var reshaped = []
  for(k in additionalClassifiers){
    for(i in data){
      categoryReshaped = {}
      categoryReshaped['dependentVariable'] = additionalClassifiers[k]
      categoryReshaped['value'] = data[i][additionalClassifiers[k]]
      for(j in classifiers){
        categoryReshaped[classifiers[j]] = data[i][classifiers[j]]
      }
    reshaped.push(categoryReshaped)
    }
  }
  return(reshaped)
}

//Filter values from reshapedJSON output to match only checked values from checkboxes
function filterDataByCheckBoxSelectorTT(categories, data, checkedValues){
  var filteredData = structuredClone(data)
  for(k in categories){
    var selectedCategories = window.checkedValues[categories[k]]
    // console.log(selectedCategories)
    filteredData = filteredData.filter(i => selectedCategories.indexOf(i[categories[k]].toString()) !== -1)
    // console.log(filteredData)
  }
  return(filteredData)
}
