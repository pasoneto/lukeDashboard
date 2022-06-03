//Generates data object to feed into graph
function colorGenerator(yAxis){
  var randomColors = [];
  for (var i=0; i<yAxis.length; i++) {
      var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
      randomColors.push(randomColor)
  }
  return randomColors
}

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
          fill: fill 
      };
  }
  return dataConstructor
}

//Generates graph and appends to given element by ID
function graphCustom(xAxis, yAxis, labels, id, type, title, randomColors, showLegend = true, fill = false){
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
        }
      }]
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
    html = '<div id="selectedVariables"></div>'+
           '<div class="row">'+
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
    html = '<div id="selectedVariables"></div>'+
           '<div class="row">'+
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

function singleLabelExtractor(checkedValues, labels){
  var selectedCats = Object.values(checkedValues)
  var selectedValues = Object.keys(checkedValues)
  json = ""
  for(k in selectedCats){
    if(selectedCats[k].length == 1){
      //Except dependent variable, which doesn't have a translator. Create more general function for this
      if(selectedValues[k] != "dependentVariable"){
        json += "<strong>" + labels[0]['classifiers'][selectedValues[k]] + "</strong>" + ": " + selectedCats[k] + ";  "
      } else {
        json += "<strong>" + selectedValues[k] + "</strong>" + ": " + labels[0]["dependentVariable"][selectedCats[k]] + ";  "
      }
    }
  }
  return(json)
}

function displeySelectedSingleVariables(checkedValues){
  document.getElementById("selectedVariables").innerHTML = checkedValues
}
