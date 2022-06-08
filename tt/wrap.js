//Adding event listener for database selector
var classifiers = Object.keys(classifierLabels[0])
//var data = JSON.parse(data)

var data = reshapeJSON(data, classifiers)

//var maakunta = [{"maakunta": {"1": "Lapland", "2": "Uusima", "3": "Keski-suomi", "4":"Satakunta", "5":"Karjala", "6":"Savo", "7":"Pirkanmaa","8":"Varsinais-Suomi", "9":"Kaakkois-Suomi", "10":"Häme", "11":"Pirkanmaa"}}]
//var production = [{"tuotantosuuntaso": {"1": "Cereal farms", "2": "Mixed production", "3": "Dairy farms", "4":"Pig farms", "5":"Cattle farms", "6":"Poultry farms", "7":"", "8":"", "9":"", "10":""}}]
//var vuosi = [{"vuosi_": {"18": "2018", "19": "2019", "20": "2020", "21":"2021", "22":"2022"}}]

//Concatenating labels for checkboxes
//var labels = [{...labels[0], ...maakunta[0], ...production[0], ...vuosi[0] }]
//var labels = [{...labels[0], ...maakunta[0], ...production[0], ...vuosi[0] }]
var labels = [{"dependentVariable": labels[0], "classifiers": classifierLabels[0]}]

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

//Generate checkbox inside box
generateCheckBoxes(categories, options, 'boxTop', data, labels)

//Add function to show checkboxes div
document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}

//Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
document.getElementById("buttonDimensionSelector").onclick = function(){

  showBoxSelector("boxTop") //Hide box with checkboxes
  
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
//Add function to render graph button. Function shows what variables were selected.
document.getElementById("buttonRender").onclick = function(){

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

    graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + labels[0]['classifiers'][group1], randomColors1)
    graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + labels[0]['classifiers'][group2], randomColors2, showLegend = true)


    //Rendering up to 3 pieCharts
    var pieColors = colorGenerator(xAxis1)
    var htmlPieCharts = '';

    var nPieCharts = Math.min(yAxis1.length, 3)
    for (var i = 2; i < nPieCharts+2; i++){
      if(nPieCharts == 3){
        var dimensionGraph = '32.6%'
      }
      if(nPieCharts == 2){
        var dimensionGraph = '49%'
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
    console.log(labels1)
    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + labels[0]['classifiers'][group1], randomColors1)
    
    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels)
    displeySelectedSingleVariables(singleLabels)

  }

  //Getting only region codes that exist in data
  var mrc = renameMapRegions(filteredDataForMap);
  var statistics = { "01" : 10, "02" : 20, "03" : 5, "04" : 3, "05" : 4, "06" : 7, "07" : 2, "08" : 8, "09" : 3, "10" : 2, "11" : 5, "12" : 5, "13" : 6, "14" : 0, "15" : 10, "16" : 7, }
  
  drawMap(ely, 'ely', mrc, statistics)

  //const mapAreaDiv = document.getElementById('map-chart');
  //const pathRegions = mapAreaDiv.getElementsByTagName('path');

  //Array.from(pathRegions).map(i => applyFunctionMap(i, mrc, filteredDataForMap, "boxTopMap") )
  
}

//document.getElementById(mc[0]).onmouseover = function(){
  //filterHoverMap(dc[0], filteredDataForMap)
  //}

//Initiate map
var boxSelector = document.getElementById("boxTop")
var headerSelector = document.getElementById("categorySelectorHeader")
dragElement(boxSelector, headerSelector);


