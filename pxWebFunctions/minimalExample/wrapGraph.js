//Wrap up graph functions for convenience
function wrapGraph(checkedValues, categories, filteredData){

  var multiClassClassifiers;  //Selects categories which will be used as group and xAxis  
  SmartDasher.pickMultiClassClassifiers(checkedValues, categories, multiClassClassifiers)

  var nMulticlassClassifiers = window.multiClassClassifiers.length
  console.log("Rendered boxes")

  //For when there are 2 multiclass classifier
  if(nMulticlassClassifiers == 2){

    SmartDasher.renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[1]
    var group2 = window.multiClassClassifiers[0]

    var xAxisName1 = window.multiClassClassifiers[0]
    var xAxisName2 = window.multiClassClassifiers[1]

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = SmartDasher.separateDataInGroups(window.filteredData, group2, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = SmartDasher.nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values
    
    SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + group1)
    SmartDasher.graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + group2, showLegend = true)

    //Rendering up to 3 pieCharts
    var pieColors = SmartDasher.colorGenerator(xAxis1)
    var nPieCharts = Math.min(yAxis1.length, 3)
    SmartDasher.generatePieChartsContainers(nPieCharts)

    for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
      SmartDasher.graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
    }

  console.log("Rendered graphs")
  } 
  ///////For when there is only 1 multiclass classifier
  if(nMulticlassClassifiers == 1) {

    SmartDasher.renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = categories.filter(i=>i !== group1)[0]

    window.filteredDataForMap = SmartDasher.filterDataByCheckBox(categories, data, window.checkedValues)

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    var singleLabels = SmartDasher.singleLabelExtractor(window.checkedValues, labels)
    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)

    var title1 = ''
    for(m in singleClassifiers){
      title1 += '<b>' + singleClassifiers[m] + '</b>' + ': ' + singleOptions[m] + '    '
    }
    var title1 = title1.slice(0, -1)

    document.getElementById('selectedVariables').innerHTML = title1

    SmartDasher.graphCustom(labels1, [yAxis1.map(i=> i[0])], '', "myChart", 'line', '', showLegend=false)
    
    //Rendering up to 3 pieCharts
    var pieColors = SmartDasher.colorGenerator(labels1)

    var nPieCharts = Math.min(yAxis1.length, 3)

    SmartDasher.generatePieChartsContainers(2)

    document.getElementById("myChart3").style.width = "100%"
 
    SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart3", 'bar', '')
    SmartDasher.graphCustomPie(labels1, yAxis1.map(i=>i[0]), "myChart2", "doughnut", 'Proportions', pieColors, legend=true) 

  } if(nMulticlassClassifiers < 1) {

    SmartDasher.renderGraphBoxes(nMulticlassClassifiers)

    var group1 = categories[0]
    var xAxisName1 = categories[1]

    window.filteredDataForMap = SmartDasher.filterDataByCheckBox(categories, data, window.checkedValues)

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    //Display single variable names
    var singleLabels = SmartDasher.singleLabelExtractor(window.checkedValues, labels)
    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)

    var title1 = ''
    for(m in singleClassifiers){
      title1 += '<b>' + singleClassifiers[m] + '</b>' + ': ' + singleOptions[m] + '    '
    }
    var title1 = title1.slice(0, -1)
    document.getElementById('selectedVariables').innerHTML = title1

    var xAxis1 = xAxis1.map(i=>SmartDasher.shortenLabel(i, 19))
    SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', '')
  }

}
