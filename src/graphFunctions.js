//Generates data object to feed into graph
function dataGenerator(yAxis, labels){
  var dataConstructor = [];
  for (var i=0; i<yAxis.length; i++) {
      var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
      var label = labels[i]
      dataConstructor[i] = {
          label: label,
          data: yAxis[i],
          borderColor: randomColor,
          backgroundColor: randomColor,
          fill: false 
      };
  }
  return dataConstructor
}

//Generates graph and appends to given element by ID
function graphCustom(xAxis, yAxis, labels, id, type, title, showLegend = true){
  var dataConstructor = dataGenerator(yAxis, labels)
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
function graphCustomPie(xAxis, yAxis, id, type, title){
  var barColors = [];
  for (var i=0; i<yAxis.length; i++) {
    var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    barColors.push(randomColor)
  }
  new Chart(id, {
    type: type,
    data: {
      labels: xAxis,
      datasets: [{
        backgroundColor: barColors,
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
