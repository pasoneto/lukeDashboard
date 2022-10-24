//Basic URL. Shows all parameters that are available for the particular variable.
async function baseURL(url){
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function queryBodyMaker(r){
      var query = []
      var lObj = r.variables.length
      for (let i = 0; i < lObj; i++) {
        let opt = r.variables[i]
        var values = [];
        for(let x = 0; x < opt.values.length; x++){
            values.push(opt.values[x]) //Select values that exist in checked values
        }
        var objQuery = {code: opt.code, selection: {filter: "item", values: values} }
        query.push(objQuery);
      }
      var rawBody = query;
      var query = {query: query, response: {"format": "json"}}
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(query)
      };
      return options
}

//Structures json into more readable format.
//Data is the raw response, base are the parameters associated with each API call.
function restructureData(base, data){
  var objData = {}
  for(i in data.data){
    var json = { };
    for(k in data.data[i].key){
      var key = base.variables[k].code;
      json[key] = data.data[i].key[k];
      json["value"] = data.data[i].values[0];
    }
    objData[i] = json;
  } 
  return objData
}

//Wrapper function to fetch data
async function fetchDataWrapper(url){
  //Fetching data from pxWeb-API
  var baseData = await baseURL(url) //Gets all categories and options available in the API call
  var queryBody = await queryBodyMaker(baseData) //Perfors conversion of the available categories options to make API request

  //Fetch all data from given report
  var allData = await fetch(url, queryBody);
  var allData = await allData.json();
  
  var report = allData['metadata'][0]['label']

  var allData = await restructureData(baseData, allData)
  var allData = Object.values(allData)
  return([allData, report])
}

function wrapGraph(){
  //Verifies if user chose at least one options for each classifier. If not, random assignment is made
  SmartDasher.verifyAllClassifiersChecked(checkedValues)
  //Selects categories which will be used as group and xAxis  
  SmartDasher.pickMultiClassClassifiers(checkedValues, categories)
  var nMulticlassClassifiers = window.multiClassClassifiers.length

  //For when there are 2 milticlass classifier
  if(nMulticlassClassifiers == 2){

    SmartDasher.renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = window.multiClassClassifiers[0]
    var group2 = window.multiClassClassifiers[1]

    var xAxisName1 = window.multiClassClassifiers[1]
    var xAxisName2 = window.multiClassClassifiers[0]

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = SmartDasher.separateDataInGroups(window.filteredData, group2, checkedValues)
    
    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = SmartDasher.nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values

    var xAxis1 = xAxis1.map(i=>SmartDasher.shortenLabel(i, 10))
    var xAxis2 = xAxis2.map(i=>SmartDasher.shortenLabel(i, 19))
  
    graph1 = SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", '', showLegend = true)
    graph2 = SmartDasher.graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", '', showLegend = true)

    //Rendering up to 2 pieCharts
    var pieColors = SmartDasher.colorGenerator(xAxis2)

    var nPieCharts = Math.min(yAxis2.length, 2)
    SmartDasher.generatePieChartsContainers(nPieCharts)

    if(nPieCharts == 2){
      pie1 = SmartDasher.graphCustomPie(xAxis2, yAxis2[yAxis2.length-1], "myChart" + 2, "doughnut", labels2[yAxis2.length-1], pieColors)
      pie2 = SmartDasher.graphCustomPie(xAxis2, yAxis2[0], "myChart" + 3, "doughnut", labels2[0], pieColors)
    }

  } 
  
  ///////For when there is only 1 milticlass classifier
  if(nMulticlassClassifiers == 1) {

    SmartDasher.renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = categories.filter(i=>i !== group1)[0]

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    var labels1 = labels1.map(i=>SmartDasher.shortenLabel(i, 19))

    graph1 = SmartDasher.graphCustom(labels1, [yAxis1.map(i=> i[0])], '', "myChart", 'line', '', showLegend=false)
    
    //Rendering up to 3 pieCharts
    var pieColors = SmartDasher.colorGenerator(labels1)
    var nPieCharts = Math.min(yAxis1.length, 3)

    SmartDasher.generatePieChartsContainers(2)
    document.getElementById("myChart3").style.width = "100%"
 
    //Define position of legend based on number of categories
    if(labels1.length >= 15){
      var position = 'right'
    } else {
      var position = 'bottom'
    }
    graph2 = SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart3", 'bar', '', position=position)
    pie1 = SmartDasher.graphCustomPie(labels1, yAxis1.map(i=>i[0]), "myChart2", "doughnut", 'Proportions', pieColors, legend=true, position=position)

  } if(nMulticlassClassifiers < 1) {
    
    SmartDasher.renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = categories[0]
    var xAxisName1 = categories[1]

    var [yAxis1, labels1] = SmartDasher.separateDataInGroups(window.filteredData, group1, checkedValues)
    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = SmartDasher.nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    var xAxis1 = xAxis1.map(i=>SmartDasher.shortenLabel(i, 19))
    graph1 = SmartDasher.graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', '')

  }
}
