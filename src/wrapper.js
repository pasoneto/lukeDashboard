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
  
  //Extracting categories and options
  var categories = baseData['variables'].map(i => i.code);
  var options = baseData['variables'].map(i => i.values)
  
  //Generate checkbox inside button
  generateCheckBoxes(categories, options, 'boxTop')

  //Add function to hide selection box to the click of button inside dimension selection box
  document.getElementById("buttonDimensionSelector").onclick = function(){showBoxSelector("boxTop")}
  //Add function to hide selection box to the click of Select Dimension button
  document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")} 

  //Creates empty object with category keys
  var checkedValues = checkedValuesObjectGenerator(categories)
  var allCheckBoxes = document.querySelectorAll('input');

  //Establishes checkbox verification system. Multiple or single selection
  establishInitial(allCheckBoxes, categories, checkedValues) //Value is written inside the global variable checkedValues

  //Add function to render graph button. Function shows what variables were selected.
  document.getElementById("buttonRender").onclick = function(){
    document.getElementById("box").innerHTML = JSON.stringify(window.checkedValues);
  }

  //Initiate map
  var mapRegionsCode = ['01', '02', '03', '04', '05', '10', '06', '07']
  clickableMap(mapRegionsCode, alert)
  showMap(mapRegionsCode)

});




