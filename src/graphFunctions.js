//Runs through list of classifiers and sees which boxes were checked.
function selectTarget(allDataObject, selectedValue){
  var c = rawBody.filter(i => i.code == catTarget)[0]
  return c.selection.values
}



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
function graphCustom(xAxis, yAxis, labels, id, type, title){
  var dataConstructor = dataGenerator(yAxis, labels)
  new Chart(id, {
    type: type,
    data: {
      labels: xAxis,
      datasets: dataConstructor },
    options: {
      legend: {
        display: true,
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