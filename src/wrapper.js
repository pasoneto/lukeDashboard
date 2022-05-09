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
  
  //Generate checkbox inside button
  generateCheckBoxes(categories, options, 'boxTop')

  //Generate dropdown selection for x, and group axis
  dropDownSelection('axisSelector', categories, categories, ['xAxis', 'group'], "dimensionSelector", nRuns = 2)

  //Once data has been fetched and checkboxes created, Select dimension button will receive the following functiong
  document.getElementById("buttonDimensionSelector").onclick = function(){
    showBoxSelector("boxTop") //Show box with checkboxes
  }
  
  //Add function to hide selection box to the click of Select Dimension button
  document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")} 

  //Creates empty object with category keys
  var checkedValues = checkedValuesObjectGenerator(categories)
  var allCheckBoxes = document.querySelectorAll('input');

  //Establishes checkbox verification system. Multiple or single selection
  establishInitial(allCheckBoxes, categories, checkedValues) //Value is written inside the global variable checkedValues

  //Add function to render graph button. Function shows what variables were selected.
  document.getElementById("buttonRender").onclick = function(){

    var xAxisName = checkSelected('xAxis');
    var groupName = checkSelected('group');

    var filteredAllData = filterDataByCheckBoxSelector(categories, allData, checkedValues)
    
    var [yAxis, labels] = separateDataInGroups(filteredAllData, groupName, checkedValues)
    var xAxis = window.checkedValues[xAxisName]
    
    

    document.getElementById("box").innerHTML = JSON.stringify(window.checkedValues);
  }

  var boxSelector = document.getElementById("boxTop")
  var headerSelector = document.getElementById("categorySelectorHeader")
  dragElement(boxSelector, headerSelector);
  //Initiate map
  var mapRegionsCode = ['01', '02', '03', '04', '05', '10', '06', '07']
  clickableMap(mapRegionsCode, alert)
  showMap(mapRegionsCode)

});




