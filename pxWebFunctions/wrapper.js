//Renders database selection
var optionNames = ["Green house gass emission",
                   "Vegetables grown in the open",
                   "Agricultural enterprises",
                   "Crop yiealds"]

var options = ['http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/08%20Indikaattorit/02%20Ilmastonmuutos/02%20Maatalouden%20kasvihuonekaasupäästöt/01_Maatal_kasvihuonekaasupaastot.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/04%20Tuotanto/20%20Puutarhatilastot/05_Vihannesviljely_avomaa_kokonaistuotanto.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/02%20Rakenne/02%20Maatalous-%20ja%20puutarhayritysten%20rakenne/01_Maatalous_ja_puutarhayrit_lkm_ELY.px']

//Rendering selector for database
var optionIDS = ['Database']
dropDownSelection('dropdown-btn', options, optionNames, optionIDS, 'statisticsSelector', nRuns = 1)

//Adding event listener for database selector
var dataBaseSelector = document.getElementById('Database')
dataBaseSelector.addEventListener('change', async function() {

  //Fetch data
  var url = checkSelected('Database');
  var baseData = await baseURL(url);
  
  //Prepare POST request to get all data
  var queryBody = await queryBodyMaker(baseData)
  
  //Fetch all data from given report
  var allData = await fetch(url, queryBody);
  var allData = await allData.json();
  var allData = await restructureData(baseData, allData)
  var allData = Object.values(allData)
  
  //Extracting categories and options
  var categories = baseData['variables'].map(i => i.code);
  var options = baseData['variables'].map(i => i.values)
  console.log(categories)  
  console.log(options)  

  //Generate checkbox inside box
  generateCheckBoxes(categories, options, 'boxTop', baseData)
  
  //Add function to show checkboxes div
  document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}

  //Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
  document.getElementById("buttonDimensionSelector").onclick = function(){

    showBoxSelector("boxTop") //Hide box with checkboxes
    
    //Create dropdown menu for dimension seletion. Only multiclasses
    //dropDownSelection('axisSelector', window.dropdownCategories, window.dropdownCategories, ['group'], "dimensionSelector", nRuns = 1)

    //Add back function to show checkboxes div
    document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}
  }
  
  //Creates empty object with category keys
  var checkedValues = checkedValuesObjectGenerator(categories)
  var allCheckBoxes = document.querySelectorAll('input');

  //Establishes checkbox verification system. Multiple or single selection
  establishInitial(allCheckBoxes, categories, checkedValues, allData, filterDataByCheckBoxSelector) //Value is written inside the global variable checkedValues

  //Add function to render graph button. Function shows what variables were selected.
  document.getElementById("buttonDimensionSelector").onclick = function(){

    //Selects categories which will be used as group and xAxis  
    var dropdownCategories;
    pickMultiClassCategories(checkedValues, categories, dropdownCategories)

    var nMulticlassClassifiers = window.dropdownCategories.length


    //For when there are 2 milticlass classifier
    if(nMulticlassClassifiers == 2){

      renderGraphBoxes("graphsContainer", nMulticlassClassifiers)

      var group1 = window.dropdownCategories[1]
      var group2 = window.dropdownCategories[0]

      var xAxisName1 = window.dropdownCategories[0]
      var xAxisName2 = window.dropdownCategories[1]

      window.filteredDataForMap = filterDataByCheckBoxSelectorTT(categories, allData, window.checkedValues)

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

      //Translates variables given the label. Change this to more general function
      if(group1 == 'dependentVariable'){
        var labels1 = labels1.map(i => labels[0][group1][i])
      }
      if(group2 == 'dependentVariable'){
        var labels2 = labels2.map(i => labels[0][group2][i])
      }

      graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", "Comparing by " + group1, randomColors1)
      graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", "Comparing by " + group2, randomColors2, showLegend = true)


      //Rendering up to 3 pieCharts
      var pieColors = colorGenerator(xAxis1)
      var htmlPieCharts = '';

      var nPieCharts = Math.min(yAxis1.length, 3)
      for (var i = 2; i < nPieCharts+2; i++){
        if(nPieCharts == 3){
          var dimensionGraph = '32.6%'
        }
        if(nPieCharts == 2){
          var dimensionGraph = '49%'
        }
        htmlPieCharts += '<div class="column graphBox3" style="width:' + dimensionGraph + '" id="box' + i + '">'+
                         '<canvas id="myChart' + i + '"></canvas>'+
                         '</div>'
      }
      document.getElementById("pieChartsContainer").innerHTML = htmlPieCharts

      for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
        graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "pie", labels1[i-2], pieColors)
      }

      //Display single variable names
      //var singleLabels = singleLabelExtractor(window.checkedValues, labels)
      //displeySelectedSingleVariables(singleLabels)
      
      console.log(filteredDataForMap) 
      var mrc = filteredDataForMap.map(i=>i['ELY-keskus']).filter(onlyUnique)
      console.log(mrc)
      drawMap(ely, 'ely', mrc, filteredDataForMap)
      showBoxSelector("boxTop") //Hide box with checkboxes
    } 
    
    ///////For when there is only 1 milticlass classifier
    if(nMulticlassClassifiers == 1) {

      renderGraphBoxes("graphsContainer", nMulticlassClassifiers)

      var group1 = window.dropdownCategories[0]
      var xAxisName1 = categories.filter(i=>i !== group1)[0]

      window.filteredDataForMap = filterDataByCheckBoxSelectorTT(categories, data, window.checkedValues)

      var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

      var xAxis1 = window.checkedValues[xAxisName1]

      //Filtering null and missing values
      var [yAxis1, labels1] = filterNull(yAxis1, labels1)

      var [yAxis1, xAxis1, labels1] = removeNullColumns(yAxis1, xAxis1, labels1)

      //End of filtering null and missing values

      var box = document.getElementById("box")
      box.innerHTML = '<canvas id="myChart"></canvas>'

      var randomColors1 = colorGenerator(yAxis1);

      graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1, randomColors1)
      
      //Display single variable names
      //var singleLabels = singleLabelExtractor(window.checkedValues, labels)
      //displeySelectedSingleVariables(singleLabels)

    } if(nMulticlassClassifiers < 1) {
      
      renderGraphBoxes("graphsContainer", nMulticlassClassifiers)

      var group1 = categories[0]
      var xAxisName1 = categories[1]

      window.filteredDataForMap = filterDataByCheckBoxSelectorTT(categories, data, window.checkedValues)

      var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

      var xAxis1 = window.checkedValues[xAxisName1]

      //Filtering null and missing values
      var [yAxis1, labels1] = filterNull(yAxis1, labels1)

      var [yAxis1, xAxis1, labels1] = removeNullColumns(yAxis1, xAxis1, labels1)

      //End of filtering null and missing values

      var box = document.getElementById("box")
      box.innerHTML = '<canvas id="myChart"></canvas>'

      var randomColors1 = colorGenerator(yAxis1);

      graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', "Comparing by " + group1, randomColors1)
      
      //Display single variable names
      //var singleLabels = singleLabelExtractor(window.checkedValues, labels)
      //displeySelectedSingleVariables(singleLabels)

      }

    //document.getElementById("box").innerHTML = JSON.stringify(window.checkedValues);
  }

  var boxSelector = document.getElementById("boxTop")
  var headerSelector = document.getElementById("categorySelectorHeader")
  dragElement(boxSelector, headerSelector);
  

});




