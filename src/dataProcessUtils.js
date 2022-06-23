//Filter values from reshapedJSON output to match only checked values from checkboxes
function filterDataByCheckBoxSelectorTT(categories, data, checkedValues){
  var filteredData = data
  for(k in categories){
    for(i in filteredData){
    }
    var selectedCategories = window.checkedValues[categories[k]]
    if(selectedCategories.length > 0){
      var filteredData = filteredData.filter(i => selectedCategories.indexOf(i[categories[k]].toString()) !== -1)
    }
  }
  return(filteredData)
}

//Filter out group with only missing values
function filterNull(yAxis, labels){
  
  //Removes category with only missing values
  var newY = []
  var newL = []
  for(t in yAxis){
    var all0 = yAxis[t].every(i => i === 0)
    if(all0 === false){
      newY.push(yAxis[t])
      newL.push(labels[t])
    }
  } 
     
  return [newY, newL]
}

//Removes x Axis and labels with only missing values
function removeNullColumns(yAxis, xAxis, labels){
  
  //Identifies which columns have only 0 values
  var columns = []
  for(a in yAxis[0]){
    var column = []
    for(t in yAxis){
      column.push(yAxis[t][a])
    }
    columns.push(column)
  }

  var columnsToKeep = []
  for(k in columns){
    if(columns[k].every(l => l === 0) === false){
      columnsToKeep.push(Number(k))
    }
  }
  
  for(k in yAxis){
    yAxis[k] = columnsToKeep.map((item) => yAxis[k][item])
  }

  xAxis = columnsToKeep.map((item) => xAxis[item])

  return [yAxis, xAxis, labels]
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

