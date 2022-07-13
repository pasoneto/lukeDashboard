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

//IMPORTANT: Function works, but it assumes that, for each level of the dependentVariable (the expenditure names will be different)
//For instance, income (venda de gado, venda de galinha), outcome (racao de gado, racao de galinha). Isso não é o caso nesse report
//de agora, porque precisamos juntar dois reports from ED.

//Generates connection data for sankey graphs. dependentName is the name of dependent variable ('dependentVariable'). 
//LevelsDependent are the subClassifier levels of the dependent varialbe (income, expenditure). Value field is the json key holding the value to be plotted
//From is the name of the selected classifier (e.g., vuosi_)
function connectionGenerator(dependentName, levelsDependent, from, valueField, labels)  {
  var filteredData1 = data.filter(i=> i[dependentName] == levelsDependent[0])
  if(labels){
    var filteredData1 = filteredData1.map(i=> ({'from': labels[0]['subLabels'][from][i[from]], 'to': i[dependentName], 'weight': i[valueField] }))
  } else {
    var filteredData1 = filteredData1.map(i=> ({'from': i[from], 'to': i[dependentName], 'weight': i[valueField] }))
  }
  if(levelsDependent.length == 2){
    var filteredData2 = data.filter(i=> i[dependentName] == levelsDependent[1])
    if(labels){
      var filteredData2 = filteredData2.map(i=> ({'from': levelsDependent[0], 'to': labels[0]['subLabels'][from][i[from]] + '2', 'weight': i[valueField] }))
    } else {
      var filteredData2 = filteredData2.map(i=> ({'from': levelsDependent[0], 'to': i[from], 'weight': i[valueField] }))
    }
    filteredData1 = filteredData1.concat(filteredData2)
  }
  return(filteredData1)
}
