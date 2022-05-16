//Generates data object to feed into graph
function colorGenerator(yAxis){
  var randomColors = [];
  for (var i=0; i<yAxis.length; i++) {
      var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
      randomColors.push(randomColor)
  }
  return randomColors
}

function dataGenerator(yAxis, labels, randomColors){
  console.log(randomColors)
  var dataConstructor = [];
  for (var i=0; i<yAxis.length; i++) {
      var label = labels[i]
      dataConstructor[i] = {
          label: label,
          data: yAxis[i],
          borderColor: randomColors[i],
          backgroundColor: randomColors[i],
          fill: false 
      };
  }
  return dataConstructor
}

//Generates graph and appends to given element by ID
function graphCustom(xAxis, yAxis, labels, id, type, title, randomColors, showLegend = true){
  console.log(randomColors)
  var dataConstructor = dataGenerator(yAxis, labels, randomColors)
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
