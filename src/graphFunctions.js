//Choose color to fill in graph
function randomNoRepeats(array) {
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
  var choices = ['#F806CC', '#A91079', '#570A57', '#F73D93', '#16003B', '#413F42', '#7F8487', '#EEEEEE', '#8B9A46', '#541212', '#3E065F', '#700B97', '#8E05C2', '#916BBF', '#A12568']
  var choices = ['#E63E6D', '#FEC260', '#DA0037', '#1597BB', '#8FD6E1', '#F05454', '#892CDC', '#BC6FF1', '#000000', '#F2A07B', '#C62A88', '#ED6663', '#FA7D09', '#FF4301', '#29C7AC', '#46B5D1', '#C400C6', '#EAE7AF']
  var randomColors = [];
  for (var i=0; i<yAxis.length; i++) {
      var randomColor = randomNoRepeats(choices);
      randomColors.push(randomColor())
  }
  return randomColors
}

//Generates data object to feed into graph
function dataGenerator(yAxis, labels, randomColors, fill){
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
function graphCustom(xAxis, yAxis, labels, id, type, title, randomColors, showLegend = true, fill = false, suggestedMin = null){
  var dataConstructor = dataGenerator(yAxis, labels, randomColors, fill)
  new Chart(id, {
    type: type,
    data: {
      labels: xAxis,
      datasets: dataConstructor },
    options: {
      legend: {
        display: showLegend,
        position: 'bottom',
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

//nMulticlassClassifiers is the length of the output from function pickMultiClassCategories
//Function renders spaces for 3 graphs if multiclass, and space for 1 graph if single class
function renderGraphBoxes(whereToAppend, nMulticlassClassifiers){
  if(nMulticlassClassifiers == 2){
    html = '<div class="row">'+
                 '<div class="column graphBox" id="box"></div>'+
                 '<div class="column graphBox" id="box1"></div>'+
                 '</div>'+
                 '<div class="row" id="pieChartsContainer">'+
                   '<div class="column graphBox3" id="box2"></div>'+
                   '<div class="column graphBox3" id="box3"></div>'+
                   '<div class="column graphBox3" id="box4"></div>'+
                 '</div>'+
                 '</div>'
  } else {
    html = '<div class="row">'+
             '<div class="graphSingleBox" id="box"></div>'+
           '</div>'
  }
  document.getElementById(whereToAppend).innerHTML = html
}

//If x axis is year, graph type is line. Bar otherwise.
function typegraph(groupName){
  if(groupName !== 'vuosi_'){
    return("line")
  } else {
    return("bar")
  }
}
//
// 1.24
//
function singleLabelExtractor(checkedValues, exception = null, labels = null){
  //var singleLabels = singleLabels.map(i => labels[0]['subLabels'][xAxisName1][i])
  var selectedValues = Object.values(checkedValues)
  var selectedCats = Object.keys(checkedValues)
  json = ""
  if(labels){
    for(k in selectedValues){
      if(selectedValues[k].length == 1){ //Verify if it is single classifier
        //Except dependent variable, which doesn't have a translator. Create more general function for this
        console.log(selectedCats[k])
        console.log(selectedValues[k])
        if(selectedCats[k] != exception){
          json += "<strong>" + labels[0]['classifiers'][selectedCats[k]] + "</strong>" + ": " + labels[0]['subLabels'][selectedCats[k]][selectedValues[k]] + ";  "
        } else {
          json += "<strong>" + selectedCats[k] + "</strong>" + ": " + labels[0]["dependentVariable"][selectedValues[k]] + ";  "
        }
      }
    }
  } else {
    for(k in selectedCats){
      if(selectedCats[k].length == 1){
        //Except dependent variable, which doesn't have a translator. Create more general function for this
        if(selectedValues[k] != exception){
          json += "<strong>" + selectedValues[k] + "</strong>" + ": " + selectedCats[k] + ";  "
        } else {
          json += "<strong>" + selectedValues[k] + "</strong>" + ": " + selectedCats[k] + ";  "
        }
      }
    }
  }
  return(json)
}

function displeySelectedSingleVariables(checkedValues){
  document.getElementById("selectedVariables").innerHTML = checkedValues
}

function displayNonGraphs(filteredData, whereToAppend){
  var noDisplay = Object.values(filteredData).every(i => i.value === 0 || i.value === null)
  if(noDisplay){
    document.getElementById(whereToAppend).innerHTML = "<div id='noGraphContainer'><div id='noGraph'><div id='textNoGraph'><p><i class='fa fa-info-circle' aria-hidden='true'></i></i>  Sorry, there is no data for this selection</p><p id='textNoGraph2'>Please, try a different combination of variables</div></p></div></div>"
  }
}


//Wrap up graph functions for convenience
function wrapGraph(checkedValues, categories, filteredData){

  var dropdownCategories;  //Selects categories which will be used as group and xAxis  
  pickMultiClassCategories(checkedValues, categories, dropdownCategories)

  var nMulticlassClassifiers = window.dropdownCategories.length
  renderGraphBoxes(whereToAppend = 'graphsContainer', nMulticlassClassifiers = 2)
  console.log("Rendered boxes")

  //For when there are 2 multiclass classifier
  if(nMulticlassClassifiers == 2){

    var group1 = window.dropdownCategories[1]
    var group2 = window.dropdownCategories[0]

    var xAxisName1 = window.dropdownCategories[0]
    var xAxisName2 = window.dropdownCategories[1]

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

    console.log(xAxis2)
    console.log(yAxis2)
    console.log(labels2)
    console.log(randomColors2)

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

  console.log("Rendered graphs")
  } 
  ///////For when there is only 1 multiclass classifier
  if(nMulticlassClassifiers == 1) {

    var group1 = window.dropdownCategories[0]
    var xAxisName1 = categories.filter(i=>i !== group1)[0]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    var box = document.getElementById("box")
    box.innerHTML = '<canvas id="myChart"></canvas>'

    var randomColors1 = colorGenerator(yAxis1);

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1, randomColors1)
    
  } if(nMulticlassClassifiers < 1) {

    var group1 = categories[0]
    var xAxisName1 = categories[1]

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var xAxis1 = window.checkedValues[xAxisName1]

    var box = document.getElementById("box")
    box.innerHTML = '<canvas id="myChart"></canvas>'

    var randomColors1 = colorGenerator(yAxis1);
    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1, randomColors1)
    
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
