//Initiating global variables
var filteredDataForMap;
var filteredData;
var multiClassClassifiers;

//Adding event listener for database selector
var classifiers = Object.keys(classifierLabels[0])

var data = reshapeJSON(data, classifiers)

var allLabels = mergeLabelsObject(classifiers, classifierSubLabels)

allLabels["dependentVariable"] = dependentLabels[0]

var labels = [{"dependentVariable": dependentLabels[0], "classifiers": classifierLabels[0], "subLabels": allLabels}]

//Function translates value -1 to its label (because this does not come from ED's backend)
function _averageSubClass(i){if(i === -1){return('Keskiarvo')}else{return(i)}}

//Extracting classifiers and options
var classifiers = Object.keys(data[0])
var classifiers = classifiers.filter(i => i !== 'value')
var options = []
for(k in classifiers){
  var a = data.map(i=>i[classifiers[k]])
  var a = a.filter(onlyUnique)
  var a = a.filter(i => {return i !== "N" && i !== 'eyelain' && i !== 'otos'});
  options.push(a)
}
var options = options.filter(i=> i[0] !== undefined)

var classifiersAndOptions = {}
for(k in classifiers){
  var a = data.map(i=>i[classifiers[k]])
  var a = a.filter(onlyUnique)
  var a = a.filter(i => {return i !== "N" && i !== 'eyelain' && i !== 'otos'});
  classifiersAndOptions[classifiers[k]] = a
}

var map;

//Generate checkbox inside box
generateCheckBoxes(classifiers, options, data, 'dependentVariable', labels)

document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Show underlining map</button>'

//Add function to show checkboxes div
document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}

//Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
var buttonsRenderGraph = document.querySelectorAll(`[id^="buttonDimensionSelector"]`)
//Applying render function to these buttons
for(k in buttonsRenderGraph){
  buttonsRenderGraph[k].onclick = function(){
    showBoxSelector("boxTop") //Hide box with checkboxes
    completeWrap() 
    displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer")
    //Add back function to show checkboxes div
    document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}
  }
}

//Creates empty object with category keys
var checkedValues = checkedValuesObjectGenerator(classifiers)

//Establishes checkbox verification system. Multiple or single selection
checkBoxVerificationSystem(classifiers, checkedValues, data, filterDataByCheckBox, exception = "dependentVariable") //Value is written inside the global variable checkedValues

function completeWrap(){
  //Selects classifiers which will be used as group and xAxis  
  pickMultiClassClassifiers(checkedValues, classifiers)

  var nMulticlassClassifiers = window.multiClassClassifiers.length

  //For when there are 2 milticlass classifier
  if(nMulticlassClassifiers == 2){

    renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[1]
    var group2 = window.multiClassClassifiers[0]

    var xAxisName1 = window.multiClassClassifiers[0]
    var xAxisName2 = window.multiClassClassifiers[1]

    window.filteredDataForMap = filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = separateDataInGroups(window.filteredData, group2, checkedValues)
    
    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values

    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var xAxis2 = xAxis2.map(i => labels[0]['subLabels'][xAxisName2][i])

    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])
    var labels2 = labels2.map(i => labels[0]['subLabels'][group2][i])

    var group1Label = labels[0]['classifiers'][group1]
    var group2Label = labels[0]['classifiers'][group2]

    graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + group1Label)
    graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + group2Label, showLegend = true)

    //Rendering up to 3 pieCharts
    var pieColors = colorGenerator(xAxis1)
    var htmlPieCharts = '';

    var nPieCharts = Math.min(yAxis1.length, 3)
    generatePieChartsContainers(nPieCharts)

    for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
      graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
    }

    //Display single variable names
    displaySelectedSingleVariables(window.checkedValues, exception = "dependentVariable", labels)
  } 
  
  ///////For when there is only 1 milticlass classifier
  if(nMulticlassClassifiers == 1) {

    renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = classifiers.filter(i=>i !== group1)[0]

    window.filteredDataForMap = filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    
    //End of filtering null and missing values
    
    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])
    var group1Label = labels[0]['classifiers'][group1]

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1Label)
    
    //Display single variable names
    displaySelectedSingleVariables(window.checkedValues, labels = labels)

  } if(nMulticlassClassifiers < 1) {
    
    renderGraphBoxes(nMulticlassClassifiers)

    var group1 = classifiers[0]
    var xAxisName1 = classifiers[1]

    window.filteredDataForMap = filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "")
    
    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels) 
    displeySelectedSingleVariables(singleLabels)

  }

  //Getting only region codes that exist in data
  var mrc = renameMapRegions(filteredDataForMap);
  drawMap(maakunta, 'maakunta', mrc, filteredDataForMap, map, labels)
}

//Selecting two multiclass classifiers
var multi = ["vuosi_"];
var classifiersNoVuosi = classifiers.filter(i=>i !== "vuosi_" && i !== "dependentVariable")
var randomElement = classifiersNoVuosi[Math.floor(Math.random() * classifiersNoVuosi.length)];
multi.push(randomElement)

//Establishing the single classifiers
var single = classifiers.filter(i => multi.includes(i) == false)

//Running click simulation
simulateSelection(multi, single)
completeWrap()
displayNonGraphs(window.filteredData) //Display message saying that data is only null or 0

//Establishing initial state of dependentVariable click box
var currentCheck = checkedValues['dependentVariable']
var dependentIndex = classifiersAndOptions['dependentVariable'].indexOf(currentCheck[0])

document.getElementById("nextDependent").onclick = function(){
  nextDependent(classifiersAndOptions, true, window.dependentIndex, "dependentVariable")
  completeWrap()
  displayNonGraphs(window.filteredData)
}
document.getElementById("previousDependent").onclick = function(){
  nextDependent(classifiersAndOptions, false, window.dependentIndex, "dependentVariable")
  completeWrap()
  displayNonGraphs(window.filteredData) //Display message saying that data is only null or 0
}
