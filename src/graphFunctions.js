//Choose color to fill in graph
function _randomNoRepeats(array) {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

function colorGenerator(yAxis){
  var choices = ['#B35C00', '#CC0082', '#000000', '#FF8200', '#CCF0FA', '#E3F2D1', '#009FC7', '#54585A', '#E5D9EB', '#CCD6ED', '#528316', '#007B9A', '#FFCCEB', '#7F3F98', 'DEDEDE', '#78BE20', '#E13C98', '#E07400', '#00B5E2', '#65A11B', '#FFE5CC', '#0033A0']
  var randomColors = [];
  for (var i=0; i<yAxis.length; i++) {
      var randomColor = _randomNoRepeats(choices);
      randomColors.push(randomColor())
  }
  return randomColors
}

//Generates data object to feed into graph
function _dataGenerator(yAxis, labels, randomColors, fill){
  var dataConstructor = [];
  for (var i=0; i<yAxis.length; i++) {
      var label = labels[i]
      dataConstructor[i] = {
          label: label,
          tension: 0,
          data: yAxis[i],
          borderColor: randomColors[i],
          backgroundColor: randomColors[i],
          fill: fill,
          borderWidth: 1,
      };
  }
  return dataConstructor
}
// Chart.defaults.global.defaultFontColor = "black";
//Generates graph and appends to given element by ID
function graphCustom(xAxis, yAxis, labels, id, type, title, showLegend = true, fill = false, suggestedMin = null, position = 'bottom'){
  var randomColors = colorGenerator(yAxis);
  var dataConstructor = _dataGenerator(yAxis, labels, randomColors, fill)
  new Chart(id, {
    type: type,
    data: {
      labels: xAxis,
      datasets: dataConstructor },
    options: {
      legend: {
        display: showLegend,
        position: position,
      },
      title: {
        display: true,
        text: title
      },
      spanGaps: true, //Interpolates missing data
      maintainAspectRatio: false,
      scaleShowValues: true,
      scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
          minRotation: 45,
        },
        gridLines: {
          display: false,
        },
      }],
      yAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          suggestedMin: suggestedMin,
        }
      }],
      }
    }
  });
};

//Pie chart
function graphCustomPie(xAxis, yAxis, id, type, title, randomColors, legend = false, position = 'bottom'){
  new Chart(id, {
    type: type,
    data: {
      labels: xAxis,
      datasets: [{
        backgroundColor: randomColors,
        data: yAxis
      }]
    },
    options: {
      legend: {
        display: legend,
        position: position,
      },
      title: {
        display: true,
        text: title 
      },
      spanGaps: true, //Interpolates missing data
      maintainAspectRatio: false,
    }
  })
}

//Verifies which classifiers were selected as single-classifiers, and what were the options selected made
function _singleLabelExtractor(checkedValues, exception = null, labels = null){
  //var singleLabels = singleLabels.map(i => labels[0]['subLabels'][xAxisName1][i])
  var selectedOptions = Object.values(checkedValues)
  var selectedClassifiers = Object.keys(checkedValues)
  json = ""
  if(labels){
    for(k in selectedOptions){
      if(selectedOptions[k].length == 1){ //Verify if it is single classifier
        //Except dependent variable, which doesn't have a translator. Create more general function for this
        if(selectedClassifiers[k] != exception){
          json += "<strong>" + labels[0]['classifiers'][selectedClassifiers[k]] + "</strong>" + ": " + labels[0]['subLabels'][selectedClassifiers[k]][selectedOptions[k]] + ";  "
        } else {
          json += "<strong>" + selectedClassifiers[k] + "</strong>" + ": " + labels[0]["dependentVariable"][selectedOptions[k]] + ";  "
        }
      }
    }
  } else {
    for(k in selectedOptions){
      if(selectedOptions[k].length == 1){
        //Except dependent variable, which doesn't have a translator. Create more general function for this
        if(selectedClassifiers[k] !== exception){
          json += "<strong>" + selectedClassifiers[k] + "</strong>" + ": " + selectedOptions[k] + ";  "
        } else {
          json += "<strong>" + selectedClassifiers[k] + "</strong>" + ": " + selectedOptions[k] + ";  "
        }
      }
    }
  }
  return(json)
}

function displaySelectedSingleVariables(checkedValues, exception = null, labels = null){
  var cV = _singleLabelExtractor(checkedValues, exception, labels)
  document.getElementById("selectedVariables").innerHTML = cV
}

function displayNonGraphs(filteredData, whereToAppend){
  var noDisplay = Object.values(filteredData).every(i => i.value === 0 || i.value === null)
  if(noDisplay){
    document.getElementById("graphsContainer").innerHTML = "<div id='noGraphContainer'><div id='noGraph'><div id='textNoGraph'><p><i class='fa fa-info-circle' aria-hidden='true'></i></i>  Sorry, there is no data for this selection</p><p id='textNoGraph2'>Please, try a different combination of variables</div></p></div></div>"
  }
}

//Wrap up graph functions for convenience
function wrapGraph(checkedValues, categories, filteredData){

  var multiClassClassifiers;  //Selects categories which will be used as group and xAxis  
  pickMultiClassClassifiers(checkedValues, categories, multiClassClassifiers)

  var nMulticlassClassifiers = window.multiClassClassifiers.length
  console.log("Rendered boxes")

  //For when there are 2 multiclass classifier
  if(nMulticlassClassifiers == 2){

    renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[1]
    var group2 = window.multiClassClassifiers[0]

    var xAxisName1 = window.multiClassClassifiers[0]
    var xAxisName2 = window.multiClassClassifiers[1]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = separateDataInGroups(window.filteredData, group2, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values
    
    graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + group1)
    graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + group2, showLegend = true)

    //Rendering up to 3 pieCharts
    var pieColors = colorGenerator(xAxis1)
    var nPieCharts = Math.min(yAxis1.length, 3)
    generatePieChartsContainers(nPieCharts)

    for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
      graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
    }
  console.log("Rendered graphs")
  } 
  ///////For when there is only 1 multiclass classifier
  if(nMulticlassClassifiers == 1) {

    renderGraphBoxes(nMulticlassClassifiers)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = categories.filter(i=>i !== group1)[0]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1)
    
  } if(nMulticlassClassifiers < 1) {

    renderGraphBoxes(1)

    var group1 = categories[0]
    var xAxisName1 = categories[1]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var xAxis1 = window.checkedValues[xAxisName1]

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1)
    
  }

}

function nextDependent(categoriesAndOptions, plus, dependentIndex, dependentName){
  Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
  };
  if(plus){
    var dependentOptions = categoriesAndOptions[dependentName]
    window.dependentIndex = dependentIndex + 1
    var ticks = document.getElementById(dependentName)
    var ticks = ticks.getElementsByTagName("input")
    ticks[window.dependentIndex.mod(dependentOptions.length)].click()
  } else {
    var dependentOptions = categoriesAndOptions[dependentName]
    window.dependentIndex = dependentIndex - 1
    var ticks = document.getElementById(dependentName)
    var ticks = ticks.getElementsByTagName("input")
    ticks[window.dependentIndex.mod(dependentOptions.length)].click()
  }
}

