//Adding event listener for database selector
var classifiers = Object.keys(classifierLabels[0])

var data = reshapeJSON(data, classifiers)

var allLabels = mergeLabelsObject(classifiers, classifierSubLabels)
console.log(allLabels)

var labels = [{"dependentVariable": dependentLabels[0], "classifiers": classifierLabels[0]}]

//Extracting categories and options
var categories = Object.keys(data[0])
var categories = categories.filter(i => i !== 'value')
var options = []
for(k in categories){
  var a = data.map(i=>i[categories[k]])
  var a = a.filter(onlyUnique)
  options.push(a)
}
var options = options.filter(i=> i[0] !== undefined)

var categoriesAndOptions = {}
for(k in categories){
  var a = data.map(i=>i[categories[k]])
  var a = a.filter(onlyUnique)
  categoriesAndOptions[categories[k]] = a
}
//Generate checkbox inside box
generateCheckBoxes(categories, options, 'boxTop', data, labels)

//Initiate base map
var map = L.map("mapBox", {zoomSnap: 0.1}).setView([65.3, 25], 4.7);

var baseTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

var baseTilePresent = false;
map.options.minZoom = 4;

document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Show underlining map</button>'

//Add function to show checkboxes div
document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}

//Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
document.getElementById("buttonDimensionSelector").onclick = function(){

  showBoxSelector("boxTop") //Hide box with checkboxes
  completeWrap() 

  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer")
  //Add back function to show checkboxes div
  document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}
}

//Creates empty object with category keys
var checkedValues = checkedValuesObjectGenerator(categories)
var allCheckBoxes = document.querySelectorAll('input');

//Establishes checkbox verification system. Multiple or single selection
establishInitial(allCheckBoxes, categories, checkedValues, data, filterDataByCheckBoxSelectorTT, exception = "dependentVariable") //Value is written inside the global variable checkedValues

var filteredDataForMap;
var filteredData;

function completeWrap(){
  //
  //Selects categories which will be used as group and xAxis  
  var dropdownCategories;
  pickMultiClassCategories(checkedValues, categories, dropdownCategories)

  var nMulticlassClassifiers = window.dropdownCategories.length

  //For when there are 2 milticlass classifier
  if(nMulticlassClassifiers == 2){

    renderGraphBoxes("graphsContainer", nMulticlassClassifiers)

    var group1 = window.dropdownCategories[1]
    var group2 = window.dropdownCategories[0]

    var xAxisName1 = window.dropdownCategories[0]
    var xAxisName2 = window.dropdownCategories[1]

    window.filteredDataForMap = filterDataByCheckBoxSelectorTT(categories, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = separateDataInGroups(window.filteredData, group2, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]
    
    //Filtering null and missing values
    var [yAxis1, labels1] = filterNull(yAxis1, labels1)
    var [yAxis2, labels2] = filterNull(yAxis2, labels2)

    var [yAxis1, xAxis1, labels1] = removeNullColumns(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = removeNullColumns(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values

    var box = document.getElementById("box")
    var box1 = document.getElementById("box1")
    box.innerHTML = '<canvas id="myChart"></canvas>'
    box1.innerHTML = '<canvas id="myChart1"></canvas>'

    var randomColors1 = colorGenerator(yAxis1);
    var randomColors2 = colorGenerator(yAxis2);

    //Translates variables given the label. Change this to more general function
    if(group1 == 'dependentVariable'){
      var labels1 = labels1.map(i => labels[0][group1][i])
    }
    if(group2 == 'dependentVariable'){
      var labels2 = labels2.map(i => labels[0][group2][i])
    }

    graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + group1, randomColors1)
    graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + group2, randomColors2, showLegend = true)


    //Rendering up to 3 pieCharts
    var pieColors = colorGenerator(xAxis1)
    var htmlPieCharts = '';

    var nPieCharts = Math.min(yAxis1.length, 3)
    for (var i = 2; i < nPieCharts+2; i++){
      if(nPieCharts == 3){
        var dimensionGraph = '32.35%'
      }
      if(nPieCharts == 2){
        var dimensionGraph = '49%'
      }
      if(nPieCharts == 1){
        var dimensionGraph = '98%'
      }
      htmlPieCharts += '<div class="column graphBox3" style="width:' + dimensionGraph + '" id="box' + i + '">'+
                       '<canvas id="myChart' + i + '"></canvas>'+
                       '</div>'
    }
    document.getElementById("pieChartsContainer").innerHTML = htmlPieCharts

    for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
      graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
    }

    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels)
    displeySelectedSingleVariables(singleLabels)
  } 
  
  ///////For when there is only 1 milticlass classifier
  if(nMulticlassClassifiers == 1) {

    renderGraphBoxes("graphsContainer", nMulticlassClassifiers)

    var group1 = window.dropdownCategories[0]
    var xAxisName1 = categories.filter(i=>i !== group1)[0]

    window.filteredDataForMap = filterDataByCheckBoxSelectorTT(categories, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, labels1] = filterNull(yAxis1, labels1)

    var [yAxis1, xAxis1, labels1] = removeNullColumns(yAxis1, xAxis1, labels1)

    //End of filtering null and missing values

    var box = document.getElementById("box")
    box.innerHTML = '<canvas id="myChart"></canvas>'

    var randomColors1 = colorGenerator(yAxis1);

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1, randomColors1)
    
    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels)
    displeySelectedSingleVariables(singleLabels)

  } if(nMulticlassClassifiers < 1) {
    
    renderGraphBoxes("graphsContainer", nMulticlassClassifiers)

    var group1 = categories[0]
    var xAxisName1 = categories[1]

    window.filteredDataForMap = filterDataByCheckBoxSelectorTT(categories, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, labels1] = filterNull(yAxis1, labels1)

    var [yAxis1, xAxis1, labels1] = removeNullColumns(yAxis1, xAxis1, labels1)

    //End of filtering null and missing values

    var box = document.getElementById("box")
    box.innerHTML = '<canvas id="myChart"></canvas>'

    var randomColors1 = colorGenerator(yAxis1);
    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1, randomColors1)
    
    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels)
    displeySelectedSingleVariables(singleLabels)

  }

  //Getting only region codes that exist in data
  var mrc = renameMapRegions(filteredDataForMap);
  drawMap(maakunta, 'maakunta', mrc, filteredDataForMap)
}

//Add function to render graph button. Function shows what variables were selected.
//document.getElementById("buttonRender").onclick = function(){completeWrap()}

//Initiate map
var boxSelector = document.getElementById("boxTop")
var headerSelector = document.getElementById("categorySelectorHeader")
dragElement(boxSelector, headerSelector);

//Selecting two multiclass classifiers
var multi = ["vuosi_"];
var categoriesNoVuosi = categories.filter(i=>i !== "vuosi_" && i !== "dependentVariable")
var randomElement = categoriesNoVuosi[Math.floor(Math.random() * categoriesNoVuosi.length)];
multi.push(randomElement)

//Establishing the single classifiers
var single = categories.filter(i => multi.includes(i) == false)

//Running click simulation
simulateSelection(multi, single)
completeWrap()

var dependentIndex = 0;

document.getElementById("nextDependent").onclick = function(){
  nextDependent(categoriesAndOptions, true, window.dependentIndex, "dependentVariable")
  completeWrap()
  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer")
}
document.getElementById("previousDependent").onclick = function(){
  nextDependent(categoriesAndOptions, false, window.dependentIndex, "dependentVariable")
  completeWrap()
  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer") //Display message saying that data is only null or 0
}

//Variables from SAS:
//data; labels; classifierLabels; varLabs
