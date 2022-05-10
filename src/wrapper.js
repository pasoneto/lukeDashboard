//Renders database selection
var optionNames = ["Green house gass emission",
                   "Vegetables grown in the open",
                   "Agricultural enterprises",
                   "Crop yiealds"]

var options = ['http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/08%20Indikaattorit/02%20Ilmastonmuutos/02%20Maatalouden%20kasvihuonekaasupäästöt/01_Maatal_kasvihuonekaasupaastot.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/04%20Tuotanto/20%20Puutarhatilastot/05_Vihannesviljely_avomaa_kokonaistuotanto.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/02%20Rakenne/02%20Maatalous-%20ja%20puutarhayritysten%20rakenne/01_Maatalous_ja_puutarhayrit_lkm_ELY.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/04%20Tuotanto/14%20Satotilasto/01_Viljelykasvien_sato.px']

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
  
  //Generate checkbox inside box
  generateCheckBoxes(categories, options, 'boxTop')
  
  //Add function to show checkboxes div
  document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}

  var dropdownCategories = []
  //Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
  document.getElementById("buttonDimensionSelector").onclick = function(){

    showBoxSelector("boxTop") //Hide box with checkboxes
    
    //Selects only categories with multiple values checked
    var dropdownCategories;
    pickMultiClassCategories(checkedValues, categories) 

    //Create dropdown menu for dimension seletion. Only multiclasses
    dropDownSelection('axisSelector', window.dropdownCategories, window.dropdownCategories, ['group'], "dimensionSelector", nRuns = 1)

    //Add back function to show checkboxes div
    document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}
  }
  

  //Creates empty object with category keys
  var checkedValues = checkedValuesObjectGenerator(categories)
  var allCheckBoxes = document.querySelectorAll('input');

  //Establishes checkbox verification system. Multiple or single selection
  establishInitial(allCheckBoxes, categories, checkedValues) //Value is written inside the global variable checkedValues

  //Add function to render graph button. Function shows what variables were selected.
  document.getElementById("buttonRender").onclick = function(){

    var groupName = checkSelected('group');
    var filteredAllData = filterDataByCheckBoxSelector(categories, allData, checkedValues)
    var [yAxis, labels] = separateDataInGroups(filteredAllData, groupName, checkedValues)
     
    var xAxisName = window.dropdownCategories.filter(i => i !== groupName)
    var xAxis = window.checkedValues[xAxisName]

    console.log(yAxis)    
    console.log(xAxis)    
    console.log(labels)    
     
    var box = document.getElementById("box")
    var box2 = document.getElementById("box2")
    var box3 = document.getElementById("box3")
    box.innerHTML = '<canvas id="myChart"></canvas>'
    box2.innerHTML = '<canvas id="myChart2"></canvas>'
    box3.innerHTML = '<canvas id="myChart3"></canvas>'
    graphCustom(xAxis, yAxis, labels, "myChart", 'bar', 'Bar plot')
    graphCustom(xAxis, yAxis, labels, "myChart2", 'line', 'Line plot')
    graphCustom(xAxis, yAxis, labels, "myChart3", 'bar', 'Line plot')
    
    //document.getElementById("box").innerHTML = JSON.stringify(window.checkedValues);
  }

  var boxSelector = document.getElementById("boxTop")
  var headerSelector = document.getElementById("categorySelectorHeader")
  dragElement(boxSelector, headerSelector);
  //Initiate map
  var mapRegionsCode = ['01', '02', '03', '04', '05', '10', '06', '07']
  clickableMap(mapRegionsCode, alert)
  showMap(mapRegionsCode)

});




