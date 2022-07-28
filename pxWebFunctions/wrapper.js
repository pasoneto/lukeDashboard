var renderMap = false
var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-economydoctor-213x150px.png'
var title = ''
var sourceText = 'PxWeb'
initiateDashboardTT(title, logoURL, renderMap = renderMap, directory = '.', flipperButton = false, sourceText)

var classifiers;
var options;

//Url will be passed by user, depending on the report selected. To test on different reports,
//Change URL value
//var url = 'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/02%20Rakenne/02%20Maatalous-%20ja%20puutarhayritysten%20rakenne/01_Maatalous_ja_puutarhayrit_lkm_ELY.px'
var url = 'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/08%20Indikaattorit/02%20Ilmastonmuutos/02%20Maatalouden%20kasvihuonekaasupäästöt/01_Maatal_kasvihuonekaasupaastot.px'
//var url = 'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/02%20Rakenne/02%20Maatalous-%20ja%20puutarhayritysten%20rakenne/01_Maatalous_ja_puutarhayrit_lkm_ELY.px'

//Wrapper function to fetch data
async function wrapData(url){
  var baseData = await baseURL(url)
  var queryBody = await queryBodyMaker(baseData)

  //Fetch all data from given report
  var allData = await fetch(url, queryBody);
  var allData = await allData.json();

  var allData = await restructureData(baseData, allData)
  var allData = Object.values(allData)

  return (allData)
}

//Wrapper function to generate graphs
function wrapGraph(nMulticlassClassifiers){
    if(nMulticlassClassifiers == 2){
      renderGraphBoxes(nMulticlassClassifiers, renderMap)

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

      graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Title")
      graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Title", showLegend = true)

      //Rendering up to 3 pieCharts
      var pieColors = colorGenerator(xAxis1)
      var htmlPieCharts = '';

      var nPieCharts = Math.min(yAxis1.length, 3)
      generatePieChartsContainers(nPieCharts)

      displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer")

      for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
        graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
      }
    }
    if(nMulticlassClassifiers == 1) {

      renderGraphBoxes(nMulticlassClassifiers, renderMap)

      var group1 = window.multiClassClassifiers[0]
      var xAxisName1 = classifiers.filter(i=>i !== group1)[0]

      var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

      var xAxis1 = window.checkedValues[xAxisName1]

      //Filtering null and missing values
      var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
      
      console.log(xAxis1)
      console.log(yAxis1)

      //End of filtering null and missing values
      
      graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Title")

      displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer")
      //displaySelectedSingleVariables(window.checkedValues)

    } if(nMulticlassClassifiers < 1) {
      
      renderGraphBoxes(nMulticlassClassifiers, renderMap)

      var group1 = classifiers[0]
      var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

      var xAxis1 = window.checkedValues[group1]
      console.log(xAxis1)
      console.log(yAxis1)
      //Filtering null and missing values
      var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
      //End of filtering null and missing values

      graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "")
      
      displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer")
      //Display single variable names
      //var singleLabels = singleLabelExtractor(window.checkedValues, labels) 
      //displeySelectedSingleVariables(singleLabels)
    }
}

//Fetching data
var allData = wrapData(url)

//After data has been cheched:
allData.then(allData => { 

  //Extract classifiers and options
  var [classifiers, options] = extractCategoriesAndOptions(allData, 'value')
  
  //Store values as global variables, so it is accessible by the whole system
  window.classifiers = classifiers
  window.options = options

  //Generate checkboxes 
  generateCheckBoxes(classifiers, options, 'boxTop', allData)
  
  //Creates empty object with category keys
  var checkedValues = checkedValuesObjectGenerator(classifiers)
  var allCheckBoxes = document.querySelectorAll('input');

  //Establishes checkbox verification system. Multiple or single selection
  checkBoxVerificationSystem(classifiers, checkedValues, allData, filterDataByCheckBox) //Output is written inside the global variable checkedValues

  //Establish initial -automated- graphing 
  var multi = [classifiers[Math.floor(Math.random() * classifiers.length)]] //Selects one random classifier
  var secondMulti = classifiers.filter(i=>i !== multi[0])
  var secondMulti = secondMulti[Math.floor(Math.random() * secondMulti.length)];
  multi.push(secondMulti)

  //Establishing the single classifiers
  var single = classifiers.filter(i => multi.includes(i) == false)

  //Adding graphing pipeline to the Render graph button:
  document.getElementById("buttonDimensionSelector").onclick = function(){
    showBoxSelector("boxTop") //Hide box with checkboxes
    pickMultiClassClassifiers(checkedValues, classifiers) //Selects classifiers which will be used as group and xAxis  
    var nMulticlassClassifiers = window.multiClassClassifiers.length //Verifying how many multi-classifiers the user chose (ex of 2 multi-classifiers => years: 2001, 2002, regions: lapland, uusima)
    wrapGraph(nMulticlassClassifiers) //Calling wrapper function
  }
  
  //Running click simulation
  simulateSelection(multi, single)
  document.getElementById("buttonDimensionSelector").click()
  showBoxSelector("boxTop") //Hide box with checkboxes
  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer")
});
