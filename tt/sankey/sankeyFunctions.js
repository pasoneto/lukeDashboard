//Creates dropdown selectors for order of Sankey nodes. Classifiers are the available classifiers (vuosi_, tuotantosunta, etc...)
function sankeyControls(classifiers){
    Number.prototype.mod = function (n) {
      return ((this % n) + n) % n;
    };
    var html = '' 
    for(j in classifiers){
      html +=  '<select class="dropdown-btn" id="dropdown-btn' + j + '" onchange="verifySankeyOrder(orderClassifiers)">'
      html += '<option value="' + classifiers[j] + '">' + classifiers[j] + '</option>'
      var firstOption = classifiers[j]
      for(k in classifiers){
        var classifierIndex = Number(Number(k)+1)
        if(classifiers[classifierIndex.mod(3)] !== firstOption){
          html += '<option value="' + classifiers[classifierIndex.mod(3)] + '">' + classifiers[classifierIndex.mod(3)] + '</option>'
        }
      }
      html += '</select>'
    }
    document.getElementById("dimensionSelector").innerHTML += '<div id="sankeyControler"></div>'
    document.getElementById("sankeyControler").innerHTML = html
}

//Verifies which values were selected and assigns it to the global variable orderClassifiers
function verifySankeyOrder(orderClassifiers) {
  var zero = document.getElementById("dropdown-btn0");
  var one = document.getElementById("dropdown-btn1");
  var two = document.getElementById("dropdown-btn2");

  window.orderClassifiers = [zero.options[zero.selectedIndex].value, one.options[one.selectedIndex].value, two.options[two.selectedIndex].value]
}

//Generates connection data for sankey graphs. dependentName is the name of dependent variable ('dependentVariable'). 
//LevelsDependent are the subClassifier levels of the dependent varialbe (income, expenditure). Value field is the json key holding the value to be plotted
//From is the name of the selected classifier (e.g., vuosi_)

//IMPORTANT: Function works, but it assumes that, for each level of the dependentVariable (the expenditure names will be different)
//For instance, income (venda de gado, venda de galinha), outcome (racao de gado, racao de galinha). Isso não é o caso nesse report
//de agora, porque precisamos juntar dois reports from ED.
function connectionGenerator(dependentName, levelsDependent, from, valueField, labels)  {
  var filteredData1 = data.filter(i=> i[dependentName] == levelsDependent[0])
  if(labels){
    var filteredData1 = filteredData1.map(i=> ({'from': labels[0]['subLabels'][from][i[from]], 'to': i[dependentName], 'weight': i[valueField] }))
  } else {
    var filteredData1 = filteredData1.map(i=> ({'from': i[from], 'to': i[dependentName], 'weight': i[valueField] }))
  }
  if(levelsDependent.length == 2){
    var filteredData2 = data.filter(i=> i[dependentName] == levelsDependent[1])
    if(labels){
      var filteredData2 = filteredData2.map(i=> ({'from': levelsDependent[0], 'to': labels[0]['subLabels'][from][i[from]] + ' ' + levelsDependent[1], 'weight': i[valueField] }))
    } else {
      var filteredData2 = filteredData2.map(i=> ({'from': levelsDependent[0], 'to': i[from], 'weight': i[valueField] }))
    }
    filteredData1 = filteredData1.concat(filteredData2)
  }
  return(filteredData1)
}


//Wrap all functions
var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-taloustohtori-200x150px_1.png'
SmartDasher.initiateDashboard("", logoURL)

//Adding event listener for database selector
var classifiers = Object.keys(classifierLabels[0])

//Variable to hold chosen of sankey node. Values assigned by 
var orderClassifiers = classifiers
//Creates checkboxes for sankey order and assigns function to verify which values were chosen
sankeyControls(classifiers)

var data = reshapeJSON(data, classifiers)

var allLabels = mergeLabelsObject(classifiers, classifierSubLabels)
allLabels["dependentVariable"] = dependentLabels[0]
var labels = [{"dependentVariable": dependentLabels[0], "classifiers": classifierLabels[0], "subLabels": allLabels}]

//Extracting categories and options
var [categories, options] = SmartDasher.extractCategoriesAndOptions(data, dependentVariableName = 'value')

SmartDasher.generateCheckBoxes(categories, options, 'boxTop', data, labels)

var checkedValues = SmartDasher.checkedValuesObjectGenerator(categories)
var allCheckBoxes = document.querySelectorAll('input');

//Establishes checkbox verification system. Multiple or single selection
SmartDasher.checkBoxVerificationSystem(categories, checkedValues, data, SmartDasher.filterDataByCheckBox, exception = "dependentVariable") //Value is written inside the global variable checkedValues

var lastChosen = classifiers[classifiers.length-1]
console.log("Last classifier chosen is");
console.log(lastChosen);
var multi = [lastChosen]; //Vuosi is always present, so we pick this as one multiclassifier
var classifiersNoVuosi = classifiers.filter(i=>i !== lastChosen && i !== "dependentVariable")
var randomElement = classifiersNoVuosi[Math.floor(Math.random() * classifiersNoVuosi.length)];
multi.push(randomElement)

//Establishing the single classifiers
var single = categories.filter(i => multi.includes(i) == false)

//Running click simulation
SmartDasher.simulateSelection(multi, single).then(r => {
  document.getElementById("buttonDimensionSelector").click()
  SmartDasher.showBoxSelector("boxTop")
})

function wrapGraphFunction(){
    SmartDasher.showBoxSelector("boxTop")
    document.getElementById("graphsContainer").innerHTML = '<div id="container" style="width: 100vw; height: 60vh"></div>'
    anychart.onDocumentReady(function () {

      // create a sankey diagram instance
      let chart = anychart.sankey();

      var selectedDependent = labels[0]['subLabels']['dependentVariable'][checkedValues['dependentVariable'][0]]
       
      filteredData0 = filteredData.map(i=> ({'from': labels[0]['subLabels'][orderClassifiers[0]][i[orderClassifiers[0]]], 'to': labels[0]['subLabels'][orderClassifiers[1]][i[orderClassifiers[1]]], 'weight': i.value }))
      filteredData1 = filteredData.map(i=> ({'from': labels[0]['subLabels'][orderClassifiers[1]][i[orderClassifiers[1]]], 'to': labels[0]['subLabels'][orderClassifiers[2]][i[orderClassifiers[2]]], 'weight': i.value }))
      filteredData2 = filteredData.map(i=> ({'from': labels[0]['subLabels'][orderClassifiers[2]][i[orderClassifiers[2]]], 'to': selectedDependent, 'weight': i.value }))

      filteredData1 = filteredData1.concat(filteredData2)  
      filteredData1 = filteredData1.concat(filteredData0)  

      // load the data to the sankey diagram instance
      chart.data(filteredData1);

      // set the chart's padding
      chart.padding(50, 90);

      // add a title
      //chart.title('Sankey ' + selectedDependent);

      // set the chart container id
      chart.container("container");

      // draw the chart
      chart.draw();
  });
}

document.getElementById("buttonDimensionSelector").onclick = wrapGraphFunction

document.getElementById("selectDimensionButton").onclick = function(){
    SmartDasher.showBoxSelector("boxTop")
}
document.getElementById("buttonDimensionSelector2").style.display = "none"





