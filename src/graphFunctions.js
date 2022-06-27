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
          minRotation: 90,
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
function graphCustomPie(xAxis, yAxis, id, type, title, randomColors){
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
        display: false,
        position: 'bottom',
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
  var selectedCats = Object.values(checkedValues)
  var selectedValues = Object.keys(checkedValues)
  json = ""
  if(labels){
    for(k in selectedCats){
      if(selectedCats[k].length == 1){
        //Except dependent variable, which doesn't have a translator. Create more general function for this
        if(selectedValues[k] != exception){
          json += "<strong>" + labels[0]['classifiers'][selectedValues[k]] + "</strong>" + ": " + selectedCats[k] + ";  "
        } else {
          json += "<strong>" + selectedValues[k] + "</strong>" + ": " + labels[0]["dependentVariable"][selectedCats[k]] + ";  "
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
